import React from 'react';
import { Brain, Pill, Droplets, Smile, Eye, Clock } from 'lucide-react';

const ICON_MAP = {
  Brain,
  Pill,
  Droplets,
  Smile,
  Eye
};

const SENTIMENT_CONFIG = {
  positive: {
    dot: 'bg-emerald-500',
    border: 'border-l-emerald-500'
  },
  neutral: {
    dot: 'bg-gray-400',
    border: 'border-l-gray-300'
  },
  negative: {
    dot: 'bg-rose-500',
    border: 'border-l-rose-400'
  }
};

export default function ActivityList({ activities }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
          Recent Activity
        </h3>
        <p className="text-sm font-semibold text-gray-500">
          Live patient events from the last 48 hours
        </p>
      </div>

      <div className="divide-y divide-gray-50 space-y-0">
        {activities.map((activity) => {
          const Icon = ICON_MAP[activity.icon] || Clock;
          const sentiment = SENTIMENT_CONFIG[activity.sentiment] || SENTIMENT_CONFIG.neutral;

          return (
            <div
              key={activity.id}
              className={`flex items-start gap-4 py-3.5 border-l-4 pl-4 rounded-r-xl ${sentiment.border}`}
            >
              {/* Icon */}
              <div className="p-2 bg-gray-100 rounded-xl shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${sentiment.dot}`} />
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                    {activity.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 leading-snug">
                  {activity.detail}
                </p>
                <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
