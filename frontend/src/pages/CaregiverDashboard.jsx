import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Brain, Eye, Shapes, ShieldCheck,
  MapPin, Phone, CalendarClock, AlertTriangle, CheckSquare
} from 'lucide-react';
import StatCard from '../components/caregiver/StatCard';
import PerformanceChart from '../components/caregiver/PerformanceChart';
import AlertCard from '../components/caregiver/AlertCard';
import ActivityList from '../components/caregiver/ActivityList';
import {
  caregiverPatient,
  weeklyPerformanceData,
  cognitiveStats,
  medicationAdherence,
  recentActivities,
  caregiverAlerts,
  gamesCompletedThisWeek
} from '../data/caregiverData';
import { useLanguage } from '../context/LanguageContext';

export default function CaregiverDashboard() {
  const [alerts, setAlerts] = useState(caregiverAlerts);
  const activeAlerts = alerts.filter(a => !a.resolved);
  const patient = caregiverPatient;
  const { t, language } = useLanguage();

  const dismissAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const formattedCurrentDate = new Date().toLocaleDateString(language === 'bn' ? 'bn-IN' : 'en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-purple-700 font-bold text-sm hover:underline mb-1">
            <ArrowLeft className="w-4 h-4" />
            {t('caregiver.backToPatient')}
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t('caregiver.dashboardTitle')}
          </h1>
          <p className="text-sm sm:text-base font-semibold text-gray-500">
            {t('caregiver.monitoring', { name: patient.name })} · {formattedCurrentDate}
          </p>
        </div>

        {activeAlerts.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="font-extrabold text-amber-900">
              {t('caregiver.activeAlerts', { count: activeAlerts.length, plural: activeAlerts.length > 1 ? 's' : '' })}
            </span>
          </div>
        )}
      </div>

      {/* ── Patient Overview Card ── */}
      <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 lg:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0">
              BH
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{patient.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs font-bold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {t('ageLabel')} {patient.age}
                </span>
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {patient.diagnosis}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                {patient.location}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-20 bg-gray-200" />

          {/* Key info columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            <div>
              <p className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-0.5">
                {t('caregiver.caregiverLabel')}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{patient.primaryCaregiver.name}</p>
              <p className="text-xs font-semibold text-gray-500">{patient.primaryCaregiver.relation}</p>
              <a href={`tel:${patient.primaryCaregiver.phone}`} className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />{patient.primaryCaregiver.phone}
              </a>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-0.5">
                {t('caregiver.physicianLabel')}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{patient.physician.name}</p>
              <p className="text-xs font-semibold text-gray-500">{patient.physician.specialty}</p>
              <p className="text-xs font-bold text-gray-600">{patient.physician.hospital}</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-0.5">
                {t('caregiver.nextAppointmentLabel')}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <CalendarClock className="w-4 h-4 text-purple-600 shrink-0" />
                <p className="text-sm sm:text-base font-extrabold text-purple-900">{patient.physician.nextAppointment}</p>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                {t('caregiver.lastCheckIn', { time: patient.primaryCaregiver.lastCheckIn })}
              </p>
            </div>
          </div>

          {/* Overall health badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-300 px-4 py-3 rounded-2xl self-start lg:self-auto shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <div>
              <p className="text-xs font-extrabold uppercase text-emerald-800">{t('caregiver.statusLabel')}</p>
              <p className="text-base font-black text-gray-900">{t('caregiver.safeConnected')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cognitive Performance Stats (3 cards) ── */}
      <div>
        <h2 className="text-base sm:text-lg font-extrabold text-gray-700 uppercase tracking-wider mb-3">
          {t('caregiver.cognitivePerformance')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {[
            { key: 'memory', labelKey: 'caregiver.statMemory', Icon: Brain, iconBg: 'bg-purple-100', iconColor: 'text-purple-700', border: 'border-purple-200' },
            { key: 'attention', labelKey: 'caregiver.statAttention', Icon: Eye, iconBg: 'bg-sky-100', iconColor: 'text-sky-700', border: 'border-sky-200' },
            { key: 'pattern', labelKey: 'caregiver.statPattern', Icon: Shapes, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700', border: 'border-emerald-200' }
          ].map(({ key, labelKey, Icon, iconBg, iconColor, border }) => {
            const stat = cognitiveStats[key];
            return (
              <StatCard
                key={key}
                label={t(labelKey)}
                value={`${stat.score}%`}
                subtitle={stat.description}
                icon={Icon}
                iconBg={iconBg}
                iconColor={iconColor}
                trend={stat.trend}
                borderColor={border}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                  <span>{t('caregiver.statLevel')}: <span className="text-gray-800">{stat.level}</span></span>
                  <span>{t('caregiver.statSessions', { count: stat.sessions })}</span>
                </div>
                {/* Score bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${
                      key === 'memory' ? 'bg-purple-600' : key === 'attention' ? 'bg-sky-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stat.score}%` }}
                  />
                </div>
              </StatCard>
            );
          })}
        </div>
      </div>

      {/* ── Weekly Performance Chart ── */}
      <PerformanceChart data={weeklyPerformanceData} />

      {/* ── Games Completed + Medication Adherence ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Games Completed */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
              {t('caregiver.gamesCompleted')}
            </h3>
            <p className="text-sm font-semibold text-gray-500">
              {t('caregiver.sessionsCompletedSub')}
            </p>
          </div>

          <div className="space-y-3">
            {gamesCompletedThisWeek.map((g) => {
              const pct = Math.round((g.completed / g.total) * 100);
              const barColor = g.game === 'Memory' ? 'bg-purple-600' : g.game === 'Attention' ? 'bg-sky-500' : 'bg-emerald-500';
              const localizedGameName = g.game === 'Memory' ? t('caregiver.statMemory') : g.game === 'Attention' ? t('caregiver.statAttention') : t('caregiver.statPattern');

              return (
                <div key={g.game} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-gray-700">
                    <span>{localizedGameName}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{g.completed}/{g.total} {t('daysLabel')}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg">
                        {t('avgLabel')} {g.avgScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 grid grid-cols-3 gap-2">
            <StatCard
              label={t('caregiver.totalSessions')}
              value={gamesCompletedThisWeek.reduce((s, g) => s + g.completed, 0)}
              iconBg="bg-purple-100"
              iconColor="text-purple-700"
            />
            <StatCard
              label={t('caregiver.bestAvgScore')}
              value={`${Math.max(...gamesCompletedThisWeek.map(g => g.avgScore))}%`}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-700"
            />
            <StatCard
              label={t('caregiver.daysActive')}
              value="7 / 7"
              iconBg="bg-amber-100"
              iconColor="text-amber-700"
            />
          </div>
        </div>

        {/* Medication Adherence */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                {t('caregiver.medicationAdherence')}
              </h3>
              <p className="text-sm font-semibold text-gray-500">
                {t('caregiver.medicationsTracked')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-purple-900">{medicationAdherence.overall}%</p>
              <p className="text-xs font-bold text-emerald-700">{t('caregiver.overallThisWeek')}</p>
            </div>
          </div>

          {/* Per-medication rows */}
          <div className="space-y-3">
            {patient.medications.map((med) => {
              const barColor = med.adherence >= 90 ? 'bg-emerald-500' : med.adherence >= 75 ? 'bg-amber-500' : 'bg-rose-500';
              const labelColor = med.adherence >= 90 ? 'text-emerald-700' : med.adherence >= 75 ? 'text-amber-700' : 'text-rose-700';

              return (
                <div key={med.name} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2 text-sm">
                    <div>
                      <p className="font-extrabold text-gray-900">{med.name}</p>
                      <p className="text-xs font-semibold text-gray-500">{med.frequency}</p>
                    </div>
                    <span className={`font-extrabold text-base shrink-0 ${labelColor}`}>{med.adherence}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${med.adherence}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily dots */}
          <div className="pt-1">
            <p className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">{t('caregiver.dailyDoses')}</p>
            <div className="flex justify-between">
              {medicationAdherence.weeklyData.map((day) => {
                const perfect = day.taken === day.total;
                const missed = day.taken === 0;
                return (
                  <div key={day.day} className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold ${
                      perfect ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400'
                      : missed ? 'bg-rose-100 text-rose-900 border-2 border-rose-400'
                      : 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                    }`}>
                      {day.taken}/{day.total}
                    </div>
                    <span className="text-xs font-bold text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerts + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-700 uppercase tracking-wider">
              {t('caregiver.alertsTitle', { count: activeAlerts.length })}
            </h2>
            {alerts.some(a => a.resolved) && (
              <span className="text-xs font-bold text-gray-400">
                {t('caregiver.resolvedCount', { count: alerts.filter(a => a.resolved).length })}
              </span>
            )}
          </div>
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={dismissAlert}
              />
            ))
          ) : (
            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-6 text-center">
              <CheckSquare className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-emerald-900">{t('caregiver.noAlerts')}</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <ActivityList activities={recentActivities} />
      </div>
    </div>
  );
}
