import { useState } from 'react'
import { useDashboard } from '@/hooks'
import { formatScore } from '@/lib/utils'
import KPICard from '@/components/dashboard/KPICard'
import Top10Table from '@/components/dashboard/Top10Table'
import CategoryPieChart from '@/components/dashboard/CategoryPieChart'
import TrendLineChart from '@/components/dashboard/TrendLineChart'
import Spinner from '@/components/ui/Spinner'

export default function DashboardPage() {
  const [periode, setPeriode] = useState('')
  const { data, isLoading, isError } = useDashboard(periode || undefined)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ringkasan Nasional</h2>
          <p className="text-sm text-gray-500">Indeks Kerawanan Sosial-Politik — 34 Provinsi Indonesia</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter Periode:</label>
          <input
            type="month"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border border-orange-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {periode && (
            <button onClick={() => setPeriode('')} className="text-sm text-gray-400 hover:text-orange-600">✕</button>
          )}
        </div>
      </div>

      {isLoading && <Spinner className="py-20" />}
      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
          Gagal memuat data dashboard. Pastikan backend berjalan.
        </div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Wilayah Dipantau"
              value={data.total_wilayah_dipantau}
              subtitle="Provinsi dengan data"
              icon="📍"
              color="orange"
            />
            <KPICard
              title="Rata-rata IKSP"
              value={formatScore(data.avg_iksp_nasional)}
              subtitle="Skor nasional"
              icon="📊"
              color="orange"
            />
            <KPICard
              title="Risiko Tertinggi"
              value={data.wilayah_tertinggi_skor > 0 ? formatScore(data.wilayah_tertinggi_skor) : '-'}
              subtitle={data.wilayah_tertinggi_nama}
              icon="⚠️"
              color={data.wilayah_tertinggi_skor >= 3.1 ? 'red' : 'orange'}
            />
            <KPICard
              title="Status Kritis"
              value={data.jumlah_kritis}
              subtitle={`Tinggi: ${data.jumlah_tinggi} | Waspada: ${data.jumlah_waspada}`}
              icon="🚨"
              color={data.jumlah_kritis > 0 ? 'red' : 'green'}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Top 10 Wilayah Risiko Tertinggi</h3>
              <Top10Table data={data.top10} />
            </div>
            <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Distribusi Kategori Risiko</h3>
              <CategoryPieChart data={data.distribusi_kategori} />
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Tren IKSP Nasional (12 Bulan Terakhir)</h3>
            <TrendLineChart data={data.trend} />
          </div>

          {/* 4 Kategori breakdown */}
          {data.total_wilayah_dipantau > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Rendah',  count: data.jumlah_rendah,  color: 'bg-green-100 text-green-700',  desc: '1.0 – 2.0' },
                { label: 'Waspada', count: data.jumlah_waspada, color: 'bg-yellow-100 text-yellow-700', desc: '2.1 – 3.0' },
                { label: 'Tinggi',  count: data.jumlah_tinggi,  color: 'bg-orange-100 text-orange-700', desc: '3.1 – 4.0' },
                { label: 'Kritis',  count: data.jumlah_kritis,  color: 'bg-red-100 text-red-700',       desc: '4.1 – 5.0' },
              ].map((item) => (
                <div key={item.label} className={`rounded-lg p-4 text-center ${item.color}`}>
                  <div className="text-3xl font-bold">{item.count}</div>
                  <div className="text-sm font-semibold mt-1">{item.label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {data && data.total_wilayah_dipantau === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-orange-700 font-medium">Belum ada data IKSP</p>
          <p className="text-orange-500 text-sm mt-1">
            Masuk ke menu "Input Data" untuk memasukkan indikator pertama
          </p>
        </div>
      )}
    </div>
  )
}
