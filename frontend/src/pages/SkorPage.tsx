import { useState } from 'react'
import { useSkor, useWilayah } from '@/hooks'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { formatScore, formatPeriode } from '@/lib/utils'

export default function SkorPage() {
  const [filterWilayah, setFilterWilayah] = useState('')
  const [filterPeriode, setFilterPeriode] = useState('')

  const { data: wilayahList } = useWilayah()
  const { data: skorList, isLoading } = useSkor(
    filterWilayah ? parseInt(filterWilayah) : undefined,
    filterPeriode || undefined,
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Riwayat Skor IKSP</h2>
        <p className="text-sm text-gray-500">Hasil kalkulasi indeks kerawanan sosial-politik</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          value={filterWilayah}
          onChange={(e) => setFilterWilayah(e.target.value)}
          className="border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Semua Wilayah</option>
          {wilayahList?.map((w) => <option key={w.id} value={w.id}>{w.nama}</option>)}
        </select>
        <input
          type="month"
          value={filterPeriode}
          onChange={(e) => setFilterPeriode(e.target.value)}
          className="border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <span className="text-sm text-gray-400">
          {skorList ? `${skorList.length} hasil` : ''}
        </span>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Wilayah</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Periode</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Dim. Sosial</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Dim. Ekonomi</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Dim. Politik</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Total IKSP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Dihitung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!skorList?.length ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Belum ada skor IKSP</td></tr>
              ) : skorList.map((s) => (
                <tr key={s.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.wilayah_nama ?? s.wilayah_id}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPeriode(s.periode)}</td>
                  <td className="px-4 py-3 text-center font-mono">{formatScore(s.dim1)}</td>
                  <td className="px-4 py-3 text-center font-mono">{formatScore(s.dim2)}</td>
                  <td className="px-4 py-3 text-center font-mono">{formatScore(s.dim3)}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-gray-800">{formatScore(s.total)}</td>
                  <td className="px-4 py-3"><Badge kategori={s.kategori} size="sm" /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(s.calculated_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
