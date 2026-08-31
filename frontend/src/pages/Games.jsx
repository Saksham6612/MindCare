import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001/api";

export default function Games() {
  const { t } = useTranslation();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/games`);

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();

        console.log("🎮 Games from backend:", data);

        setGames(data.games || []);
      } catch (err) {
        console.error("❌ Games fetch error:", err);
        setError("Unable to load games.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">{t('games.title')}</h1>
        <p className="mt-4">{t('common.loading')}</p>
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
    <div className="p-8">
      <h1 className="text-3xl font-bold">{t('games.title')}</h1>

      <p className="mt-2 text-gray-500">
        Choose a game to exercise your mind.
      </p>

      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="p-6 bg-white rounded-2xl shadow-sm border"
          >
            <h2 className="text-xl font-semibold">
              {game.name}
            </h2>

            <p className="mt-2 text-gray-600">
              {game.description}
            </p>

            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                {game.category}
              </span>

              <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                {game.difficulty}
              </span>
            </div>

            <button
  className="w-full mt-6 px-4 py-3 rounded-xl bg-black text-white hover:opacity-80 transition"
  onClick={() => {
    if (game.name === "Memory Match") {
      window.location.href = "/games/memory";
    } else {
      console.log("Selected game:", game);
    }
  }}
>
  Play Game
</button>
          </div>
        ))}
      </div>
    </div>
  );
}