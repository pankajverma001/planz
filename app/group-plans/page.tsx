"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2, IndianRupee } from "lucide-react";
import { supabase } from "../lib/supabase";

type Plan = {
  id: number;
  title: string;
};

type Friend = {
  id: number;
  name: string;
};

type GroupMember = {
  id: number;
  contribution_amount: number;
  plans: { title: string }[];
  friends: { name: string }[];
};

export default function GroupPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [planId, setPlanId] = useState("");
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    getPlans();
    getFriends();
    getMembers();
  }, []);

  async function getPlans() {
    const { data } = await supabase.from("plans").select("id,title");
    setPlans(data || []);
  }

  async function getFriends() {
    const { data } = await supabase.from("friends").select("id,name");
    setFriends(data || []);
  }

  async function getMembers() {
    const { data, error } = await supabase
      .from("group_members")
      .select(`
        id,
        contribution_amount,
        plans(title),
        friends(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setMembers((data as GroupMember[]) || []);
  }

  async function addMember() {
    if (!planId || !friendId) {
      alert("Select plan and friend");
      return;
    }

    const { error } = await supabase.from("group_members").insert([
      {
        plan_id: Number(planId),
        friend_id: Number(friendId),
        contribution_amount: 0,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setPlanId("");
    setFriendId("");
    getMembers();
  }

  async function addContribution(member: GroupMember) {
    const amount = prompt("Enter member contribution amount ₹");

    if (!amount) return;

    const newAmount = member.contribution_amount + Number(amount);

    const { error } = await supabase
      .from("group_members")
      .update({ contribution_amount: newAmount })
      .eq("id", member.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert([
      {
        title: "Member Contribution Added",
        message: `${member.friends?.[0]?.name} added ₹${amount} to ${member.plans?.[0]?.title}`,
      },
    ]);

    getMembers();
  }

  async function deleteMember(id: number) {
    if (!confirm("Remove this member from group plan?")) return;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    getMembers();
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6">
          <Users size={38} />
          <h1 className="text-3xl font-bold mt-4">Group Plans</h1>
          <p className="text-white/70 mt-1">
            Track individual friend contributions.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
          >
            <option value="">Select Plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
              </option>
            ))}
          </select>

          <select
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
          >
            <option value="">Select Friend</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>

          <button
            onClick={addMember}
            className="w-full bg-purple-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Friend to Plan
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {members.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No group members yet.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg">
                      {member.friends?.[0]?.name}
                    </h2>

                    <p className="text-white/50 text-sm">
                      Plan: {member.plans?.[0]?.title}
                    </p>

                    <p className="text-purple-300 text-sm mt-1">
                      Contribution: ₹{member.contribution_amount}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteMember(member.id)}
                    className="w-11 h-11 rounded-2xl bg-red-500 flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <button
                  onClick={() => addContribution(member)}
                  className="w-full bg-green-500 text-white p-3 rounded-2xl font-bold mt-4 flex items-center justify-center gap-2"
                >
                  <IndianRupee size={18} />
                  Add Member Contribution
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}