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

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const payload = normalizeListingPayload(req.body || {});
    const amenityIds = req.body?.amenityIds || [];

    const { data: listing, error: listingError } = await supabaseAdmin
      .from("listings")
      .update(payload)
      .eq("id", id)
      .select(
        "id,title,description,price,bedrooms,bathrooms,house_size,land_size,year_built,floor,apartment_name,type,location_id,created_at,updated_at"
      )
      .single();

    if (listingError) {
      return res.status(500).json({ error: listingError.message });
    }

    await supabaseAdmin.from("listing_amenities").delete().eq("listing_id", id);

    if (amenityIds.length > 0) {
      const amenityRows = amenityIds.map((amenityId) => ({
        listing_id: id,
        amenity_id: amenityId,
      }));
      const { error: amenityError } = await supabaseAdmin
        .from("listing_amenities")
        .insert(amenityRows);
      if (amenityError) {
        return res.status(500).json({ error: amenityError.message });
      }
    }

    return res.status(200).json({ listing });
  }

  if (req.method === "DELETE") {
    await supabaseAdmin.from("listing_amenities").delete().eq("listing_id", id);

    const { error } = await supabaseAdmin.from("listings").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
