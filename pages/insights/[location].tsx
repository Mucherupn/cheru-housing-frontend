import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type InsightProperty = {
  id: number;
  title: string;
  slug: string;
  location_id: number;
  property_type?: string | null;
  description?: string | null;
  unit_types?: string[] | string | null;
  developer?: string | null;
  parking_ratio?: string | null;
  featured_image?: string | null;
};

type AreaArticle = {
  id: number;
  title: string;
  slug: string;
  image_url?: string | null;
  excerpt?: string | null;
};

const toTitleCase = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeAmenityList = (value?: string[] | string | null) => {
  if (!value) return [] as string[];
  if (Array.isArray(value)) return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const fallbackAmenities = ["Concierge", "Parking", "Security", "Lifestyle"]; 

const LocationInsightsPage = () => {
  const router = useRouter();
  const locationSlug = typeof router.query.location === "string" ? router.query.location : "";
  const [properties, setProperties] = useState<InsightProperty[]>([]);
  const [articles, setArticles] = useState<AreaArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const locationLabel = useMemo(
    () => (locationSlug ? toTitleCase(locationSlug) : "Your Area"),
    [locationSlug]
  );

  useEffect(() => {
    if (!locationSlug) return;

    const fetchInsights = async () => {
      setLoading(true);
      const response = await fetch(`/api/insights?location=${encodeURIComponent(locationSlug)}`);

      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties ?? []);
        setArticles(data.articles ?? []);
      } else {
        setProperties([]);
        setArticles([]);
      }

      setLoading(false);
    };

    fetchInsights();
  }, [locationSlug]);

  const sliderArticles = useMemo(() => {
    if (articles.length === 0) return [] as AreaArticle[];
    return [...articles, ...articles];
  }, [articles]);

  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Head>
        <title>{`${locationLabel} Property Insights | Cheru`}</title>
        <meta
          name="description"
          content={`Explore property insights, developments, and real estate data in ${locationLabel}.`}
        />
      </Head>

      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <span className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
            Area Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#012169]">
            {locationLabel} Property Insights
          </h1>
          <p className="max-w-3xl text-base sm:text-lg text-[#4B5563]">
            Explore premium intelligence on every known residence, emerging developments, and
            curated market narratives for {locationLabel}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#0B1220]">Featured Properties</h2>
          {loading && (
            <span className="text-sm text-[#9CA3AF]">Loading insights...</span>
          )}
        </div>

        {properties.length === 0 && !loading ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-[#F9FAFB] p-10 text-center">
            <p className="text-base text-[#6B7280]">
              Insights for this area are coming soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const amenities = normalizeAmenityList(property.unit_types);
              const displayAmenities =
                amenities.length > 0 ? amenities.slice(0, 4) : fallbackAmenities;
              const description = property.description?.slice(0, 110) ?? "";

              return (
                <Link
                  key={property.id}
                  href={`/insights/${locationSlug}/${property.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-[#F3F4F6]">
                    {property.featured_image ? (
                      <img
                        src={property.featured_image}
                        alt={property.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-[#9CA3AF]">
                        Image coming soon
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
                        {property.property_type ?? "Premium Residence"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[#0B1220]">
                        {property.title}
                      </h3>
                      <p className="mt-3 text-sm text-[#6B7280]">
                        {description || "Intelligence report pending."}
                      </p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-3">
                      {displayAmenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-[#0B1220]"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-semibold text-[#012169]">
                            {amenity.slice(0, 1).toUpperCase()}
                          </span>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-[#F9FAFB] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            <span className="text-sm uppercase tracking-[0.2em] text-[#9CA3AF]">
              Area Briefings
            </span>
            <h2 className="text-2xl font-semibold text-[#0B1220]">
              {locationLabel} Articles
            </h2>
            <p className="max-w-2xl text-base text-[#6B7280]">
              Curated research, development signals, and market commentary tailored to this area.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-[#6B7280]">Articles will be published soon.</p>
            </div>
          ) : (
            <div className="mt-10 overflow-hidden">
              <div className="article-track flex gap-6" aria-label="Area articles">
                {sliderArticles.map((article, index) => (
                  <Link
                    key={`${article.id}-${index}`}
                    href={`/insights/${locationSlug}/${article.slug}`}
                    className="group min-w-[260px] max-w-[320px] overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-40 w-full bg-[#F3F4F6]">
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
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-[#0B1220]">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-xs text-[#6B7280]">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

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

export default LocationInsightsPage;
