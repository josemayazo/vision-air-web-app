const BASE = import.meta.env.VITE_API_URL || '/api/v1'
export const DEVICE_ID = import.meta.env.VITE_DEVICE_ID || 'ESP32_AULA_1'

const NUM_FIELDS = ['temperatura', 'humedad', 'pm1_0', 'pm2_5', 'pm4_0', 'pm10', 'voc', 'co2']

function normalizeReading(r) {
  if (!r) return null
  const out = { ...r }
  for (const f of NUM_FIELDS) {
    if (out[f] != null) out[f] = parseFloat(out[f])
  }
  return out
}

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const api = {
  getLecturaActual: async () => {
    const data = await apiFetch(`/lecturas/actual?dispositivo_id=${DEVICE_ID}`)
    return { ...data, lectura: normalizeReading(data?.lectura) }
  },
  getEstadisticas:       (filtro='hoy') => apiFetch(`/lecturas/estadisticas?dispositivo_id=${DEVICE_ID}&filtro=${filtro}`),
  getAlertasRecientes:   ()           => apiFetch('/alertas/recientes'),
  resolverAlerta:        (id)         => fetch(`${BASE}/alertas/${id}/resolver`, { method: 'PATCH' }).then(r => r.json()),
}
