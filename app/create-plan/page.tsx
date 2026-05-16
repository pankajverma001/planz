"use client";

import { useState } from "react";
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
    <main className="min-h-screen bg-[#F5F1FF] p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <h1 className="text-2xl font-bold mt-5">
          Create a Plan
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Start saving with your friends and family.
        </p>

        <div className="bg-white rounded-3xl p-5 mt-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
            placeholder="Plan name"
          />

          <input
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
            placeholder="Goal amount ₹"
            type="number"
          />

          <input
            value={collectedAmount}
            onChange={(e) => setCollectedAmount(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
            placeholder="Collected amount ₹"
            type="number"
          />

          <input
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
            placeholder="Members name"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
          >
            <option>Coffee Party</option>
            <option>Pizza Party</option>
            <option>Movie Plan</option>
            <option>Birthday</option>
            <option>Hotel Dinner</option>
          </select>

          <button
            onClick={createPlan}
            disabled={loading}
            className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold"
          >
            {loading ? "Creating..." : "Create Plan"}
          </button>
        </div>
      </div>
    </main>
  );
}