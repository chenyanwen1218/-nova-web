import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { clearToken, getToken, setToken } from '../utils/token'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const isLoggedIn = computed(() => !!token.value)

  function login(newToken: string) {
    token.value = newToken
    setToken(newToken)
  }

  function logout() {
    token.value = null
    clearToken()
  }

  return { token, isLoggedIn, login, logout }
})
