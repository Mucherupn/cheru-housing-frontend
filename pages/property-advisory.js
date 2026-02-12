import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PropertyAdvisoryPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Property Advisory</h1>
          <p className="text-gray-700 leading-relaxed">
            Strategic property decisions require more than listings and comparable prices. Cheru advisory
            combines market intelligence with investment thinking to help clients make disciplined choices
            aligned with long-term value.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Who It Is For</h2>
          <p className="text-gray-700 leading-relaxed">
            Our advisory is designed for buyers, investors, developers, and families evaluating meaningful
            capital commitments in Nairobi residential property.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">What We Help With</h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside">
            <li>Acquisition strategy and area selection grounded in objective market evidence.</li>
            <li>Pricing and negotiation guidance informed by current and historical comparables.</li>
            <li>Risk evaluation across product type, timing, and long-term neighborhood dynamics.</li>
            <li>Decision support for portfolio expansion and capital allocation planning.</li>
          </ul>
        </section>

        <section className="pt-8 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            To discuss your objectives, reach out through our
            <Link href="/contact" className="text-[#012169] font-medium ml-1">
              contact page
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyAdvisoryPage;
