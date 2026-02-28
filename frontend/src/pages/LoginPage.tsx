import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '@/hooks'
import { useAuthStore } from '@/store/authStore'

interface LoginForm {
  username: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const loginMutation = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  async function onSubmit(data: LoginForm) {
    try {
      const res = await loginMutation.mutateAsync(data)
      login(res.access_token, { id: res.user_id, username: res.username, role: res.role })
      navigate('/dashboard')
    } catch {
      // error displayed below
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo + Header */}
        <div className="text-center mb-8">
          {/* PKS Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo-pks.png"
              alt="Logo PKS"
              className="w-24 h-24 drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow">IKSP Early Warning</h1>
          <p className="text-orange-100 mt-1 text-sm font-medium">Partai Keadilan Sejahtera</p>
          <p className="text-orange-200 mt-1 text-xs">
            Sistem Pemantauan Kerawanan Sosial-Politik Indonesia
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">Masuk ke Sistem</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                {...register('username', { required: 'Username diperlukan' })}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Masukkan username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register('password', { required: 'Password diperlukan' })}
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Masukkan password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {loginMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Username atau password salah
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg text-xs text-gray-500 space-y-1">
            <div className="font-medium text-orange-700 mb-2">Akun Demo:</div>
            <div>Admin: <code>admin</code> / <code>Admin@12345</code></div>
            <div>Analis: <code>analis1</code> / <code>Analis@12345</code></div>
            <div>Viewer: <code>viewer1</code> / <code>Viewer@12345</code></div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-orange-200 text-xs mt-4">
          © 2025 PKS — Partai Keadilan Sejahtera
        </p>
      </div>
    </div>
  )
}
