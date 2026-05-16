import { Bell, Wallet, Gift, Ticket } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      icon: Wallet,
      title: "Rohit added ₹500",
      text: "Coffee Party is now 75% complete.",
      time: "2 min ago",
    },
    {
      icon: Gift,
      title: "Pizza Party reached 80%",
      text: "Only ₹300 left to complete your goal.",
      time: "15 min ago",
    },
    {
      icon: Ticket,
      title: "Movie deal ending soon",
      text: "Flat 15% OFF on PVR tickets today.",
      time: "1 hour ago",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0714] text-white p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-300 font-bold">
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">Notifications</h1>
        <p className="text-white/50 mt-1">
          Latest activity from your plans.
        </p>

        <div className="mt-6 space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 flex gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center">
                  <Icon size={24} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-white/50 text-sm mt-1">{item.text}</p>
                  <p className="text-purple-300 text-xs mt-2">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}