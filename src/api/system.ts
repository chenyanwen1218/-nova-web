import { http } from '../utils/request'

export const getHealth = () => http.get<{ status: string }>('/api/system/health')
