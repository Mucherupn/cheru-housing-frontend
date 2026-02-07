import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

const normalizeListingPayload = (payload) => ({
  title: payload.title?.trim(),
  description: payload.description?.trim() || null,
  price: payload.price !== "" ? Number(payload.price) : null,
  property_type: payload.propertyType?.trim() || null,
  listing_type: payload.listingType?.trim() || null,
  location_id: payload.locationId || null,
  neighbourhood_id: payload.neighbourhoodId || null,
  size: payload.size !== "" ? Number(payload.size) : null,
  bedrooms: payload.bedrooms !== "" ? Number(payload.bedrooms) : null,
  bathrooms: payload.bathrooms !== "" ? Number(payload.bathrooms) : null,
  year_built: payload.yearBuilt !== "" ? Number(payload.yearBuilt) : null,
  status: payload.status?.trim() || "draft",
  featured_image: payload.featuredImage || null,
});

const fetchListings = async () =>
  supabaseAdmin
    .from("listings")
    .select(
      "*, locations(name), neighbourhoods(name), listing_images(id, image_path), listing_amenities(id, amenity_id, amenities(name))"
    )
    .order("created_at", { ascending: false });

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await fetchListings();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ listings: data });
  }

  if (req.method === "POST") {
    const payload = normalizeListingPayload(req.body || {});
    const amenityIds = req.body?.amenityIds || [];
    const galleryImages = req.body?.galleryImages || [];

    if (!payload.title || !payload.listing_type || !payload.location_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const { data: listing, error: listingError } = await supabaseAdmin
      .from("listings")
      .insert([payload])
      .select("*")
      .single();

    if (listingError) {
      return res.status(500).json({ error: listingError.message });
    }

    if (amenityIds.length > 0) {
      const amenityRows = amenityIds.map((amenityId) => ({
        listing_id: listing.id,
        amenity_id: amenityId,
      }));
      const { error: amenityError } = await supabaseAdmin
        .from("listing_amenities")
        .insert(amenityRows);
      if (amenityError) {
        return res.status(500).json({ error: amenityError.message });
      }
    }

    if (galleryImages.length > 0) {
      const imageRows = galleryImages.map((imagePath) => ({
        listing_id: listing.id,
        image_path: imagePath,
      }));
      const { error: imageError } = await supabaseAdmin
        .from("listing_images")
        .insert(imageRows);
      if (imageError) {
        return res.status(500).json({ error: imageError.message });
      }
    }

    const { data: refreshed, error: refreshError } = await fetchListings();

    if (refreshError) {
      return res.status(500).json({ error: refreshError.message });
    }

    return res.status(201).json({ listing, listings: refreshed });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
