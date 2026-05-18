"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Send,
  Share2,
  IndianRupee,
  Users,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Message = {
  id: number;
  user_id: string;
  user_email: string;
  message: string;
  created_at: string;
  plan_id: number;
  message_type: string;
  amount: number | null;
};

type Plan = {
  id: number;
  title: string;
  goal_amount: number;
  collected_amount: number;
  invite_code: string;
  status: string;
};

type ContributionRecord = {
  id: number;
  user_id: string;
  user_email: string;
  amount: number;
  created_at: string;
};

type GroupMember = {
  id: number;
  user_id: string;
  user_email: string;
  role: string;
  contribution_amount: number;
};

export default function PlanChatPage() {
  const params = useParams();
  const planId = Number(params.planId);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [records, setRecords] = useState<ContributionRecord[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadUser();
    getPlan();
    getMessages();
    getRecords();
    getMembers();

    const channel = supabase
      .channel(`plan-chat-${planId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.plan_id === planId) {
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email || "");
  }

  async function loadNames(userIds: string[]) {
    const uniqueIds = [...new Set(userIds.filter(Boolean))];

    if (uniqueIds.length === 0) return;

    const { data } = await supabase
      .from("profiles")
      .select("id,full_name")
      .in("id", uniqueIds);

    const map: Record<string, string> = {};

    data?.forEach((profile) => {
      map[profile.id] = profile.full_name || "PlanZ User";
    });

    setNames((old) => ({ ...old, ...map }));
  }

  function showName(userIdValue: string, email: string) {
    return names[userIdValue] || email || "PlanZ User";
  }

  async function getPlan() {
    const { data, error } = await supabase
      .from("plans")
      .select("id,title,goal_amount,collected_amount,invite_code,status")
      .eq("id", planId)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setPlan(data);
  }

  async function getMembers() {
    const { data, error } = await supabase
      .from("group_members")
      .select("id,user_id,user_email,role,contribution_amount")
      .eq("plan_id", planId)
      .order("role", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMembers(data || []);
    loadNames((data || []).map((m) => m.user_id));
  }

  async function getMessages() {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("plan_id", planId)
      .order("created_at", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMessages(data || []);
    loadNames((data || []).map((m) => m.user_id));
  }

  async function getRecords() {
    const { data, error } = await supabase
      .from("contribution_records")
      .select("*")
      .eq("plan_id", planId)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setRecords(data || []);
    loadNames((data || []).map((r) => r.user_id));
  }

  async function sendMessage() {
    if (!text.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("group_messages").insert([
      {
        plan_id: planId,
        user_id: user.id,
        user_email: user.email,
        message: text.trim(),
        message_type: "chat",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setText("");
  }

  async function addContribution() {
    if (plan?.status === "completed") {
      alert("This plan is already completed.");
      return;
    }

    const amountText = prompt("Enter contribution amount ₹");
    if (!amountText) return;

    const amount = Number(amountText);

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const newCollected = Number(plan?.collected_amount || 0) + amount;

    const { error: planError } = await supabase
      .from("plans")
      .update({ collected_amount: newCollected })
      .eq("id", planId);

    if (planError) {
      alert(planError.message);
      return;
    }

    const currentMember = members.find((m) => m.user_id === user.id);

    if (currentMember) {
      await supabase
        .from("group_members")
        .update({
          contribution_amount:
            Number(currentMember.contribution_amount || 0) + amount,
        })
        .eq("id", currentMember.id);
    }

    await supabase.from("contribution_records").insert([
      {
        plan_id: planId,
        user_id: user.id,
        user_email: user.email,
        amount,
      },
    ]);

    const displayName = showName(user.id, user.email || "");

    await supabase.from("group_messages").insert([
      {
        plan_id: planId,
        user_id: user.id,
        user_email: user.email,
        message: `${displayName} contributed ₹${amount}`,
        message_type: "contribution",
        amount,
      },
    ]);

    getPlan();
    getRecords();
    getMembers();
  }

  async function removeMember(member: GroupMember) {
    if (member.user_id === userId) {
      alert("Admin cannot remove themselves.");
      return;
    }

    if (!confirm(`Remove ${showName(member.user_id, member.user_email)}?`))
      return;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", member.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("group_messages").insert([
      {
        plan_id: planId,
        user_id: userId,
        user_email: userEmail,
        message: `${showName(member.user_id, member.user_email)} was removed from the group`,
        message_type: "system",
      },
    ]);

    getMembers();
  }

  async function completePlan() {
    if (!isAdmin) return;

    const { error } = await supabase
      .from("plans")
      .update({ status: "completed" })
      .eq("id", planId);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("group_messages").insert([
      {
        plan_id: planId,
        user_id: userId,
        user_email: userEmail,
        message: "This plan was marked as completed by admin.",
        message_type: "system",
      },
    ]);

    getPlan();
  }

  function inviteLink() {
    if (!plan?.invite_code) return "";
    return `https://planz-theta.vercel.app/join/${plan.invite_code}`;
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteLink());
    alert("Invite link copied!");
  }

  const currentMember = members.find((member) => member.user_id === userId);
  const isAdmin = currentMember?.role === "admin";

  const totalContribution = records.reduce(
    (sum, record) => sum + Number(record.amount),
    0
  );

  const progress = plan
    ? Math.min(
        (Number(plan.collected_amount) / Number(plan.goal_amount)) * 100,
        100
      )
    : 0;

  return (
    <main className="min-h-screen bg-[#0B0714] text-white pb-32">
      <div className="max-w-[430px] mx-auto p-5">
        <a href="/plans" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-r from-purple-700 to-pink-500 rounded-3xl p-5 mt-5">
          <h1 className="text-3xl font-bold">{plan?.title || "Group Chat"}</h1>

          <p className="text-white/70 mt-2">
            Members, chat, invite and contributions.
          </p>

          <div className="flex items-center gap-2 mt-4 text-white/80">
            <Users size={18} />
            <span>{members.length} members</span>

            {isAdmin && (
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                Admin
              </span>
            )}
          </div>

          {plan && (
            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span>Saved ₹{plan.collected_amount}</span>
                <span>Goal ₹{plan.goal_amount}</span>
              </div>

              <div className="w-full h-3 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={copyInvite}
            className="bg-blue-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Invite
          </button>

          <button
            onClick={addContribution}
            disabled={plan?.status === "completed"}
            className="bg-green-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <IndianRupee size={18} />
            Contribute
          </button>
        </div>

        {isAdmin && plan?.status !== "completed" && (
          <button
            onClick={completePlan}
            className="w-full bg-yellow-400 text-black p-4 rounded-2xl font-bold mt-3 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Complete Plan
          </button>
        )}

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-5">
          <h2 className="font-bold text-xl">Members</h2>

          <div className="mt-4 space-y-3">
            {members.map((member) => (
              <div key={member.id} className="bg-white/10 rounded-2xl p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">
                      {showName(member.user_id, member.user_email)}
                    </p>

                    <p className="text-white/50 text-xs">
                      Total: ₹{member.contribution_amount || 0}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      member.role === "admin"
                        ? "bg-yellow-400 text-black"
                        : "bg-purple-700 text-white"
                    }`}
                  >
                    {member.role === "admin" ? "Admin" : "Member"}
                  </span>
                </div>

                {isAdmin && member.user_id !== userId && (
                  <button
                    onClick={() => removeMember(member)}
                    className="w-full bg-red-500 text-white p-3 rounded-2xl font-bold mt-3 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove Member
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-5">
          <p className="text-white/50 text-sm">Total Contribution Records</p>
          <h2 className="text-3xl font-bold text-purple-300 mt-2">
            ₹{totalContribution}
          </h2>

          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex justify-between text-sm bg-white/10 rounded-2xl p-3"
              >
                <span>{showName(record.user_id, record.user_email)}</span>
                <span>₹{record.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {messages.map((msg) => {
            const isMe = msg.user_id === userId;
            const isContribution = msg.message_type === "contribution";
            const isSystem = msg.message_type === "system";

            if (isContribution) {
              return (
                <div
                  key={msg.id}
                  className="bg-green-500/20 border border-green-500/30 rounded-3xl p-4 text-center"
                >
                  <p className="font-bold text-green-300">
                    ₹{msg.amount} contribution added
                  </p>

                  <p className="text-white/60 text-sm mt-1">
                    {showName(msg.user_id, msg.user_email)}
                  </p>
                </div>
              );
            }

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="bg-white/10 border border-white/10 rounded-3xl p-3 text-center text-white/60 text-sm"
                >
                  {msg.message}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl p-4 ${
                    isMe
                      ? "bg-purple-700"
                      : "bg-white/10 border border-white/10"
                  }`}
                >
                  <p className="text-xs text-white/50 mb-1">
                    {isMe ? "You" : showName(msg.user_id, msg.user_email)}
                  </p>

                  <p>{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0B0714] border-t border-white/10 p-4">
        <div className="max-w-[430px] mx-auto flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message..."
            className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />

          <button
            onClick={sendMessage}
            className="w-14 h-14 rounded-2xl bg-purple-700 flex items-center justify-center"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </main>
  );
}