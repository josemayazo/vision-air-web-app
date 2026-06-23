import { getBarStatus, STATUS_CONFIG, LIMITS, UNITS } from '../../utils/airQuality'

export default function PMBar({ label, field, value, limit, unit }) {
  const lim = limit ?? LIMITS[field] ?? 100
  const u   = unit  ?? UNITS[field]  ?? ''
  const pct = Math.min(((value ?? 0) / lim) * 100, 100)
  const cfg = STATUS_CONFIG[getBarStatus(value, lim)]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.icon} {cfg.label}</span>
      </div>
      <div className="flex justify-between items-end mb-2">
        <span className={`text-3xl font-bold ${value != null ? 'text-gray-900' : 'text-gray-300'}`}>
          {value != null ? value.toFixed(1) : '--'}
        </span>
        <span className="text-xs text-gray-400">LÍMITE: {lim} {u}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-400">{u}</span>
        {value != null && (
          <span className={`text-xs font-medium ${pct >= 90 ? cfg.text : 'text-gray-400'}`}>
            {pct.toFixed(0)}% del límite
          </span>
        )}
      </div>
    </div>
  )
}
