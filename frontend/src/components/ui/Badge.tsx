import type { Kategori } from '@/types'
import { getKategoriClass } from '@/lib/utils'

interface BadgeProps {
  kategori: Kategori | null | undefined
  size?: 'sm' | 'md'
}

export default function Badge({ kategori, size = 'md' }: BadgeProps) {
  const cls = getKategoriClass(kategori)
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${cls} ${sizeClass}`}>
      {kategori ?? 'Tidak ada data'}
    </span>
  )
}
