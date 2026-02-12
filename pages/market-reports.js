import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MarketReportsPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Market Reports</h1>
          <p className="text-gray-700 leading-relaxed">
            Cheru market reports provide clear, data-driven visibility into Nairobi residential markets.
            They are built to support high-conviction decisions with measurable context.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">What Reports Include</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside">
            <li>Area-level pricing trends and directional shifts across key neighborhoods.</li>
            <li>Supply and demand signals shaping transaction behavior.</li>
            <li>Comparative intelligence on product mix, liquidity, and price positioning.</li>
            <li>Structured summaries highlighting relevant market changes over time.</li>
          </ul>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">How They Help Buyers and Investors</h2>
          <p className="text-gray-700 leading-relaxed">
            Reports help clients identify timing windows, evaluate entry points, and benchmark potential
            opportunities against reliable market evidence. The result is better planning, stronger risk
            control, and more confident decisions.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MarketReportsPage;
