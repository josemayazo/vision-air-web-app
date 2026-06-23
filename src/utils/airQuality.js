export const LIMITS = { pm1_0: 15, pm2_5: 25, pm4_0: 40, pm10: 50, voc: 300, co2: 900 }
export const UNITS  = { pm1_0: 'µg/m³', pm2_5: 'µg/m³', pm4_0: 'µg/m³', pm10: 'µg/m³', voc: 'ppb', co2: 'ppm' }

export function getBarStatus(value, limit) {
  if (value == null || !limit) return 'good'
  const r = value / limit
  if (r >= 1)   return 'critical'
  if (r >= 0.9) return 'limit'
  if (r >= 0.7) return 'high'
  return 'good'
}

export const STATUS_CONFIG = {
  good:     { bar: 'bg-green-500',  text: 'text-green-600',  label: 'BIEN',    icon: '↓' },
  high:     { bar: 'bg-yellow-400', text: 'text-yellow-600', label: 'ELEVADO', icon: '↑' },
  limit:    { bar: 'bg-orange-400', text: 'text-orange-600', label: 'LÍMITE',  icon: '△' },
  critical: { bar: 'bg-red-500',    text: 'text-red-600',    label: 'CRÍTICO', icon: '⚠' },
}

export function getOverallQuality(lectura) {
  if (!lectura) return { level: 'DESCONOCIDO', color: 'gray', message: 'Esperando datos del sensor...' }
  const { pm2_5 = 0, co2 = 0 } = lectura
  if (pm2_5 >= LIMITS.pm2_5 || co2 >= LIMITS.co2)
    return { level: 'ALERTA ROJA', color: 'red',    message: 'La calidad del aire ha superado los límites. Se recomienda ventilación inmediata.' }
  if (pm2_5 >= LIMITS.pm2_5 * 0.8 || co2 >= LIMITS.co2 * 0.85)
    return { level: 'MODERADO',    color: 'orange', message: 'Algunos parámetros están cerca de los límites. Ventila el espacio.' }
  return   { level: 'ÓPTIMO',      color: 'green',  message: '¡El aire está en condiciones óptimas para el estudio!' }
}

export function timeAgo(dateStr) {
  if (!dateStr) return 'sin datos'
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1)  return 'ahora mismo'
  if (mins < 60) return `hace ${mins} min`
  const h = Math.floor(mins / 60)
  if (h < 24)    return `hace ${h} hora${h > 1 ? 's' : ''}`
  return `hace ${Math.floor(h / 24)} día(s)`
}

export function getAlertUnit(variable) {
  if (variable?.toLowerCase().includes('pm')) return 'µg/m³'
  if (variable === 'CO2') return 'ppm'
  if (variable === 'VOC') return 'ppb'
  return ''
}
