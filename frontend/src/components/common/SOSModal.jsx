import React from 'react';
import { Phone, PhoneCall, AlertTriangle, X, ShieldAlert, Heart } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../utils/constants';

export default function SOSModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="bg-white rounded-3xl border-4 border-red-500 shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-red-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <h2 id="sos-modal-title" className="text-2xl md:text-3xl font-extrabold text-red-600">
                Emergency & Help
              </h2>
              <p className="text-gray-600 font-medium text-base">
                Tap any button below to call immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close emergency modal"
            className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Emergency Call Options */}
        <div className="space-y-4">
          {/* Primary Caregiver */}
          <a
            href={`tel:${EMERGENCY_CONTACTS.caregiverPhone}`}
            className="w-full flex items-center justify-between p-4 md:p-5 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 hover:border-purple-500 rounded-2xl transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-purple-600 text-white rounded-xl group-hover:scale-105 transition">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Primary Family Contact
                </span>
                <span className="block text-xl md:text-2xl font-bold text-gray-900">
                  {EMERGENCY_CONTACTS.caregiverName}
                </span>
                <span className="block text-base text-gray-600">
                  {EMERGENCY_CONTACTS.caregiverPhone}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-600 text-white rounded-full">
              <PhoneCall className="w-6 h-6" />
            </div>
          </a>

          {/* Doctor */}
          <a
            href={`tel:${EMERGENCY_CONTACTS.doctorPhone}`}
            className="w-full flex items-center justify-between p-4 md:p-5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 hover:border-blue-500 rounded-2xl transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition">
                <Phone className="w-7 h-7" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Family Physician
                </span>
                <span className="block text-xl md:text-2xl font-bold text-gray-900">
                  {EMERGENCY_CONTACTS.doctorName}
                </span>
                <span className="block text-base text-gray-600">
                  {EMERGENCY_CONTACTS.doctorPhone}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-600 text-white rounded-full">
              <PhoneCall className="w-6 h-6" />
            </div>
          </a>

          {/* Senior Helpline 14567 */}
          <a
            href={`tel:${EMERGENCY_CONTACTS.nationalSeniorHelpline}`}
            className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 hover:border-emerald-500 rounded-2xl transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold text-gray-900">
                  Elder Line Helpline (14567)
                </span>
                <span className="text-sm text-gray-600">
                  Free 24/7 National Senior Support
                </span>
              </div>
            </div>
            <span className="text-base font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
              Toll Free
            </span>
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-4 text-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition border-2 border-gray-300"
        >
          I am Safe • Close This
        </button>
      </div>
    </div>
  );
}
