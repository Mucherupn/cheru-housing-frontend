import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      location,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
    } = req.query;

    let query = supabase
      .from("listings")
      .select(
        "id,title,price,bedrooms,bathrooms,house_size,land_size,type,location_id,created_at,locations(name,slug)"
      );

    if (location && typeof location === "string") {
      const { data: locationData } = await supabase
        .from("locations")
        .select("id,name,slug")
        .or(`slug.ilike.%${location}%,name.ilike.%${location}%`)
        .maybeSingle();

      if (locationData?.id) {
        query = query.eq("location_id", locationData.id);
      }
    }

    if (type && typeof type === "string") {
      query = query.eq("type", type);
    }

    if (bedrooms && !Array.isArray(bedrooms)) {
      query = query.gte("bedrooms", Number(bedrooms));
    }

    if (bathrooms && !Array.isArray(bathrooms)) {
      query = query.gte("bathrooms", Number(bathrooms));
    }

    if (minPrice && !Array.isArray(minPrice)) {
      query = query.gte("price", Number(minPrice));
    }

    if (maxPrice && !Array.isArray(maxPrice)) {
      query = query.lte("price", Number(maxPrice));
    }

    const isLand = type && typeof type === "string" && type.toLowerCase() === "land";
    const areaColumn = isLand ? "land_size" : "house_size";

    if (minArea && !Array.isArray(minArea)) {
      query = query.gte(areaColumn, Number(minArea));
    }

    if (maxArea && !Array.isArray(maxArea)) {
      query = query.lte(areaColumn, Number(maxArea));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Search error:", error);
      return res.status(500).json({ error: "Search failed" });
    }

    const results = (data || []).map((listing) => ({
      id: listing.id,
      title: listing.title,
      location: listing.locations?.name || "",
      price: listing.price,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      area:
        listing.type?.toLowerCase?.() === "land"
          ? listing.land_size
          : listing.house_size,
      image_url: null,
      property_type: listing.type || null,
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
