import { useState } from 'react'
import { useSensor } from '../context/SensorContext'
import { getOverallQuality } from '../utils/airQuality'
import DustyChat from '../components/ui/DustyChat'

const STATE_STYLE = {
  green:  { badge: 'bg-green-100 text-green-700',   label: 'ESTADO: ÓPTIMO'      },
  orange: { badge: 'bg-orange-100 text-orange-700', label: 'ESTADO: MODERADO'    },
  red:    { badge: 'bg-red-100 text-red-700',       label: 'ESTADO: ALERTA'      },
  gray:   { badge: 'bg-gray-100 text-gray-600',     label: 'ESTADO: DESCONOCIDO' },
}

const MOOD = {
  'ÓPTIMO':      { emoji: '😊', text: 'Dusty se siente genial hoy 🌿' },
  'MODERADO':    { emoji: '🤔', text: 'Dusty está un poco preocupado'  },
  'ALERTA ROJA': { emoji: '😨', text: 'Dusty necesita tu ayuda urgente ⚠️' },
  'DESCONOCIDO': { emoji: '😴', text: 'Dusty está esperando datos...' },
}

export default function Dusty() {
  const { lectura, estado } = useSensor()
  const [chatOpen, setChatOpen] = useState(false)
  const quality = getOverallQuality(lectura)
  const ss   = STATE_STYLE[quality.color]
  const mood = MOOD[quality.level] ?? MOOD['DESCONOCIDO']

  return (
    <>
      <div className="px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Dusty Monitor</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5
            ${estado?.conectado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            <span className={`w-2 h-2 rounded-full ${estado?.conectado ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {estado?.conectado ? 'ESP32 ON' : 'ESP32 OFF'}
          </span>
        </div>

        {/* Dusty card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-28 h-28 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center text-6xl mx-auto">
              🐢
            </div>
            <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${ss.badge}`}>
              {ss.label}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-6">¡Hola STEMnauta!</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Soy <strong className="text-green-600">Dusty</strong>, tu compañero en la misión<br />
            de proteger nuestro ecosistema.
          </p>

          {/* Mood row */}
          <div className="mt-4 bg-gray-50 rounded-2xl p-3 flex items-center gap-3 text-left">
            <span className="text-2xl">{mood.emoji}</span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Ánimo de Dusty</p>
              <p className="text-sm font-semibold text-gray-800">{mood.text}</p>
            </div>
          </div>

          <button
            onClick={() => setChatOpen(true)}
            className="mt-4 w-full bg-green-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600 active:scale-95 transition-all shadow-sm"
          >
            ⚡ Interactuar con Dusty
          </button>
        </div>

        {/* Misiones */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900">☑️ Misiones Activas</h3>
            <button className="text-xs text-green-600 font-semibold">VER TODAS</button>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">STEM Ciencias</p>
            <p className="font-semibold text-gray-900 mt-1">Cuidar el aire del aula</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>PROGRESO</span>
                <span>85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Sabías que */}
        <div className="bg-pink-50 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Sabías que...</p>
            <p className="text-sm text-gray-600 mt-1">
              Dusty está inspirado en la <strong>Tortuga de Río</strong>{' '}
              (<em>Podocnemis lewyana</em>), una especie única de Colombia que debemos proteger.
            </p>
          </div>
        </div>

        {/* Temp + Humidity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <span className="text-2xl">💧</span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-2">Humedad</p>
            <p className="text-2xl font-bold text-gray-900">
              {lectura?.humedad?.toFixed(0) ?? '--'}<span className="text-sm text-gray-400">%</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <span className="text-2xl">🌡️</span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-2">Temp.</p>
            <p className="text-2xl font-bold text-gray-900">
              {lectura?.temperatura?.toFixed(0) ?? '--'}<span className="text-sm text-gray-400">°C</span>
            </p>
          </div>
        </div>
      </div>

      {chatOpen && <DustyChat lectura={lectura} onClose={() => setChatOpen(false)} />}
    </>
  )
}
