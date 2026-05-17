"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function JoinGroup() {
  const params = useParams();
  const code = params.code as string;

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findPlan();
  }, []);

  async function findPlan() {
    const { data, error } = await supabase.rpc(
      "get_plan_by_invite",
      {
        invite: code,
      }
    );

    if (error || !data || data.length === 0) {
      setLoading(false);
      return;
    }

    setPlan(data[0]);
    setLoading(false);
  }

  async function joinPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      localStorage.setItem(
        "pendingInvite",
        window.location.pathname
      );

      window.location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("group_members")
      .insert([
        {
  plan_id: plan.id,
  user_id: user.id,
  user_email: user.email,
  contribution_amount: 0,
  role: "member",
},
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Successfully joined group!");

    window.location.href = "/plans";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0714] text-white flex items-center justify-center">
        Loading invite...
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#0B0714] text-white flex items-center justify-center p-5">
        Invalid invite link.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5 flex items-center justify-center">
      <div className="max-w-[430px] w-full bg-white/10 border border-white/10 rounded-3xl p-6">
        <h1 className="text-3xl font-bold">
          Join Group Plan
        </h1>

        <p className="text-white/60 mt-2">
          You were invited to join:
        </p>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-5 mt-6">
          <h2 className="text-2xl font-bold">
            {plan.title}
          </h2>

          <p className="text-white/80 mt-2">
            {plan.category}
          </p>

          <p className="text-white/80 mt-2">
            Goal: ₹{plan.goal_amount}
          </p>
        </div>

        <button
          onClick={joinPlan}
          className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold mt-6"
        >
          Join Group
        </button>

        <a
          href="/"
          className="block text-center text-purple-300 font-bold mt-5"
        >
          Back Home
        </a>
      </div>
    </main>
  );
}