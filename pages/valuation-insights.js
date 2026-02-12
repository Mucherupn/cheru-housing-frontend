import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ValuationInsightsPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Valuation Insights</h1>
          <p className="text-gray-700 leading-relaxed">
            Valuation is a strategic discipline, not just a number. Sound property decisions require an
            understanding of value drivers, market timing, and quality-adjusted comparables.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Why Valuations Matter</h2>
          <p className="text-gray-700 leading-relaxed">
            Accurate valuations shape acquisition strategy, financing terms, negotiation strength, and
            portfolio performance. Mispricing introduces avoidable risk, particularly in fast-moving or
            low-transparency markets.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">What Affects Value</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside">
            <li>Micro-location quality, accessibility, and neighborhood trajectory.</li>
            <li>Property condition, layout efficiency, and functional utility.</li>
            <li>Comparable transaction quality and recency in similar submarkets.</li>
            <li>Macroeconomic context, buyer liquidity, and financing conditions.</li>
          </ul>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">How Cheru Approaches Valuation</h2>
          <p className="text-gray-700 leading-relaxed">
            We combine empirical market signals with local professional judgment. Our approach prioritizes
            consistency, transparency, and context so clients can evaluate value with greater precision and
            confidence.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ValuationInsightsPage;
