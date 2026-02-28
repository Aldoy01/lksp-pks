import type { Kategori } from '@/types'

// 4 kategori sesuai Excel IKSP_EarlyWarning_Indonesia.xlsx
export const RISK_COLORS: Record<Kategori | 'no-data', string> = {
  'Rendah':  '#22c55e',   // hijau  (1.0–2.0)
  'Waspada': '#eab308',   // kuning (2.1–3.0)
  'Tinggi':  '#f97316',   // oranye (3.1–4.0)
  'Kritis':  '#dc2626',   // merah  (4.1–5.0)
  'no-data': '#e5e7eb',
}

export const RISK_BORDER_COLORS: Record<Kategori | 'no-data', string> = {
  'Rendah':  '#16a34a',
  'Waspada': '#ca8a04',
  'Tinggi':  '#ea580c',
  'Kritis':  '#b91c1c',
  'no-data': '#9ca3af',
}

export const DIMENSION_NAMES = {
  dim1: 'Dimensi Struktural (Bobot 40%)',
  dim2: 'Dimensi Mobilisasi (Bobot 30%)',
  dim3: 'Dimensi Sentimen Digital (Bobot 30%)',
}

// Sesuai Excel sheet "Parameter" — 9 indikator
export const INDICATOR_LABELS: Record<string, string> = {
  ind1: 'Gini Ratio',
  ind2: 'Pengangguran Usia 15-29',
  ind3: 'Kepercayaan Pemerintah',
  ind4: 'Mahasiswa per 100rb',
  ind5: 'Penetrasi Internet',
  ind6: 'Insiden Konflik (5 thn)',
  ind7: 'Volume Mention',
  ind8: 'Tone Narasi Negatif',
  ind9: 'Pertumbuhan Tagar',
}

// Panduan skoring dari Excel sheet "Parameter"
export const INDICATOR_GUIDE: Record<string, { low: string; mid: string; high: string }> = {
  ind1: { low: '< 0.30',    mid: '0.35–0.39',  high: '> 0.40' },
  ind2: { low: '< 5%',      mid: '8–12%',       high: '> 15%' },
  ind3: { low: '> 70% puas',mid: '40–60% puas', high: '< 30% puas' },
  ind4: { low: '< 1.000',   mid: '2.000–3.500', high: '> 5.000' },
  ind5: { low: '< 30%',     mid: '50–65%',      high: '> 75%' },
  ind6: { low: '0–2 insiden',mid: '5–10 insiden',high: '> 15 insiden' },
  ind7: { low: 'Baseline',  mid: '2–3x baseline',high: '> 5x baseline' },
  ind8: { low: '< 20%',     mid: '35–50%',      high: '> 65%' },
  ind9: { low: '< 10%/mgg', mid: '30–60%/mgg',  high: '> 100%/mgg' },
}

export const ROLES = ['Admin', 'Analis', 'Viewer'] as const
