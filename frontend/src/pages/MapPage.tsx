import { useState } from 'react'
import { usePetaRisiko } from '@/hooks'
import IndonesiaMap from '@/components/map/IndonesiaMap'
import RiskLegend from '@/components/map/RiskLegend'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import type { PetaRisikoItem } from '@/types'
import { formatScore } from '@/lib/utils'
import { DIMENSION_NAMES } from '@/lib/constants'

export default function MapPage() {
  const [periode, setPeriode] = useState('')
  const [selected, setSelected] = useState<PetaRisikoItem | null>(null)
  const { data: riskData, isLoading } = usePetaRisiko(periode || undefined)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3rem)] gap-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Peta Risiko IKSP</h2>
          <p className="text-sm text-gray-500">Choropleth 34 Provinsi Indonesia</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Periode:</label>
          <input
            type="month"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />
          {periode && (
            <button onClick={() => setPeriode('')} className="text-gray-400 hover:text-gray-600 text-sm">✕ Terbaru</button>
          )}
        </div>
      </div>

      {/* Map + Panel */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 relative bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <Spinner className="h-full" />
          ) : (
            <>
              <IndonesiaMap
                riskData={riskData ?? []}
                onSelectWilayah={setSelected}
              />
              <RiskLegend />
            </>
          )}
        </div>

        {/* Detail Panel */}
        <div className="w-72 bg-white rounded-xl border border-gray-200 p-5 overflow-y-auto">
          {selected ? (
            <div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-400 hover:text-gray-600 mb-4"
              >
                ← Tutup
              </button>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{selected.nama}</h3>
              <p className="text-xs text-gray-400 mb-4">Kode BPS: {selected.kode}</p>

              {selected.has_data ? (
                <>
                  <div className="text-center mb-5">
                    <div className="text-4xl font-bold text-gray-800">{formatScore(selected.total)}</div>
                    <div className="text-xs text-gray-500 mb-2">Skor IKSP Komposit</div>
                    <Badge kategori={selected.kategori} />
                  </div>

                  <div className="space-y-3">
                    {([['dim1', selected.dim1], ['dim2', selected.dim2], ['dim3', selected.dim3]] as [string, number | null][]).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES]}</span>
                          <span className="font-semibold">{formatScore(val)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${((val ?? 0) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm">Belum ada data IKSP untuk provinsi ini</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-sm font-medium">Klik provinsi pada peta</p>
              <p className="text-xs mt-1">untuk melihat detail skor IKSP</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
