"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2, IndianRupee, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type Plan = {
  id: number;
  title: string;
};

type GroupMember = {
  id: number;
  user_email: string;
  contribution_amount: number;
  plans: { title: string }[];
};

export default function GroupPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [planId, setPlanId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  useEffect(() => {
    getPlans();
    getMembers();
  }, []);

  async function getPlans() {
    const { data, error } = await supabase
      .from("plans")
      .select("id,title")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setPlans(data || []);
  }

  async function getMembers() {
    const { data, error } = await supabase
      .from("group_members")
      .select(`
        id,
        user_email,
        contribution_amount,
        plans(title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setMembers((data as GroupMember[]) || []);
  }

  async function addMember() {
    if (!planId || !memberEmail) {
      alert("Select plan and enter member email");
      return;
    }

    const { error } = await supabase.from("group_members").insert([
      {
        plan_id: Number(planId),
        user_email: memberEmail.toLowerCase().trim(),
        contribution_amount: 0,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Member added by email!");

    setPlanId("");
    setMemberEmail("");
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
        message: `${member.user_email} added ₹${amount} to ${member.plans?.[0]?.title}`,
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
          <h1 className="text-3xl font-bold mt-4">Shared Group Plans</h1>
          <p className="text-white/70 mt-1">
            Add members by email. They can see this plan after login.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
          >
            <option value="">Select Your Plan</option>

            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
              </option>
            ))}
          </select>

          <input
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="Friend email used for login"
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />

          <button
            onClick={addMember}
            className="w-full bg-purple-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Member to Plan
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {members.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No shared members yet.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg">{member.user_email}</h2>

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

                <a
                  href="/group-chat"
                  className="w-full bg-blue-500 text-white p-3 rounded-2xl font-bold mt-3 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Open Group Chat
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}