import "../styles/globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const steps = [
  {
    title: "Strategic valuation",
    description: "Data-backed pricing aligned with Nairobi market demand.",
  },
  {
    title: "Curated marketing",
    description: "Premium storytelling and targeted buyer outreach.",
  },
  {
    title: "White-glove support",
    description: "End-to-end guidance from listing to closing.",
  },
];

const ListWithCheru = () => {
  return (
    <div className="min-h-screen bg-black text-[#0B1220]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            List with Cheru
          </h1>
          <p className="max-w-2xl text-base text-[#4B5563]">
            Partner with Nairobi&apos;s most discerning housing reference for a
            seamless listing experience.
          </p>
          <button className="rounded-xl bg-[#012169] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012169]/90">
            Schedule a consultation
          </button>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-white/10 bg-[#111418] p-6 text-white"
            >
              <h2 className="text-xl font-semibold text-[#012169]">
                {step.title}
              </h2>
              <p className="mt-3 text-sm text-[#4B5563]">
                {step.description}
              </p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ListWithCheru;
