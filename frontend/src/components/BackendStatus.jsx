import { useEffect, useState } from "react";
import { checkBackend, checkDatabase } from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export default function BackendStatus() {
  const [backend, setBackend] = useState("checking");
  const [database, setDatabase] = useState("checking");
  const { t } = useLanguage();

  useEffect(() => {
    async function testConnection() {
      try {
        await checkBackend();
        setBackend("connected");
      } catch (error) {
        console.error("Backend error:", error);
        setBackend("error");
      }

      try {
        await checkDatabase();
        setDatabase("connected");
      } catch (error) {
        console.error("Database error:", error);
        setDatabase("error");
      }
    }

    testConnection();
  }, []);

  const statusStyle = (status) => {
    if (status === "connected") {
      return "text-green-400";
    }

    if (status === "error") {
      return "text-red-400";
    }

    return "text-yellow-400";
  };

  return (
    <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">
        {t('systemStatus.title')}
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300">
            {t('systemStatus.backendApi')}
          </span>

          <span className={statusStyle(backend)}>
            {backend === "connected"
              ? t('systemStatus.connected')
              : backend === "error"
              ? t('systemStatus.error')
              : t('systemStatus.checking')}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">
            {t('systemStatus.postgresDb')}
          </span>

          <span className={statusStyle(database)}>
            {database === "connected"
              ? t('systemStatus.connected')
              : database === "error"
              ? t('systemStatus.error')
              : t('systemStatus.checking')}
          </span>
        </div>
      </div>
    </div>
  );
}