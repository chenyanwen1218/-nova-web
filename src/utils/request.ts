import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { getToken, clearToken } from './token'

/** 与后端 com.nova.common.domain.Result 对应 */
export interface Result<T> {
  code: number
  message: string
  data: T
}

const SUCCESS_CODE = 200
// 401 未登录、1000 token 无效、1001 token 过期
const AUTH_ERROR_CODES = [401, 1000, 1001]

export class ApiError extends Error {
  code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function handleAuthError() {
  clearToken()
  // 后续加了登录页后在这里跳转，例如 router.replace('/login')
}

/** 成功直接返回 data，失败抛 ApiError */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await instance.request<Result<T>>(config)
    const body = res.data
    if (body.code === SUCCESS_CODE) {
      return body.data
    }
    if (AUTH_ERROR_CODES.includes(body.code)) {
      handleAuthError()
    }
    throw new ApiError(body.code, body.message)
  } catch (e) {
    if (e instanceof ApiError) throw e
    const err = e as AxiosError<Result<unknown>>
    const body = err.response?.data
    const code = body?.code ?? err.response?.status ?? -1
    if (AUTH_ERROR_CODES.includes(code)) {
      handleAuthError()
    }
    throw new ApiError(code, body?.message ?? err.message ?? '网络异常')
  }
}

export const http = {
  get: <T>(url: string, params?: object) => request<T>({ url, method: 'GET', params }),
  post: <T>(url: string, data?: object) => request<T>({ url, method: 'POST', data }),
  put: <T>(url: string, data?: object) => request<T>({ url, method: 'PUT', data }),
  delete: <T>(url: string, params?: object) => request<T>({ url, method: 'DELETE', params }),
}
