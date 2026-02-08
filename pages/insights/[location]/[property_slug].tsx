import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

type InsightEntry = {
  id: string;
  title: string;
  content?: string | null;
  year?: number | null;
  location_id?: string | null;
};

type AreaArticle = {
  id: number;
  title: string;
  slug: string;
  featured_image?: string | null;
};

type AreaArticleDetail = AreaArticle & {
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

const formatYear = (value?: number | null) => {
  if (!value) return "Latest briefing";
  return `Year ${value}`;
};

const PropertyInsightsPage = () => {
  const router = useRouter();
  const locationSlug = typeof router.query.location === "string" ? router.query.location : "";
  const propertySlug =
    typeof router.query.property_slug === "string" ? router.query.property_slug : "";

  const [insight, setInsight] = useState<InsightEntry | null>(null);
  const [articles, setArticles] = useState<AreaArticle[]>([]);
  const [article, setArticle] = useState<AreaArticleDetail | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
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
        setInsight(data.insight ?? null);
        setArticles(data.articles ?? []);
        setLocation(data.location ?? null);
        setArticle(data.article ?? null);
      } else {
        setInsight(null);
        setArticles([]);
        setLocation(null);
        setArticle(null);
      }

      setLoading(false);
    };

    fetchPropertyInsights();
  }, [propertySlug]);

  const locationLabel = location?.name || (locationSlug ? toTitleCase(locationSlug) : "Location");

  const metaDescription = insight?.content
    ? insight.content.slice(0, 160)
    : article?.content?.slice(0, 160) ||
      `Explore intelligence, pricing insights, and development details for ${locationLabel}.`;

  const sliderArticles = useMemo(() => {
    if (articles.length === 0) return [] as AreaArticle[];
    return [...articles, ...articles];
  }, [articles]);

  const handleSubmitInterest = async () => {
    if (!insight?.id) return;

    setSubmitting(true);
    setSubmitMessage(null);

    const response = await fetch("/api/property-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: insight.id,
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
        <title>{`${insight?.title ?? article?.title ?? locationLabel} ${locationLabel} Property Insights | Cheru`}</title>
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
            Loading market briefing...
          </div>
        ) : !insight && article ? (
          <article className="rounded-3xl border border-gray-100 bg-white shadow-sm">
            {article.featured_image && (
              <div className="h-[320px] w-full overflow-hidden rounded-t-3xl bg-[#F3F4F6]">
                <img
                  src={article.featured_image}
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
              <div className="mt-6 text-base leading-relaxed text-[#4B5563]">
                {article.content ?? "Full article insights are being prepared."}
              </div>
            </div>
          </article>
        ) : !insight ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-[#F9FAFB] p-10 text-center text-[#6B7280]">
            Insights for this area are coming soon.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
              <span className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
                Market Insight
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-[#0B1220]">
                {insight.title}
              </h1>
              <p className="mt-2 text-sm text-[#6B7280]">
                {locationLabel} • {formatYear(insight.year)}
              </p>
              <p className="mt-6 text-base leading-relaxed text-[#4B5563]">
                {insight.content ??
                  "Detailed insights for this market are being prepared."}
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
                          {article.featured_image ? (
                            <img
                              src={article.featured_image}
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
                  {insight?.title ?? "Market Insight"}
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
