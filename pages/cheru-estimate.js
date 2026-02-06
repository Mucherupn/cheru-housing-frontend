import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const propertyTypes = ["Land", "House", "Apartment"];
const locations = [
  "Karen", "Kilimani", "Kileleshwa", "Runda", "Lavington", "Westlands",
  "Muthaiga", "Gigiri", "Riverside", "Nyari"
];

const CheruEstimate = () => {
  const [propertyType, setPropertyType] = useState("Land");
  const [formData, setFormData] = useState({ type: "Land", location: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked ? [...(formData[name] || []), value] : formData[name].filter((v) => v !== value),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Your estimate request has been submitted. Our team will get back to you.");
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

          <button
            type="submit"
            className="w-full rounded-xl bg-[#012169] py-4 text-white font-semibold text-lg hover:opacity-90 transition"
          >
            Get Estimate
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default CheruEstimate;
