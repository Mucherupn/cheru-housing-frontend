import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const initialFormState = {
  title: "",
  description: "",
  price: "",
  type: "",
  locationId: "",
  houseSize: "",
  landSize: "",
  bedrooms: "",
  bathrooms: "",
  yearBuilt: "",
  floor: "",
  apartmentName: "",
};

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadData = async () => {
    const [listingPayload, locationPayload, amenityPayload] =
      await Promise.all([
        apiRequest("/api/admin/listings"),
        apiRequest("/api/admin/locations"),
        apiRequest("/api/admin/amenities"),
      ]);

    setListings(listingPayload.listings || []);
    setLocations(locationPayload.locations || []);
    setAmenities(amenityPayload.amenities || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedAmenities([]);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    const payload = {
      ...formState,
      amenityIds: selectedAmenities,
    };

    let listingResponse;

    if (editingId) {
      listingResponse = await apiRequest(`/api/admin/listings/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      listingResponse = await apiRequest("/api/admin/listings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    await loadData();
    setStatusMessage(editingId ? "Listing updated." : "Listing created.");
    resetForm();
  };

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setFormState({
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price || "",
      type: listing.type || "",
      locationId: listing.location_id || "",
      houseSize: listing.house_size || "",
      landSize: listing.land_size || "",
      bedrooms: listing.bedrooms || "",
      bathrooms: listing.bathrooms || "",
      yearBuilt: listing.year_built || "",
      floor: listing.floor || "",
      apartmentName: listing.apartment_name || "",
    });
    setSelectedAmenities(
      listing.listing_amenities?.map((item) => item.amenity_id) || []
    );
  };

  const handleDelete = async (listingId) => {
    await apiRequest(`/api/admin/listings/${listingId}`, { method: "DELETE" });
    await loadData();
  };

  const listingRows = listings.map((listing) => [
    listing.title,
    listing.type,
    listing.price ? `KES ${Number(listing.price).toLocaleString()}` : "-",
    listing.bedrooms ? `${listing.bedrooms} Beds` : "-",
    listing.location?.name || "-",
    <div key={listing.id} className="flex gap-2">
      <button
        type="button"
        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
        onClick={() => handleEdit(listing)}
      >
        Edit
      </button>
      <button
        type="button"
        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500"
        onClick={() => handleDelete(listing.id)}
      >
        Delete
      </button>
    </div>,
  ]);

  return (
    <AdminLayout
      title="Listings Management"
      subtitle="Curate sale, rent, and insights properties with clean, structured controls."
    >
      <SectionCard
        title="Listings Library"
        description="Manage core property data and amenity coverage in one streamlined view."
      >
        <DataTable
          columns={["Listing", "Type", "Price", "Beds", "Location", "Actions"]}
          rows={listingRows}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title={editingId ? "Edit Listing" : "Create Listing"}
          description="Ensure all core fields, amenities, and media are complete."
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                Title
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                Price (KES)
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.price}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              Description
              <textarea
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                rows={3}
                value={formState.description}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                Type
                <select
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Land">Land</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                Apartment Name
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.apartmentName}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      apartmentName: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Floor
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.floor}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      floor: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                Location
                <select
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.locationId}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      locationId: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label className="flex flex-col gap-2">
                House Size (sqm)
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.houseSize}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      houseSize: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Land Size (acres)
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.landSize}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      landSize: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Bedrooms
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.bedrooms}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      bedrooms: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Bathrooms
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.bathrooms}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      bathrooms: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Year Built
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.yearBuilt}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      yearBuilt: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={(event) => {
                        setSelectedAmenities((prev) =>
                          event.target.checked
                            ? [...prev, amenity.id]
                            : prev.filter((id) => id !== amenity.id)
                        );
                      }}
                    />
                    {amenity.name}
                  </label>
                ))}
              </div>
            </div>

            {statusMessage ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-600">
                {statusMessage}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white"
                type="submit"
              >
                {editingId ? "Update listing" : "Create listing"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-6 py-2 text-xs font-semibold text-slate-500"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Listing Actions"
          description="Quick controls for status, duplication, and visibility."
        >
          <div className="flex flex-col gap-3">
            {[
              "Toggle active status",
              "Duplicate listing",
              "Schedule refresh",
              "Archive draft",
            ].map((item) => (
              <button
                key={item}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                type="button"
              >
                {item}
                <span className="text-xs text-slate-400">›</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </AdminLayout>
  );
};

export default ListingsPage;
