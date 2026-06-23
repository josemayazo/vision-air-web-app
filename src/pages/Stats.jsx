import { useState, useEffect } from 'react'
import { useSensor } from '../context/SensorContext'
import PMBar from '../components/ui/PMBar'
import LineChart from '../components/ui/LineChart'
import { getOverallQuality, getBarStatus, STATUS_CONFIG, LIMITS, timeAgo } from '../utils/airQuality'
import { api } from '../api/visionair'

const FILTERS = [
  { key: 'hoy',    label: 'Hoy'    },
  { key: 'semana', label: 'Semana' },
  { key: 'mes',    label: 'Mes'    },
]

const POLLUTANTS = [
  { key: 'pm1_0', label: 'PM1.0' },
  { key: 'pm2_5', label: 'PM2.5' },
  { key: 'pm4_0', label: 'PM4.0' },
  { key: 'pm10',  label: 'PM10'  },
  { key: 'voc',   label: 'VOC'   },
  { key: 'co2',   label: 'CO₂'   },
]

const CHIP = {
  good:     'bg-green-50  text-green-700  border-green-200',
  high:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  limit:    'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50    text-red-700    border-red-200',
}

const QUALITY_STYLE = {
  green:  { banner: 'bg-green-50  border-green-200',  label: 'text-green-700'  },
  orange: { banner: 'bg-orange-50 border-orange-200', label: 'text-orange-600' },
  red:    { banner: 'bg-red-50    border-red-200',    label: 'text-red-600'    },
  gray:   { banner: 'bg-gray-50   border-gray-200',   label: 'text-gray-500'   },
}

const CHARTS = [
  { title: 'PM 2.5',      unit: 'µg/m³', key: 'pm25_promedio',        threshold: LIMITS.pm2_5, color: '#22c55e' },
  { title: 'CO₂',         unit: 'ppm',   key: 'co2_promedio',         threshold: LIMITS.co2,   color: '#22c55e' },
  { title: 'Temperatura', unit: '°C',    key: 'temperatura_promedio', threshold: 28,            color: '#3b82f6' },
  { title: 'Humedad',     unit: '%',     key: 'humedad_promedio',     threshold: 70,            color: '#8b5cf6' },
]

function ChartCard({ title, unit, valueKey, threshold, data, color }) {
  const lastPt  = [...(data ?? [])].reverse().find(d => d[valueKey] != null)
  const lastVal = lastPt ? parseFloat(lastPt[valueKey]) : null
  const alert   = lastVal != null && lastVal >= threshold

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          {lastVal != null && (
            <span className={`text-xs font-semibold ${alert ? 'text-red-600' : 'text-green-600'}`}>
              {alert ? '⚠ Sobre el límite' : '✓ En rango seguro'}
            </span>
          )}
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="text-xs text-gray-400">{unit}</p>
          <p className="flex items-center gap-1 mt-0.5 justify-end">
            <span className="inline-block w-5 border-t border-dashed border-orange-400" />
            <span className="text-xs text-orange-500">límite {threshold}</span>
          </p>
        </div>
      </div>
      <LineChart data={data} valueKey={valueKey} threshold={threshold} color={color} />
    </div>
  )
}

export default function Stats() {
  const { lectura, estado, refresh } = useSensor()
  const [filtro, setFiltro] = useState('hoy')
  const [stats,  setStats]  = useState(null)
  const quality = getOverallQuality(lectura)
  const qs = QUALITY_STYLE[quality.color]

  useEffect(() => {
    api.getEstadisticas(filtro).then(setStats).catch(() => setStats(null))
  }, [filtro])

  const alertCount = POLLUTANTS.filter(({ key }) =>
    lectura?.[key] != null && ['critical', 'limit'].includes(getBarStatus(lectura[key], LIMITS[key]))
  ).length

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Estadísticas</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5
          ${estado?.conectado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          <span className={`w-2 h-2 rounded-full ${estado?.conectado ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {estado?.conectado ? 'Conectado' : 'Sin señal'}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-1 shadow-sm">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all
              ${filtro === f.key ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* 4 mini summary cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: '🌡️', label: 'Temperatura',   value: lectura?.temperatura != null ? `${lectura.temperatura.toFixed(1)} °C`  : '--' },
          { icon: '💧', label: 'Humedad',        value: lectura?.humedad     != null ? `${lectura.humedad.toFixed(0)} %`       : '--' },
          { icon: '📊', label: stats ? `Lecturas · ${stats.periodo}` : 'Lecturas', value: stats?.total_lecturas ?? '--' },
          { icon: '🕐', label: 'Última lectura', value: lectura ? timeAgo(lectura.fecha_hora) : '--' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{label}</p>
              <p className="font-bold text-gray-900 text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pollutant status chips */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado contaminantes</p>
          {alertCount > 0 && (
            <span className="text-xs font-semibold text-red-600">⚠️ {alertCount} en alerta</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POLLUTANTS.map(({ key, label }) => {
            const val    = lectura?.[key]
            const status = val != null ? getBarStatus(val, LIMITS[key]) : null
            const cfg    = STATUS_CONFIG[status ?? 'good']
            return (
              <span key={key}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border
                  ${status ? CHIP[status] : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                {status ? cfg.icon : '·'} {label}
              </span>
            )
          })}
        </div>
        {lectura && !alertCount && (
          <p className="text-xs text-green-600 font-semibold mt-3">✅ Todos los parámetros en rango seguro</p>
        )}
      </div>

      {/* Tendencia / period summary */}
      <div className={`rounded-2xl p-4 border flex items-start gap-3 ${qs.banner}`}>
        <span className="text-3xl flex-shrink-0">🐢</span>
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${qs.label}`}>{quality.level}</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            {stats
              ? stats.total_lecturas > 0
                ? `${stats.total_lecturas} lecturas en ${stats.periodo}`
                : `Sin registros en ${stats.periodo}`
              : 'Cargando…'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{quality.message}</p>
        </div>
      </div>

      {/* ── Tendencias (line charts) ── */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Tendencias · {stats?.periodo ?? '…'}
        </p>
        {stats?.datos?.length > 0 ? (
          <div className="space-y-3">
            {CHARTS.map(c => (
              <ChartCard key={c.key}
                title={c.title} unit={c.unit}
                valueKey={c.key} threshold={c.threshold}
                data={stats.datos} color={c.color}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-dashed border-gray-200">
            <span className="text-4xl opacity-25">📈</span>
            <p className="text-sm font-semibold text-gray-500 mt-3">Sin datos históricos aún</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Las gráficas aparecerán cuando el sensor<br />retome las lecturas periódicas
            </p>
          </div>
        )}
      </div>

      {/* Material Particulado */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Material Particulado (µg/m³)
        </p>
        <div className="space-y-3">
          <PMBar label="PM 1.0" field="pm1_0" value={lectura?.pm1_0} />
          <PMBar label="PM 2.5" field="pm2_5" value={lectura?.pm2_5} />
          <PMBar label="PM 4.0" field="pm4_0" value={lectura?.pm4_0} />
          <PMBar label="PM 10"  field="pm10"  value={lectura?.pm10}  />
        </div>
      </div>

      {/* VOC */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          VOC · Compuestos Orgánicos Volátiles
        </p>
        <PMBar label="VOC" field="voc" value={lectura?.voc} />
      </div>

      {/* CO2 */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          CO₂ · Dióxido de Carbono
        </p>
        <PMBar label="CO₂" field="co2" value={lectura?.co2} />
      </div>

      {/* Update button */}
      <button onClick={refresh}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
        🔃 ACTUALIZAR DATOS
      </button>
    </div>
  )
}
