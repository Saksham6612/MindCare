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
import { useTranslation } from 'react-i18next';

const CHART_LINES = [
  { key: 'memory', labelKey: 'games.memory_game', labelDefault: 'Memory', color: '#7C3AED' },
  { key: 'attention', labelKey: 'caregiver.attention', labelDefault: 'Attention', color: '#0EA5E9' },
  { key: 'pattern', labelKey: 'caregiver.pattern', labelDefault: 'Pattern', color: '#10B981' }
];

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
  const { t } = useTranslation();
  const [chartType, setChartType] = useState('line');
  const [visibleLines, setVisibleLines] = useState(
    Object.fromEntries(CHART_LINES.map(l => [l.key, true]))
  );

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
            {t('caregiver.weekly_perf_title', { defaultValue: 'Weekly Cognitive Performance' })}
          </h3>
          <p className="text-sm font-semibold text-gray-500">
            {t('caregiver.weekly_perf_desc', { defaultValue: 'Memory, Attention & Pattern Recognition (%) — Last 7 days' })}
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
              {t(`caregiver.${type}`, { defaultValue: type })}
            </button>
          ))}
        </div>
      </div>

      {/* Metric toggles */}
      <div className="flex flex-wrap gap-2">
        {CHART_LINES.map(line => (
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
            {t(line.labelKey, { defaultValue: line.labelDefault })}
          </button>
        ))}
      </div>

      {/* Chart — explicit height required by Recharts ResponsiveContainer */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              {CHART_LINES.map(line => visibleLines[line.key] && (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={t(line.labelKey, { defaultValue: line.labelDefault })}
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
              {CHART_LINES.map(line => visibleLines[line.key] && (
                <Bar
                  key={line.key}
                  dataKey={line.key}
                  name={t(line.labelKey, { defaultValue: line.labelDefault })}
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
