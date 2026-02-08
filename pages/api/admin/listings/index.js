import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

const normalizeListingPayload = (payload) => ({
  title: payload.title?.trim(),
  description: payload.description?.trim() || null,
  price: payload.price !== "" ? Number(payload.price) : null,
  type: payload.type?.trim() || null,
  location_id: payload.locationId || null,
  bedrooms: payload.bedrooms !== "" ? Number(payload.bedrooms) : null,
  bathrooms: payload.bathrooms !== "" ? Number(payload.bathrooms) : null,
  year_built: payload.yearBuilt !== "" ? Number(payload.yearBuilt) : null,
  house_size: payload.houseSize !== "" ? Number(payload.houseSize) : null,
  land_size: payload.landSize !== "" ? Number(payload.landSize) : null,
  floor: payload.floor !== "" ? Number(payload.floor) : null,
  apartment_name: payload.apartmentName?.trim() || null,
});

const fetchListings = async () =>
  supabaseAdmin
    .from("listings")
    .select(
      "id,title,description,price,bedrooms,bathrooms,house_size,land_size,year_built,floor,apartment_name,type,location_id,created_at,updated_at,location:locations(name,slug),listing_amenities(amenity_id,amenity:amenities(name))"
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

    if (!payload.title || !payload.type || !payload.location_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const { data: listing, error: listingError } = await supabaseAdmin
      .from("listings")
      .insert([payload])
      .select(
        "id,title,description,price,bedrooms,bathrooms,house_size,land_size,year_built,floor,apartment_name,type,location_id,created_at,updated_at"
      )
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

    const { data: refreshed, error: refreshError } = await fetchListings();

    if (refreshError) {
      return res.status(500).json({ error: refreshError.message });
    }

    return res.status(201).json({ listing, listings: refreshed });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
