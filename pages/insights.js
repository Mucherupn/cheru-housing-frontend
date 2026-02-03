import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const insights = [
  {
    title: "Nairobi luxury market pulse",
    description:
      "Track price shifts, demand drivers, and the most resilient estates this quarter.",
  },
  {
    title: "Neighborhood spotlight: Lavington",
    description:
      "A refined look at leafy avenues, lifestyle access, and top inventory.",
  },
  {
    title: "Investor brief: rental yields",
    description:
      "Benchmark rental yields across Karen, Westlands, and Kilimani corridors.",
  },
];

const Insights = () => {
  return (
    <div className="min-h-screen bg-black text-[#0B1220]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <h1 className="section-heading">Market insights</h1>
          <p className="max-w-2xl text-base text-[#4B5563]">
            Intelligence-led guidance on Nairobi&apos;s most in-demand neighborhoods.
          </p>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {insights.map((insight) => (
            <article
              key={insight.title}
              className="rounded-2xl border border-white/10 bg-[#111418] p-6 text-white"
            >
              <h2 className="text-xl font-semibold text-[#012169]">
                {insight.title}
              </h2>
              <p className="mt-3 text-sm text-[#4B5563]">
                {insight.description}
              </p>
              <button className="mt-6 text-sm font-semibold text-white transition hover:text-[#012169]">
                Read report
              </button>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Insights;
