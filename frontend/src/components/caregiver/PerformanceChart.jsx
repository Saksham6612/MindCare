import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border-2 border-gray-200 shadow-xl rounded-2xl p-4 text-sm min-w-[160px]">
      <p className="font-extrabold text-gray-800 mb-2">{payload[0]?.payload?.date || label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-extrabold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart({ data }) {
  const [chartType, setChartType] = useState('line');
  const { t } = useLanguage();

  const chartLines = [
    { key: 'memory', label: t('caregiver.statMemory'), color: '#7C3AED' },
    { key: 'attention', label: t('caregiver.statAttention'), color: '#0EA5E9' },
    { key: 'pattern', label: t('caregiver.statPattern'), color: '#10B981' }
  ];

  const [visibleLines, setVisibleLines] = useState({
    memory: true,
    attention: true,
    pattern: true
  });

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
            {t('caregiver.weeklyChartTitle')}
          </h3>
          <p className="text-sm font-semibold text-gray-500">
            {t('caregiver.weeklyChartSub')}
          </p>
        </div>

        {/* Chart type toggle */}
        <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 self-start sm:self-auto">
          {['line', 'bar'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-1.5 text-sm font-bold capitalize transition cursor-pointer ${
                chartType === type
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t(`chartType.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Metric toggles */}
      <div className="flex flex-wrap gap-2">
        {chartLines.map(line => (
          <button
            key={line.key}
            onClick={() => toggleLine(line.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition cursor-pointer ${
              visibleLines[line.key]
                ? 'bg-white text-gray-800 border-gray-300'
                : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
            }`}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: line.color }} />
            {line.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              {chartLines.map(line => visibleLines[line.key] && (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.label}
                  stroke={line.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: line.color, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
              {chartLines.map(line => visibleLines[line.key] && (
                <Bar
                  key={line.key}
                  dataKey={line.key}
                  name={line.label}
                  fill={line.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
