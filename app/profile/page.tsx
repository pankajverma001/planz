export default function Profile() {
  return (
    <main className="min-h-screen bg-[#F5F1FF] p-5">
      <div className="max-w-[430px] mx-auto">
        <a href="/" className="text-purple-700 font-bold">
          ← Back
        </a>

        <div className="bg-white rounded-3xl p-6 mt-6 text-center">
          <div className="w-24 h-24 rounded-full bg-purple-700 text-white flex items-center justify-center text-4xl font-bold mx-auto">
            P
          </div>

          <h1 className="text-2xl font-bold mt-4">Pankaj Kumar</h1>
          <p className="text-gray-500">PlanZ Founder</p>
        </div>

        <div className="bg-white rounded-3xl p-5 mt-5 space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Total Plans</p>
            <h2 className="text-xl font-bold">Live from Supabase soon</h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">App Name</p>
            <h2 className="text-xl font-bold">PlanZ</h2>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Tagline</p>
            <h2 className="text-xl font-bold">
              Save Together. Celebrate Better.
            </h2>
          </div>
        </div>
      </div>
    </main>
  );
}