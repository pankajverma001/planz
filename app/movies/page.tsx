import { Film, Clock, MapPin } from "lucide-react";

export default function Movies() {
  return (
    <main className="min-h-screen bg-[#F5F1FF] p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <h1 className="text-3xl font-bold mt-5">Movie Tickets</h1>
        <p className="text-gray-500 mt-1">
          Book movie plans with your friends.
        </p>

        <div className="bg-gradient-to-br from-orange-500 to-purple-700 rounded-3xl p-5 text-white mt-6">
          <Film size={42} />
          <h2 className="text-2xl font-bold mt-5">The Adventure Movie</h2>
          <p className="text-white/80 mt-1">Comedy • Adventure • 2h 10m</p>
        </div>

        <div className="bg-white rounded-3xl p-5 mt-5">
          <div className="flex items-center gap-3">
            <MapPin className="text-purple-700" />
            <div>
              <h2 className="font-bold">PVR Nexus Mall</h2>
              <p className="text-gray-500 text-sm">Near city center</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Clock className="text-purple-700" />
            <div>
              <h2 className="font-bold">Today, 24 May</h2>
              <p className="text-gray-500 text-sm">Select show timing</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <button className="border border-purple-300 text-purple-700 rounded-2xl p-3 font-bold">
              12:30 PM
            </button>
            <button className="border border-purple-300 text-purple-700 rounded-2xl p-3 font-bold">
              03:30 PM
            </button>
            <button className="border border-purple-300 text-purple-700 rounded-2xl p-3 font-bold">
              06:30 PM
            </button>
            <button className="border border-purple-300 text-purple-700 rounded-2xl p-3 font-bold">
              09:30 PM
            </button>
          </div>

          <div className="flex justify-between mt-6">
            <p className="font-bold">2 Tickets</p>
            <p className="font-bold">₹340</p>
          </div>

          <button className="w-full bg-purple-700 text-white p-4 rounded-2xl font-bold mt-5">
            Proceed to Pay
          </button>
        </div>
      </div>
    </main>
  );
}