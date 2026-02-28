import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInputData, useCreateInputData, useKalkulasi, useWilayah } from '@/hooks'
import { INDICATOR_LABELS, DIMENSION_NAMES } from '@/lib/constants'
import { formatPeriode, currentPeriode } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'

interface FormData {
  wilayah_id: number
  periode: string
  ind1: number; ind2: number; ind3: number
  ind4: number; ind5: number; ind6: number
  ind7: number; ind8: number; ind9: number
}

const DIMENSIONS = [
  { key: 'Sosial', label: DIMENSION_NAMES.dim1, indicators: ['ind1', 'ind2', 'ind3'] },
  { key: 'Ekonomi', label: DIMENSION_NAMES.dim2, indicators: ['ind4', 'ind5', 'ind6'] },
  { key: 'Politik', label: DIMENSION_NAMES.dim3, indicators: ['ind7', 'ind8', 'ind9'] },
]

export default function InputDataPage() {
  const [showModal, setShowModal] = useState(false)
  const [filterWilayah, setFilterWilayah] = useState('')
  const [filterPeriode, setFilterPeriode] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { data: wilayahList } = useWilayah()
  const { data: inputList, isLoading } = useInputData(
    filterWilayah ? parseInt(filterWilayah) : undefined,
    filterPeriode || undefined,
  )
  const createMutation = useCreateInputData()
  const kalkulasiMutation = useKalkulasi()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      periode: currentPeriode(),
      ind1: 3, ind2: 3, ind3: 3, ind4: 3, ind5: 3, ind6: 3, ind7: 3, ind8: 3, ind9: 3,
    },
  })

  async function onSubmit(data: FormData) {
    try {
      setStatusMsg(null)
      const numData = {
        ...data,
        wilayah_id: Number(data.wilayah_id),
        ind1: Number(data.ind1), ind2: Number(data.ind2), ind3: Number(data.ind3),
        ind4: Number(data.ind4), ind5: Number(data.ind5), ind6: Number(data.ind6),
        ind7: Number(data.ind7), ind8: Number(data.ind8), ind9: Number(data.ind9),
      }
      const created = await createMutation.mutateAsync(numData)
      await kalkulasiMutation.mutateAsync(created.id)
      setStatusMsg({ type: 'success', text: 'Data berhasil disimpan & IKSP dihitung!' })
      reset({ periode: currentPeriode(), ind1: 3, ind2: 3, ind3: 3, ind4: 3, ind5: 3, ind6: 3, ind7: 3, ind8: 3, ind9: 3 })
      setShowModal(false)
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.response?.data?.detail ?? 'Gagal menyimpan data' })
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Input Data Indikator</h2>
          <p className="text-sm text-gray-500">9 indikator IKSP per wilayah per periode</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setStatusMsg(null) }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Tambah Data
        </button>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div className={`rounded-lg px-4 py-3 text-sm ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {statusMsg.text}
        </div>
      )}

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
      </div>

      {/* Table */}
      {isLoading ? <Spinner /> : (
        <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Wilayah</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Periode</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Sosial (1-2-3)</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Ekonomi (4-5-6)</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Politik (7-8-9)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">Diinput</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!inputList?.length ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Belum ada data input</td></tr>
              ) : inputList.map((item) => (
                <tr key={item.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.wilayah_nama ?? item.wilayah_id}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPeriode(item.periode)}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">
                    {item.ind1} / {item.ind2} / {item.ind3}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs">
                    {item.ind4} / {item.ind5} / {item.ind6}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs">
                    {item.ind7} / {item.ind8} / {item.ind9}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800">Input Data Indikator IKSP</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah *</label>
                  <select
                    {...register('wilayah_id', { required: 'Pilih wilayah' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Pilih Provinsi...</option>
                    {wilayahList?.map((w) => <option key={w.id} value={w.id}>{w.nama}</option>)}
                  </select>
                  {errors.wilayah_id && <p className="text-red-500 text-xs mt-1">{errors.wilayah_id.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Periode *</label>
                  <input
                    type="month"
                    {...register('periode', { required: 'Pilih periode' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {errors.periode && <p className="text-red-500 text-xs mt-1">{errors.periode.message}</p>}
                </div>
              </div>

              {DIMENSIONS.map((dim) => (
                <div key={dim.key}>
                  <h4 className="text-sm font-semibold text-orange-700 bg-orange-50 rounded-lg px-3 py-2 mb-3">
                    {dim.label}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {dim.indicators.map((indKey) => {
                      const label = INDICATOR_LABELS[indKey]
                      return (
                        <div key={indKey}>
                          <label className="block text-xs text-gray-600 mb-1">{label}</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <label key={v} className="flex-1 cursor-pointer">
                                <input
                                  type="radio"
                                  value={v}
                                  {...register(indKey as any, { required: true, valueAsNumber: true })}
                                  className="sr-only peer"
                                />
                                <div className="text-center text-xs py-1.5 rounded border border-gray-200 peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-orange-500 hover:bg-orange-50 transition-colors">
                                  {v}
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors[indKey as keyof FormData] && (
                            <p className="text-red-500 text-xs mt-0.5">Diperlukan</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || kalkulasiMutation.isPending}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg py-2.5 text-sm disabled:opacity-60"
                >
                  {createMutation.isPending || kalkulasiMutation.isPending
                    ? 'Memproses...'
                    : 'Simpan & Hitung IKSP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
