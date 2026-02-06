import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import useFetchProperties from "../hooks/useFetchProperties";

const Home = () => {
  const { properties } = useFetchProperties();

  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        {/* Light premium overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl px-6 text-center">
          <div className="flex flex-col items-center gap-8">
            
            {/* Floating buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/insights" className="btn-primary">Insights</a>
              <a href="/buy" className="btn-primary">Buy</a>
              <a href="/rent" className="btn-primary">Rent</a>
            </div>

            {/* Search bar — no wrapper, no background */}
            <div className="w-full max-w-3xl">
              <SearchBar />
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <main className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0B1220]">
              Featured Listings
            </h2>
            <span className="text-sm text-[#6B7280]">Updated daily</span>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </main>
      {/* CHERU ESTIMATE */}
<section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
  <div className="rounded-2xl bg-[#F9FAFB] px-6 py-14 shadow-md sm:px-12">
    
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#0B1220]">
        Cheru Estimate
      </h2>

      <p className="text-base text-[#4B5563]">
        Get an instant estimate of what your property could be worth. 
        Start by telling us where your property is located and our valuation 
        engine will do the rest.
      </p>
    </div>

    {/* Input */}
    <div className="mx-auto mt-10 max-w-3xl">
      <form className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Enter your property estate e.g Kilimani, Karen, Kileleshwa, Runda, Thika"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-[#0B1220] placeholder-[#6B7280] shadow-sm outline-none focus:border-[#012169] focus:ring-2 focus:ring-[#012169]/20"
        />

        <button
          type="submit"
          className="rounded-xl bg-[#012169] px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
        >
          Get Estimate
        </button>
      </form>
    </div>
  </div>
</section>
{/* SELL WITH THE BEST PREMIUM SECTION */}
<section className="relative bg-[#F9FAFB] py-28">
  {/* Background accent image */}
  <div className="absolute inset-0 overflow-hidden">
    <img
      src="/premium-office.jpg"
      alt="Premium real estate office"
      className="w-full h-full object-cover object-center opacity-20"
    />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-extrabold text-[#0B1220] tracking-tight sm:text-5xl">
        Sell With The Best
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-[#4B5563]">
        Partner with Nairobi’s most trusted real estate experts. Our market insights, pricing expertise, and strategic exposure ensure your property gets the attention it deserves.
      </p>
    </div>

    {/* Split layout: Left highlights & right single CTA */}
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

      {/* LEFT SIDE: Visual & Highlights */}
      <div className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#012169] text-white font-bold text-xl">
              1
            </div>
            <p className="text-[#0B1220] font-medium text-lg">
              Market Knowledge: We know every neighborhood, estate, and price trend.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#012169] text-white font-bold text-xl">
              2
            </div>
            <p className="text-[#0B1220] font-medium text-lg">
              Pricing Expertise: Accurate valuation to maximize your returns.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#012169] text-white font-bold text-xl">
              3
            </div>
            <p className="text-[#0B1220] font-medium text-lg">
              Strategic Exposure: Get your property seen by the right buyers.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Single CTA Button */}
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-3xl bg-white p-12 shadow-2xl max-w-md w-full text-center">
          <h3 className="text-2xl font-semibold text-[#0B1220] mb-4">
            Share Your Property Details
          </h3>
          <p className="text-[#6B7280] mb-6">
            Let us know your property and we’ll get back to you with insights and next steps.
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-[#012169] py-4 text-sm font-medium text-white transition hover:opacity-90"
            onClick={() => alert("Here we will later trigger the popup form")}
          >
            Share Details
          </button>
        </div>
      </div>

    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default Home;
