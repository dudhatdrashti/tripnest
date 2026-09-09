import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
  { month: 'Jan', bookings: 120 },
  { month: 'Feb', bookings: 150 },
  { month: 'Mar', bookings: 180 },
  { month: 'Apr', bookings: 140 },
  { month: 'May', bookings: 200 },
  { month: 'Jun', bookings: 250 },
  { month: 'Jul', bookings: 280 },
  { month: 'Aug', bookings: 260 },
  { month: 'Sep', bookings: 190 },
  { month: 'Oct', bookings: 170 },
  { month: 'Nov', bookings: 160 },
  { month: 'Dec', bookings: 230 },
];

function CustomTooltip({ active, payload, label }) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-sm">
      <div className="font-medium text-gray-800 dark:text-gray-200">{label}</div>
      <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
        {payload[0].value.toLocaleString()} {t('ui.bookings')}
      </div>
    </div>
  );
}

export default function BookingStatisticsChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
        <Bar
          dataKey="bookings"
          fill="#3b82f6"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
          isAnimationActive
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
