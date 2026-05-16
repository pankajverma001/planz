"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  Wallet,
  Ticket,
  User,
  Plus,
  Moon,
  Sun,
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
  const [dark, setDark] = useState(false);

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

  const bg = dark ? "bg-[#0B0714] text-white" : "bg-[#F5F1FF] text-black";
  const card = dark ? "bg-[#171124] text-white" : "bg-white text-black";
  const muted = dark ? "text-gray-400" : "text-gray-500";

  return (
    <main className={`min-h-screen pb-24 transition-all duration-500 ${bg}`}>
      <div className="flex items-center justify-between p-5">
        <div>
          <h1 className="text-2xl font-bold">Hi, Pankaj 👋</h1>
          <p className={`${muted} text-sm`}>Good Evening!</p>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-5 bg-gradient-to-br from-purple-700 via-violet-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl"
      >
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
      </motion.div>

      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">Your Plans</h2>
          <a href="/plans" className="text-purple-500 font-semibold text-sm">
            View All
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto">
          {plans.length === 0 ? (
            <div className={`${card} rounded-2xl p-5 ${muted}`}>
              No plans yet. Create your first plan.
            </div>
          ) : (
            plans.slice(0, 5).map((plan, index) => {
              const percent = Math.min(
                (plan.collected_amount / plan.goal_amount) * 100,
                100
              );

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.04 }}
                  className={`min-w-[160px] ${card} rounded-2xl p-3 shadow-sm`}
                >
                  <div className="h-24 rounded-2xl bg-purple-200 flex items-center justify-center text-4xl">
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

                  <p className={`text-sm ${muted}`}>
                    ₹{plan.collected_amount} / ₹{plan.goal_amount}
                  </p>

                  <div className="w-full h-2 bg-gray-300 rounded-full mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-2 bg-purple-600 rounded-full"
                    />
                  </div>

                  <p className={`text-xs ${muted} mt-2`}>{plan.members}</p>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">Top Deals</h2>
          <a href="/deals" className="text-purple-500 font-semibold text-sm">
            View All
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["CCD", "PVR", "Hotel"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${card} rounded-2xl p-3`}
            >
              <h3 className="font-bold text-sm">{item}</h3>
              <p className="text-purple-500 font-bold text-sm mt-2">
                {item === "CCD"
                  ? "20% OFF"
                  : item === "PVR"
                  ? "Flat 15%"
                  : "Up to 30%"}
              </p>
              <p className={`text-xs ${muted} mt-1`}>
                {item === "CCD"
                  ? "Above ₹499"
                  : item === "PVR"
                  ? "Movie tickets"
                  : "Room booking"}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-8">
        <h2 className="font-bold text-xl mb-4">Quick Access</h2>

        <div className="grid grid-cols-4 gap-3">
          {[
            ["☕", "Cafes", "/deals"],
            ["🏨", "Hotels", "/deals"],
            ["🎬", "Movies", "/movies"],
            ["🧾", "Split", "/split-bill"],
          ].map((item, index) => (
            <motion.a
              key={item[1]}
              href={item[2]}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileTap={{ scale: 0.92 }}
              className={`${card} rounded-2xl p-4 text-center`}
            >
              <div className="text-3xl">{item[0]}</div>
              <p className="text-sm mt-2 font-semibold">{item[1]}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <div className={`${card} fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto border-t border-purple-200 flex justify-around py-3`}>
        <a href="/" className="flex flex-col items-center text-purple-500">
          <HomeIcon size={22} />
          <span className="text-xs mt-1">Home</span>
        </a>

        <a href="/plans" className={`flex flex-col items-center ${muted}`}>
          <Wallet size={22} />
          <span className="text-xs mt-1">Plans</span>
        </a>

        <motion.a
          whileTap={{ scale: 0.9 }}
          href="/create-plan"
          className="bg-purple-700 text-white w-14 h-14 rounded-full -mt-7 flex items-center justify-center shadow-lg"
        >
          <Plus size={28} />
        </motion.a>

        <a href="/deals" className={`flex flex-col items-center ${muted}`}>
          <Ticket size={22} />
          <span className="text-xs mt-1">Deals</span>
        </a>

        <a href="/profile" className={`flex flex-col items-center ${muted}`}>
          <User size={22} />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </main>
  );
}