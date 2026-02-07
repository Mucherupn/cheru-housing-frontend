import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";
import { supabase } from "../../utils/supabaseClient";

const initialFormState = {
  title: "",
  description: "",
  price: "",
  propertyType: "",
  listingType: "sale",
  locationId: "",
  neighbourhoodId: "",
  size: "",
  bedrooms: "",
  bathrooms: "",
  yearBuilt: "",
  status: "active",
};

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
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
    setNeighbourhoods(locationPayload.neighbourhoods || []);
    setAmenities(amenityPayload.amenities || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredNeighbourhoods = useMemo(() => {
    if (!formState.locationId) return neighbourhoods;
    return neighbourhoods.filter(
      (item) => item.location_id === formState.locationId
    );
  }, [neighbourhoods, formState.locationId]);

  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedAmenities([]);
    setFeaturedImage(null);
    setGalleryImages([]);
    setEditingId(null);
  };

  const uploadListingImage = async (listingId, file, label) => {
    const extension = file.name.split(".").pop();
    const filePath = `${listingId}/${label}.${extension}`;

    const { error } = await supabase.storage
      .from("listing-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      throw new Error(error.message);
    }

    return filePath;
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

    const listingId = editingId || listingResponse.listing?.id;

    const updates = { ...payload };

    if (featuredImage && listingId) {
      updates.featuredImage = await uploadListingImage(
        listingId,
        featuredImage,
        "featured"
      );
    }

    if (galleryImages.length && listingId) {
      const uploadedGallery = [];
      for (const [index, file] of galleryImages.entries()) {
        const imagePath = await uploadListingImage(
          listingId,
          file,
          `gallery-${index + 1}`
        );
        uploadedGallery.push(imagePath);
      }
      updates.galleryImages = uploadedGallery;
    }

    if (listingId && (updates.featuredImage || updates.galleryImages)) {
      await apiRequest(`/api/admin/listings/${listingId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...payload,
          featuredImage: updates.featuredImage,
          galleryImages: updates.galleryImages,
        }),
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
      propertyType: listing.property_type || "",
      listingType: listing.listing_type || "sale",
      locationId: listing.location_id || "",
      neighbourhoodId: listing.neighbourhood_id || "",
      size: listing.size || "",
      bedrooms: listing.bedrooms || "",
      bathrooms: listing.bathrooms || "",
      yearBuilt: listing.year_built || "",
      status: listing.status || "active",
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
    listing.listing_type,
    listing.price ? `KES ${Number(listing.price).toLocaleString()}` : "-",
    listing.bedrooms ? `${listing.bedrooms} Beds` : "-",
    listing.status,
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
        description="Manage core property data, media, and status states in one streamlined view."
      >
        <DataTable
          columns={["Listing", "Type", "Price", "Beds", "Status", "Actions"]}
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
                Listing Type
                <select
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.listingType}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      listingType: event.target.value,
                    }))
                  }
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                Property Type
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.propertyType}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      propertyType: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Status
                <select
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                </select>
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
                      neighbourhoodId: "",
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
              <label className="flex flex-col gap-2">
                Neighbourhood
                <select
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.neighbourhoodId}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      neighbourhoodId: event.target.value,
                    }))
                  }
                >
                  <option value="">Select neighbourhood</option>
                  {filteredNeighbourhoods.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label className="flex flex-col gap-2">
                Size (sqm)
                <input
                  type="number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                  value={formState.size}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      size: event.target.value,
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

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                Featured Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setFeaturedImage(event.target.files?.[0] || null)
                  }
                />
              </label>
              <label className="flex flex-col gap-2">
                Gallery Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setGalleryImages(Array.from(event.target.files || []))
                  }
                />
              </label>
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
