import { useSensor } from '../context/SensorContext'
import AlertCard from '../components/ui/AlertCard'
import { getOverallQuality } from '../utils/airQuality'
import { api } from '../api/visionair'

const STATUS_CFG = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  icon: '🛡️', label: 'Estado General: Óptimo'     },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: '⚠️', label: 'Estado General: Moderado'    },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    icon: '⚠️', label: 'Estado General: Alerta Roja' },
  gray:   { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-600',   icon: '📡', label: 'Estado General: Sin Datos'   },
}

export default function Alerts() {
  const { alertas, lectura, estado, refresh } = useSensor()
  const quality      = getOverallQuality(lectura)
  const activeAlerts = alertas?.filter(a => !a.resuelto) ?? []
  const sc           = STATUS_CFG[quality.color]

  async function handleResolve(id) {
    try { await api.resolverAlerta(id); refresh() }
    catch (e) { console.error(e) }
  }

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Alertas</h1>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5
            ${estado?.conectado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            <span className={`w-2 h-2 rounded-full ${estado?.conectado ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {estado?.conectado ? 'ESP32 Online' : 'ESP32 Offline'}
          </span>
          <span className="text-gray-400">🔔</span>
        </div>
      </div>

      {/* Overall status */}
      <div className={`rounded-2xl border p-5 text-center ${sc.bg} ${sc.border}`}>
        <span className="text-4xl">{sc.icon}</span>
        <h2 className={`font-bold text-lg mt-2 ${sc.text}`}>{sc.label}</h2>
        <p className="text-sm text-gray-500 mt-1">{quality.message}</p>
      </div>

      {/* Alerts list */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Recientes</h3>
          {activeAlerts.length > 0 && (
            <span className="text-xs text-gray-400">Ver historial →</span>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <span className="text-4xl">✅</span>
            <p className="text-gray-600 font-semibold mt-3">No hay alertas activas</p>
            <p className="text-xs text-gray-400 mt-1">¡El sistema funciona perfectamente!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map(a => (
              <AlertCard key={a.id} alerta={a} onResolve={handleResolve} />
            ))}
          </div>
        )}
      </div>

      {/* Historial link */}
      <button className="w-full bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-xl">🕐</span>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Historial completo</p>
            <p className="text-xs text-gray-400">{alertas?.length ?? 0} eventos registrados</p>
          </div>
        </div>
        <span className="text-gray-400 text-lg">›</span>
      </button>
    </div>
  )
}
