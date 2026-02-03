import "../styles/globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import useFetchProperties from "../hooks/useFetchProperties";

const Buy = () => {
  const { properties } = useFetchProperties();

  return (
    <div className="min-h-screen bg-black text-[#0B1220]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Buy homes in Nairobi
          </h1>
          <p className="max-w-2xl text-base text-[#4B5563]">
            Explore curated residences across Nairobi&apos;s most sought-after
            neighborhoods.
          </p>
          <SearchBar />
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Buy;
