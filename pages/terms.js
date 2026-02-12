import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Terms of Use</h1>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Platform Use</h2>
          <p className="text-gray-700 leading-relaxed">
            By using Cheru, you agree to use the platform lawfully and responsibly. You may not misuse the
            service, interfere with operations, or attempt unauthorized access to systems or data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Accuracy Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            While we aim for accuracy and timely updates, market information may change and may not be
            complete at all times. Platform content is provided for general information and should not be
            treated as a substitute for professional advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            Content, design elements, data presentation, and related materials on Cheru are protected by
            intellectual property rights. Unauthorized copying, distribution, or commercial use is
            prohibited without written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Cheru is not liable for direct or indirect losses arising from reliance on platform content,
            temporary service interruptions, or third-party links and services. Use of the platform is at
            your own discretion.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
