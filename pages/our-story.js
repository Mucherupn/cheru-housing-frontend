import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const OurStoryPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Our Story</h1>
          <p className="text-gray-700 leading-relaxed">
            Cheru was built on a simple conviction: every property decision should start with clarity.
            In Nairobi, buyers, investors, and developers often face fragmented information, inconsistent
            pricing, and avoidable uncertainty. We created Cheru to replace guesswork with structured,
            credible intelligence.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our platform combines local context, market data, and professional judgment to provide a
            trusted reference point for high-value residential decisions. We focus on the details that
            materially affect outcomes, from neighborhood dynamics to pricing behavior over time.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">What We Are Building</h2>
          <p className="text-gray-700 leading-relaxed">
            We are building the most dependable source of housing intelligence in Nairobi, one that helps
            people act with confidence. Our ambition is not noise. It is precision, consistency, and trust
            earned through disciplined execution.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurStoryPage;
