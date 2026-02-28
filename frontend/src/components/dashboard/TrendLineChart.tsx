import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { TrendPoint } from '@/types'
import { formatPeriode } from '@/lib/utils'

export default function TrendLineChart({ data }: { data: TrendPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Belum ada data tren
      </div>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatPeriode(d.periode),
    avg_total: parseFloat(d.avg_total.toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} tickCount={5} />
        <Tooltip
          formatter={(val) => [val, 'Rata-rata IKSP']}
          labelFormatter={(label) => `Periode: ${label}`}
        />
        <ReferenceLine y={2.5} stroke="#eab308" strokeDasharray="4 4" label={{ value: 'Sedang', fontSize: 10 }} />
        <ReferenceLine y={3.5} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'Tinggi', fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="avg_total"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#3b82f6' }}
          activeDot={{ r: 6 }}
          name="Rata-rata IKSP"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
