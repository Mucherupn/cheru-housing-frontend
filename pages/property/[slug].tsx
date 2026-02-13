import { GetServerSideProps } from "next";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type PropertyDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sale_price: number | null;
  rent_price: number | null;
  location_name: string;
  featured_image: string | null;
};

type Props = { property: PropertyDetail | null };

type LeadPayload = {
  interest_type: "Buying this property" | "Renting this property";
  timeline: "Immediately" | "Within 1 month" | "Within 3 months" | "Just researching";
  phone: string;
  name: string;
  email: string;
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data } = await supabase
    .from("properties")
    .select("id,title,slug,description,sale_price,rent_price,location:locations(name),property_images(url,is_featured)")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return { props: { property: null } };

  const featuredImage = data.property_images?.find((image: any) => image.is_featured)?.url ?? data.property_images?.[0]?.url ?? null;

  return {
    props: {
      property: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        sale_price: data.sale_price,
        rent_price: data.rent_price,
        location_name: data.location?.name ?? "",
        featured_image: featuredImage,
      },
    },
  };
};

export default function PropertyDetailPage({ property }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<LeadPayload>({
    interest_type: "Buying this property",
    timeline: "Immediately",
    phone: "",
    name: "",
    email: "",
  });

  if (!property) return <div className="min-h-screen bg-slate-950 text-white">Property not found.</div>;

  const title = `${property.title} | Premium Property | CHERU`;
  const description = `Discover ${property.title} in ${property.location_name}. Sale and rental details, market-ready insights, and direct advisory support.`;

  const submitLead = async () => {
    setSubmitting(true);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: property.id,
        property_title: property.title,
        interest_type: form.interest_type,
        timeline: form.timeline,
        phone: form.phone,
        name: form.name || null,
        email: form.email || null,
      }),
    });

    setSubmitting(false);
    if (response.ok) {
      setSuccess(true);
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <Navbar />

      <section className="relative">
        <div className="h-[56vh] bg-slate-800">
          {property.featured_image ? (
            <img src={property.featured_image} alt={property.title} className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-8 left-1/2 w-full max-w-6xl -translate-x-1/2 px-4">
          <h1 className="text-4xl font-semibold sm:text-5xl">{property.title}</h1>
          <div className="mt-3 flex flex-wrap gap-6 text-lg text-slate-200">
            <p>Sale: {property.sale_price ? currency.format(property.sale_price) : "N/A"}</p>
            <p>Rent: {property.rent_price ? currency.format(property.rent_price) : "N/A"}</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900">Express Interest</button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-semibold">Property Details</h2>
        <p className="mt-5 leading-8 text-slate-300">{property.description ?? "Property description will be shared by our advisory team."}</p>
      </section>

      <button onClick={() => setModalOpen(true)} className="fixed bottom-4 left-4 right-4 z-30 rounded-full bg-white py-3 text-sm font-semibold text-slate-900 sm:hidden">Express Interest</button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900">
            <button onClick={() => { setModalOpen(false); setSuccess(false); }} className="ml-auto block text-sm text-slate-500">Close</button>
            {!success ? (
              <>
                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold">What are you interested in?</h3>
                    <div className="mt-4 grid gap-3">
                      {["Buying this property", "Renting this property"].map((option) => (
                        <button key={option} onClick={() => { setForm({ ...form, interest_type: option as LeadPayload["interest_type"] }); setStep(2); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-400">{option}</button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold">When would you like to proceed?</h3>
                    <div className="mt-4 grid gap-3">
                      {(["Immediately", "Within 1 month", "Within 3 months", "Just researching"] as LeadPayload["timeline"][]).map((option) => (
                        <button key={option} onClick={() => { setForm({ ...form, timeline: option }); setStep(3); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-400">{option}</button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Contact details</h3>
                    <input required placeholder="Phone number *" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    <input placeholder="Name (optional)" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    <input placeholder="Working with a budget? (optional email/budget note)" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
                    <button disabled={submitting || !form.phone} onClick={submitLead} className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white disabled:bg-slate-500">{submitting ? "Submitting..." : "Submit"}</button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-10 text-center">
                <h3 className="text-2xl font-semibold">Success</h3>
                <p className="mt-3 text-slate-600">Our team will contact you shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
