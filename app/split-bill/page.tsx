"use client";

import { useState } from "react";

export default function SplitBill() {
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("");
  const total = Number(amount);
  const count = Number(people);
  const perPerson = total && count ? total / count : 0;

  return (
    <main className="min-h-screen bg-[#F5F1FF] p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">Split Bill</h1>
        <p className="text-gray-500 mt-1">
          Calculate how much each friend should pay.
        </p>

        <div className="bg-white rounded-3xl p-5 mt-6 space-y-4">
          <input
            type="number"
            placeholder="Total bill amount ₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
          />

          <input
            type="number"
            placeholder="Number of people"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F5F1FF] outline-none"
          />

          <div className="bg-purple-100 rounded-3xl p-5 text-center">
            <p className="text-gray-500">Each person pays</p>
            <h2 className="text-4xl font-bold text-purple-700 mt-2">
              ₹{perPerson.toFixed(2)}
            </h2>
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `PlanZ Split Bill: Total ₹${amount}, People ${people}, Each pays ₹${perPerson.toFixed(
                2
              )}`
            )}`}
            target="_blank"
            className="block text-center w-full bg-green-500 text-white p-4 rounded-2xl font-bold"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}