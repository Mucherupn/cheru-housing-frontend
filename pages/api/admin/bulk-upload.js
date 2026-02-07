import path from "path";
import { supabaseAdmin, requireAdmin } from "../../../lib/supabaseAdmin";

const isRemoteUrl = (value) =>
  typeof value === "string" && /^https?:\/\//i.test(value.trim());

const normalizeAmenityName = (name) => name.trim();

const ensureLocation = async (name) => {
  const trimmed = name.trim();
  const { data: existing } = await supabaseAdmin
    .from("locations")
    .select("id")
    .ilike("name", trimmed)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data: created, error } = await supabaseAdmin
    .from("locations")
    .insert([{ name: trimmed }])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return created.id;
};

const ensureNeighbourhood = async (name, locationId) => {
  const trimmed = name.trim();
  const { data: existing } = await supabaseAdmin
    .from("neighbourhoods")
    .select("id")
    .eq("location_id", locationId)
    .ilike("name", trimmed)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data: created, error } = await supabaseAdmin
    .from("neighbourhoods")
    .insert([{ name: trimmed, location_id: locationId }])
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

const uploadRemoteImage = async (listingId, url, label) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const extension =
    path.extname(new URL(url).pathname) || `.${contentType.split("/")[1]}`;
  const fileName = `${listingId}/${label}${extension}`;
  const buffer = Buffer.from(await response.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("listing-images")
    .upload(fileName, buffer, { contentType, upsert: true });

  if (error) {
    throw new Error(error.message);
  }

  return fileName;
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
      const listingType = String(row.listingType || "").trim();
      const propertyType = String(row.propertyType || "").trim();
      const locationName = String(row.location || "").trim();
      const neighbourhoodName = String(row.neighbourhood || "").trim();

      if (!title || !listingType || !locationName) {
        throw new Error("Missing required fields.");
      }

      const locationId = await ensureLocation(locationName);
      const neighbourhoodId = neighbourhoodName
        ? await ensureNeighbourhood(neighbourhoodName, locationId)
        : null;

      const { data: listing, error: listingError } = await supabaseAdmin
        .from("listings")
        .insert([
          {
            title,
            description: row.description || null,
            price: row.price ? Number(row.price) : null,
            property_type: propertyType || null,
            listing_type: listingType,
            location_id: locationId,
            neighbourhood_id: neighbourhoodId,
            size: row.size ? Number(row.size) : null,
            bedrooms: row.bedrooms ? Number(row.bedrooms) : null,
            bathrooms: row.bathrooms ? Number(row.bathrooms) : null,
            year_built: row.yearBuilt ? Number(row.yearBuilt) : null,
            status: row.status || "draft",
          },
        ])
        .select("*")
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
          .from("listing_amenities")
          .insert(amenityRows);
        if (amenityError) {
          throw new Error(amenityError.message);
        }
      }

      let featuredImagePath = row.featuredImage || null;
      if (isRemoteUrl(row.featuredImage)) {
        featuredImagePath = await uploadRemoteImage(
          listing.id,
          row.featuredImage,
          "featured"
        );
      }

      if (featuredImagePath) {
        await supabaseAdmin
          .from("listings")
          .update({ featured_image: featuredImagePath })
          .eq("id", listing.id);
      }

      const galleryImages = String(row.galleryImages || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (galleryImages.length) {
        const imageRows = [];
        for (const [imageIndex, image] of galleryImages.entries()) {
          let imagePath = image;
          if (isRemoteUrl(image)) {
            imagePath = await uploadRemoteImage(
              listing.id,
              image,
              `gallery-${imageIndex + 1}`
            );
          }
          imageRows.push({ listing_id: listing.id, image_path: imagePath });
        }
        const { error: imageError } = await supabaseAdmin
          .from("listing_images")
          .insert(imageRows);
        if (imageError) {
          throw new Error(imageError.message);
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
