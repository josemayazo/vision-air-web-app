const W = 320, H = 96, PT = 12, PB = 22, PL = 4, PR = 4
const CW = W - PL - PR
const CH = H - PT - PB

function formatTs(ts) {
  if (!ts) return ''
  if (/^\d{2}:\d{2}$/.test(ts)) return ts          // "10:00" → keep
  const parts = ts.split('-')
  return parts.length === 3 ? `${parts[2]}/${+parts[1]}` : ts // "2026-06-22" → "22/6"
}

export default function LineChart({ data, valueKey, threshold, color = '#22c55e' }) {
  if (!data?.length) {
    return (
      <div className="h-24 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-1">
        <span className="text-2xl opacity-20">📈</span>
        <p className="text-xs text-gray-400">Sin datos para este período</p>
      </div>
    )
  }

  const pts = data
    .map((d, i) => ({ i, v: d[valueKey] != null ? parseFloat(d[valueKey]) : null, t: d.timestamp }))
    .filter(p => p.v != null)

  if (!pts.length) {
    return (
      <div className="h-24 rounded-xl bg-gray-50 flex items-center justify-center">
        <p className="text-xs text-gray-400">Sin datos para este parámetro</p>
      </div>
    )
  }

  const vals   = pts.map(p => p.v)
  const maxVal = Math.max(...vals, threshold * 1.2, 1)
  const minVal = 0

  const sx = (i) => PL + (i / Math.max(data.length - 1, 1)) * CW
  const sy = (v) => PT + CH - ((v - minVal) / (maxVal - minVal)) * CH

  const xyPts    = pts.map(p => ({ ...p, x: sx(p.i), y: sy(p.v) }))
  const linePath = xyPts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${xyPts.at(-1).x.toFixed(1)},${(PT + CH).toFixed(1)} L${xyPts[0].x.toFixed(1)},${(PT + CH).toFixed(1)} Z`

  const thY       = sy(threshold)
  const isAlert   = vals.some(v => v >= threshold)
  const lineColor = isAlert ? '#ef4444' : color
  const dotR      = pts.length > 12 ? 2.5 : 3.5

  // x-axis: at most 5 evenly-spaced labels
  const n    = data.length
  const idxs = n <= 5
    ? [...Array(n).keys()]
    : [0, Math.round(n / 4), Math.round(n / 2), Math.round((3 * n) / 4), n - 1]

  // last visible point (for value label)
  const last = xyPts.at(-1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: `${H}px` }}>
      {/* Threshold dashed line */}
      <line
        x1={PL} y1={thY} x2={W - PR} y2={thY}
        stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.65"
      />
      <text x={W - PR - 3} y={thY - 3} fontSize="7.5" textAnchor="end" fill="#f97316" opacity="0.8">
        {threshold}
      </text>

      {/* Area fill */}
      <path d={areaPath} fill={lineColor} opacity="0.1" />

      {/* Gradient under line using fill approximation */}
      <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Data-point dots */}
      {pts.length <= 24 && xyPts.map((p, k) => (
        <circle key={k}
          cx={p.x} cy={p.y} r={dotR}
          fill={p.v >= threshold ? '#ef4444' : color}
          stroke="#fff" strokeWidth="1.5"
        />
      ))}

      {/* Last-value label */}
      {last && (
        <text
          x={Math.min(last.x + 5, W - PR - 12)}
          y={Math.max(last.y - 4, PT + 9)}
          fontSize="9" fontWeight="700" textAnchor="start"
          fill={last.v >= threshold ? '#ef4444' : '#374151'}
        >
          {last.v.toFixed(1)}
        </text>
      )}

      {/* X-axis labels */}
      {idxs.map(i => data[i] && (
        <text key={i}
          x={sx(i)} y={H - 5}
          fontSize="8" textAnchor="middle" fill="#9ca3af"
        >
          {formatTs(data[i].timestamp)}
        </text>
      ))}
    </svg>
  )
}
