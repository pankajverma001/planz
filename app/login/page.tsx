"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(true);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function signUp() {
    if (!name || !dob || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      await supabase.from("profiles").upsert([
        {
          id: user.id,
          full_name: name,
          email,
          date_of_birth: dob,
        },
      ]);
    }

    setLoading(false);

    alert("Account created successfully!");

    window.location.href = "/";
  }

  async function login() {
    if (!email || !password) {
      alert("Please fill email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/";
  }

  async function googleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://planz-theta.vercel.app",
      },
    });
  }

  return (
    <main className="min-h-screen bg-[#F6F3FB] flex items-center justify-center p-5">
      <div className="w-full max-w-[430px]">
        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-[32px] p-7 text-white shadow-xl">
          <h1 className="text-4xl font-bold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-white/80 mt-3 text-lg">
            {isSignup
              ? "Join PlanZ and start saving together."
              : "Login to continue your group plans."}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 mt-6 shadow-sm space-y-4">
          {isSignup && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
              />

              <input
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                type="date"
                className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
              />
            </>
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          />

          <button
            onClick={isSignup ? signUp : login}
            disabled={loading}
            className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>

          <button
            onClick={googleLogin}
            className="w-full bg-white border border-gray-300 p-4 rounded-2xl font-bold"
          >
            Continue with Google
          </button>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-purple-700 font-bold pt-2"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
}