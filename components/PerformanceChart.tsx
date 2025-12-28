
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PerformanceStats } from '../types';

interface Props {
  stats: PerformanceStats;
}

const PerformanceChart: React.FC<Props> = ({ stats }) => {
  const data = [
    { name: 'Horsepower', value: stats.horsepower, max: 2000, color: '#3b82f6' },
    { name: 'Top Speed', value: stats.topSpeed, max: 300, color: '#ef4444' },
    { name: 'Range', value: stats.range, max: 1000, color: '#10b981' },
    { name: '0-60 Accel', value: (10 - stats.acceleration) * 100, displayValue: stats.acceleration, max: 1000, color: '#f59e0b' },
  ];

  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <h3 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Performance Metrics</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            formatter={(value: any, name: any, props: any) => {
                if (props.payload.name === '0-60 Accel') return [`${props.payload.displayValue}s`, 'Acceleration'];
                return [value, props.payload.name];
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
