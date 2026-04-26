"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (token) {
        try {
          await api.get("/auth/admin/verify");
          router.push("/admin/dashboard");
        } catch {
          // Token is invalid, allow login
        }
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", res.data.token);
        window.location.href = "/admin/dashboard";
      }
    } catch {
      setError("ایمیل یا رمز عبور اشتباه است");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 rtl">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mainlogo.png"
            alt="Mina Cafe"
            className="h-14 w-auto mb-3"
          />
          <h1 className="text-lg font-bold text-gray-900">پنل مدیریت</h1>
          <p className="text-xs text-gray-500 mt-0.5">مینا کافه</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form className="space-y-4 text-sm" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1.5 text-xs font-medium text-gray-700">
                ایمیل
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-medium text-gray-700">
                رمز عبور
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-xs text-center text-red-600 bg-red-50 border border-red-100 rounded-lg py-2 px-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-1 rounded-lg bg-black text-white py-2.5 text-sm font-medium transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {submitting ? "در حال ورود…" : "ورود"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
