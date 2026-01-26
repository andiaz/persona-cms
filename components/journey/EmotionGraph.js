// components/journey/EmotionGraph.js
// SVG line graph showing emotional journey per persona across stages

import { useState, useRef, useEffect } from 'react';

const EMOTION_LABELS = {
  2: 'Delighted',
  1: 'Happy',
  0: 'Neutral',
  '-1': 'Frustrated',
  '-2': 'Upset',
};

export default function EmotionGraph({ stages, personas, colors }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32); // minus padding
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!stages?.length || !personas?.length) return null;

  // Graph dimensions - use full container width
  const width = Math.max(containerWidth, 400);
  const height = 160;
  const padding = { top: 30, right: 40, bottom: 40, left: 70 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale emotion value (-2 to 2) to y position
  const emotionToY = (value) => {
    const normalized = (value + 2) / 4;
    return padding.top + graphHeight * (1 - normalized);
  };

  // Get x position for stage
  const stageToX = (index) => {
    const sWidth = graphWidth / stages.length;
    return padding.left + sWidth * index + sWidth / 2;
  };

  // Get emotion value for persona at stage
  const getEmotionValue = (personaId, stage) => {
    const emotion = stage.emotions?.find((e) => e.personaId === personaId);
    return emotion?.value ?? 0;
  };

  // Generate path for persona's emotional journey
  const generatePath = (personaId) => {
    const points = stages.map((stage, index) => {
      const x = stageToX(index);
      const y = emotionToY(getEmotionValue(personaId, stage));
      return { x, y };
    });

    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Emotion labels for y-axis
  const emotionLabels = [
    { value: 2, label: 'Delighted', color: '#22c55e' },
    { value: 1, label: 'Happy', color: '#84cc16' },
    { value: 0, label: 'Neutral', color: '#eab308' },
    { value: -1, label: 'Frustrated', color: '#f97316' },
    { value: -2, label: 'Upset', color: '#ef4444' },
  ];

  return (
    <div ref={containerRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">Emotional Journey</h3>
      </div>
      <div className="p-4">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block"
        >
          {/* Background gradient zones */}
          <defs>
            <linearGradient id="emotionBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#fef9c3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fecaca" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <rect
            x={padding.left}
            y={padding.top}
            width={graphWidth}
            height={graphHeight}
            fill="url(#emotionBg)"
            rx="4"
          />

          {/* Horizontal grid lines with labels */}
          {emotionLabels.map(({ value, label, color }) => (
            <g key={value}>
              <line
                x1={padding.left}
                y1={emotionToY(value)}
                x2={width - padding.right}
                y2={emotionToY(value)}
                stroke={value === 0 ? '#94a3b8' : '#e2e8f0'}
                strokeWidth={value === 0 ? '1.5' : '1'}
                strokeDasharray={value === 0 ? '4,4' : 'none'}
              />
              <text
                x={padding.left - 8}
                y={emotionToY(value)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fill={color}
                fontWeight="500"
              >
                {label}
              </text>
            </g>
          ))}

          {/* Stage labels at bottom */}
          {stages.map((stage, index) => (
            <g key={stage.id}>
              <line
                x1={stageToX(index)}
                y1={padding.top}
                x2={stageToX(index)}
                y2={height - padding.bottom}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={stageToX(index)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontWeight="500"
              >
                {stage.name.length > 12 ? stage.name.slice(0, 12) + '...' : stage.name}
              </text>
            </g>
          ))}

          {/* Emotion lines for each persona */}
          {personas.map((persona, idx) => {
            const color = colors[idx % colors.length];
            const path = generatePath(persona.id);

            return (
              <g key={persona.id}>
                {/* Shadow for depth */}
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.2"
                />
                {/* Main line */}
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points with hover */}
                {stages.map((stage, stageIdx) => {
                  const x = stageToX(stageIdx);
                  const emotionValue = getEmotionValue(persona.id, stage);
                  const y = emotionToY(emotionValue);
                  const isHovered = hoveredPoint?.personaId === persona.id && hoveredPoint?.stageIdx === stageIdx;

                  return (
                    <g key={`${persona.id}-${stageIdx}`}>
                      {/* Larger hit area for hover */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredPoint({ personaId: persona.id, stageIdx, emotionValue, personaName: persona.name, stageName: stage.name })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Visible point */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? '7' : '5'}
                        fill="white"
                        stroke={color}
                        strokeWidth="2.5"
                        style={{ transition: 'r 0.15s ease' }}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Tooltip */}
          {hoveredPoint && (
            <g>
              <rect
                x={stageToX(hoveredPoint.stageIdx) - 60}
                y={emotionToY(hoveredPoint.emotionValue) - 45}
                width="120"
                height="36"
                rx="6"
                fill="#1e293b"
                opacity="0.95"
              />
              <text
                x={stageToX(hoveredPoint.stageIdx)}
                y={emotionToY(hoveredPoint.emotionValue) - 32}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="600"
              >
                {hoveredPoint.personaName}
              </text>
              <text
                x={stageToX(hoveredPoint.stageIdx)}
                y={emotionToY(hoveredPoint.emotionValue) - 18}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
              >
                {EMOTION_LABELS[hoveredPoint.emotionValue]} at {hoveredPoint.stageName}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div style={{ fontSize: '12px', lineHeight: '20px' }}>
          {personas.map((persona, idx) => (
            <span key={persona.id} style={{ marginRight: '16px' }}>
              <svg width="12" height="20" style={{ display: 'inline-block', verticalAlign: 'top', marginRight: '8px' }}>
                <circle cx="6" cy="10" r="6" fill={colors[idx % colors.length]} />
              </svg>
              <span className="font-medium text-slate-600">{persona.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
