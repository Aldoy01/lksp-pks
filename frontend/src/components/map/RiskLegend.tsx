import { RISK_COLORS } from '@/lib/constants'
import type { Kategori } from '@/types'

const LEGEND_ITEMS: { label: Kategori | 'Tidak ada data'; color: string }[] = [
  { label: 'Kritis', color: RISK_COLORS['Kritis'] },
  { label: 'Tinggi', color: RISK_COLORS['Tinggi'] },
  { label: 'Waspada', color: RISK_COLORS['Waspada'] },
  { label: 'Rendah', color: RISK_COLORS['Rendah'] },
  { label: 'Tidak ada data', color: RISK_COLORS['no-data'] },
]

export default function RiskLegend() {
  return (
    <div className="absolute bottom-8 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
        Kategori Risiko IKSP
      </h4>
      <div className="space-y-1.5">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded flex-shrink-0 border border-white/30"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
        Skala 1–5 (IKSP Komposit)
      </div>
    </div>
  )
}
