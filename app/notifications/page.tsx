"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "../lib/supabase";

type Notification = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotifications();

    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotifications((current) => [
            payload.new as Notification,
            ...current,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setNotifications(data || []);
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">Notifications</h1>
        <p className="text-white/50 mt-1">
          Live updates from your PlanZ activity.
        </p>

        <div className="mt-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No notifications yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 flex gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center">
                  <Bell size={24} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-white/50 text-sm mt-1">
                    {item.message}
                  </p>
                  <p className="text-purple-300 text-xs mt-2">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}