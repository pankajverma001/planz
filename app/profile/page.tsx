"use client";

import { useEffect, useState } from "react";
import { LogOut, Save, User } from "lucide-react";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [totalSaved, setTotalSaved] = useState(0);
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

    const email = user.email || "";

    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          name: "PlanZ User",
          email,
          avatar_url: "",
        },
      ]);

      const result = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      data = result.data;
    }

    const { data: plans } = await supabase
      .from("plans")
      .select("collected_amount")
      .eq("user_id", user.id);

    const saved =
      plans?.reduce(
        (sum, plan) => sum + Number(plan.collected_amount),
        0
      ) || 0;

    setProfile(data);
    setName(data?.name || "");
    setAvatarUrl(data?.avatar_url || "");
    setTotalSaved(saved);
    setLoading(false);
  }

  async function updateProfile() {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        avatar_url: avatarUrl,
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
      <main className="min-h-screen bg-[#0B0714] text-white flex items-center justify-center">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={42} />
            )}
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {name || "PlanZ User"}
          </h1>

          <p className="text-white/70 mt-1">
            {profile?.email}
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6">
          <p className="text-white/50">Total Saved</p>
          <h2 className="text-4xl font-bold text-purple-300 mt-2">
            ₹{totalSaved}
          </h2>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />

          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Profile image URL"
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />

          <button
            onClick={updateProfile}
            className="w-full bg-purple-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Profile
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}