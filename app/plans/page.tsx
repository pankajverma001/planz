"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

type Plan = {
  id: number;
  title: string;
  category: string;
  goal_amount: number;
  collected_amount: number;
  invite_code: string;
};

export default function Plans() {
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
      <main className="min-h-screen bg-[#0B0714] text-white flex items-center justify-center">
        Loading plans...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6">
          <h1 className="text-3xl font-bold">
            My Shared Plans
          </h1>

          <p className="text-white/70 mt-2">
            Only plans you created or joined are shown.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {plans.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No shared plans found.
            </div>
          ) : (
            plans.map((plan, index) => {
              const progress =
                (plan.collected_amount /
                  plan.goal_amount) *
                100;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white/10 border border-white/10 rounded-3xl p-5"
                >
                  <h2 className="text-2xl font-bold">
                    {plan.title}
                  </h2>

                  <p className="text-white/50 mt-1">
                    {plan.category}
                  </p>

                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        ₹{plan.collected_amount}
                      </span>

                      <span>
                        ₹{plan.goal_amount}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <a
                      href={`/group-chat`}
                      className="flex-1 bg-blue-500 p-3 rounded-2xl text-center font-bold"
                    >
                      Open Chat
                    </a>

                    <a
                      href={`/join/${plan.invite_code}`}
                      className="flex-1 bg-green-500 p-3 rounded-2xl text-center font-bold"
                    >
                      Invite
                    </a>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}