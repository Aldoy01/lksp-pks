import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/peta-risiko': 'Peta Risiko',
  '/input-data': 'Input Data Indikator',
  '/skor': 'Skor IKSP',
  '/admin': 'Administrasi',
}

export default function Topbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout, user } = useAuthStore()

  const title = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'IKSP'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-orange-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/logo-pks.png" alt="PKS" className="w-8 h-8" />
        <h1 className="text-lg font-semibold text-orange-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {user?.username} ({user?.role})
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Keluar
        </button>
      </div>
    </header>
  )
}
