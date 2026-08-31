import { useEffect, useState } from "react";
import { checkBackend, checkDatabase } from "../api/api";

export default function BackendStatus() {
  const [backend, setBackend] = useState("checking");
  const [database, setDatabase] = useState("checking");

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
        System Status
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300">
            Backend API
          </span>

          <span className={statusStyle(backend)}>
            {backend === "connected"
              ? "● Connected"
              : backend === "error"
              ? "● Error"
              : "● Checking..."}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">
            PostgreSQL Database
          </span>

          <span className={statusStyle(database)}>
            {database === "connected"
              ? "● Connected"
              : database === "error"
              ? "● Error"
              : "● Checking..."}
          </span>
        </div>
      </div>
    </div>
  );
}