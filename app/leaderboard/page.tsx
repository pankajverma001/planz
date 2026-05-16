"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import { supabase } from "../lib/supabase";

type Member = {
  id: number;
  contribution_amount: number;
  friends: {
    name: string;
  }[];
};

export default function Leaderboard() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    getLeaderboard();
  }, []);

  async function getLeaderboard() {
    const { data, error } = await supabase
      .from("group_members")
      .select(`
        id,
        contribution_amount,
        friends(name)
      `)
      .order("contribution_amount", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setMembers((data as Member[]) || []);
  }

  function badge(index: number) {
    if (index === 0) return "🥇 Top Saver";
    if (index === 1) return "🥈 Money Hero";
    if (index === 2) return "🥉 Party Builder";
    return "⭐ Contributor";
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-yellow-500 to-purple-700 rounded-3xl p-6 mt-6">
          <Trophy size={42} />
          <h1 className="text-3xl font-bold mt-4">Leaderboard</h1>
          <p className="text-white/80 mt-1">
            Top contributors in PlanZ groups.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6">
          <div className="flex items-center gap-3">
            <Crown className="text-yellow-400" />
            <div>
              <h2 className="font-bold">Gamification</h2>
              <p className="text-white/50 text-sm">
                Save more, earn badges, stay on top.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {members.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No contributions yet.
            </div>
          ) : (
            members.map((member, index) => (
              <div
                key={member.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center font-bold">
                  #{index + 1}
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-lg">
                    {member.friends?.[0]?.name || "Unknown"}
                  </h2>

                  <p className="text-purple-300 text-sm">
                    ₹{member.contribution_amount} saved
                  </p>

                  <p className="text-white/50 text-xs mt-1">
                    {badge(index)}
                  </p>
                </div>

                <Medal className="text-yellow-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}