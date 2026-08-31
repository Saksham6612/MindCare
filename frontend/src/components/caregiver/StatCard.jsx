import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-purple-100',
  iconColor = 'text-purple-700',
  trend,
  trendLabel = 'vs last week',
  borderColor = 'border-purple-200',
  children
}) {
  const { t } = useTranslation();
  const hasTrend = typeof trend === 'number';
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderColor} shadow-sm p-5 sm:p-6 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gray-500">
            {t(`caregiver.${label.toLowerCase().replace(/ /g, '_')}`, { defaultValue: t(label, { defaultValue: label }) })}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-gray-900 mt-1 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm font-semibold text-gray-500 mt-0.5">
              {t(`caregiver.${subtitle.toLowerCase().replace(/ /g, '_')}`, { defaultValue: t(subtitle, { defaultValue: subtitle }) })}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        )}
      </div>

      {hasTrend && (
        <div className="flex items-center gap-1.5 text-sm font-bold">
          {isNeutral ? (
            <Minus className="w-4 h-4 text-gray-400" />
          ) : isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-rose-600" />
          )}
          <span className={
            isNeutral ? 'text-gray-500' : isPositive ? 'text-emerald-700' : 'text-rose-700'
          }>
            {isPositive ? '+' : ''}{trend}% {t('caregiver.vs_last_week', { defaultValue: trendLabel })}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
