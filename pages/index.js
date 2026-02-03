import Footer from "../components/Footer";
import HeroButtons from "../components/HeroButtons";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import useFetchProperties from "../hooks/useFetchProperties";

const Home = () => {
  const { properties } = useFetchProperties();

  return (
    <div className="min-h-screen bg-black text-[#0B1220]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4B5563]">
            Nairobi housing intelligence
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            The housing reference point for Nairobi
          </h1>
          <p className="max-w-2xl text-base text-[#4B5563]">
            Discover trusted listings, market insights, and refined neighborhoods
            curated for modern Nairobi living.
          </p>
          <HeroButtons />
          <SearchBar />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Featured Nairobi listings
            </h2>
            <span className="text-sm text-[#4B5563]">Updated daily</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
