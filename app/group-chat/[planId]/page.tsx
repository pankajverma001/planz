"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Message = {
  id: number;
  user_email: string;
  message: string;
  created_at: string;
  plan_id: number;
};

export default function PlanChatPage() {
  const params = useParams();
  const planId = Number(params.planId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadUser();
    getMessages();

    const channel = supabase
      .channel(`plan-chat-${planId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;

          if (newMessage.plan_id === planId) {
            setMessages((current) => [
              ...current,
              newMessage,
            ]);
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

    setUserEmail(user.email || "");
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
  }

  async function sendMessage() {
    if (!text.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("group_messages")
      .insert([
        {
          plan_id: planId,
          user_id: user.id,
          user_email: user.email,
          message: text,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setText("");
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white pb-28">
      <div className="max-w-[430px] mx-auto p-5">
        <a
          href="/plans"
          className="text-purple-300 font-bold"
        >
          ← Back
        </a>

        <div className="bg-gradient-to-r from-purple-700 to-pink-500 rounded-3xl p-5 mt-5">
          <h1 className="text-3xl font-bold">
            Group Chat
          </h1>

          <p className="text-white/70 mt-2">
            Private chat for this plan only.
          </p>
        </div>

        <div className="space-y-3 mt-6">
          {messages.map((msg) => {
            const isMe =
              msg.user_email === userEmail;

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl p-4 ${
                    isMe
                      ? "bg-purple-700"
                      : "bg-white/10 border border-white/10"
                  }`}
                >
                  <p className="text-xs text-white/50 mb-1">
                    {isMe
                      ? "You"
                      : msg.user_email}
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
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Type message..."
            className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
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