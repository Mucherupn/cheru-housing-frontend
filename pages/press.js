import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PressPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Press</h1>
          <p className="text-gray-700 leading-relaxed">
            Cheru provides data-driven market intelligence on Nairobi residential property. Our work is
            built for decision-makers who need clear, contextual insights rather than broad assumptions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We welcome media partnerships focused on market structure, area trends, pricing behavior, and
            informed housing conversations across Nairobi.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Press Inquiries</h2>
          <p className="text-gray-700 leading-relaxed">
            For interviews, commentary, data requests, and partnership conversations, contact
            <a className="text-[#012169] font-medium ml-1" href="mailto:press@cheru.co.ke">
              press@cheru.co.ke
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PressPage;
