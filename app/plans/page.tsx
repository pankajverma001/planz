"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Plus, Wallet } from "lucide-react";
import { supabase } from "../lib/supabase";

type Plan = {
  id: number;
  title: string;
  category: string;
  goal_amount: number;
  collected_amount: number;
  status: string;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans();
  }, []);

  async function getPlans() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setPlans(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F3FB] flex items-center justify-center">
        Loading plans...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F3FB] text-black pb-28">
      <div className="max-w-[430px] mx-auto p-5">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-[32px] p-7 mt-6 text-white shadow-xl">
          <Wallet size={42} />

          <h1 className="text-4xl font-bold mt-5">
            My Plans
          </h1>

          <p className="text-white/80 mt-3 text-lg">
            Your created and joined group plans.
          </p>

          <a
            href="/create-plan"
            className="inline-flex items-center gap-2 mt-6 bg-white text-purple-700 px-5 py-3 rounded-2xl font-bold"
          >
            <Plus size={20} />
            New Plan
          </a>
        </div>

        <div className="mt-7 space-y-4">
          {plans.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 text-center text-gray-500">
              No plans found. Create or join a group plan.
            </div>
          ) : (
            plans.map((plan) => {
              const progress = Math.min(
                (Number(plan.collected_amount) /
                  Number(plan.goal_amount)) *
                  100,
                100
              );

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {plan.title}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {plan.category}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        plan.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {plan.status === "completed"
                        ? "Completed"
                        : "Active"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>₹{plan.collected_amount}</span>
                      <span>₹{plan.goal_amount}</span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {Math.round(progress)}% completed
                    </p>
                  </div>

                  <a
                    href={`/group-chat/${plan.id}`}
                    className="mt-5 w-full bg-purple-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Open Group
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-[430px] mx-auto flex items-center justify-around py-4">
          <a href="/" className="text-gray-500 font-bold">
            Home
          </a>

          <a href="/plans" className="text-purple-700 font-bold">
            Plans
          </a>

          <a
            href="/create-plan"
            className="w-16 h-16 rounded-full bg-purple-700 text-white flex items-center justify-center -mt-10 shadow-xl text-3xl"
          >
            +
          </a>

          <a href="/profile" className="text-gray-500 font-bold">
            Profile
          </a>
        </div>
      </div>
    </main>
  );
}