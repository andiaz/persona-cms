import { useState, useEffect } from 'react';

const getPriorityLabel = (priority) => {
  const labels = ['low', 'low', 'medium', 'high', 'critical'];
  return labels[priority] || 'low';
};

const PriorityAnalytics = ({ personas }) => {
  const [stats, setStats] = useState({
    criticalGoals: 0,
    highPriorityPainPoints: 0,
    priorityDistribution: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  });

  useEffect(() => {
    const newStats = personas.reduce(
      (acc, persona) => {
        // Count priority distribution
        acc.priorityDistribution[getPriorityLabel(persona.priority)]++;

        // Count critical goals
        Object.values(persona.goalPriorities).forEach((priority) => {
          if (priority === 4) acc.criticalGoals++;
        });

        // Count high priority pain points
        Object.values(persona.painPointPriorities).forEach((priority) => {
          if (priority >= 3) acc.highPriorityPainPoints++;
        });

        return acc;
      },
      {
        criticalGoals: 0,
        highPriorityPainPoints: 0,
        priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
      }
    );

    setStats(newStats);
  }, [personas]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-bold">Priority Distribution</h3>
        {Object.entries(stats.priorityDistribution).map(([label, count]) => (
          <div key={label} className="flex justify-between">
            <span className="capitalize">{label}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-bold">Critical Items</h3>
        <p>Critical Goals: {stats.criticalGoals}</p>
        <p>High Priority Pain Points: {stats.highPriorityPainPoints}</p>
      </div>
    </div>
  );
};

export default PriorityAnalytics;
