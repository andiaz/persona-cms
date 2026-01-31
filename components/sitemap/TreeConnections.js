// components/sitemap/TreeConnections.js

export default function TreeConnections({ screens, positions, nodeWidth, nodeHeight }) {
  // Generate paths for parent-child connections
  const paths = [];

  screens.forEach((screen) => {
    if (!screen.parentId) return;

    const parentPos = positions.get(screen.parentId);
    const childPos = positions.get(screen.id);

    if (!parentPos || !childPos) return;

    // Calculate connection points
    const startX = parentPos.x + nodeWidth / 2;
    const startY = parentPos.y + nodeHeight;
    const endX = childPos.x + nodeWidth / 2;
    const endY = childPos.y;

    // Bezier curve control points
    const midY = (startY + endY) / 2;

    // Path data
    const d = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

    paths.push({
      id: `conn-${screen.parentId}-${screen.id}`,
      d,
    });
  });

  // Calculate SVG bounds
  let maxX = 0;
  let maxY = 0;
  positions.forEach((pos) => {
    maxX = Math.max(maxX, pos.x + nodeWidth);
    maxY = Math.max(maxY, pos.y + nodeHeight);
  });

  if (paths.length === 0) return null;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: maxX + 100,
        height: maxY + 100,
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>

      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
