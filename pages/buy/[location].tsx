import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url?: string | null;
  property_type?: string | null;
};

type RecommendedProperty = {
  id: number;
  title: string;
  location: string;
  price: number;
  image_url?: string | null;
};

type FiltersState = {
  location: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  size: string;
  sort: string;
};

const PRICE_RANGES = {
  "": { label: "Price Range", min: undefined, max: undefined },
  "below-5m": { label: "Below 5M", min: undefined, max: 5_000_000 },
  "5m-15m": { label: "5M – 15M", min: 5_000_000, max: 15_000_000 },
  "15m-30m": { label: "15M – 30M", min: 15_000_000, max: 30_000_000 },
  "30m-60m": { label: "30M – 60M", min: 30_000_000, max: 60_000_000 },
  "60m-100m": { label: "60M – 100M", min: 60_000_000, max: 100_000_000 },
  "100m-150m": { label: "100M – 150M", min: 100_000_000, max: 150_000_000 },
  "150m-plus": { label: "150M+", min: 150_000_000, max: undefined },
};

const ACRE_IN_SQM = 4046.86;

const LAND_SIZE_RANGES = {
  "": { label: "Size", min: undefined, max: undefined },
  "quarter-and-below": {
    label: "1/4 acre and below",
    min: undefined,
    max: 0.25 * ACRE_IN_SQM,
  },
  "half-acre": {
    label: "1/2 acre",
    min: 0.25 * ACRE_IN_SQM,
    max: 0.5 * ACRE_IN_SQM,
  },
  "one-acre": {
    label: "1 acre",
    min: 0.5 * ACRE_IN_SQM,
    max: 1 * ACRE_IN_SQM,
  },
  "two-acres": {
    label: "2 acres",
    min: 1 * ACRE_IN_SQM,
    max: 2 * ACRE_IN_SQM,
  },
  "three-plus": {
    label: "3+ acres",
    min: 3 * ACRE_IN_SQM,
    max: undefined,
  },
};

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const createSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const getLocationFromQuery = (value: string) =>
  decodeURIComponent(value).replace(/-/g, " ").trim();

export default function BuyLocationPage() {
  const router = useRouter();
  const [results, setResults] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<RecommendedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    location: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    size: "",
    sort: "newest",
  });

  const formattedLocation = useMemo(() => {
    if (!router.isReady) return "";
    const locationParam = router.query.location;
    if (!locationParam || Array.isArray(locationParam)) return "";
    return toTitleCase(getLocationFromQuery(locationParam));
  }, [router.isReady, router.query.location]);

  const pageTitle = formattedLocation
    ? `Buy homes in ${formattedLocation} | Cheru Housing`
    : "Buy premium homes | Cheru Housing";

  const pageDescription = formattedLocation
    ? `Explore premium homes for sale in ${formattedLocation}. Filter by price, bedrooms, bathrooms, and area with Cheru Housing.`
    : "Explore premium homes for sale across Nairobi. Filter by price, bedrooms, bathrooms, and area with Cheru Housing.";

  useEffect(() => {
    if (!router.isReady) return;

    const queryLocation =
      typeof router.query.location === "string"
        ? getLocationFromQuery(router.query.location)
        : "";

    const queryType = typeof router.query.type === "string" ? router.query.type : "";
    const queryBedrooms =
      typeof router.query.bedrooms === "string" ? router.query.bedrooms : "";
    const queryBathrooms =
      typeof router.query.bathrooms === "string" ? router.query.bathrooms : "";
    const queryPrice = typeof router.query.price === "string" ? router.query.price : "";
    const querySize = typeof router.query.size === "string" ? router.query.size : "";
    const querySort = typeof router.query.sort === "string" ? router.query.sort : "newest";

    const matchedPriceRange = queryPrice in PRICE_RANGES ? queryPrice : "";
    const matchedSizeRange = querySize in LAND_SIZE_RANGES ? querySize : "";

    const isLandType = queryType.toLowerCase() === "land";

    setFilters({
      location: queryLocation || formattedLocation,
      type: queryType,
      bedrooms: isLandType ? "" : queryBedrooms,
      bathrooms: isLandType ? "" : queryBathrooms,
      price: matchedPriceRange,
      size: isLandType ? matchedSizeRange : "",
      sort: querySort,
    });
  }, [router.isReady, router.query, formattedLocation]);

  const fetchResults = async (activeFilters: FiltersState) => {
    // Fetch properties from the search API based on filters and location.
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      const locationValue = activeFilters.location.trim();

      if (locationValue) {
        params.set("location", locationValue);
      }

      if (activeFilters.type) {
        params.set("type", activeFilters.type);
      }

      if (activeFilters.bedrooms) {
        params.set("bedrooms", activeFilters.bedrooms);
      }

      if (activeFilters.bathrooms) {
        params.set("bathrooms", activeFilters.bathrooms);
      }

      const priceRange = PRICE_RANGES[activeFilters.price];
      if (priceRange?.min !== undefined) {
        params.set("minPrice", String(priceRange.min));
      }
      if (priceRange?.max !== undefined) {
        params.set("maxPrice", String(priceRange.max));
      }

      const sizeRange = LAND_SIZE_RANGES[activeFilters.size];
      if (sizeRange?.min !== undefined) {
        params.set("minArea", String(Math.round(sizeRange.min)));
      }
      if (sizeRange?.max !== undefined) {
        params.set("maxArea", String(Math.round(sizeRange.max)));
      }

      params.set("status", "buy");

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("We couldn't load listings right now.");
      }

      const data = (await response.json()) as Property[];

      setResults(Array.isArray(data) ? data : []);
      setRecommended(
        Array.isArray(data)
          ? data
              .slice(0, 3)
              .map(({ id, title, location, price, image_url }) => ({
                id,
                title,
                location,
                price,
                image_url,
              }))
          : []
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load listings.");
      setResults([]);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!filters.location && !formattedLocation) return;

    fetchResults(filters);
  }, [router.isReady, filters, formattedLocation]);

  const handleFilterChange = (field: keyof FiltersState, value: string) => {
    setFilters((prev) => {
      if (field === "type") {
        const nextType = value;
        const isLand = nextType.toLowerCase() === "land";
        return {
          ...prev,
          type: nextType,
          bedrooms: isLand ? "" : prev.bedrooms,
          bathrooms: isLand ? "" : prev.bathrooms,
          size: isLand ? prev.size : "",
        };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleApplyFilters = () => {
    // Update the URL to keep filters shareable and SEO-friendly.
    const slug = filters.location ? createSlug(filters.location) : "";
    if (!slug) return;

    const queryParams: Record<string, string> = {};

    if (filters.type) queryParams.type = filters.type;
    if (filters.bedrooms) queryParams.bedrooms = filters.bedrooms;
    if (filters.bathrooms) queryParams.bathrooms = filters.bathrooms;
    if (filters.price) queryParams.price = filters.price;
    if (filters.size) queryParams.size = filters.size;
    if (filters.sort && filters.sort !== "newest") queryParams.sort = filters.sort;

    router.push({ pathname: `/buy/${slug}`, query: queryParams }, undefined, {
      shallow: true,
    });
  };

  const filterInput =
    "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 focus:border-[#012169] focus:outline-none focus:ring-2 focus:ring-[#012169]/20";
  const isLand = filters.type.toLowerCase() === "land";

  const sortedResults = useMemo(() => {
    const ordered = [...results];

    if (filters.sort === "price-asc") {
      ordered.sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "price-desc") {
      ordered.sort((a, b) => b.price - a.price);
    }

    return ordered;
  }, [filters.sort, results]);

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#0B1220]">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <Navbar />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#012169]">
            Buy with confidence
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
            {formattedLocation
              ? `Homes for sale in ${formattedLocation}`
              : "Find your next premium home"}
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Filter curated listings by price, bedrooms, bathrooms, and area. Our
            experts are ready to source exclusive opportunities for you.
          </p>
        </div>
      </section>

      {/* Filter section */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Location"
              className={filterInput}
              value={filters.location}
              onChange={(event) =>
                handleFilterChange("location", event.target.value)
              }
            />

            <select
              className={filterInput}
              value={filters.type}
              onChange={(event) =>
                handleFilterChange("type", event.target.value)
              }
            >
              <option value="">Property Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Land</option>
            </select>

            {!isLand && (
              <select
                className={filterInput}
                value={filters.bedrooms}
                onChange={(event) =>
                  handleFilterChange("bedrooms", event.target.value)
                }
              >
                <option value="">Bedrooms</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            )}

            {!isLand && (
              <select
                className={filterInput}
                value={filters.bathrooms}
                onChange={(event) =>
                  handleFilterChange("bathrooms", event.target.value)
                }
              >
                <option value="">Bathrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            )}

            {isLand && (
              <select
                className={filterInput}
                value={filters.size}
                onChange={(event) =>
                  handleFilterChange("size", event.target.value)
                }
              >
                {Object.entries(LAND_SIZE_RANGES).map(([value, range]) => (
                  <option key={value} value={value}>
                    {range.label}
                  </option>
                ))}
              </select>
            )}

            <select
              className={filterInput}
              value={filters.price}
              onChange={(event) =>
                handleFilterChange("price", event.target.value)
              }
            >
              {Object.entries(PRICE_RANGES).map(([value, range]) => (
                <option key={value} value={value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              className={filterInput}
              value={filters.sort}
              onChange={(event) =>
                handleFilterChange("sort", event.target.value)
              }
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <button
              onClick={handleApplyFilters}
              className="rounded-lg bg-[#012169] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#001a4d]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Results header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {loading
                ? "Searching premium listings..."
                : `${sortedResults.length} Properties Found`}
            </h2>
            <p className="text-sm text-gray-500">
              {formattedLocation
                ? `Showing curated buy listings in ${formattedLocation}.`
                : "Showing curated buy listings across Nairobi."}
            </p>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="rounded-lg border border-[#012169] px-5 py-2 text-sm font-semibold text-[#012169] hover:bg-[#012169] hover:text-white"
          >
            Request a Property
          </button>
        </div>

        {/* Conditional rendering for results, errors, and empty state */}
        {loading ? (
          <div className="text-gray-500">Loading results...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => fetchResults(filters)}
              className="mt-6 rounded-lg bg-[#012169] px-6 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : sortedResults.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No properties in this area
            </h2>
            <p className="mt-2 text-gray-600">
              Share your ideal home, and our agents will source it for you.
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="mt-6 rounded-lg bg-[#012169] px-6 py-3 text-white font-semibold shadow hover:bg-[#001a4d]"
            >
              Request a Property
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sortedResults.map((property) => (
              <div
                key={property.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="h-52 w-full bg-gray-200">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Image coming soon
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{property.location}</p>
                  <p className="text-xl font-bold text-[#012169]">
                    KES {property.price.toLocaleString()}
                  </p>
                  <div className="text-sm text-gray-600">
                    {property.bedrooms} bd • {property.bathrooms} ba •{" "}
                    {property.area} sqm
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended section */}
        {recommended.length > 0 && !loading && !error && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              You may also like
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((property) => (
                <div
                  key={property.id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  <div className="h-40 w-full bg-gray-200">
                    {property.image_url && (
                      <img
                        src={property.image_url}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500">{property.location}</p>
                    <p className="mt-2 font-bold text-[#012169]">
                      KES {property.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Request Property Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Request a Property</h2>

            <form className="space-y-4">
              <input
                placeholder="Preferred Location"
                className={filterInput + " w-full"}
                defaultValue={filters.location}
                required
              />

              <select className={filterInput + " w-full"} required>
                <option value="">Property Type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Land</option>
              </select>

              <input
                placeholder="Budget"
                className={filterInput + " w-full"}
                required
              />

              <input
                placeholder="Email or Phone Number"
                className={filterInput + " w-full"}
                required
              />

              <textarea
                placeholder="Additional details"
                className={filterInput + " w-full"}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#012169] px-6 py-2 text-white font-semibold shadow hover:bg-[#001a4d]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
