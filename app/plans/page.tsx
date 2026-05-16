"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

type Plan = {
  id: number;
  title: string;
  category: string;
  goal_amount: number;
  collected_amount: number;
  members: string;
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    getPlans();
  }, []);

  async function getPlans() {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setPlans(data || []);
  }

  async function contribute() {
    if (!selectedPlan || !amount) return;

    const newAmount =
      selectedPlan.collected_amount +
      Number(amount);

    const { error } = await supabase
      .from("plans")
      .update({
        collected_amount: newAmount,
      })
      .eq("id", selectedPlan.id);

    if (error) {
      alert(error.message);
      return;
    }

    // ADD NOTIFICATION
    await supabase.from("notifications").insert([
      {
        title: "New Contribution Added",
        message: `₹${amount} added to ${selectedPlan.title}`,
      },
    ]);

    setAmount("");
    setSelectedPlan(null);

    getPlans();
  }

  async function deletePlan(id: number) {
    if (!confirm("Delete this plan?")) return;

    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    getPlans();
  }

  function inviteFriends(plan: Plan) {
    const message = `Join my PlanZ savings plan: ${plan.title}. Goal: ₹${plan.goal_amount}. Let's save together!`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a
          href="/"
          className="text-purple-300 font-bold"
        >
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">
          My Plans
        </h1>

        <p className="text-white/50 mt-1">
          Track all your savings plans.
        </p>

        <div className="mt-6 space-y-4">
          {plans.length === 0 ? (
            <div className="bg-white/10 rounded-3xl p-5 text-center text-white/60">
              No plans found.
            </div>
          ) : (
            plans.map((plan, index) => {
              const percent = Math.min(
                (plan.collected_amount /
                  plan.goal_amount) *
                  100,
                100
              );

              return (
                <motion.div
                  key={plan.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5"
                >
                  <h2 className="font-bold text-xl">
                    {plan.title}
                  </h2>

                  <p className="text-white/50 text-sm">
                    {plan.category}
                  </p>

                  <p className="font-bold mt-4">
                    ₹
                    {plan.collected_amount} / ₹
                    {plan.goal_amount}
                  </p>

                  <div className="w-full h-3 bg-white/20 rounded-full mt-3">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percent}%`,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="h-3 bg-purple-500 rounded-full"
                    />
                  </div>

                  <p className="text-white/50 text-sm mt-3">
                    Members: {plan.members}
                  </p>

                  <button
                    onClick={() =>
                      setSelectedPlan(plan)
                    }
                    className="w-full bg-purple-700 text-white p-3 rounded-2xl font-bold mt-4"
                  >
                    Contribute Money
                  </button>

                  <button
                    onClick={() =>
                      inviteFriends(plan)
                    }
                    className="w-full bg-green-500 text-white p-3 rounded-2xl font-bold mt-3"
                  >
                    Invite Friends on WhatsApp
                  </button>

                  <button
                    onClick={() =>
                      deletePlan(plan.id)
                    }
                    className="w-full bg-red-500 text-white p-3 rounded-2xl font-bold mt-3"
                  >
                    Delete Plan
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedPlan(null)
            }
          >
            <motion.div
              initial={{
                y: 400,
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: 400,
              }}
              transition={{
                type: "spring",
                damping: 24,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="w-full max-w-[430px] bg-[#171124] rounded-t-3xl p-6 border border-white/10"
            >
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-5" />

              <h2 className="text-2xl font-bold">
                Add Contribution
              </h2>

              <p className="text-white/50 mt-1">
                {selectedPlan.title}
              </p>

              <input
                type="number"
                placeholder="Enter amount ₹"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none mt-5 placeholder:text-white/40"
              />

              <button
                onClick={contribute}
                className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold mt-4"
              >
                Add Money
              </button>

              <button
                onClick={() =>
                  setSelectedPlan(null)
                }
                className="w-full bg-white/10 text-white p-4 rounded-2xl font-bold mt-3"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}