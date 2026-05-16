"use client";

import { useEffect, useState } from "react";
import { Brain, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

type Plan = {
  id: number;
  title: string;
  category: string;
  goal_amount: number;
  collected_amount: number;
};

export default function Insights() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    getPlans();
  }, []);

  async function getPlans() {
    const { data, error } = await supabase.from("plans").select("*");

    if (error) {
      alert(error.message);
      return;
    }

    setPlans(data || []);
  }

  const totalGoal = plans.reduce((sum, p) => sum + p.goal_amount, 0);
  const totalSaved = plans.reduce((sum, p) => sum + p.collected_amount, 0);
  const progress = totalGoal ? Math.round((totalSaved / totalGoal) * 100) : 0;

  const bestPlan = plans.sort(
    (a, b) =>
      b.collected_amount / b.goal_amount -
      a.collected_amount / a.goal_amount
  )[0];

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6">
          <Brain size={42} />
          <h1 className="text-3xl font-bold mt-4">AI Smart Insights</h1>
          <p className="text-white/70 mt-1">
            Smart suggestions for your saving plans.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
            <Wallet className="text-purple-300" />
            <h2 className="font-bold text-xl mt-3">
              Total Saved: ₹{totalSaved}
            </h2>
            <p className="text-white/50 mt-1">
              You have completed {progress}% of all your saving goals.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
            <TrendingUp className="text-green-400" />
            <h2 className="font-bold text-xl mt-3">
              Best Performing Plan
            </h2>
            <p className="text-white/50 mt-1">
              {bestPlan
                ? `${bestPlan.title} is your strongest plan. Keep pushing it.`
                : "Create your first plan to get insights."}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
            <Sparkles className="text-yellow-400" />
            <h2 className="font-bold text-xl mt-3">
              Smart Suggestion
            </h2>
            <p className="text-white/50 mt-1">
              {progress >= 70
                ? "You are close to completing your goals. Share your plan on WhatsApp to finish faster."
                : "Try adding small daily contributions. Even ₹50 per day can help your group reach goals faster."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}