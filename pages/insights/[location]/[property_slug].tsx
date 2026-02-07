import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

type InsightProperty = {
  id: number;
  title: string;
  slug: string;
  location_id: number;
  property_type?: string | null;
  description?: string | null;
  asking_price_min?: number | null;
  asking_price_max?: number | null;
  rent_price_min?: number | null;
  rent_price_max?: number | null;
  year_built?: number | null;
  total_units?: number | null;
  unit_types?: string[] | string | null;
  size_range?: string | null;
  developer?: string | null;
  parking_ratio?: string | null;
};

type InsightImage = {
  id: number;
  property_id: number;
  image_url: string;
  is_featured?: boolean | null;
};

type AreaArticle = {
  id: number;
  title: string;
  slug: string;
  image_url?: string | null;
};

type AreaArticleDetail = AreaArticle & {
  excerpt?: string | null;
  content?: string | null;
  created_at?: string | null;
};

type LocationInfo = {
  id: number;
  name: string;
  slug: string;
};

const toTitleCase = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatRange = (min?: number | null, max?: number | null) => {
  if (min && max) return `${formatCurrency(min)} – ${formatCurrency(max)}`;
  if (min) return `${formatCurrency(min)}+`;
  if (max) return `Up to ${formatCurrency(max)}`;
  return "Available on request";
};

const normalizeList = (value?: string[] | string | null) => {
  if (!value) return "Available on request";
  if (Array.isArray(value)) return value.join(", ");
  return value;
};

const PropertyInsightsPage = () => {
  const router = useRouter();
  const locationSlug = typeof router.query.location === "string" ? router.query.location : "";
  const propertySlug =
    typeof router.query.property_slug === "string" ? router.query.property_slug : "";

  const [property, setProperty] = useState<InsightProperty | null>(null);
  const [images, setImages] = useState<InsightImage[]>([]);
  const [articles, setArticles] = useState<AreaArticle[]>([]);
  const [article, setArticle] = useState<AreaArticleDetail | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    interest_type: "Buy",
    timeline: "Immediately",
    contact: "",
    message: "",
  });

  useEffect(() => {
    if (!propertySlug) return;

    const fetchPropertyInsights = async () => {
      setLoading(true);
      const response = await fetch(`/api/insights/${encodeURIComponent(propertySlug)}`);

      if (response.ok) {
        const data = await response.json();
        setProperty(data.property ?? null);
        setImages(data.images ?? []);
        setArticles(data.articles ?? []);
        setLocation(data.location ?? null);
        setArticle(data.article ?? null);
      } else {
        setProperty(null);
        setImages([]);
        setArticles([]);
        setLocation(null);
        setArticle(null);
      }

      setLoading(false);
    };

    fetchPropertyInsights();
  }, [propertySlug]);

  const galleryImages = useMemo(() => {
    if (images.length === 0) return [];
    const featured = images.filter((image) => image.is_featured);
    const others = images.filter((image) => !image.is_featured);
    return [...featured, ...others];
  }, [images]);

  useEffect(() => {
    if (activeIndex >= galleryImages.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, galleryImages.length]);

  const locationLabel = location?.name || (locationSlug ? toTitleCase(locationSlug) : "Location");

  const metaDescription = property?.description
    ? property.description.slice(0, 160)
    : article?.excerpt || article?.content?.slice(0, 160) ||
      `Explore intelligence, pricing insights, and development details for ${locationLabel}.`;

  const sliderArticles = useMemo(() => {
    if (articles.length === 0) return [] as AreaArticle[];
    return [...articles, ...articles];
  }, [articles]);

  const handleSubmitInterest = async () => {
    if (!property?.id) return;

    setSubmitting(true);
    setSubmitMessage(null);

    const response = await fetch("/api/property-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: property.id,
        interest_type: formState.interest_type,
        timeline: formState.timeline,
        contact: formState.contact,
        message: formState.message,
      }),
    });

    if (response.ok) {
      setSubmitMessage("Thank you. Our insights team will reach out shortly.");
      setFormState({
        interest_type: "Buy",
        timeline: "Immediately",
        contact: "",
        message: "",
      });
    } else {
      setSubmitMessage("Unable to submit your interest. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Head>
        <title>{`${property?.title ?? article?.title ?? locationLabel} ${locationLabel} Property Insights | Cheru`}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <Navbar />

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
          <Link href="/insights" className="hover:text-[#012169]">
            Insights
          </Link>
          <span>/</span>
          <Link href={`/insights/${locationSlug}`} className="hover:text-[#012169]">
            {locationLabel}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-[#F9FAFB] p-10 text-center text-[#6B7280]">
            Loading property intelligence...
          </div>
        ) : !property && article ? (
          <article className="rounded-3xl border border-gray-100 bg-white shadow-sm">
            {article.image_url && (
              <div className="h-[320px] w-full overflow-hidden rounded-t-3xl bg-[#F3F4F6]">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="px-6 py-8">
              <p className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
                Area Briefing
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-[#0B1220]">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-4 text-base text-[#4B5563]">{article.excerpt}</p>
              )}
              <div className="mt-6 text-base leading-relaxed text-[#4B5563]">
                {article.content ?? "Full article insights are being prepared."}
              </div>
            </div>
          </article>
        ) : !property ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-[#F9FAFB] p-10 text-center text-[#6B7280]">
            Insights for this property are coming soon.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="relative overflow-hidden rounded-3xl bg-[#F3F4F6]">
              {galleryImages.length > 0 ? (
                <div className="relative h-[360px] w-full sm:h-[420px]">
                  <img
                    src={galleryImages[activeIndex]?.image_url}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                  {galleryImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <button
                        type="button"
                        className="rounded-full bg-white/80 p-3 text-sm font-semibold text-[#012169] shadow"
                        onClick={() =>
                          setActiveIndex((prev) =>
                            prev === 0 ? galleryImages.length - 1 : prev - 1
                          )
                        }
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-white/80 p-3 text-sm font-semibold text-[#012169] shadow"
                        onClick={() =>
                          setActiveIndex((prev) =>
                            prev === galleryImages.length - 1 ? 0 : prev + 1
                          )
                        }
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[320px] items-center justify-center text-[#9CA3AF]">
                  Gallery coming soon
                </div>
              )}

              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto bg-white/90 px-6 py-4">
                  {galleryImages.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={`relative h-16 w-24 overflow-hidden rounded-2xl border transition ${
                        index === activeIndex
                          ? "border-[#012169]"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <img
                        src={image.image_url}
                        alt={`${property.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
                Property Intelligence
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#0B1220]">
                {property.title}
              </h1>
              <p className="text-base text-[#4B5563]">
                {locationLabel} • {property.property_type ?? "Premium Development"}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-[#0B1220]">Property Intelligence</h2>
              </div>
              <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Property Type</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {property.property_type ?? "Available on request"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Asking Price Range</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {formatRange(property.asking_price_min, property.asking_price_max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Rental Price Range</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {formatRange(property.rent_price_min, property.rent_price_max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Year Built</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {property.year_built ?? "Available on request"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Total Units</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {property.total_units ?? "Available on request"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Unit Types</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {normalizeList(property.unit_types)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Size Range</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {property.size_range ?? "Available on request"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Developer</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {property.developer ?? "Available on request"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Parking Ratio</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {property.parking_ratio ?? "Available on request"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Key Amenities</p>
                  <p className="mt-2 text-sm text-[#0B1220]">
                    {normalizeList(property.unit_types)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0B1220]">Overview</h2>
              <p className="mt-4 text-base leading-relaxed text-[#4B5563]">
                {property.description ??
                  "Detailed overview of this premium residence will be published soon."}
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-6 py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
                    Express Interest
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#0B1220]">
                    Receive tailored pricing guidance and availability intelligence.
                  </h3>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Our advisory team will respond with the latest market context.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInterestModal(true)}
                  className="rounded-full bg-[#012169] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#021F4A]"
                >
                  Express Interest
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0B1220]">Related Articles</h2>
              {articles.length === 0 ? (
                <p className="mt-4 text-sm text-[#6B7280]">
                  Related insights will be published soon.
                </p>
              ) : (
                <div className="mt-6 overflow-hidden">
                  <div className="article-track flex gap-6" aria-label="Related articles">
                    {sliderArticles.map((article, index) => (
                      <Link
                        key={`${article.id}-${index}`}
                        href={`/insights/${locationSlug}/${article.slug}`}
                        className="group min-w-[220px] max-w-[280px] overflow-hidden rounded-2xl bg-[#F9FAFB] transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="h-36 w-full bg-[#E5E7EB]">
                          {article.image_url ? (
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#9CA3AF]">
                              Image coming soon
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-[#0B1220]">
                            {article.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer />

      {showInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
                  Express Interest
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#0B1220]">
                  {property?.title}
                </h3>
              </div>
              <button
                type="button"
                className="text-sm text-[#9CA3AF]"
                onClick={() => setShowInterestModal(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="text-sm text-[#4B5563]">
                Interest type
                <select
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm"
                  value={formState.interest_type}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      interest_type: event.target.value,
                    }))
                  }
                >
                  <option>Buy</option>
                  <option>Rent</option>
                  <option>Both</option>
                </select>
              </label>

              <label className="text-sm text-[#4B5563]">
                Timeline
                <select
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm"
                  value={formState.timeline}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      timeline: event.target.value,
                    }))
                  }
                >
                  <option>Immediately</option>
                  <option>Within 3 months</option>
                  <option>Within 6 months</option>
                  <option>Just exploring</option>
                </select>
              </label>

              <label className="text-sm text-[#4B5563]">
                Phone or email
                <input
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm"
                  value={formState.contact}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, contact: event.target.value }))
                  }
                  placeholder="+254 700 000 000 or name@email.com"
                  required
                />
              </label>

              <label className="text-sm text-[#4B5563]">
                Optional message
                <textarea
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm"
                  rows={4}
                  value={formState.message}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, message: event.target.value }))
                  }
                  placeholder="Tell us what matters most."
                />
              </label>

              {submitMessage && (
                <p className="rounded-2xl bg-[#EEF2FF] px-4 py-3 text-sm text-[#1E3A8A]">
                  {submitMessage}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmitInterest}
                disabled={submitting || !formState.contact}
                className="rounded-full bg-[#012169] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#021F4A] disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
              >
                {submitting ? "Submitting..." : "Send Interest"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .article-track {
          animation: insightsScroll 40s linear infinite;
        }

        .article-track:hover {
          animation-play-state: paused;
        }

        @keyframes insightsScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyInsightsPage;
