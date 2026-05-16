"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Moon,
  Plus,
  Home,
  Wallet,
  User,
  Ticket,
} from "lucide-react";

import { supabase } from "./lib/supabase";

type Plan = {
  id: number;
  title: string;
  category: string;
  goal_amount: number;
  collected_amount: number;
  members: string;
};

export default function HomePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    loadUser();
    getPlans();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  }

  async function getPlans() {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setPlans(data || []);
  }

  return (
    <main
      className={`min-h-screen pb-28 transition-all duration-300 ${
        darkMode
          ? "bg-[#0B0714] text-white"
          : "bg-[#F4F1FA] text-black"
      }`}
    >
      <div className="max-w-[430px] mx-auto p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Hi, {userName} 👋
            </h1>

            <p className="text-gray-500 mt-1">
              Good Evening!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="w-14 h-14 rounded-full bg-purple-700 text-white flex items-center justify-center"
            >
              <Bell />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-14 h-14 rounded-full bg-purple-700 text-white flex items-center justify-center"
            >
              <Moon />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-700 to-pink-500 rounded-[32px] p-7 mt-8 shadow-xl">
          <h2 className="text-5xl font-bold text-white leading-tight">
            Save Together,
            <br />
            Celebrate Better
          </h2>

          <p className="text-white/80 mt-5 text-lg">
            Create plans and save money with your friends,
            family and partner.
          </p>

          <a
            href="/create-plan"
            className="inline-block mt-8 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Create a Plan
          </a>
        </div>

        <div className="flex items-center justify-between mt-10">
          <h2 className="text-3xl font-bold">
            Your Plans
          </h2>

          <a
            href="/plans"
            className="text-purple-500 font-bold"
          >
            View All
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto mt-5 pb-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`min-w-[250px] rounded-3xl p-4 shadow-lg ${
                darkMode
                  ? "bg-white/10 border border-white/10"
                  : "bg-white"
              }`}
            >
              <div className="w-full h-32 rounded-3xl bg-[#E9D8FD] flex items-center justify-center text-6xl">
                {plan.category === "Coffee Party"
                  ? "☕"
                  : plan.category === "Movie Plan"
                  ? "🎬"
                  : "🍕"}
              </div>

              <h3 className="text-2xl font-bold mt-4">
                {plan.title}
              </h3>

              <p className="text-gray-500 mt-1">
                ₹{plan.collected_amount} / ₹
                {plan.goal_amount}
              </p>

              <div className="w-full h-3 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{
                    width: `${
                      (plan.collected_amount /
                        plan.goal_amount) *
                      100
                    }%`,
                  }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-3">
                {plan.members}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold">
            Quick Access
          </h2>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <a
              href="/group-plans"
              className={`rounded-3xl p-6 text-center ${
                darkMode
                  ? "bg-white/10 border border-white/10"
                  : "bg-white"
              }`}
            >
              <div className="text-5xl">👥</div>
              <p className="font-bold mt-3">
                Groups
              </p>
            </a>

            <a
              href="/group-chat"
              className={`rounded-3xl p-6 text-center ${
                darkMode
                  ? "bg-white/10 border border-white/10"
                  : "bg-white"
              }`}
            >
              <div className="text-5xl">💬</div>
              <p className="font-bold mt-3">
                Chats
              </p>
            </a>

            <a
              href="/split-bill"
              className={`rounded-3xl p-6 text-center ${
                darkMode
                  ? "bg-white/10 border border-white/10"
                  : "bg-white"
              }`}
            >
              <div className="text-5xl">🧾</div>
              <p className="font-bold mt-3">
                Split
              </p>
            </a>

            <a
              href="/profile"
              className={`rounded-3xl p-6 text-center ${
                darkMode
                  ? "bg-white/10 border border-white/10"
                  : "bg-white"
              }`}
            >
              <div className="text-5xl">👤</div>
              <p className="font-bold mt-3">
                Profile
              </p>
            </a>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 border-t backdrop-blur-xl ${
          darkMode
            ? "bg-[#0B0714]/90 border-white/10"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-around py-4">
          <a
            href="/"
            className="flex flex-col items-center text-purple-600"
          >
            <Home size={26} />
            <span className="text-sm mt-1">
              Home
            </span>
          </a>

          <a
            href="/plans"
            className="flex flex-col items-center text-gray-500"
          >
            <Wallet size={26} />
            <span className="text-sm mt-1">
              Plans
            </span>
          </a>

          <a
            href="/create-plan"
            className="w-16 h-16 rounded-full bg-purple-700 text-white flex items-center justify-center -mt-10 shadow-2xl"
          >
            <Plus size={32} />
          </a>

          <a
            href="/deals"
            className="flex flex-col items-center text-gray-500"
          >
            <Ticket size={26} />
            <span className="text-sm mt-1">
              Deals
            </span>
          </a>

          <a
            href="/profile"
            className="flex flex-col items-center text-gray-500"
          >
            <User size={26} />
            <span className="text-sm mt-1">
              Profile
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}