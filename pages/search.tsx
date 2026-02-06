import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url?: string;
};

export default function SearchResults() {
  const router = useRouter();
  const [results, setResults] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchResults = async () => {
      setLoading(true);

      const params = new URLSearchParams(
        router.query as Record<string, string>
      );

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      setResults(data.results || data || []);
      setRecommended(data.recommended || []);
      setLoading(false);
    };

    fetchResults();
  }, [router.isReady, router.query]);

  const filterInput =
    "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 focus:border-[#012169] focus:outline-none focus:ring-2 focus:ring-[#012169]/20";

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* Filter section */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Location"
              className={filterInput}
            />

            <select className={filterInput}>
              <option>Property Type</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
            </select>

            <select className={filterInput}>
              <option>Bedrooms</option>
              <option>Studio</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6+</option>
            </select>

            <select className={filterInput}>
              <option>Price Range</option>
              <option>Below 5M</option>
              <option>5M – 15M</option>
              <option>15M – 30M</option>
              <option>30M – 60M</option>
              <option>60M – 100M</option>
              <option>100M – 150M</option>
              <option>Above 150M</option>
            </select>

            <button className="rounded-lg bg-[#012169] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#001a4d]">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Results header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {loading
              ? "Searching..."
              : `${results.length} Properties Found`}
          </h1>

          <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
            <option>Sort: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="text-gray-500">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h2>
            <p className="text-gray-600 mb-6">
              Tell us what you are looking for and our agents will
              find it for you.
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="rounded-lg bg-[#012169] px-6 py-3 text-white font-semibold shadow hover:bg-[#001a4d]"
            >
              Request a Property
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((property) => (
              <div
                key={property.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="h-52 w-full bg-gray-200">
                  {property.image_url && (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {property.location}
                  </p>

                  <p className="mt-3 text-xl font-bold text-[#012169]">
                    KES {property.price.toLocaleString()}
                  </p>

                  <div className="mt-3 text-sm text-gray-600">
                    {property.bedrooms} bd • {property.bathrooms} ba •{" "}
                    {property.area} sqm
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended section */}
        {recommended.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              You may also like
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((property) => (
                <div
                  key={property.id}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <h3 className="font-semibold">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {property.location}
                  </p>
                  <p className="mt-2 font-bold text-[#012169]">
                    KES {property.price.toLocaleString()}
                  </p>
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
            <h2 className="text-xl font-semibold mb-4">
              Request a Property
            </h2>

            <form className="space-y-4">
              <input
                placeholder="Preferred Location"
                className={filterInput + " w-full"}
                required
              />

              <select
                className={filterInput + " w-full"}
                required
              >
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
                placeholder="Your Phone Number"
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
    </div>
  );
}
