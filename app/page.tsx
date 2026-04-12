import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Report. Track. Resolve.
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-8">
          CivicPulse lets citizens report local infrastructure issues and hold
          governments accountable — in real time.
        </p>
        <div className="flex gap-4">
          <Link
            href="/submit"
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Report an Issue
          </Link>
          <Link
            href="/map"
            className="border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition"
          >
            View Map
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pb-24 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-4xl font-bold text-black">1,200+</p>
          <p className="text-gray-500 mt-1">Issues Reported</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-4xl font-bold text-green-500">68%</p>
          <p className="text-gray-500 mt-1">Resolved</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-4xl font-bold text-black">12</p>
          <p className="text-gray-500 mt-1">Cities Active</p>
        </div>
      </section>
    </main>
  );
}
