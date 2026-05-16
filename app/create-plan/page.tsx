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
  const [inviteLink, setInviteLink] = useState("");

  async function createPlan() {
    if (!title || !goalAmount) {
      alert("Please fill plan name and goal amount");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    const inviteCode =
      Math.random().toString(36).substring(2, 10) +
      Date.now().toString(36);

    const { data, error } = await supabase
      .from("plans")
      .insert([
        {
          title,
          category,
          goal_amount: Number(goalAmount),
          collected_amount: Number(collectedAmount || 0),
          members: members || user.email,
          user_id: user.id,
          invite_code: inviteCode,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const link = `https://planz-theta.vercel.app/join/${data.invite_code}`;
    setInviteLink(link);

    alert("Group plan created! Share invite link with friends.");

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

        <div className="bg-gradient-to-br from-purple-700 via-violet-600 to-pink-500 rounded-3xl p-6 mt-6 shadow-2xl">
          <h1 className="text-3xl font-bold">Create Group Plan</h1>
          <p className="text-white/80 mt-2">
            Create a plan and share invite link with friends.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
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
            placeholder="Members text optional"
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

          <button
            onClick={createPlan}
            disabled={loading}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl font-bold shadow-lg"
          >
            {loading ? "Creating..." : "Create Group Plan"}
          </button>
        </div>

        {inviteLink && (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6">
            <h2 className="text-xl font-bold">Invite Link</h2>

            <p className="text-white/60 text-sm break-all mt-3">
              {inviteLink}
            </p>

            <button
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="w-full bg-blue-500 p-4 rounded-2xl font-bold mt-4"
            >
              Copy Invite Link
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Join my PlanZ group plan. Click this link: ${inviteLink}`
              )}`}
              target="_blank"
              className="block text-center w-full bg-green-500 p-4 rounded-2xl font-bold mt-3"
            >
              Share on WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}