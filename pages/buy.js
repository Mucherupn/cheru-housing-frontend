import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

const recommendedLocations = [
  "Karen", "Kilimani", "Runda", "Lavington", "Westlands",
  "Gigiri", "Kileleshwa", "Muthaiga", "Riverside", "Langata"
];

const Buy = () => {
  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#012169] mb-4">
          Find Your Ideal Home
        </h1>
        <p className="text-lg sm:text-xl text-[#4B5563] max-w-2xl mb-8">
          Whether you know exactly where you want to live or need guidance, we help you navigate Nairobi's premium property market.
        </p>

        {/* Search Bar for people who know where to buy */}
        <div className="w-full max-w-3xl">
          <SearchBar 
            placeholder="Where would you like to live? E.g. Karen, Kilimani, Runda..." 
            buttonText="Search Homes"
            basePath="/buy"
          />
        </div>

        {/* Quick recommended locations */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {recommendedLocations.map((location) => (
            <a 
              key={location}
              href={`/buy/${location.toLowerCase()}`}
              className="rounded-full border border-[#012169] px-6 py-2 text-sm font-medium text-[#012169] hover:bg-[#012169] hover:text-white transition"
            >
              {location}
            </a>
          ))}
        </div>
      </section>

      {/* GUIDANCE SECTION */}
      <section className="relative bg-[#F9FAFB] py-28">
        {/* Optional accent background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/agent-guidance.jpg" 
            alt="Agent helping client" 
            className="w-full h-full object-cover object-center opacity-20" 
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#012169] mb-4">
            Not sure where to start?
          </h2>
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto mb-8">
            Our expert agents are here to guide you. Whether it’s your first home or a strategic investment, we’ll help you navigate Nairobi’s neighborhoods and find the perfect property.
          </p>
          <button 
            type="button"
            className="rounded-xl bg-[#012169] px-8 py-4 text-sm sm:text-base font-medium text-white shadow-lg hover:opacity-90 transition"
            onClick={() => alert("Here we will trigger the contact popup later")}
          >
            Speak with an Agent
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Buy;
