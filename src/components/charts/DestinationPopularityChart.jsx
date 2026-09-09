import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Paris', value: 400 },
  { name: 'Maldives', value: 300 },
  { name: 'Swiss Alps', value: 250 },
  { name: 'New York', value: 350 },
  { name: 'Dubai', value: 280 },
  { name: 'Tokyo', value: 320 },
];

const COLORS = ['#2563eb', '#d946ef', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

const total = data.reduce((sum, d) => sum + d.value, 0);

function CustomTooltip({ active, payload }) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const percent = ((entry.value / total) * 100).toFixed(1);
  return (
    <div className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-sm">
      <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.payload.fill }} />
        {entry.name}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
        {entry.value.toLocaleString()} {t('ui.bookings')} · {percent}%
      </div>
    </div>
  );
}

export default function DestinationPopularityChart() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
      <div className="w-full sm:w-1/2 h-[260px] sm:h-[280px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="85%"
              paddingAngle={3}
              cornerRadius={6}
              dataKey="value"
              label={false}
              stroke="none"
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ outline: 'none', cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Right-side legend */}
      <div className="w-full sm:w-1/2 space-y-2.5">
        {data.map((entry, index) => {
          const percent = ((entry.value / total) * 100).toFixed(1);
          return (
            <div
              key={entry.name}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
              <span
                className="w-3 h-3 rounded-md shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {entry.name}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {entry.value.toLocaleString()}
              </span>
              <span className="w-14 text-right text-xs text-gray-400">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
