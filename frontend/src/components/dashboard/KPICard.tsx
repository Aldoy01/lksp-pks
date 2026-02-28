interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: string
  icon?: string
}

export default function KPICard({ title, value, subtitle, color = 'orange', icon }: KPICardProps) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color] ?? colors.orange}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider opacity-70">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
        </div>
        {icon && <span className="text-3xl opacity-50">{icon}</span>}
      </div>
    </div>
  )
}
