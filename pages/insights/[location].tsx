import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type PropertyCard = {
  id: string;
  slug: string;
  title: string;
  sale_price: number | null;
  rent_price: number | null;
  featured_image: string | null;
};

type LocationData = {
  id: string;
  name: string;
  slug: string;
};

type Snapshot = {
  avgSalePrice: number;
  avgRentPrice: number;
  highestSalePrice: number;
  lowestSalePrice: number;
  totalListings: number;
};

type PageProps = {
  location: LocationData | null;
  properties: PropertyCard[];
  snapshot: Snapshot;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatPrice = (value: number | null) => (value ? currency.format(value) : "N/A");

const buildJsonLd = (locationName: string, properties: PropertyCard[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Insights",
          item: "https://cheru.io/insights",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locationName,
          item: `https://cheru.io/insights/${locationName.toLowerCase().replace(/\s+/g, "-")}`,
        },
      ],
    },
    ...properties.slice(0, 5).map((property) => ({
      "@type": "RealEstateListing",
      name: property.title,
      url: `https://cheru.io/property/${property.slug}`,
      image: property.featured_image ?? undefined,
      offers: {
        "@type": "Offer",
        price: property.sale_price ?? property.rent_price ?? 0,
        priceCurrency: "USD",
      },
      areaServed: locationName,
    })),
  ],
});

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ params }) => {
  const locationSlug = typeof params?.location === "string" ? params.location : "";
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: location } = await supabase
    .from("locations")
    .select("id,name")
    .ilike("name", locationSlug.replace(/-/g, " "))
    .maybeSingle();

  if (!location?.id) {
    return {
      props: {
        location: null,
        properties: [],
        snapshot: {
          avgSalePrice: 0,
          avgRentPrice: 0,
          highestSalePrice: 0,
          lowestSalePrice: 0,
          totalListings: 0,
        },
      },
    };
  }

  const { data: propertiesRaw } = await supabase
    .from("properties")
    .select("id,title,slug,sale_price,rent_price,property_images(url,is_featured)")
    .eq("location_id", location.id)
    .order("sale_price", { ascending: false });

  const properties: PropertyCard[] = (propertiesRaw ?? []).map((property: any) => {
    const featured = (property.property_images ?? []).find((img: any) => img.is_featured) ?? property.property_images?.[0];
    return {
      id: property.id,
      slug: property.slug,
      title: property.title,
      sale_price: property.sale_price,
      rent_price: property.rent_price,
      featured_image: featured?.url ?? null,
    };
  });

  const salePrices = properties.map((p) => p.sale_price).filter((price): price is number => !!price && price > 0);
  const rentPrices = properties.map((p) => p.rent_price).filter((price): price is number => !!price && price > 0);

  const snapshot: Snapshot = {
    avgSalePrice: salePrices.length ? Math.round(salePrices.reduce((a, b) => a + b, 0) / salePrices.length) : 0,
    avgRentPrice: rentPrices.length ? Math.round(rentPrices.reduce((a, b) => a + b, 0) / rentPrices.length) : 0,
    highestSalePrice: salePrices.length ? Math.max(...salePrices) : 0,
    lowestSalePrice: salePrices.length ? Math.min(...salePrices) : 0,
    totalListings: properties.length,
  };

  return {
    props: {
      location: { id: location.id, name: location.name, slug: locationSlug },
      properties,
      snapshot,
    },
  };
};

export default function LocationInsightsPage({ location, properties, snapshot }: PageProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredProperties = useMemo(() => {
    if (!query.trim()) return properties;
    return properties.filter((property) => property.title.toLowerCase().includes(query.toLowerCase()));
  }, [properties, query]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const title = `${location?.name ?? "Location"} Real Estate Market Insights 2026`;
  const description = `Explore property prices, homes for sale, and rental trends in ${location?.name ?? "this location"}.`;
  const jsonLd = buildJsonLd(location?.name ?? "Location", filteredProperties);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <Navbar />

      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl animate-fadeUp">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-slate-300">Institutional-grade intelligence for pricing, inventory, and demand signals across {location?.name ?? "this market"}.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5 sm:px-6 lg:px-8">
        {[
          ["Avg Sale Price", formatPrice(snapshot.avgSalePrice)],
          ["Avg Rent", formatPrice(snapshot.avgRentPrice)],
          ["Entry Price", formatPrice(snapshot.lowestSalePrice)],
          ["Premium Tier Price", formatPrice(snapshot.highestSalePrice)],
          ["Total Listings", snapshot.totalListings.toString()],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">Premium Listings</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search within this location"
            className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-slate-400 focus:border-white/30 focus:outline-none sm:w-96"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProperties.map((property) => (
              <div key={property.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50">
                <Link href={`/property/${property.slug}`}>
                  <div className="relative h-64 overflow-hidden bg-slate-800">
                    {property.featured_image ? (
                      <img src={property.featured_image} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">No image available</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">{formatPrice(property.sale_price ?? property.rent_price)}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-white">{property.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        {visibleCount < filteredProperties.length && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => setVisibleCount((count) => count + 4)} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              View More Listings
            </button>
          </div>
        )}
      </section>

      <Footer />
      <style jsx>{`
        .animate-fadeUp {
          animation: fadeUp 0.8s ease-out;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
