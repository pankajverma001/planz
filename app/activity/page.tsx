"use client";

import { useEffect, useState } from "react";
import { Activity, IndianRupee, Users, Gift } from "lucide-react";
import { supabase } from "../lib/supabase";

type FeedItem = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

export default function ActivityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    getFeed();

    const channel = supabase
      .channel("activity-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setFeed((current) => [
            payload.new as FeedItem,
            ...current,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getFeed() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setFeed(data || []);
  }

  function iconFor(title: string) {
    if (title.includes("Contribution")) return IndianRupee;
    if (title.includes("Member")) return Users;
    if (title.includes("Plan")) return Gift;
    return Activity;
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6">
          <Activity size={38} />
          <h1 className="text-3xl font-bold mt-4">Activity Feed</h1>
          <p className="text-white/70 mt-1">
            Live updates from your PlanZ groups.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {feed.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No activity yet.
            </div>
          ) : (
            feed.map((item) => {
              const Icon = iconFor(item.title);

              return (
                <div
                  key={item.id}
                  className="bg-white/10 border border-white/10 rounded-3xl p-5 flex gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center">
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-bold">{item.title}</h2>
                    <p className="text-white/50 text-sm mt-1">
                      {item.message}
                    </p>
                    <p className="text-purple-300 text-xs mt-2">
                      {new Date(item.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
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
    </main>
  );
}