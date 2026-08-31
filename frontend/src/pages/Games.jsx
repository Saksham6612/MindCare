import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const API_URL = "http://localhost:5001/api";

const GAME_TRANSLATIONS = {
  "Memory Match": {
    name: "স্মৃতি মিলকরণ",
    description: "আপনার স্বল্পমেয়াদী স্মৃতিশক্তি বৃদ্ধির জন্য সুন্দর বস্তু মনে রাখার খেলা।"
  },
  "Pattern Puzzle": {
    name: "প্যাটার্ন ধাঁধা",
    description: "প্যাটার্ন ও ক্রম শনাক্ত করে যুক্তি দক্ষতা উন্নত করুন।"
  },
  "Speed Focus": {
    name: "মনোযোগ খেলা",
    description: "সঠিক বস্তু দ্রুত শনাক্ত করে একাগ্রতা বাড়ান।"
  }
};

const DIFFICULTY_TRANSLATIONS = {
  "Easy": "সহজ",
  "Medium": "মাঝারি",
  "Hard": "কঠিন",
  "Adaptive": "অভিযোজিত"
};

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, isBengali } = useLanguage();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/games`);

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data.games || []);
      } catch (err) {
        console.error("❌ Games fetch error:", err);
        setError(t('games.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [t]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">{t('games.title')}</h1>
        <p className="mt-4">{t('games.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">{t('games.title')}</h1>
        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t('games.title')}
        </h1>
        <p className="mt-2 text-lg text-gray-600 font-medium">
          {t('games.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => {
          const localizedName = isBengali && GAME_TRANSLATIONS[game.name] ? GAME_TRANSLATIONS[game.name].name : game.name;
          const localizedDesc = isBengali && GAME_TRANSLATIONS[game.name] ? GAME_TRANSLATIONS[game.name].description : game.description;
          const localizedDiff = isBengali && DIFFICULTY_TRANSLATIONS[game.difficulty] ? DIFFICULTY_TRANSLATIONS[game.difficulty] : game.difficulty;

          return (
            <div
              key={game.id}
              className="p-6 bg-white rounded-2xl shadow-sm border-2 border-purple-100 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {localizedName}
                </h2>

                <p className="mt-2 text-base text-gray-600 font-medium">
                  {localizedDesc}
                </p>

                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 text-sm font-bold rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    {game.category}
                  </span>

                  <span className="px-3 py-1 text-sm font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {localizedDiff}
                  </span>
                </div>
              </div>

              <button
                className="w-full mt-6 px-4 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-lg transition active:scale-95 cursor-pointer shadow-md"
                onClick={() => {
                  if (game.name === "Memory Match" || game.id === 1) {
                    window.location.href = "/games/memory";
                  } else {
                    window.location.href = "/games/memory";
                  }
                }}
              >
                {t('games.playGame')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}