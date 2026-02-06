import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ListWithCheru = () => {
  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Navbar />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#012169] mb-3">
          List With Cheru
        </h1>
        <p className="text-lg sm:text-xl text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
          Reach Nairobi’s most qualified buyers with our market expertise, 
          strategic exposure, and professional guidance. Listing with Cheru is 
          simple, secure, and premium.
        </p>
      </section>

      {/* STEPS / PROCESS */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0B1220] mb-10 text-center">
          How It Works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#012169] text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-semibold text-[#0B1220]">Share Your Property</h3>
            <p className="text-sm text-[#4B5563] text-center">
              Provide basic details and location of your property.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#012169] text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-semibold text-[#0B1220]">Pricing & Valuation</h3>
            <p className="text-sm text-[#4B5563] text-center">
              Our experts evaluate the property and recommend a competitive price.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#012169] text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-semibold text-[#0B1220]">Exposure & Sale</h3>
            <p className="text-sm text-[#4B5563] text-center">
              Your property is listed to the right buyers and our team guides 
              the sale from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* PRIMARY CTA FORM */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#F9FAFB] p-10 shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-[#0B1220] mb-3">
            Share Your Property Details
          </h2>
          <p className="text-[#4B5563] mb-6">
            Fill out a few details and our agents will reach out with guidance.
          </p>

          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Property Location e.g Karen, Kilimani"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-[#0B1220] placeholder-[#6B7280] shadow-sm focus:outline-none focus:border-[#012169] focus:ring-2 focus:ring-[#012169]/20"
            />

            <select className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-[#0B1220] shadow-sm focus:outline-none focus:border-[#012169] focus:ring-2 focus:ring-[#012169]/20">
              <option>For Sale</option>
              <option>For Rent</option>
            </select>

            <input
              type="text"
              placeholder="Brief Description of your property"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-[#0B1220] placeholder-[#6B7280] shadow-sm focus:outline-none focus:border-[#012169] focus:ring-2 focus:ring-[#012169]/20"
            />

            <input
              type="text"
              placeholder="Contact Number / WhatsApp"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-[#0B1220] placeholder-[#6B7280] shadow-sm focus:outline-none focus:border-[#012169] focus:ring-2 focus:ring-[#012169]/20"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-[#012169] py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Share Property Details
            </button>
          </form>
        </div>
      </section>

      {/* TRUST / AUTHORITY */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0B1220] mb-6">
          Why List With Cheru
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-[#0B1220] mb-1">Market Knowledge</h3>
            <p className="text-sm text-[#4B5563]">
              Deep expertise on Nairobi’s premium neighborhoods and pricing trends.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-[#0B1220] mb-1">Premium Exposure</h3>
            <p className="text-sm text-[#4B5563]">
              Your property reaches serious buyers through our curated channels.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-[#0B1220] mb-1">Accurate Pricing</h3>
            <p className="text-sm text-[#4B5563]">
              Professional valuation ensures competitive and transparent pricing.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ListWithCheru;
