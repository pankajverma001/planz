"use client";

import { useState } from "react";
import { Calculator, Sparkles, Share2 } from "lucide-react";

export default function ExpenseAssistant() {
  const [bill, setBill] = useState("");
  const [people, setPeople] = useState("");
  const [tip, setTip] = useState("");

  const totalBill = Number(bill);
  const totalTip = Number(tip || 0);
  const totalPeople = Number(people);

  const finalAmount = totalBill + totalTip;
  const perPerson =
    finalAmount && totalPeople ? finalAmount / totalPeople : 0;

  const suggestion =
    perPerson > 500
      ? "This is a high split. You can reduce cost by using cafe deals or discount coupons."
      : perPerson > 0
      ? "This split looks affordable. Share it with your group now."
      : "Enter bill details to get smart split suggestion.";

  const shareText = `PlanZ AI Expense Split:
Total Bill: ₹${bill}
Tip/Extra: ₹${tip || 0}
People: ${people}
Each Person Pays: ₹${perPerson.toFixed(2)}

${suggestion}`;

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <div className="bg-gradient-to-br from-purple-700 to-pink-500 rounded-3xl p-6 mt-6">
          <Calculator size={42} />
          <h1 className="text-3xl font-bold mt-4">
            AI Expense Split
          </h1>
          <p className="text-white/70 mt-1">
            Split bills smarter with group suggestions.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
          <input
            type="number"
            placeholder="Total bill amount ₹"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />

          <input
            type="number"
            placeholder="Number of people"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />

          <input
            type="number"
            placeholder="Tip / extra charges ₹"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none placeholder:text-white/40"
          />
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6 mt-6 text-center">
          <p className="text-white/50">Each person pays</p>
          <h2 className="text-4xl font-bold text-purple-300 mt-2">
            ₹{perPerson.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mt-5">
          <Sparkles className="text-yellow-400" />
          <h2 className="font-bold text-xl mt-3">
            AI Suggestion
          </h2>
          <p className="text-white/50 mt-2">
            {suggestion}
          </p>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          className="w-full bg-green-500 text-white p-4 rounded-2xl font-bold mt-5 flex items-center justify-center gap-2"
        >
          <Share2 size={20} />
          Share Split on WhatsApp
        </a>
      </div>
    </main>
  );
}