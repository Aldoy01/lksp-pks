import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { KategoriCount } from '@/types'

export default function CategoryPieChart({ data }: { data: KategoriCount[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Belum ada data
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="kategori"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ kategori, count }) => `${count}`}
        >
          {data.map((entry) => (
            <Cell key={entry.kategori} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => [`${val} wilayah`]} />
        <Legend formatter={(val) => <span className="text-xs">{val}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}
