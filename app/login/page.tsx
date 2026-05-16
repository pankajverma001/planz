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
        emailRedirectTo: "http://localhost:3000",
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
    <main className="min-h-screen bg-[#F5F1FF] p-5 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 w-full max-w-[430px]">
        <h1 className="text-3xl font-bold text-purple-700">PlanZ</h1>

        <p className="text-gray-500 mt-2">
          Save Together. Celebrate Better.
        </p>

        <input
          className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none mt-8"
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
          className="block text-center text-purple-700 font-bold mt-5"
        >
          Back Home
        </a>
      </div>
    </main>
  );
}