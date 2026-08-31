import React, { useState } from 'react';
import { Sparkles, Heart, Volume2, Users, MapPin, Calendar, Check } from 'lucide-react';
import { memorySpotlight } from '../../data/mockData';

export default function MemorySpotlightCard() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    // Auto turn off simulation after 4 seconds
    if (!isPlayingAudio) {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  return (
    <section 
      aria-label="Family Memory Spotlight"
      className="senior-card p-6 sm:p-8 bg-gradient-to-br from-white via-[#FCF9F5] to-amber-50/40 border-2 border-amber-200"
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
        {/* Memory Photo */}
        <div className="lg:w-1/2 relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md flex flex-col justify-end min-h-[260px] sm:min-h-[300px]">
          <img
            src={memorySpotlight.image}
            alt={memorySpotlight.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="relative p-5 text-white space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>{memorySpotlight.location}</span>
              <span>•</span>
              <Calendar className="w-4 h-4" />
              <span>{memorySpotlight.date}</span>
            </div>
            <h4 className="text-2xl font-black text-white">
              {memorySpotlight.title}
            </h4>
          </div>
        </div>

        {/* Memory Details & Prompt Question */}
        <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-sm border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Cherished Memory of the Day</span>
            </div>

            <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              "{memorySpotlight.promptQuestion}"
            </p>

            <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed">
              {memorySpotlight.caption}
            </p>

            {/* People in photo */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-gray-600 font-bold text-sm sm:text-base mr-2">
                <Users className="w-5 h-5 text-purple-700" />
                <span>With:</span>
              </div>
              {memorySpotlight.familyMembers.map((person, idx) => (
                <span
                  key={idx}
                  className="bg-white border-2 border-purple-200 text-purple-900 font-bold text-sm sm:text-base px-3 py-1 rounded-xl shadow-2xs"
                >
                  {person.name} ({person.relation})
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Memory Actions */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-extrabold text-base sm:text-lg transition shadow-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-2 border-purple-300'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingAudio ? 'Playing Audio Story...' : 'Listen to Memory'}</span>
            </button>

            <button
              onClick={() => setHasAcknowledged(true)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-extrabold text-base sm:text-lg transition cursor-pointer ${
                hasAcknowledged
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300'
              }`}
            >
              {hasAcknowledged ? (
                <>
                  <Check className="w-5 h-5 text-emerald-700 stroke-[3px]" />
                  <span>I Remember This!</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
                  <span>I Remember!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
