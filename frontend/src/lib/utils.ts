import type { Kategori } from '@/types'
import { RISK_COLORS } from './constants'

export function getRiskColor(kategori: Kategori | null | undefined): string {
  if (!kategori) return RISK_COLORS['no-data']
  return RISK_COLORS[kategori] ?? RISK_COLORS['no-data']
}

export function formatPeriode(periode: string): string {
  if (!periode || periode.length !== 7) return periode
  const [year, month] = periode.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${months[parseInt(month) - 1]} ${year}`
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '-'
  return score.toFixed(2)
}

// 4 kategori sesuai Excel IKSP_EarlyWarning_Indonesia.xlsx
export function getKategoriClass(kategori: Kategori | null | undefined): string {
  switch (kategori) {
    case 'Rendah':  return 'bg-green-100 text-green-800'
    case 'Waspada': return 'bg-yellow-100 text-yellow-800'
    case 'Tinggi':  return 'bg-orange-100 text-orange-800'
    case 'Kritis':  return 'bg-red-100 text-red-800'
    default:        return 'bg-gray-100 text-gray-600'
  }
}

export function currentPeriode(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
