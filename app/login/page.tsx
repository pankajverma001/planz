"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginWithEmail() {
    if (!email) {
      alert("Enter your email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://planz-theta.vercel.app",
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login link sent! Check your email.");
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5 flex items-center justify-center">
      <div className="bg-white/10 border border-white/10 rounded-3xl p-6 w-full max-w-[430px]">
        <h1 className="text-4xl font-bold text-purple-300">
          PlanZ
        </h1>

        <p className="text-white/60 mt-2">
          Login to save your personal plans.
        </p>

        <input
          className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none mt-8 placeholder:text-white/40"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={loginWithEmail}
          disabled={loading}
          className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold mt-4"
        >
          {loading ? "Sending..." : "Send Login Link"}
        </button>

        <a
          href="/"
          className="block text-center text-purple-300 font-bold mt-5"
        >
          Back Home
        </a>
      </div>
    </main>
  );
}