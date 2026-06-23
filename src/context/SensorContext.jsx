import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/visionair'

const SensorContext = createContext(null)

export function SensorProvider({ children }) {
  const [lectura,    setLectura]    = useState(null)
  const [estado,     setEstado]     = useState(null)
  const [alertas,    setAlertas]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const refresh = useCallback(async () => {
    const [lecturaRes, alertasRes] = await Promise.allSettled([
      api.getLecturaActual(),
      api.getAlertasRecientes(),
    ])

    if (lecturaRes.status === 'fulfilled') {
      setLectura(lecturaRes.value?.lectura ?? null)
      setEstado(lecturaRes.value?.estado_dispositivo ?? null)
      setError(null)
    } else {
      setError('No se pudo conectar con el servidor')
    }

    if (alertasRes.status === 'fulfilled') {
      setAlertas(alertasRes.value ?? [])
    }

    setLastUpdate(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 30_000)
    return () => clearInterval(id)
  }, [refresh])

  return (
    <SensorContext.Provider value={{ lectura, estado, alertas, loading, error, lastUpdate, refresh }}>
      {children}
    </SensorContext.Provider>
  )
}

export const useSensor = () => useContext(SensorContext)
