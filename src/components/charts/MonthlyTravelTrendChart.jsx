import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { month: 'Jan', travelers: 1200, trips: 800 },
  { month: 'Feb', travelers: 1500, trips: 950 },
  { month: 'Mar', travelers: 1800, trips: 1200 },
  { month: 'Apr', travelers: 1600, trips: 1050 },
  { month: 'May', travelers: 2100, trips: 1400 },
  { month: 'Jun', travelers: 2500, trips: 1700 },
  { month: 'Jul', travelers: 2800, trips: 1900 },
  { month: 'Aug', travelers: 2600, trips: 1750 },
  { month: 'Sep', travelers: 2000, trips: 1350 },
  { month: 'Oct', travelers: 1800, trips: 1200 },
  { month: 'Nov', travelers: 1700, trips: 1100 },
  { month: 'Dec', travelers: 2400, trips: 1600 },
];

export default function MonthlyTravelTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="travelers" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="trips" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
