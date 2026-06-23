import { timeAgo, getAlertUnit } from '../../utils/airQuality'

export default function AlertCard({ alerta, onResolve }) {
  const { id, variable_afectada, fecha_hora, nivel_critico, resuelto } = alerta
  const valor_detectado = alerta.valor_detectado != null ? parseFloat(alerta.valor_detectado) : null
  const level = nivel_critico
    ? { label: 'CRÍTICO', bg: 'bg-red-50',     border: 'border-red-200',    text: 'text-red-700',    val: 'text-red-600'    }
    : { label: 'ELEVADO',  bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-700', val: 'text-orange-600' }

  return (
    <div className={`rounded-2xl border p-4 ${level.bg} ${level.border}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-white ${level.text}`}>
            {level.label}
          </span>
          <span className="text-xs text-gray-500">{timeAgo(fecha_hora)}</span>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${level.val}`}>{valor_detectado?.toFixed(1)}</span>
          <span className="text-xs text-gray-400 block">{getAlertUnit(variable_afectada)}</span>
        </div>
      </div>

      <p className="font-semibold text-gray-800 text-sm mb-3">{variable_afectada}</p>

      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-3">
        <div className={`h-full w-4/5 rounded-full ${nivel_critico ? 'bg-red-400' : 'bg-orange-400'}`} />
      </div>

      {!resuelto && onResolve && (
        <button
          onClick={() => onResolve(id)}
          className="text-xs text-gray-500 underline hover:text-gray-700 transition-colors"
        >
          Marcar como resuelta
        </button>
      )}
    </div>
  )
}
