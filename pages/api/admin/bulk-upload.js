import { supabaseAdmin, requireAdmin } from "../../../lib/supabaseAdmin";

const normalizeAmenityName = (name) => name.trim();

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const ensureLocation = async (name) => {
  const trimmed = name.trim();
  const { data: existing } = await supabaseAdmin
    .from("locations")
    .select("id,slug")
    .ilike("name", trimmed)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const slug = createSlug(trimmed);
  const { data: created, error } = await supabaseAdmin
    .from("locations")
    .insert([{ name: trimmed, slug }])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created.id;
};

const ensureAmenityIds = async (amenities) => {
  const ids = [];
  for (const amenity of amenities) {
    const trimmed = normalizeAmenityName(amenity);
    if (!trimmed) continue;
    const { data: existing } = await supabaseAdmin
      .from("amenities")
      .select("id")
      .ilike("name", trimmed)
      .maybeSingle();

    if (existing?.id) {
      ids.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabaseAdmin
      .from("amenities")
      .insert([{ name: trimmed }])
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    ids.push(created.id);
  }

  return ids;
};

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rows = req.body?.rows || [];

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "No rows provided." });
  }

  let successCount = 0;
  const failedRows = [];

  for (const [index, row] of rows.entries()) {
    try {
      const title = String(row.title || "").trim();
      const type = String(row.type || "").trim();
      const locationName = String(row.location || "").trim();

      if (!title || !type || !locationName) {
        throw new Error("Missing required fields.");
      }

      const locationId = await ensureLocation(locationName);

      const { data: listing, error: listingError } = await supabaseAdmin
        .from("listings")
        .insert([
          {
            title,
            description: row.description || null,
            price: row.price ? Number(row.price) : null,
            type,
            location_id: locationId,
            bedrooms: row.bedrooms ? Number(row.bedrooms) : null,
            bathrooms: row.bathrooms ? Number(row.bathrooms) : null,
            year_built: row.yearBuilt ? Number(row.yearBuilt) : null,
            house_size: row.houseSize ? Number(row.houseSize) : null,
            land_size: row.landSize ? Number(row.landSize) : null,
            floor: row.floor ? Number(row.floor) : null,
            apartment_name: row.apartmentName ? String(row.apartmentName) : null,
          },
        ])
        .select(
          "id,title,description,price,bedrooms,bathrooms,house_size,land_size,year_built,floor,apartment_name,type,location_id,created_at,updated_at"
        )
        .single();

      if (listingError) {
        throw new Error(listingError.message);
      }

      const amenities = String(row.amenities || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (amenities.length) {
        const amenityIds = await ensureAmenityIds(amenities);
        const amenityRows = amenityIds.map((amenityId) => ({
          listing_id: listing.id,
          amenity_id: amenityId,
        }));
        const { error: amenityError } = await supabaseAdmin
          .from("property_amenities")
          .insert(amenityRows);
        if (amenityError) {
          throw new Error(amenityError.message);
        }
      }

      successCount += 1;
    } catch (error) {
      failedRows.push({
        row: index + 1,
        message: error.message,
      });
    }
  }

  return res.status(200).json({
    successCount,
    failedCount: failedRows.length,
    failedRows,
  });
}
