import { useSensor } from '../context/SensorContext'
import { DEVICE_ID } from '../api/visionair'
import { timeAgo } from '../utils/airQuality'

function Row({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono bg-gray-100 px-2 py-0.5 rounded text-xs' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { estado, lastUpdate, error, refresh } = useSensor()

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Configuración</h1>

      <Section title="Dispositivo">
        <Row label="ID del Sensor"   value={DEVICE_ID}                                                              mono />
        <Row label="Estado"          value={estado?.conectado ? '🟢 Conectado' : '🔴 Desconectado'}                      />
        <Row label="Último contacto" value={estado ? (estado.minutos_sin_contacto < 1 ? 'Ahora mismo' : `Hace ${estado.minutos_sin_contacto} min`) : '—'} />
      </Section>

      <Section title="API Backend">
        <Row label="Servidor"           value="localhost:8000"                                       mono />
        <Row label="Prefijo API"        value="/api/v1"                                              mono />
        <Row label="Última lectura"     value={lastUpdate ? timeAgo(lastUpdate.toISOString()) : '—'}      />
        <Row label="Estado conexión"    value={error ? `⚠️ ${error}` : '✅ OK'}                          />
      </Section>

      <Section title="Parámetros de Alerta">
        <Row label="Límite CO₂"         value="900 ppm"    />
        <Row label="Límite PM2.5"       value="25 µg/m³"   />
        <Row label="Límite VOC"         value="300 ppb"    />
        <Row label="Auto-actualización" value="Cada 30 s"  />
        <Row label="Versión"            value="v1.0.0 Demo" />
      </Section>

      <button onClick={refresh}
        className="w-full bg-green-500 text-white font-bold py-3 rounded-2xl hover:bg-green-600 active:scale-95 transition-all shadow-sm">
        🔃 Forzar Actualización
      </button>

      <p className="text-center text-xs text-gray-400 pb-2">
        VisionAir STEM v2.0 · Sistema de Monitoreo IoT
      </p>
    </div>
  )
}
