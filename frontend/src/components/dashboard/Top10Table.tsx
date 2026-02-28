import type { Top10Item } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatScore } from '@/lib/utils'

export default function Top10Table({ data }: { data: Top10Item[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Belum ada data untuk ditampilkan
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 uppercase border-b">
            <th className="pb-2 pr-3">#</th>
            <th className="pb-2 pr-3">Provinsi</th>
            <th className="pb-2 pr-3 text-right">Skor</th>
            <th className="pb-2">Kategori</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item.wilayah_id} className="hover:bg-gray-50">
              <td className="py-2 pr-3 text-gray-400 font-medium">{item.rank}</td>
              <td className="py-2 pr-3 font-medium text-gray-800">{item.nama}</td>
              <td className="py-2 pr-3 text-right font-mono font-semibold">{formatScore(item.total)}</td>
              <td className="py-2">
                <Badge kategori={item.kategori} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
