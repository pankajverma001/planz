"use client";

import { useEffect, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type Message = {
  id: number;
  user_email: string;
  message: string;
  created_at: string;
};

export default function GroupChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadUser();
    getMessages();

    const channel = supabase
      .channel("group-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
        },
        (payload) => {
          setMessages((current) => [
            ...(current || []),
            payload.new as Message,
          ]);
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

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("group_messages").insert([
      {
        plan_id: null,
        user_id: user.id,
        user_email: user.email,
        message: text.trim(),
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setText("");
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5 pb-28">
      <div className="max-w-[430px] mx-auto">
        <a href="/group-plans" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 mt-6">
          <MessageCircle size={38} />
          <h1 className="text-3xl font-bold mt-4">Group Chat</h1>
          <p className="text-white/70 mt-1">
            Chat with your PlanZ group members in realtime.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {messages.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No messages yet.
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.user_email === userEmail;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl p-4 ${
                      isMe
                        ? "bg-purple-700 text-white rounded-br-md"
                        : "bg-white/10 border border-white/10 rounded-bl-md"
                    }`}
                  >
                    <p className="text-xs text-white/50 mb-1">
                      {isMe ? "You" : msg.user_email}
                    </p>

                    <p>{msg.message}</p>

                    <p className="text-[10px] text-white/40 mt-2">
                      {new Date(msg.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
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