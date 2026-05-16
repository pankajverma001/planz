import { Coffee, Hotel, Film, Pizza } from "lucide-react";

export default function Deals() {
  const deals = [
    {
      name: "Cafe Coffee Day",
      offer: "20% OFF",
      detail: "On orders above ₹499",
      icon: Coffee,
    },
    {
      name: "The Park Hotel",
      offer: "Up to 30% OFF",
      detail: "On room booking",
      icon: Hotel,
    },
    {
      name: "PVR Cinemas",
      offer: "Flat 15% OFF",
      detail: "On movie tickets",
      icon: Film,
    },
    {
      name: "Pizza Hub",
      offer: "Buy 1 Get 1",
      detail: "Best for group pizza party",
      icon: Pizza,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F1FF] p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">Best Deals</h1>
        <p className="text-gray-500 mt-1">
          Cafes, hotels, movies and party offers.
        </p>

        <div className="mt-6 space-y-4">
          {deals.map((deal) => {
            const Icon = deal.icon;

            return (
              <div
                key={deal.name}
                className="bg-white rounded-3xl p-5 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Icon size={28} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold">{deal.name}</h2>
                  <p className="text-purple-700 font-bold text-sm">
                    {deal.offer}
                  </p>
                  <p className="text-gray-500 text-sm">{deal.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}