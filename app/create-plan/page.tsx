"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function CreatePlan() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Coffee Party");
  const [goalAmount, setGoalAmount] = useState("");
  const [collectedAmount, setCollectedAmount] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPlan() {
    if (!title || !goalAmount || !members) {
      alert("Please fill plan name, goal amount, and members");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("plans").insert([
      {
        title,
        category,
        goal_amount: Number(goalAmount),
        collected_amount: Number(collectedAmount || 0),
        members,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Plan created successfully!");

    setTitle("");
    setCategory("Coffee Party");
    setGoalAmount("");
    setCollectedAmount("");
    setMembers("");
  }

  return (
    <main className="min-h-screen bg-[#0B0714] p-5 text-white">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-700 via-violet-600 to-pink-500 rounded-3xl p-6 mt-6 shadow-2xl"
        >
          <h1 className="text-3xl font-bold">
            Create a Plan
          </h1>

          <p className="text-white/80 mt-2">
            Start saving with your people.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mt-6 space-y-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/50"
            placeholder="Plan name"
          />

          <input
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/50"
            placeholder="Goal amount ₹"
            type="number"
          />

          <input
            value={collectedAmount}
            onChange={(e) => setCollectedAmount(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/50"
            placeholder="Collected amount ₹"
            type="number"
          />

          <input
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/50"
            placeholder="Members name"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
          >
            <option>Coffee Party</option>
            <option>Pizza Party</option>
            <option>Movie Plan</option>
            <option>Birthday</option>
            <option>Hotel Dinner</option>
          </select>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={createPlan}
            disabled={loading}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl font-bold shadow-lg"
          >
            {loading ? "Creating..." : "Create Plan"}
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}