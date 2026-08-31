import React, { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2, X, Clock } from 'lucide-react';

const SEVERITY_CONFIG = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeLabel: 'Warning'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    badgeLabel: 'Info'
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badgeLabel: 'Resolved'
  }
};

export default function AlertCard({ alert, onDismiss }) {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border-2 p-4 sm:p-5 flex items-start gap-4 ${config.bg} ${config.border} transition-all`}>
      <div className={`p-2.5 rounded-xl shrink-0 ${config.iconBg} ${config.iconColor}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badge}`}>
            {config.badgeLabel}
          </span>
          {alert.resolved && (
            <span className="text-xs font-bold text-gray-400">Resolved</span>
          )}
        </div>

        <h4 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
          {alert.title}
        </h4>
        <p className="text-sm sm:text-base font-semibold text-gray-600 leading-relaxed">
          {alert.detail}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 pt-0.5">
          <Clock className="w-3.5 h-3.5" />
          {alert.time}
        </div>
      </div>

      {onDismiss && !alert.resolved && (
        <button
          onClick={() => onDismiss(alert.id)}
          aria-label={`Dismiss alert: ${alert.title}`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/70 transition shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
