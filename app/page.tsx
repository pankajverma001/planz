"use client";

import { useEffect, useState } from "react";
import {
  Home as HomeIcon,
  Wallet,
  Ticket,
  User,
  Plus,
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

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    getPlans();
  }, []);

  async function getPlans() {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setPlans(data || []);
  }

  return (
    <main className="min-h-screen bg-[#F5F1FF] pb-24">
      <div className="flex items-center justify-between p-5">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Hi, Pankaj 👋
          </h1>
          <p className="text-gray-500 text-sm">Good Evening!</p>
        </div>

        <a
          href="/login"
          className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold"
        >
          P
        </a>
      </div>

      <div className="mx-5 bg-gradient-to-br from-purple-700 via-violet-600 to-pink-500 rounded-3xl p-6 text-white">
        <h2 className="text-3xl font-bold leading-tight">
          Save Together,
          <br />
          Celebrate Better
        </h2>

        <p className="text-sm text-white/90 mt-3 max-w-[260px]">
          Create plans and save money with your friends, family and partner.
        </p>

        <a
          href="/create-plan"
          className="inline-block mt-5 bg-white text-purple-700 px-5 py-3 rounded-2xl font-bold"
        >
          Create a Plan
        </a>
      </div>

      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">Your Plans</h2>

          <a
            href="/plans"
            className="text-purple-700 font-semibold text-sm"
          >
            View All
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto">
          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 text-gray-500">
              No plans yet. Create your first plan.
            </div>
          ) : (
            plans.slice(0, 5).map((plan) => {
              const percent = Math.min(
                (plan.collected_amount / plan.goal_amount) * 100,
                100
              );

              return (
                <div
                  key={plan.id}
                  className="min-w-[160px] bg-white rounded-2xl p-3 shadow-sm"
                >
                  <div className="h-24 rounded-2xl bg-[#E9D5FF] flex items-center justify-center text-4xl">
                    {plan.category === "Pizza Party"
                      ? "🍕"
                      : plan.category === "Movie Plan"
                      ? "🎬"
                      : plan.category === "Birthday"
                      ? "🎂"
                      : plan.category === "Hotel Dinner"
                      ? "🏨"
                      : "☕"}
                  </div>

                  <h3 className="font-bold mt-3">{plan.title}</h3>

                  <p className="text-sm text-gray-500">
                    ₹{plan.collected_amount} / ₹{plan.goal_amount}
                  </p>

                  <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                    <div
                      className="h-2 bg-purple-600 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {plan.members}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">Top Deals</h2>

          <a
            href="/deals"
            className="text-purple-700 font-semibold text-sm"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3">
            <h3 className="font-bold text-sm">CCD</h3>
            <p className="text-purple-700 font-bold text-sm mt-2">
              20% OFF
            </p>
            <p className="text-xs text-gray-500 mt-1">Above ₹499</p>
          </div>

          <div className="bg-white rounded-2xl p-3">
            <h3 className="font-bold text-sm">PVR</h3>
            <p className="text-purple-700 font-bold text-sm mt-2">
              Flat 15%
            </p>
            <p className="text-xs text-gray-500 mt-1">Movie tickets</p>
          </div>

          <div className="bg-white rounded-2xl p-3">
            <h3 className="font-bold text-sm">Hotel</h3>
            <p className="text-purple-700 font-bold text-sm mt-2">
              Up to 30%
            </p>
            <p className="text-xs text-gray-500 mt-1">Room booking</p>
          </div>
        </div>
      </section>

      <section className="px-5 mt-8">
        <h2 className="font-bold text-xl mb-4">Quick Access</h2>

        <div className="grid grid-cols-4 gap-3">
          <a href="/deals" className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl">☕</div>
            <p className="text-sm mt-2 font-semibold">Cafes</p>
          </a>

          <a href="/deals" className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl">🏨</div>
            <p className="text-sm mt-2 font-semibold">Hotels</p>
          </a>

          <a href="/movies" className="bg-white rounded-2xl p-4 text-center">
            <div className="text-3xl">🎬</div>
            <p className="text-sm mt-2 font-semibold">Movies</p>
          </a>

          <a
            href="/split-bill"
            className="bg-white rounded-2xl p-4 text-center"
          >
            <div className="text-3xl">🧾</div>
            <p className="text-sm mt-2 font-semibold">Split</p>
          </a>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t flex justify-around py-3">
        <a href="/" className="flex flex-col items-center text-purple-700">
          <HomeIcon size={22} />
          <span className="text-xs mt-1">Home</span>
        </a>

        <a href="/plans" className="flex flex-col items-center text-gray-500">
          <Wallet size={22} />
          <span className="text-xs mt-1">Plans</span>
        </a>

        <a
          href="/create-plan"
          className="bg-purple-700 text-white w-14 h-14 rounded-full -mt-7 flex items-center justify-center shadow-lg"
        >
          <Plus size={28} />
        </a>

        <a href="/deals" className="flex flex-col items-center text-gray-500">
          <Ticket size={22} />
          <span className="text-xs mt-1">Deals</span>
        </a>

        <a href="/profile" className="flex flex-col items-center text-gray-500">
          <User size={22} />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </main>
  );
}