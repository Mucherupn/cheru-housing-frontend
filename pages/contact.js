import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#012169]">Contact</h1>
          <p className="text-gray-700 leading-relaxed">
            For inquiries, advisory conversations, and platform support, our team is available to help.
          </p>
        </section>

        <section className="border border-gray-200 bg-white">
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="p-8 space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Office Location</h2>
              <p className="text-gray-700 leading-relaxed">Karen, Nairobi</p>
            </div>
            <div className="p-8 space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Email</h2>
              <a className="text-gray-700 leading-relaxed hover:text-[#012169]" href="mailto:info@cheru.co.ke">
                info@cheru.co.ke
              </a>
            </div>
            <div className="p-8 space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Phone</h2>
              <a className="text-gray-700 leading-relaxed hover:text-[#012169]" href="tel:0722423005">
                0722 423 005
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
