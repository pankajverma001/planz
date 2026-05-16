"use client";

import { useEffect, useState } from "react";
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

  async function contribute(plan: Plan) {
    const amount = prompt("Enter contribution amount ₹");

    if (!amount) return;

    const newAmount =
      plan.collected_amount + Number(amount);

    const { error } = await supabase
      .from("plans")
      .update({
        collected_amount: newAmount,
      })
      .eq("id", plan.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Contribution added!");
    getPlans();
  }

  async function deletePlan(id: number) {
    const confirmDelete = confirm(
      "Delete this plan?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Plan deleted!");
    getPlans();
  }

  return (
    <main className="min-h-screen bg-[#F5F1FF] p-5">
      <div className="max-w-[430px] mx-auto">

        <a
          href="/"
          className="text-purple-700 font-bold"
        >
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">
          My Plans
        </h1>

        <p className="text-gray-500 mt-1">
          Track all your savings plans.
        </p>

        <div className="mt-6 space-y-4">
          {plans.length === 0 ? (
            <div className="bg-white rounded-3xl p-5 text-center text-gray-500">
              No plans found.
            </div>
          ) : (
            plans.map((plan) => {
              const percent = Math.min(
                (plan.collected_amount /
                  plan.goal_amount) *
                  100,
                100
              );

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl p-5"
                >
                  <h2 className="font-bold text-xl">
                    {plan.title}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {plan.category}
                  </p>

                  <p className="font-bold mt-4">
                    ₹{plan.collected_amount} / ₹
                    {plan.goal_amount}
                  </p>

                  <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
                    <div
                      className="h-3 bg-purple-700 rounded-full"
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Members: {plan.members}
                  </p>

                  <button
                    onClick={() =>
                      contribute(plan)
                    }
                    className="w-full bg-purple-700 text-white p-3 rounded-2xl font-bold mt-4"
                  >
                    Contribute Money
                  </button>

                  <button
                    onClick={() =>
                      deletePlan(plan.id)
                    }
                    className="w-full bg-red-500 text-white p-3 rounded-2xl font-bold mt-3"
                  >
                    Delete Plan
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}