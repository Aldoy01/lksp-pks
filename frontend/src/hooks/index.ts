import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
  Wilayah, InputData, SkorIKSP, PetaRisikoItem,
  DashboardSummary, ParameterBobot, User
} from '@/types'

// Auth
export function useLogin() {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.post('/auth/login', data).then((r) => r.data),
  })
}

// Wilayah
export function useWilayah() {
  return useQuery<Wilayah[]>({
    queryKey: ['wilayah'],
    queryFn: () => api.get('/wilayah').then((r) => r.data),
  })
}

// Input Data
export function useInputData(wilayah_id?: number, periode?: string) {
  return useQuery<InputData[]>({
    queryKey: ['input-data', wilayah_id, periode],
    queryFn: () =>
      api.get('/input-data', { params: { wilayah_id, periode } }).then((r) => r.data),
  })
}

export function useCreateInputData() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<InputData, 'id' | 'created_at' | 'wilayah_nama' | 'user_id'>) =>
      api.post('/input-data', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['input-data'] }),
  })
}

// Kalkulasi
export function useKalkulasi() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input_id: number) =>
      api.post(`/kalkulasi/${input_id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skor'] })
      qc.invalidateQueries({ queryKey: ['peta-risiko'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Skor IKSP
export function useSkor(wilayah_id?: number, periode?: string) {
  return useQuery<SkorIKSP[]>({
    queryKey: ['skor', wilayah_id, periode],
    queryFn: () =>
      api.get('/skor', { params: { wilayah_id, periode } }).then((r) => r.data),
  })
}

// Peta Risiko
export function usePetaRisiko(periode?: string) {
  return useQuery<PetaRisikoItem[]>({
    queryKey: ['peta-risiko', periode],
    queryFn: () =>
      api.get('/peta-risiko', { params: { periode } }).then((r) => r.data),
  })
}

// Dashboard
export function useDashboard(periode?: string) {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard', periode],
    queryFn: () =>
      api.get('/dashboard/summary', { params: { periode } }).then((r) => r.data),
  })
}

// Admin - Users
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string; role: string }) =>
      api.post('/admin/users', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

// Admin - Parameter Bobot
export function useParameterBobot() {
  return useQuery<ParameterBobot[]>({
    queryKey: ['parameter-bobot'],
    queryFn: () => api.get('/admin/parameter').then((r) => r.data),
  })
}

export function useUpdateParameterBobot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (updates: { id: number; bobot: number }[]) =>
      api.put('/admin/parameter', updates).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['parameter-bobot'] }),
  })
}
