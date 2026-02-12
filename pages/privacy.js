import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Privacy Policy</h1>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We may collect personal information you provide directly, including contact details, inquiry
            content, and information submitted through forms. We also collect limited technical usage data
            to improve platform performance and security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">How We Use It</h2>
          <p className="text-gray-700 leading-relaxed">
            Information is used to respond to inquiries, deliver requested services, improve user
            experience, and maintain platform integrity. We do not use personal data in ways that are
            inconsistent with this policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            Cheru applies reasonable administrative and technical safeguards to protect personal data from
            unauthorized access, misuse, or disclosure. Access is limited to authorized personnel with a
            legitimate business need.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Privacy Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            For privacy concerns or requests regarding your data, contact
            <a className="text-[#012169] font-medium ml-1" href="mailto:privacy@cheru.co.ke">
              privacy@cheru.co.ke
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
