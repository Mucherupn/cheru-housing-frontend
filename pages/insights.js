import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Link from "next/link"; // Use Next.js Link
import Image from "next/image";

const locations = [
  "Karen",
  "Kilimani",
  "Kileleshwa",
  "Runda",
  "Lavington",
  "Westlands",
  "Muthaiga",
  "Gigiri",
  "Riverside",
  "Nyari",
  "Lower Kabete",
  "Parklands",
  "Spring Valley",
  "Nairobi West",
  "Langata",
  "Garden Estate",
  "Kitisuru",
  "Upper Hill",
  "Kyuna",
  "Loresho",
];

const articles = [
  {
    title: "Nairobi luxury market pulse",
    description:
      "Track price shifts, demand drivers, and the most resilient estates this quarter.",
    date: "Feb 1, 2026",
    image: "/articles/market-pulse.jpg",
  },
  {
    title: "Neighborhood spotlight: Lavington",
    description:
      "A refined look at leafy avenues, lifestyle access, and top inventory.",
    date: "Jan 28, 2026",
    image: "/articles/lavington-spotlight.jpg",
  },
  {
    title: "Investor brief: rental yields",
    description:
      "Benchmark rental yields across Karen, Westlands, and Kilimani corridors.",
    date: "Jan 20, 2026",
    image: "/articles/rental-yields.jpg",
  },
];

const Insights = () => {
  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Navbar />

      {/* HERO / INTRODUCTION */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#012169] mb-4">
          Nairobi Housing Insights
        </h1>
        <p className="text-lg sm:text-xl text-[#4B5563] max-w-3xl mx-auto mb-12 leading-relaxed">
          Get expert intelligence on Nairobi’s most premium neighborhoods. Explore property trends, pricing insights, and market movements to make informed decisions.
        </p>

        {/* Quick CTA Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#locations"
            className="rounded-full border border-[#012169] px-6 py-3 text-sm font-medium text-[#012169] hover:bg-[#012169] hover:text-white transition"
          >
            Explore Locations
          </a>
          <a
            href="#articles"
            className="rounded-full border border-[#012169] px-6 py-3 text-sm font-medium text-[#012169] hover:bg-[#012169] hover:text-white transition"
          >
            Read Articles
          </a>
        </div>
      </section>

      {/* LOCATIONS GRID */}
      <section
        id="locations"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0B1220] mb-6">
          Explore by Location
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {locations.map((loc) => (
            <Link
              key={loc}
              href={`/insights/${loc.toLowerCase()}`}
              className="rounded-xl border border-gray-200 p-4 text-center text-[#012169] font-medium hover:bg-[#012169] hover:text-white transition"
            >
              {loc}
            </Link>
          ))}
        </div>
      </section>

      {/* ARTICLES / MARKET NEWS */}
      <section
        id="articles"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0B1220] mb-6">
          Latest Articles & Market News
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-white p-6">
                <h3 className="text-lg font-semibold text-[#0B1220] mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">{article.description}</p>
                <span className="text-xs text-[#9CA3AF]">{article.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Insights;
