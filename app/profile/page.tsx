"use client";

import { useEffect, useState } from "react";
import { LogOut, Save, User } from "lucide-react";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: user.user_metadata?.full_name || "PlanZ User",
          email: user.email,
          date_of_birth: null,
        },
      ]);

      const result = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      data = result.data;
    }

    setProfile(data);
    setFullName(data?.full_name || "");
    setDob(data?.date_of_birth || "");
    setLoading(false);
  }

  async function updateProfile() {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        date_of_birth: dob || null,
      })
      .eq("id", profile.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated!");
    loadProfile();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F3FB] flex items-center justify-center">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F3FB] text-black pb-10">
      <div className="max-w-[430px] mx-auto p-5">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-[32px] p-7 mt-6 text-white text-center shadow-xl">
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto flex items-center justify-center">
            <User size={44} />
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {fullName || "PlanZ User"}
          </h1>

          <p className="text-white/70 mt-1">
            Your PlanZ profile
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 mt-6 shadow-sm space-y-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your registered name"
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          />

          <input
            value={dob || ""}
            onChange={(e) => setDob(e.target.value)}
            type="date"
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          />

          <button
            onClick={updateProfile}
            className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Profile
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}