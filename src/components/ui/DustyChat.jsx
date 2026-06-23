import { useState, useRef, useEffect } from 'react'

const QUICK = ['¿Cómo está el PM2.5?', 'Ver misiones', 'Consejo del día', '¿Qué es el VOC?']

function getResponse(msg, lectura) {
  const m    = msg.toLowerCase()
  const pm25 = lectura?.pm2_5
  const co2  = lectura?.co2
  const voc  = lectura?.voc
  const temp = lectura?.temperatura
  const hum  = lectura?.humedad

  if (m.includes('pm2') || m.includes('pm 2')) {
    if (!pm25) return 'No hay datos de PM2.5 ahora. ¿Está el sensor conectado? 🔌'
    return pm25 > 25
      ? `⚠️ El PM2.5 está en ${pm25.toFixed(1)} µg/m³, sobre el límite de 25. ¡Abre las ventanas ahora!`
      : `✅ El PM2.5 está en ${pm25.toFixed(1)} µg/m³, dentro del límite de 25. ¡El aire está limpio!`
  }
  if (m.includes('co2') || m.includes('dióxido')) {
    if (!co2) return 'No hay datos de CO2 ahora. 🤔'
    return co2 > 900
      ? `⚠️ El CO2 está en ${co2} ppm, sobre el límite. Ventila el espacio de inmediato.`
      : `✅ El CO2 está en ${co2} ppm, dentro del límite de 900 ppm. ¡Bien ventilado!`
  }
  if (m.includes('voc') || m.includes('orgánic')) {
    if (!voc) return '💡 El VOC mide Compuestos Orgánicos Volátiles. Vienen de pinturas, limpiadores y plásticos.'
    return `El VOC está en ${voc} ppb ${voc > 300 ? '⚠️ — algo elevado. Ventila el aula.' : '✅ — nivel normal. ¡Todo bien!'}. Los VOC altos causan fatiga.`
  }
  if (m.includes('mision') || m.includes('misión')) {
    return '🎯 Tienes 1 misión activa: "Cuidar el aire del aula" al 85% de progreso. ¡Sigue monitoreando!'
  }
  if (m.includes('consejo')) {
    if (temp && hum) {
      const humMsg = hum < 40 ? 'El aire está seco — considera un humidificador.' : hum > 70 ? 'Humedad alta — ventila el espacio.' : 'Condiciones perfectas para estudiar.'
      return `🌿 Hoy: ${temp.toFixed(1)}°C y ${hum.toFixed(0)}% humedad. ${humMsg} Un buen nivel de CO2 mejora la concentración hasta un 15%.`
    }
    return '🌿 Mantén la ventilación activa durante las clases. Ábrelas al menos 5 minutos cada hora.'
  }
  if (m.includes('hola') || m.includes('hello')) {
    return '¡Hola STEMnauta! 🐢 Puedes preguntarme sobre PM2.5, CO2, VOC, misiones o pedir consejos. ¿Qué quieres saber?'
  }
  return '🐢 Puedo ayudarte con info sobre PM2.5, CO2, VOC, misiones o consejos de salud ambiental. ¿Qué necesitas?'
}

export default function DustyChat({ lectura, onClose }) {
  const [msgs, setMsgs]   = useState([
    { role: 'dusty', text: '¡Hola STEMnauta! 🌿 He analizado los sensores. El aire de tu espacio está siendo monitoreado. ¿En qué puedo ayudarte hoy?' }
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  function send(text) {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setMsgs(prev => [
      ...prev,
      { role: 'user',  text: msg },
      { role: 'dusty', text: getResponse(msg, lectura) }
    ])
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐢</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">Chat con Dusty</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
              ESP32 Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-light">
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
            {msg.role === 'dusty' && (
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-base flex-shrink-0">🐢</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-green-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)}
            className="whitespace-nowrap text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-50 flex-shrink-0 transition-colors">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-5 pt-2 border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Pregúntale algo a Dusty..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-300"
        />
        <button onClick={() => send()}
          className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-green-600 active:scale-95 transition-all">
          ›
        </button>
      </div>
    </div>
  )
}
