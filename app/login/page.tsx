"use client";

import { LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://planz-theta.vercel.app",
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5 flex items-center justify-center">
      <div className="bg-white/10 border border-white/10 rounded-3xl p-6 w-full max-w-[430px]">
        <h1 className="text-4xl font-bold text-purple-300">
          PlanZ
        </h1>

        <p className="text-white/60 mt-2">
          Login with Google to continue.
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-white text-black p-4 rounded-2xl font-bold mt-8 flex items-center justify-center gap-3"
        >
          <LogIn size={22} />
          Continue with Google
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