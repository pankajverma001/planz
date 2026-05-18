"use client";

import { useState } from "react";
import { Copy, Share2, Plus } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CreatePlan() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Coffee Party");
  const [goalAmount, setGoalAmount] = useState("");
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
          collected_amount: 0,
          members: user.email,
          user_id: user.id,
          invite_code: inviteCode,
          status: "active",
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

    setTitle("");
    setGoalAmount("");
    setCategory("Coffee Party");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  }

  return (
    <main className="min-h-screen bg-[#F6F3FB] text-black pb-10">
      <div className="max-w-[430px] mx-auto p-5">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-[32px] p-7 mt-6 text-white shadow-xl">
          <Plus size={42} />

          <h1 className="text-4xl font-bold mt-5">
            Create Plan
          </h1>

          <p className="text-white/80 mt-3 text-lg">
            Start a private group saving plan and invite friends.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 mt-6 shadow-sm space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plan name"
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          />

          <input
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            placeholder="Goal amount ₹"
            type="number"
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F6F3FB] outline-none"
          >
            <option>Coffee Party</option>
            <option>Pizza Party</option>
            <option>Movie Plan</option>
            <option>Birthday</option>
            <option>Hotel Dinner</option>
            <option>Trip Plan</option>
          </select>

          <button
            onClick={createPlan}
            disabled={loading}
            className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold"
          >
            {loading ? "Creating..." : "Create Group Plan"}
          </button>
        </div>

        {inviteLink && (
          <div className="bg-white rounded-3xl p-5 mt-6 shadow-sm">
            <h2 className="text-2xl font-bold">
              Invite Link Ready 🎉
            </h2>

            <p className="text-gray-500 mt-2">
              Share this link with your friends to join the group.
            </p>

            <p className="text-sm text-purple-700 break-all mt-4 bg-purple-50 p-4 rounded-2xl">
              {inviteLink}
            </p>

            <button
              onClick={copyLink}
              className="w-full bg-blue-500 text-white p-4 rounded-2xl font-bold mt-4 flex items-center justify-center gap-2"
            >
              <Copy size={20} />
              Copy Link
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Join my PlanZ group plan: ${inviteLink}`
              )}`}
              target="_blank"
              className="w-full bg-green-500 text-white p-4 rounded-2xl font-bold mt-3 flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              Share on WhatsApp
            </a>

            <a
              href="/plans"
              className="block text-center w-full bg-purple-700 text-white p-4 rounded-2xl font-bold mt-3"
            >
              Go to My Plans
            </a>
          </div>
        )}
      </div>
    </main>
  );
}