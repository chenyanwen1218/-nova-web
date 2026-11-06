// 流体玻璃材质内核：shader、材质参数换算、质量档位、共享渲染循环与设置持久化。
// Shader 与材质参数取自 fluidglass-ui（https://github.com/csuyincs-creator/fluidglass-ui），
// Copyright the fluidglass-ui authors, Licensed under the Apache License, Version 2.0。
// 改动：把原生 JS 引擎改写为 TypeScript 模块，供 Vue 组件使用；shader 与视觉参数未改。

export type Quality = 'auto' | 'high' | 'balanced' | 'eco' | 'fallback'
export type PresetName = 'cyan' | 'original' | 'klein' | 'chrome'
export type RenderMode = 'webgl' | 'fallback'

export interface Palette {
  a: string
  b: string
  c: string
}

export interface CardMaterial extends Palette {
  preset: PresetName | 'custom'
  speed: number
  intensity: number
  pointer: number
  surface: number
  seed: number
}

export interface FluidCard extends CardMaterial {
  key: string
  eyebrow: string
  label: string
  value: string
  unit: string
  change: number
}

export interface FluidSettings {
  quality: Quality
  interaction: boolean
  cards: FluidCard[]
}

export const QUALITIES: Quality[] = ['auto', 'high', 'balanced', 'eco', 'fallback']

export const PRESETS: Record<PresetName, Palette> = {
  cyan: { a: '#00e7d2', b: '#3cc8ff', c: '#075f68' },
  original: { a: '#ff3aa7', b: '#ff8050', c: '#a443ff' },
  klein: { a: '#3158ff', b: '#ff6531', c: '#20252e' },
  chrome: { a: '#eef2f3', b: '#6c7780', c: '#11171d' },
}

// 每张卡默认的动效参数，按序号循环取用，保证相邻卡片的流动不同步
export const VARIANTS = [
  { speed: 0.92, intensity: 1.02, pointer: 0.82, surface: 0.08, seed: 1.7 },
  { speed: 0.84, intensity: 1.08, pointer: 0.8, surface: 0.08, seed: 4.9 },
  { speed: 0.76, intensity: 0.98, pointer: 0.72, surface: 0.08, seed: 8.4 },
  { speed: 0.88, intensity: 1.05, pointer: 0.86, surface: 0.08, seed: 12.1 },
]

export const clamp = (n: number, a: number, b: number) => (Number.isFinite(n) ? Math.min(b, Math.max(a, n)) : a)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const isHex = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16)
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]
}
function mixRgb(from: string, to: string, t: number) {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return `rgb(${a.map((v, i) => Math.round((v + (b[i] - v) * t) * 255)).join(',')})`
}

// 底材不透明度 → 内容遮罩、高光与文字颜色；底材变亮后文字自动转深
export function materialTokens(surface: number) {
  const s = clamp(surface, 0, 1)
  const light = smoothstep(0.25, 0.46, s)
  const k = Math.pow(1 - s, 1.45)
  return {
    surface: s.toFixed(3),
    shade: (0.48 * k).toFixed(3),
    shadeMid: (0.3456 * k).toFixed(3),
    shadeSoft: (0.1536 * k).toFixed(3),
    topGlow: (0.035 * (1 - s)).toFixed(3),
    bottomShade: (0.1 * (1 - s)).toFixed(3),
    text: mixRgb('#f3fffb', '#16201d', light),
    title: mixRgb('#d8eee8', '#2b3632', light),
    muted: mixRgb('#8fa9a2', '#59635f', light),
    eyebrow: mixRgb('#82a69d', '#66716c', light),
    change: mixRgb('#819b94', '#59645f', light),
    edge: (0.1 + 0.22 * s).toFixed(3),
    light,
  }
}

export function surfaceLabel(value: number) {
  const p = Math.round(value * 100)
  if (p === 0) return '0% · 全透明'
  if (p < 20) return `${p}% · 玻璃`
  if (p < 55) return `${p}% · 灰玻璃`
  if (p < 100) return `${p}% · 亮材质`
  return '100% · 白'
}

interface Profile {
  name: Exclude<Quality, 'auto'>
  fps: number
  dpr: number
}

export function qualityProfile(requested: Quality): Profile {
  const dpr = window.devicePixelRatio || 1
  const query = new URLSearchParams(location.search).get('fluid')
  if (query === 'fallback' || requested === 'fallback') return { name: 'fallback', fps: 0, dpr: 1 }
  if (query === 'eco') requested = 'eco'
  if (requested === 'high') return { name: 'high', fps: 60, dpr: Math.min(dpr, 1.8) }
  if (requested === 'balanced') return { name: 'balanced', fps: 45, dpr: Math.min(dpr, 1.35) }
  if (requested === 'eco') return { name: 'eco', fps: 24, dpr: Math.min(dpr, 1) }
  // auto：低配设备、省流量或减少动效时降到 eco
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const low = nav.connection?.saveData || (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4
  if (reduced || low) return { name: 'eco', fps: reduced ? 15 : 24, dpr: Math.min(dpr, 1) }
  return { name: 'balanced', fps: 45, dpr: Math.min(dpr, 1.35) }
}

/* ---------- Canonical shader（原样保留） ---------- */

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main(){
  v_uv=a_position*.5+.5;
  gl_Position=vec4(a_position,0.0,1.0);
}`

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_mouseVelocity;
uniform float u_mouseMix;
uniform float u_time;
uniform float u_speed;
uniform float u_intensity;
uniform float u_pointer;
uniform float u_seed;
uniform float u_surfaceOpacity;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;

float hash(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
}
float fbm(vec2 p){
  float value=0.0;
  float amp=.53;
  mat2 rot=mat2(.80,-.60,.60,.80);
  for(int i=0;i<5;i++){
    value+=amp*noise(p);
    p=rot*p*2.02+vec2(17.13,9.27);
    amp*=.49;
  }
  return value;
}
float softBlob(vec2 p,vec2 center,float radius,float softness){
  return 1.0-smoothstep(radius-softness,radius+softness,length(p-center));
}
void main(){
  vec2 uv=v_uv;
  float aspect=u_resolution.x/max(1.0,u_resolution.y);
  vec2 p=(uv-.5)*vec2(aspect,1.0);
  vec2 mouse=(u_mouse-.5)*vec2(aspect,1.0);
  vec2 delta=p-mouse;
  float dist=length(delta);
  float mouseField=exp(-dist*dist*7.2)*u_mouseMix*u_pointer;
  vec2 normal=delta/max(dist,.035);
  vec2 tangent=vec2(-normal.y,normal.x);
  p+=normal*mouseField*.115+tangent*mouseField*(u_mouseVelocity.x-u_mouseVelocity.y)*.045;

  float t=u_time*u_speed;
  vec2 seedVec=vec2(u_seed*1.713,u_seed*.937);
  float w1=fbm(p*1.22+seedVec+vec2(t*.075,-t*.052));
  float w2=fbm(p*1.54-seedVec*.37+vec2(-t*.057,t*.064)+w1*.82);
  vec2 q=p+(vec2(w1,w2)-.5)*(.58*u_intensity);
  float broad=fbm(q*1.12+vec2(t*.041,-t*.033));
  float detail=fbm(q*2.18+vec2(-t*.083,t*.057)+broad*.95);
  float ribbon=.5+.5*sin(q.x*3.15+q.y*.76+detail*5.0+t*.25+u_seed);
  float colorMix=smoothstep(.16,.88,broad*.61+ribbon*.39);
  vec3 fluid=mix(u_colorA,u_colorB,colorMix);
  float shadow=smoothstep(.43,.84,detail*.69+(.5+.5*sin(q.y*4.2-q.x*.8-t*.17))*.31);
  fluid=mix(fluid,u_colorC,shadow*.74);

  float plume1=softBlob(p,vec2(aspect*.23+.12*sin(t*.08+u_seed),.16*cos(t*.11+u_seed)),.52,.38);
  float plume2=softBlob(p,vec2(aspect*.39+.10*cos(t*.07-u_seed),-.24+.11*sin(t*.09)),.43,.34);
  float haze=clamp(plume1*.72+plume2*.58,0.0,1.0);
  float reveal=smoothstep(.055,.735,uv.x+(.5-broad)*.27+.070*sin(uv.y*4.0+t*.12));
  reveal*=mix(.70,1.0,haze);
  reveal=clamp(reveal*u_intensity,0.0,1.0);

  float spec=pow(clamp(1.0-abs(detail-.52)*2.0,0.0,1.0),5.0)*reveal;
  float caustic=pow(clamp(.52+.48*sin((q.x-q.y)*5.2+detail*7.0-t*.18),0.0,1.0),7.0)*reveal;
  vec3 cyanGlow=mix(fluid,vec3(.34,1.0,.90),spec*.18+caustic*.09);
  cyanGlow*=.78+.25*haze;
  cyanGlow=mix(cyanGlow,cyanGlow*.70,u_surfaceOpacity*.34);
  float filament=smoothstep(.48,.86,detail)*reveal;
  float density=clamp(reveal*(.36+.48*haze)+filament*.22+mouseField*.28,0.0,1.0);
  float alpha=clamp(.035*haze+density*(.24+.50*u_intensity)+spec*.08+u_surfaceOpacity*density*.14,0.0,.92);
  float edgeFade=smoothstep(1.08,.70,length((uv-.5)*vec2(1.0,.92)));
  alpha*=edgeFade;
  cyanGlow=pow(max(cyanGlow,0.0),vec3(.94));
  gl_FragColor=vec4(cyanGlow,alpha);
}`

const UNIFORMS = [
  'u_resolution',
  'u_mouse',
  'u_mouseVelocity',
  'u_mouseMix',
  'u_time',
  'u_speed',
  'u_intensity',
  'u_pointer',
  'u_seed',
  'u_surfaceOpacity',
  'u_colorA',
  'u_colorB',
  'u_colorC',
] as const

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('createShader failed')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const msg = gl.getShaderInfoLog(shader) || 'Shader compile failed'
    gl.deleteShader(shader)
    throw new Error(msg)
  }
  return shader
}

function buildProgram(gl: WebGLRenderingContext) {
  const program = gl.createProgram()
  if (!program) throw new Error('createProgram failed')
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Link failed')
  return program
}

/* ---------- 共享状态：所有卡片共用一个 RAF 循环，WebGL 上下文最多 8 个，超出的走 CSS 降级 ---------- */

const MAX_CONTEXTS = 8
let liveContexts = 0
let profile: Profile = { name: 'balanced', fps: 45, dpr: 1 }
let interaction = true
let raf = 0
const renderers = new Set<FluidRenderer>()
let reducedMq: MediaQueryList | undefined

function frame(now: number) {
  raf = 0
  renderers.forEach((r) => r.render(now))
  if (renderers.size) raf = requestAnimationFrame(frame)
}

export function setQuality(q: Quality) {
  profile = qualityProfile(q)
  renderers.forEach((r) => r.applyProfile())
  return profile.name
}

export function setInteraction(v: boolean) {
  interaction = v
}

const REST: [number, number] = [0.76, 0.46]

export class FluidRenderer {
  private gl: WebGLRenderingContext | null = null
  private program: WebGLProgram | null = null
  private buffer: WebGLBuffer | null = null
  private loseExt: WEBGL_lose_context | null = null
  private u: Partial<Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>> = {}
  private visible = true
  private lastFrame = 0
  private mouse: [number, number] = [...REST]
  private mouseTarget: [number, number] = [...REST]
  private mouseVel: [number, number] = [0, 0]
  private mouseMix = 0
  private inside = false
  private ac = new AbortController()
  private ro: ResizeObserver
  private io: IntersectionObserver
  private el: HTMLElement
  private canvas: HTMLCanvasElement
  private config: CardMaterial
  private index: number
  private onMode: (m: RenderMode) => void

  constructor(
    el: HTMLElement,
    canvas: HTMLCanvasElement,
    config: CardMaterial,
    index: number,
    onMode: (m: RenderMode) => void,
  ) {
    this.el = el
    this.canvas = canvas
    this.config = config
    this.index = index
    this.onMode = onMode
    reducedMq ??= matchMedia('(prefers-reduced-motion: reduce)')
    const signal = this.ac.signal
    this.bindPointer(signal)
    canvas.addEventListener(
      'webglcontextlost',
      (e) => {
        e.preventDefault()
        this.fallback()
      },
      { signal },
    )
    canvas.addEventListener(
      'webglcontextrestored',
      () => {
        this.destroyGl()
        this.init()
      },
      { signal },
    )
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(el)
    this.io = new IntersectionObserver(([e]) => (this.visible = e?.isIntersecting !== false), { rootMargin: '80px' })
    this.io.observe(el)
    renderers.add(this)
    this.init()
    if (!raf) raf = requestAnimationFrame(frame)
  }

  setConfig(config: CardMaterial) {
    this.config = config
  }

  private bindPointer(signal: AbortSignal) {
    let last: [number, number] = [0, 0]
    let lastT = 0
    const update = (e: PointerEvent) => {
      if (!interaction) return
      const rect = this.el.getBoundingClientRect()
      const x = clamp((e.clientX - rect.left) / Math.max(rect.width, 1), 0, 1)
      const y = clamp(1 - (e.clientY - rect.top) / Math.max(rect.height, 1), 0, 1)
      const now = performance.now()
      const dt = Math.max(8, now - lastT || 16) / 16.67
      this.mouseTarget = [x, y]
      this.mouseVel = [clamp((x - last[0]) / dt, -0.12, 0.12), clamp((y - last[1]) / dt, -0.12, 0.12)]
      last = [x, y]
      lastT = now
      this.mouseMix = 1
    }
    const opts = { signal, passive: true }
    this.el.addEventListener(
      'pointerenter',
      (e) => {
        this.inside = true
        update(e)
      },
      opts,
    )
    this.el.addEventListener('pointermove', update, opts)
    this.el.addEventListener(
      'pointerleave',
      () => {
        this.inside = false
        this.mouseTarget = [...REST]
      },
      opts,
    )
    this.el.addEventListener(
      'pointerdown',
      (e) => {
        this.mouseMix = 1.2
        update(e)
      },
      opts,
    )
  }

  private init() {
    if (profile.name === 'fallback' || liveContexts >= MAX_CONTEXTS) return this.fallback()
    try {
      const gl = this.canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: profile.name === 'eco' ? 'low-power' : 'high-performance',
      })
      if (!gl) throw new Error('WebGL unavailable')
      // 之前降级时主动释放过上下文：请求恢复，恢复后由 webglcontextrestored 再次 init
      if (gl.isContextLost()) {
        if (this.loseExt) return this.loseExt.restoreContext()
        throw new Error('WebGL context lost')
      }
      this.gl = gl
      liveContexts++
      this.loseExt = gl.getExtension('WEBGL_lose_context')
      gl.clearColor(0, 0, 0, 0)
      this.program = buildProgram(gl)
      gl.useProgram(this.program)
      this.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
      const pos = gl.getAttribLocation(this.program, 'a_position')
      gl.enableVertexAttribArray(pos)
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
      UNIFORMS.forEach((name) => (this.u[name] = gl.getUniformLocation(this.program!, name)))
      this.onMode('webgl')
      this.resize()
    } catch (err) {
      console.warn('[FluidGlass]', err)
      this.fallback()
    }
  }

  applyProfile() {
    if (profile.name === 'fallback') this.fallback()
    else if (!this.gl) this.init()
    else this.resize()
  }

  private fallback() {
    this.destroyGl()
    this.onMode('fallback')
  }

  private destroyGl() {
    const gl = this.gl
    if (!gl) return
    try {
      if (this.program) gl.deleteProgram(this.program)
      if (this.buffer) gl.deleteBuffer(this.buffer)
      this.loseExt?.loseContext()
    } catch {
      /* 上下文已丢失时忽略 */
    }
    liveContexts = Math.max(0, liveContexts - 1)
    this.gl = null
    this.program = null
    this.buffer = null
  }

  private resize() {
    if (!this.gl) return
    const rect = this.el.getBoundingClientRect()
    const w = Math.max(2, Math.round(rect.width * profile.dpr))
    const h = Math.max(2, Math.round(rect.height * profile.dpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
      this.gl.viewport(0, 0, w, h)
    }
  }

  render(now: number) {
    const gl = this.gl
    if (!gl || !this.visible || document.hidden) return
    if (now - this.lastFrame < 1000 / profile.fps) return
    this.lastFrame = now
    this.mouse[0] += (this.mouseTarget[0] - this.mouse[0]) * 0.105
    this.mouse[1] += (this.mouseTarget[1] - this.mouse[1]) * 0.105
    this.mouseVel[0] *= 0.9
    this.mouseVel[1] *= 0.9
    this.mouseMix += ((this.inside && interaction ? 1 : 0) - this.mouseMix) * 0.075
    if (!this.inside) this.mouseMix *= 0.945
    const c = this.config
    const u = this.u
    gl.uniform2f(u.u_resolution!, this.canvas.width, this.canvas.height)
    gl.uniform2f(u.u_mouse!, this.mouse[0], this.mouse[1])
    gl.uniform2f(u.u_mouseVelocity!, this.mouseVel[0], this.mouseVel[1])
    gl.uniform1f(u.u_mouseMix!, interaction ? clamp(this.mouseMix, 0, 1.2) : 0)
    gl.uniform1f(u.u_time!, now * 0.001 + this.index * 3.73)
    gl.uniform1f(u.u_speed!, reducedMq?.matches ? Math.min(c.speed, 0.08) : c.speed)
    gl.uniform1f(u.u_intensity!, c.intensity)
    gl.uniform1f(u.u_pointer!, c.pointer)
    gl.uniform1f(u.u_seed!, c.seed)
    gl.uniform1f(u.u_surfaceOpacity!, c.surface)
    gl.uniform3fv(u.u_colorA!, hexToRgb(c.a))
    gl.uniform3fv(u.u_colorB!, hexToRgb(c.b))
    gl.uniform3fv(u.u_colorC!, hexToRgb(c.c))
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  destroy() {
    this.ac.abort()
    this.ro.disconnect()
    this.io.disconnect()
    this.destroyGl()
    renderers.delete(this)
    if (!renderers.size && raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}

/* ---------- 设置持久化：只存材质参数，业务文案以数据文件为准 ---------- */

export function pickMaterial(c: CardMaterial): CardMaterial {
  const { preset, a, b, c: cc, speed, intensity, pointer, surface, seed } = c
  return { preset, a, b, c: cc, speed, intensity, pointer, surface, seed }
}

function sanitizeMaterial(raw: unknown, base: CardMaterial): CardMaterial {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const num = (k: 'speed' | 'intensity' | 'pointer' | 'surface', lo: number, hi: number) =>
    isNum(r[k]) ? clamp(r[k], lo, hi) : base[k]
  const preset =
    r.preset === 'custom' || (typeof r.preset === 'string' && Object.hasOwn(PRESETS, r.preset))
      ? (r.preset as CardMaterial['preset'])
      : base.preset
  return {
    preset,
    a: isHex(r.a) ? r.a.toLowerCase() : base.a,
    b: isHex(r.b) ? r.b.toLowerCase() : base.b,
    c: isHex(r.c) ? r.c.toLowerCase() : base.c,
    speed: num('speed', 0, 2),
    intensity: num('intensity', 0.35, 1.6),
    pointer: num('pointer', 0, 1.5),
    surface: num('surface', 0, 1),
    seed: isNum(r.seed) ? r.seed : base.seed,
  }
}

export function loadSettings(storageKey: string, defaults: FluidCard[]): FluidSettings {
  let saved: Record<string, unknown> = {}
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed
  } catch {
    /* 损坏的存储直接忽略，回到默认值 */
  }
  const cards =
    saved.cards && typeof saved.cards === 'object' && !Array.isArray(saved.cards)
      ? (saved.cards as Record<string, unknown>)
      : {}
  return {
    quality: QUALITIES.includes(saved.quality as Quality) ? (saved.quality as Quality) : 'auto',
    interaction: typeof saved.interaction === 'boolean' ? saved.interaction : true,
    cards: defaults.map((c) => ({ ...c, ...sanitizeMaterial(Object.hasOwn(cards, c.key) ? cards[c.key] : null, c) })),
  }
}

export function persistSettings(storageKey: string, s: FluidSettings) {
  try {
    const cards = Object.fromEntries(s.cards.map((c) => [c.key, pickMaterial(c)]))
    localStorage.setItem(storageKey, JSON.stringify({ quality: s.quality, interaction: s.interaction, cards }))
    return true
  } catch {
    return false
  }
}
