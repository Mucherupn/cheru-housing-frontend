import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
  parking?: boolean;
  gym?: boolean;
  lift?: boolean;
  pool?: boolean;
};

type Filters = {
  type: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: string;
  size: string;
  sort: string;
};

const apartmentHousePriceRanges = [
  { label: "Below 100K", value: "0-100000" },
  { label: "100K – 200K", value: "100000-200000" },
  { label: "200K – 500K", value: "200000-500000" },
  { label: "500K – 1M", value: "500000-1000000" },
  { label: "1M+", value: "1000000+" },
];

const landPriceRanges = [
  { label: "Below 100K", value: "0-100000" },
  { label: "100K – 300K", value: "100000-300000" },
  { label: "300K – 500K", value: "300000-500000" },
  { label: "500K – 1M", value: "500000-1000000" },
  { label: "1M+", value: "1000000+" },
];

const landSizeOptions = [
  { label: "1/4 acre and below", value: "0-0.25" },
  { label: "1/2 acre", value: "0.5" },
  { label: "1 acre", value: "1" },
  { label: "2 acres", value: "2" },
  { label: "3+ acres", value: "3+" },
];

const parseRangeValue = (value: string) => {
  if (!value) return {};
  if (value.includes("-")) {
    const [min, max] = value.split("-").map(Number);
    return {
      min: Number.isNaN(min) ? undefined : min,
      max: Number.isNaN(max) ? undefined : max,
    };
  }
  if (value.endsWith("+")) {
    const min = Number(value.replace("+", ""));
    return { min: Number.isNaN(min) ? undefined : min };
  }
  const exact = Number(value);
  return { min: Number.isNaN(exact) ? undefined : exact, max: exact };
};

const rangeFromQuery = (min?: string, max?: string) => {
  if (!min && !max) return "";
  if (min && max) return `${min}-${max}`;
  if (min) return `${min}+`;
  return `0-${max}`;
};

const toTitleCase = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const RentLocationPage = () => {
  const router = useRouter();
  const locationSlug = typeof router.query.location === "string" ? router.query.location : "";
  const locationLabel = locationSlug ? toTitleCase(locationSlug) : "Your Area";

  const [filters, setFilters] = useState<Filters>({
    type: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: "",
    size: "",
    sort: "newest",
  });
  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestState, setRequestState] = useState({
    location: "",
    property_type: "",
    budget: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    if (!router.isReady) return;

    const { type, bedrooms, bathrooms, min_price, max_price, size, sort } = router.query;

    setFilters({
      type: typeof type === "string" ? type : "",
      bedrooms: typeof bedrooms === "string" ? bedrooms : "",
      bathrooms: typeof bathrooms === "string" ? bathrooms : "",
      priceRange: rangeFromQuery(
        typeof min_price === "string" ? min_price : "",
        typeof max_price === "string" ? max_price : ""
      ),
      size: typeof size === "string" ? size : "",
      sort: typeof sort === "string" ? sort : "newest",
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!locationSlug) return;

    const fetchResults = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("location", locationSlug);
      if (filters.type) params.set("type", filters.type);
      if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
      if (filters.bathrooms) params.set("bathrooms", filters.bathrooms);
      if (filters.size) params.set("size", filters.size);

      const { min, max } = parseRangeValue(filters.priceRange);
      if (min !== undefined) params.set("min_price", String(min));
      if (max !== undefined) params.set("max_price", String(max));

      if (filters.sort) params.set("sort", filters.sort);

      const response = await fetch(`/api/rent?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } else {
        setResults([]);
        setTotal(0);
      }
      setLoading(false);
    };

    fetchResults();
  }, [locationSlug, filters]);

  useEffect(() => {
    setRequestState((prev) => ({
      ...prev,
      location: locationLabel,
    }));
  }, [locationLabel]);

  const updateFilters = (next: Partial<Filters>) => {
    const updated = { ...filters, ...next };
    const query: Record<string, string> = {};

    if (locationSlug) query.location = locationSlug;
    if (updated.type) query.type = updated.type;
    if (updated.bedrooms) query.bedrooms = updated.bedrooms;
    if (updated.bathrooms) query.bathrooms = updated.bathrooms;
    if (updated.size) query.size = updated.size;
    if (updated.sort) query.sort = updated.sort;

    const { min, max } = parseRangeValue(updated.priceRange);
    if (min !== undefined) query.min_price = String(min);
    if (max !== undefined) query.max_price = String(max);

    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    setFilters(updated);
  };

  const handleTypeChange = (value: string) => {
    if (value === "land") {
      updateFilters({ type: value, bedrooms: "", bathrooms: "" });
    } else if (value === "apartment" || value === "house") {
      updateFilters({ type: value, size: "" });
    } else {
      updateFilters({ type: value, bedrooms: "", bathrooms: "", size: "" });
    }
  };

  const activePriceRanges =
    filters.type === "land" ? landPriceRanges : apartmentHousePriceRanges;

  const showBedroomBathroomFilters =
    filters.type === "apartment" || filters.type === "house";
  const showLandFilters = filters.type === "land";

  const filterInput =
    "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-[#012169] focus:outline-none focus:ring-2 focus:ring-[#012169]/20";

  const handleRequestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/property-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestState),
    });

    if (response.ok) {
      setShowRequestModal(false);
      setRequestState({
        location: locationLabel,
        property_type: "",
        budget: "",
        contact: "",
        message: "",
      });
    }
  };

  const requestPropertyButton = (
    <button
      type="button"
      onClick={() => setShowRequestModal(true)}
      className="rounded-xl bg-[#012169] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#001a4d]"
    >
      Request Property
    </button>
  );

  const headerSubtitle = useMemo(
    () =>
      filters.type
        ? `Curated ${filters.type} rentals in ${locationLabel}`
        : `Curated rentals in ${locationLabel}`,
    [filters.type, locationLabel]
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#0B1220]">
      <Navbar />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Rent in {locationLabel}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#012169] sm:text-4xl">
                Premium Rentals in {locationLabel}
              </h1>
              <p className="mt-3 text-base text-gray-600">{headerSubtitle}</p>
            </div>
            <div className="flex items-center gap-4">{requestPropertyButton}</div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-6 py-4">
          <select
            value={filters.type}
            onChange={(event) => handleTypeChange(event.target.value)}
            className={filterInput}
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(event) => updateFilters({ priceRange: event.target.value })}
            className={filterInput}
          >
            <option value="">Price Range</option>
            {activePriceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {showBedroomBathroomFilters && (
            <>
              <select
                value={filters.bedrooms}
                onChange={(event) => updateFilters({ bedrooms: event.target.value })}
                className={filterInput}
              >
                <option value="">Bedrooms</option>
                <option value="studio">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>

              <select
                value={filters.bathrooms}
                onChange={(event) => updateFilters({ bathrooms: event.target.value })}
                className={filterInput}
              >
                <option value="">Bathrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </>
          )}

          {showLandFilters && (
            <select
              value={filters.size}
              onChange={(event) => updateFilters({ size: event.target.value })}
              className={filterInput}
            >
              <option value="">Land Size</option>
              {landSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          <select
            value={filters.sort}
            onChange={(event) => updateFilters({ sort: event.target.value })}
            className={filterInput}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? "Loading rentals..." : `${total} rentals in ${locationLabel}`}
          </h2>
          <button
            type="button"
            onClick={() =>
              updateFilters({
                type: "",
                bedrooms: "",
                bathrooms: "",
                priceRange: "",
                size: "",
                sort: "newest",
              })
            }
            className="text-sm font-semibold text-[#012169] hover:text-[#001a4d]"
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-gray-500 shadow-sm">
            Fetching premium rentals for you...
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              We currently have no rental properties in this area.
            </h3>
            <p className="mt-3 text-base text-gray-600">
              Request a property and our agents will assist you.
            </p>
            <div className="mt-6 flex justify-center">{requestPropertyButton}</div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Request a Property
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Share your preferences and we will match you with the right rental.
            </p>
            <form onSubmit={handleRequestSubmit} className="mt-6 space-y-4">
              <input
                required
                value={requestState.location}
                onChange={(event) =>
                  setRequestState((prev) => ({ ...prev, location: event.target.value }))
                }
                placeholder="Preferred location"
                className={`${filterInput} w-full`}
              />
              <select
                required
                value={requestState.property_type}
                onChange={(event) =>
                  setRequestState((prev) => ({ ...prev, property_type: event.target.value }))
                }
                className={`${filterInput} w-full`}
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
              <input
                required
                value={requestState.budget}
                onChange={(event) =>
                  setRequestState((prev) => ({ ...prev, budget: event.target.value }))
                }
                placeholder="Budget"
                className={`${filterInput} w-full`}
              />
              <input
                required
                value={requestState.contact}
                onChange={(event) =>
                  setRequestState((prev) => ({ ...prev, contact: event.target.value }))
                }
                placeholder="Contact (Phone or Email)"
                className={`${filterInput} w-full`}
              />
              <textarea
                value={requestState.message}
                onChange={(event) =>
                  setRequestState((prev) => ({ ...prev, message: event.target.value }))
                }
                placeholder="Additional details"
                className={`${filterInput} w-full`}
                rows={4}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#012169] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#001a4d]"
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
};

export default RentLocationPage;
