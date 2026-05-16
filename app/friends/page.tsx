"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

type Friend = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getFriends();
  }, []);

  async function getFriends() {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setFriends(data || []);
  }

  async function addFriend() {
    if (!name) {
      alert("Enter friend name");
      return;
    }

    const { error } = await supabase.from("friends").insert([
      {
        name,
        phone,
        email,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setPhone("");
    setEmail("");
    getFriends();
  }

  async function deleteFriend(id: number) {
    if (!confirm("Delete this friend?")) return;

    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    getFriends();
  }

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6">
          <Users size={36} />
          <h1 className="text-3xl font-bold mt-4">Friends</h1>
          <p className="text-white/70 mt-1">
            Add friends and invite them to your plans.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
          <input
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
            placeholder="Friend name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={addFriend}
            className="w-full bg-purple-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Friend
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {friends.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 text-center text-white/50">
              No friends added yet.
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 flex items-center justify-between"
              >
                <div>
                  <h2 className="font-bold text-lg">{friend.name}</h2>
                  <p className="text-white/50 text-sm">{friend.phone}</p>
                  <p className="text-white/50 text-sm">{friend.email}</p>
                </div>

                <button
                  onClick={() => deleteFriend(friend.id)}
                  className="w-11 h-11 rounded-2xl bg-red-500 flex items-center justify-center"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}