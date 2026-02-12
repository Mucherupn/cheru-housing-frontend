import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Careers</h1>
          <p className="text-gray-700 leading-relaxed">
            Cheru is building a new kind of real estate intelligence company for Nairobi: rigorous,
            thoughtful, and focused on long-term value. We are a small team that cares deeply about
            quality, clarity, and meaningful outcomes for our clients.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We hire selectively and intentionally. If you are an ambitious builder, analyst, or operator
            who thrives in high-ownership environments and believes in disciplined execution, we would like
            to hear from you.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Opportunities</h2>
          <p className="text-gray-700 leading-relaxed">
            Send your profile and a concise note on why you want to build with Cheru to
            <a className="text-[#012169] font-medium ml-1" href="mailto:careers@cheru.co.ke">
              careers@cheru.co.ke
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
