import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Cookie Policy</h1>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">What Cookies Are</h2>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files placed on your device when you visit a website. They help websites
            remember preferences, improve functionality, and understand usage patterns.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">How Cheru Uses Them</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies to support core platform functionality, maintain session reliability, and analyze
            aggregate usage trends so we can improve performance and user experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">User Control</h2>
          <p className="text-gray-700 leading-relaxed">
            You can manage or disable cookies through your browser settings. Please note that certain
            platform features may not perform as expected if cookies are restricted.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;
