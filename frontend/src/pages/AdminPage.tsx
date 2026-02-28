import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUsers, useCreateUser, useParameterBobot, useUpdateParameterBobot } from '@/hooks'
import Spinner from '@/components/ui/Spinner'

type Tab = 'users' | 'parameter'

interface UserForm {
  username: string
  email: string
  password: string
  role: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('users')
  const [showUserModal, setShowUserModal] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const { data: users, isLoading: loadingUsers } = useUsers()
  const createUserMutation = useCreateUser()

  const { data: params, isLoading: loadingParams } = useParameterBobot()
  const updateParamMutation = useUpdateParameterBobot()

  const [bobotEdits, setBobotEdits] = useState<Record<number, number>>({})

  const { register: regUser, handleSubmit: handleUserSubmit, reset: resetUser } = useForm<UserForm>({
    defaultValues: { role: 'Viewer' }
  })

  async function onCreateUser(data: UserForm) {
    try {
      await createUserMutation.mutateAsync(data)
      resetUser({ role: 'Viewer' })
      setShowUserModal(false)
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? 'Gagal membuat user')
    }
  }

  async function onSaveBobot() {
    try {
      const updates = Object.entries(bobotEdits).map(([id, bobot]) => ({ id: parseInt(id), bobot }))
      if (!updates.length) return
      await updateParamMutation.mutateAsync(updates)
      setBobotEdits({})
      setSaveMsg('Parameter berhasil diperbarui!')
      setTimeout(() => setSaveMsg(null), 3000)
    } catch {
      setSaveMsg('Gagal menyimpan parameter.')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Administrasi</h2>
        <p className="text-sm text-gray-500">Manajemen pengguna dan parameter sistem</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-orange-200">
        {(['users', 'parameter'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-orange-500 text-orange-700'
                : 'border-transparent text-gray-500 hover:text-orange-600'
            }`}
          >
            {tab === 'users' ? '👥 Manajemen Pengguna' : '⚙️ Parameter Bobot'}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + Tambah Pengguna
            </button>
          </div>

          {loadingUsers ? <Spinner /> : (
            <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {['Username', 'Email', 'Role', 'Status', 'Dibuat'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users?.map((u) => (
                    <tr key={u.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{u.username}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          u.role === 'Admin' ? 'bg-orange-100 text-orange-700' :
                          u.role === 'Analis' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(u.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                  <h3 className="text-lg font-bold">Tambah Pengguna Baru</h3>
                </div>
                <form onSubmit={handleUserSubmit(onCreateUser)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <input {...regUser('username', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" {...regUser('email', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input type="password" {...regUser('password', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select {...regUser('role')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option value="Viewer">Viewer</option>
                      <option value="Analis">Analis</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50">Batal</button>
                    <button type="submit" disabled={createUserMutation.isPending} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60">
                      {createUserMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parameter Tab */}
      {activeTab === 'parameter' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
            ⚠️ Mengubah parameter bobot akan mempengaruhi kalkulasi IKSP berikutnya. Nilai lama tidak berubah secara otomatis.
          </div>

          {saveMsg && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">{saveMsg}</div>
          )}

          {loadingParams ? <Spinner /> : (
            <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {['Dimensi', 'Indikator', 'Bobot Saat Ini', 'Bobot Baru'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-orange-700 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {params?.map((p) => (
                    <tr key={p.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          p.nama_dimensi === 'Sosial' ? 'bg-green-100 text-green-700' :
                          p.nama_dimensi === 'Ekonomi' ? 'bg-orange-100 text-orange-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>{p.nama_dimensi}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.nama_indikator}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{p.bobot.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={1}
                          step={0.01}
                          defaultValue={p.bobot}
                          onChange={(e) => setBobotEdits((prev) => ({ ...prev, [p.id]: parseFloat(e.target.value) }))}
                          className="w-24 border border-orange-200 rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-4 border-t border-orange-100 flex justify-end">
                <button
                  onClick={onSaveBobot}
                  disabled={!Object.keys(bobotEdits).length || updateParamMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
                >
                  {updateParamMutation.isPending ? 'Menyimpan...' : 'Simpan Parameter'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
