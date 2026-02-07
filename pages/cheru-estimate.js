import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const propertyTypes = ["Land", "House", "Apartment"];
const locations = [
  "Karen", "Kilimani", "Kileleshwa", "Runda", "Lavington", "Westlands",
  "Muthaiga", "Gigiri", "Riverside", "Nyari"
];
const API_URL = process.env.NEXT_PUBLIC_AVM_API || "http://localhost:8000";
const YEAR_CLASSIC_MESSAGE =
  "This property is too classic for automated estimation. Please contact our team for a professional valuation.";

const CheruEstimate = () => {
  const [propertyType, setPropertyType] = useState("Land");
  const [formData, setFormData] = useState({ type: "Land", location: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const currentValues = formData[name] || [];
      setFormData({
        ...formData,
        [name]: checked ? [...currentValues, value] : currentValues.filter((v) => v !== value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const renderFields = () => {
    switch (propertyType) {
      case "Land":
        return (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Size (acres)</label>
              <input
                type="number"
                name="size"
                placeholder="e.g 0.5"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Shape</label>
              <select
                name="shape"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              >
                <option value="">Select shape</option>
                <option>Rectangular</option>
                <option>Irregular</option>
                <option>Corner Plot</option>
              </select>
            </div>
          </>
        );
      case "House":
        return (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Size of house (sqm)</label>
              <input
                type="number"
                name="houseSize"
                placeholder="e.g 250"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Size of land (acres)</label>
              <input
                type="number"
                name="landSize"
                placeholder="e.g 0.5"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Year built</label>
              <input
                type="number"
                name="yearBuilt"
                placeholder="e.g 2018"
                min="1970"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Bedrooms & Bathrooms</label>
              <input
                type="text"
                name="bedBath"
                placeholder="e.g 4 beds, 3 baths"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Amenities</label>
              <div className="flex flex-wrap gap-3">
                {["Pool", "Gym", "Garage", "Garden", "Security", "Solar Panels"].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 text-[#0B1220]">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      onChange={handleChange}
                      className="accent-[#012169]"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case "Apartment":
        return (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Apartment Name</label>
              <input
                type="text"
                name="apartmentName"
                placeholder="e.g Tigoni Heights"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Floor</label>
              <input
                type="number"
                name="floor"
                placeholder="e.g 5"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Size (sqm)</label>
              <input
                type="number"
                name="apartmentSize"
                placeholder="e.g 120"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Year built</label>
              <input
                type="number"
                name="yearBuilt"
                placeholder="e.g 2020"
                min="1970"
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#012169]/30"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#0B1220]">Amenities</label>
              <div className="flex flex-wrap gap-3">
                {["Pool", "Gym", "Lift", "Parking", "Backup Generator", "Balcony"].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 text-[#0B1220]">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      onChange={handleChange}
                      className="accent-[#012169]"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== "number") {
      return "—";
    }
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const buildPayload = () => {
    const shapeMap = {
      Rectangular: "normal",
      "Corner Plot": "corner",
      Irregular: "irregular",
    };

    if (propertyType === "Land") {
      return {
        property_type: "land",
        area: formData.location,
        land_size_acres: Number(formData.size),
        plot_shape: shapeMap[formData.shape] || "normal",
      };
    }

    if (propertyType === "House") {
      return {
        property_type: "house",
        area: formData.location,
        house_size_sqm: Number(formData.houseSize),
        land_size_acres: Number(formData.landSize),
        year_built: Number(formData.yearBuilt),
        plot_shape: "normal",
        amenities: formData.amenities || [],
      };
    }

    return {
      property_type: "apartment",
      area: formData.location,
      size_sqm: Number(formData.apartmentSize),
      year_built: Number(formData.yearBuilt),
      amenities: formData.amenities || [],
      apartment_name: formData.apartmentName,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setEstimate(null);

    if (propertyType !== "Land") {
      const yearBuilt = Number(formData.yearBuilt);
      if (Number.isNaN(yearBuilt) || yearBuilt < 1970) {
        setFormError("Please enter a valid year built from 1970 onwards.");
        return;
      }
      if (yearBuilt < 1985) {
        setFormError(YEAR_CLASSIC_MESSAGE);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/estimate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      });

      if (!response.ok) {
        throw new Error("Estimate request failed.");
      }

      const data = await response.json();
      setEstimate(data);
      setIsModalOpen(true);
    } catch (error) {
      setFormError("We couldn’t generate an estimate. Please check your inputs or try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 bg-[#F9FAFB] text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Cheru Estimate</h1>
        <p className="text-lg text-[#4B5563] max-w-2xl">
          Get an instant and accurate estimate for your property. Provide the details below, and our system will analyze the data for you.
        </p>
      </section>

      {/* Form Section */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-[#0B1220] mb-6">Enter Your Property Details</h2>
        <form
          className="rounded-2xl bg-white p-8 shadow-xl space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Property Type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[#0B1220]">Property Type</label>
            <select
              name="type"
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                setFormData({ ...formData, type: e.target.value });
              }}
              className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] outline-none focus:ring-2 focus:ring-[#012169]/30"
            >
              {propertyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[#0B1220]">Location</label>
            <select
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#0B1220] outline-none focus:ring-2 focus:ring-[#012169]/30"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Fields */}
          {renderFields()}

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#012169] py-4 text-white font-semibold text-lg hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Generating Estimate..." : "Get Estimate"}
          </button>
        </form>
      </section>

      {isModalOpen && estimate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close estimate modal"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl transition duration-300 ease-out animate-modal-in">
            <button
              type="button"
              aria-label="Close estimate modal"
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Cheru Automated Value</p>
            <h3 className="mt-4 text-4xl font-bold text-[#012169] sm:text-5xl">
              {formatCurrency(estimate.estimated_value)}
            </h3>
            <p className="mt-3 text-lg text-gray-600">
              Range: {formatCurrency(estimate.low_estimate)} - {formatCurrency(estimate.high_estimate)}
            </p>
            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-gray-600">
              Market-adjusted estimate for {estimate.area} based on available amenity and sizing data.
            </div>
            <p className="mt-6 text-xs leading-relaxed text-gray-400">
              This estimate is generated automatically using market data and may vary from the final transaction value. For a precise valuation, consult a Cheru property expert.
            </p>
          </div>
        </div>
      )}

      <Footer />
      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CheruEstimate;
