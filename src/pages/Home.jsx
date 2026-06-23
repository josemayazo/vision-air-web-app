import { useSensor } from '../context/SensorContext'
import { getOverallQuality, timeAgo } from '../utils/airQuality'

function StatCard({ label, value, unit }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-1 mt-1">
        <span className="text-2xl font-bold text-gray-900">{value ?? '--'}</span>
        <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
      </div>
    </div>
  )
}

export default function Home() {
  const { lectura, estado, alertas, loading, error, lastUpdate, refresh } = useSensor()
  const quality = getOverallQuality(lectura)
  const activeAlerts = alertas?.filter(a => !a.resuelto) ?? []

  const qualityStyle = {
    green:  'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    red:    'bg-red-50 border-red-200',
    gray:   'bg-gray-50 border-gray-200',
  }
  const qualityTextColor = {
    green: 'text-green-800', orange: 'text-orange-800', red: 'text-red-800', gray: 'text-gray-600'
  }
  const icons = { green: '🌿', orange: '🌫️', red: '⚠️', gray: '📡' }

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-green-500">Vision</span><span className="text-gray-900">Air</span>
          </h1>
          <p className="text-xs text-gray-400">Sistema de Monitoreo STEM</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5
          ${estado?.conectado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          <span className={`w-2 h-2 rounded-full ${estado?.conectado ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {estado?.conectado ? 'ESP32 Online' : 'Sin señal'}
        </span>
      </div>

      {/* Error / API not available */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
          ⚠️ {error} — Verifica que el servidor esté corriendo.
        </div>
      )}

      {/* Air quality card */}
      <div className={`rounded-2xl border p-5 ${qualityStyle[quality.color]}`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{icons[quality.color]}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Estado del Aire</p>
            <h2 className={`text-xl font-bold ${qualityTextColor[quality.color]}`}>{quality.level}</h2>
            <p className="text-sm opacity-75 mt-0.5">{quality.message}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Temperatura"  value={lectura?.temperatura?.toFixed(1)} unit="°C"    />
        <StatCard label="Humedad"      value={lectura?.humedad?.toFixed(0)}     unit="%"     />
        <StatCard label="PM 2.5"       value={lectura?.pm2_5?.toFixed(1)}       unit="µg/m³" />
        <StatCard label="CO₂"          value={lectura?.co2}                     unit="ppm"   />
      </div>

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-red-700">
              {activeAlerts.length} alerta{activeAlerts.length > 1 ? 's' : ''} activa{activeAlerts.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-400 mt-0.5">Última: {timeAgo(activeAlerts[0]?.fecha_hora)}</p>
          </div>
          <span className="text-3xl">🔔</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-1">
        <p className="text-xs text-gray-400">
          {lastUpdate ? `Actualizado ${timeAgo(lastUpdate.toISOString())}` : loading ? 'Cargando...' : 'Sin datos'}
        </p>
        <button onClick={refresh} className="text-xs text-green-600 font-semibold hover:text-green-700 transition-colors">
          ↻ Actualizar
        </button>
      </div>
    </div>
  )
}
