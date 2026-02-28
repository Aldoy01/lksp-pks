import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/peta-risiko', label: 'Peta Risiko', icon: '🗺️' },
  { to: '/input-data', label: 'Input Data', icon: '📝', roles: ['Admin', 'Analis'] },
  { to: '/skor', label: 'Skor IKSP', icon: '📈' },
  { to: '/admin', label: 'Admin', icon: '⚙️', roles: ['Admin'] },
]

export default function Sidebar() {
  const { user } = useAuthStore()

  return (
    <aside className="w-64 bg-orange-800 text-white flex flex-col">
      {/* Logo + Judul */}
      <div className="p-5 border-b border-orange-700">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/logo-pks.png"
            alt="Logo PKS"
            className="w-10 h-10 flex-shrink-0"
          />
          <div>
            <div className="text-xs font-semibold text-orange-200 uppercase tracking-wider leading-tight">
              Partai Keadilan Sejahtera
            </div>
            <div className="text-base font-bold leading-tight mt-0.5">IKSP Early Warning</div>
          </div>
        </div>
        <div className="text-xs text-orange-300 mt-1">
          Sistem Pemantauan Kerawanan Sosial-Politik
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          if (item.roles && user && !item.roles.includes(user.role)) return null
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'text-orange-100 hover:bg-orange-700 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-orange-700 text-xs text-orange-300">
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-orange-100">{user.username}</div>
              <div className="text-orange-300">{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
