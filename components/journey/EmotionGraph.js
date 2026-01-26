// components/journey/EmotionGraph.js
// SVG line graph showing emotional journey per persona across stages

export default function EmotionGraph({ stages, personas, colors }) {
  if (!stages?.length || !personas?.length) return null;

  // Graph dimensions
  const width = stages.length * 288 + 32; // 288px per stage (w-72) + padding
  const height = 120;
  const padding = { top: 20, right: 16, bottom: 20, left: 16 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale emotion value (-2 to 2) to y position
  const emotionToY = (value) => {
    // -2 should be at bottom (high y), +2 should be at top (low y)
    const normalized = (value + 2) / 4; // 0 to 1
    return padding.top + graphHeight * (1 - normalized);
  };

  // Get x position for stage
  const stageToX = (index) => {
    const stageWidth = graphWidth / stages.length;
    return padding.left + stageWidth * index + stageWidth / 2;
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

    // Create smooth curve through points
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      // Use bezier curve for smooth lines
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Emotion labels for y-axis
  const emotionLabels = [
    { value: 2, label: '😄' },
    { value: 1, label: '🙂' },
    { value: 0, label: '😐' },
    { value: -1, label: '😕' },
    { value: -2, label: '😞' },
  ];

  return (
    <div className="mb-4 bg-gradient-to-b from-green-50 via-white to-red-50 rounded-lg border border-gray-200 overflow-hidden">
      <svg width={width} height={height} className="block">
        {/* Horizontal grid lines */}
        {emotionLabels.map(({ value, label }) => (
          <g key={value}>
            <line
              x1={padding.left}
              y1={emotionToY(value)}
              x2={width - padding.right}
              y2={emotionToY(value)}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray={value === 0 ? '4,4' : 'none'}
            />
            <text
              x={padding.left - 4}
              y={emotionToY(value)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs"
              fill="#9ca3af"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Vertical grid lines for stages */}
        {stages.map((_, index) => (
          <line
            key={index}
            x1={stageToX(index)}
            y1={padding.top}
            x2={stageToX(index)}
            y2={height - padding.bottom}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Emotion lines for each persona */}
        {personas.map((persona, idx) => {
          const color = colors[idx % colors.length];
          const path = generatePath(persona.id);

          return (
            <g key={persona.id}>
              {/* Line */}
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {stages.map((stage, stageIdx) => {
                const x = stageToX(stageIdx);
                const y = emotionToY(getEmotionValue(persona.id, stage));
                return (
                  <circle
                    key={`${persona.id}-${stageIdx}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke={color}
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
