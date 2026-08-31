import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

export default function Auth() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      const role = data.user?.role;

      if (role === "caregiver" || role === "healthcare_worker") {
        navigate("/caregiver", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#201D35] text-white text-2xl mb-4">
            🧠
          </div>

          <h1 className="text-4xl font-bold text-[#201D35]">
            MindCare
          </h1>

          <p className="mt-2 text-gray-500">
            Cognitive care, made simple.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-[#201D35]">
              Welcome back
            </h2>

            <p className="text-gray-500 mt-1">
              Sign in to continue to MindCare.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#201D35] text-white py-3.5 rounded-xl font-medium transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Demo account: test@mindcare.com
            </p>
          </div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          MindCare • Secure Cognitive Care Platform
        </p>

      </div>
    </div>
  );
}
