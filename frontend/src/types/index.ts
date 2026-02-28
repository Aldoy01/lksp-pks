export interface User {
  id: number
  username: string
  email: string
  role: 'Admin' | 'Analis' | 'Viewer'
  is_active: boolean
  created_at: string
}

export interface Wilayah {
  id: number
  kode: string
  nama: string
  level: string
  lat: number | null
  lng: number | null
}

export interface InputData {
  id: number
  wilayah_id: number
  wilayah_nama?: string
  periode: string
  ind1: number
  ind2: number
  ind3: number
  ind4: number
  ind5: number
  ind6: number
  ind7: number
  ind8: number
  ind9: number
  user_id?: number
  created_at: string
}

export interface SkorIKSP {
  id: number
  wilayah_id: number
  wilayah_nama?: string
  wilayah_kode?: string
  periode: string
  dim1: number
  dim2: number
  dim3: number
  total: number
  kategori: Kategori
  calculated_at: string
}

// 4 kategori sesuai Excel IKSP_EarlyWarning_Indonesia.xlsx
export type Kategori = 'Rendah' | 'Waspada' | 'Tinggi' | 'Kritis'

export interface PetaRisikoItem {
  kode: string
  nama: string
  lat: number | null
  lng: number | null
  total: number | null
  kategori: Kategori | null
  dim1: number | null
  dim2: number | null
  dim3: number | null
  has_data: boolean
}

export interface DashboardSummary {
  total_wilayah_dipantau: number
  avg_iksp_nasional: number
  wilayah_tertinggi_nama: string
  wilayah_tertinggi_skor: number
  jumlah_kritis: number
  jumlah_tinggi: number
  jumlah_waspada: number
  jumlah_rendah: number
  top10: Top10Item[]
  trend: TrendPoint[]
  distribusi_kategori: KategoriCount[]
}

export interface Top10Item {
  rank: number
  wilayah_id: number
  nama: string
  kode: string
  total: number
  kategori: Kategori
}

export interface TrendPoint {
  periode: string
  avg_total: number
  count: number
}

export interface KategoriCount {
  kategori: Kategori
  count: number
  color: string
}

export interface ParameterBobot {
  id: number
  nama_dimensi: string
  nama_indikator: string
  bobot: number
  updated_at: string
}
