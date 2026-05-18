"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Wallet,
  User,
  Home,
  MessageCircle,
} from "lucide-react";

import { supabase } from "./lib/supabase";

type Plan = {
  id: number;
  title: string;
  category: string;
  goal_amount: number;
  collected_amount: number;
  status: string;
};

export default function HomePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    loadUser();
    getPlans();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  }

  async function getPlans() {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.log(error.message);
      return;
    }

    setPlans(data || []);
  }

  return (
    <main className="min-h-screen bg-[#F6F3FB] text-black pb-28">
      <div className="max-w-[430px] mx-auto p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Welcome Back
            </p>

            <h1 className="text-4xl font-bold mt-1">
              Hi, {userName} 👋
            </h1>
          </div>

          <a
            href="/profile"
            className="w-14 h-14 rounded-full bg-purple-700 text-white flex items-center justify-center"
          >
            <User size={24} />
          </a>
        </div>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-[32px] p-7 mt-8 shadow-xl text-white">
          <h2 className="text-4xl font-bold leading-tight">
            Save Together.
            <br />
            Enjoy Together.
          </h2>

          <p className="text-white/80 mt-4 text-lg">
            Create private group plans with friends,
            track contributions, and manage shared goals.
          </p>

          <a
            href="/create-plan"
            className="inline-flex items-center gap-2 mt-7 bg-white text-purple-700 px-6 py-4 rounded-2xl font-bold"
          >
            <Plus size={20} />
            Create Plan
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <a
            href="/plans"
            className="bg-white rounded-3xl p-5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Wallet className="text-purple-700" />
            </div>

            <h3 className="font-bold text-xl mt-4">
              My Plans
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              View your active and completed plans.
            </p>
          </a>

          <a
            href="/profile"
            className="bg-white rounded-3xl p-5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
              <User className="text-pink-600" />
            </div>

            <h3 className="font-bold text-xl mt-4">
              Profile
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Manage your account and activity.
            </p>
          </a>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recent Plans
          </h2>

          <a
            href="/plans"
            className="text-purple-700 font-bold"
          >
            View All
          </a>
        </div>

        <div className="space-y-4 mt-5">
          {plans.length === 0 ? (
            <div className="bg-white rounded-3xl p-5 text-center text-gray-500">
              No plans yet.
            </div>
          ) : (
            plans.map((plan) => {
              const progress =
                (plan.collected_amount /
                  plan.goal_amount) *
                100;

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {plan.title}
                      </h3>

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
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        ₹{plan.collected_amount}
                      </span>

                      <span>
                        ₹{plan.goal_amount}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>
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
          <a
            href="/"
            className="flex flex-col items-center text-purple-700"
          >
            <Home size={24} />
            <span className="text-xs mt-1">
              Home
            </span>
          </a>

          <a
            href="/plans"
            className="flex flex-col items-center text-gray-500"
          >
            <Wallet size={24} />
            <span className="text-xs mt-1">
              Plans
            </span>
          </a>

          <a
            href="/create-plan"
            className="w-16 h-16 rounded-full bg-purple-700 text-white flex items-center justify-center -mt-10 shadow-xl"
          >
            <Plus size={30} />
          </a>

          <a
            href="/profile"
            className="flex flex-col items-center text-gray-500"
          >
            <User size={24} />
            <span className="text-xs mt-1">
              Profile
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}