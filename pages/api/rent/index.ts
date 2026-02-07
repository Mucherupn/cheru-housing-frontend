import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const parseNumber = (value: string | string[] | undefined) => {
  if (!value || Array.isArray(value)) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseSizeRange = (value: string) => {
  if (value.includes("-")) {
    const [min, max] = value.split("-").map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      return { min, max };
    }
  }

  if (value.endsWith("+")) {
    const min = Number(value.replace("+", ""));
    if (!Number.isNaN(min)) {
      return { min };
    }
  }

  const exact = Number(value);
  if (!Number.isNaN(exact)) {
    return { min: exact, max: exact };
  }

  return {};
};

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
      min_price,
      max_price,
      bedrooms,
      bathrooms,
      size,
      sort,
    } = req.query;

    let query = supabaseAdmin
      .from("listings")
      .select(
        "id,title,description,price,bedrooms,bathrooms,house_size,land_size,type,location_id,created_at,locations(name,slug)",
        { count: "exact" }
      );

    if (location && typeof location === "string") {
      const { data: locationData } = await supabaseAdmin
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

    if (bedrooms && typeof bedrooms === "string") {
      if (bedrooms === "studio") {
        query = query.eq("bedrooms", 0);
      } else if (!Number.isNaN(Number(bedrooms))) {
        query = query.gte("bedrooms", Number(bedrooms));
      }
    }

    if (bathrooms && typeof bathrooms === "string" && !Number.isNaN(Number(bathrooms))) {
      query = query.gte("bathrooms", Number(bathrooms));
    }

    const minPrice = parseNumber(min_price);
    const maxPrice = parseNumber(max_price);

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    if (size && typeof size === "string") {
      const { min, max } = parseSizeRange(size);
      const isLand = type && typeof type === "string" && type.toLowerCase() === "land";
      const sizeColumn = isLand ? "land_size" : "house_size";
      if (min !== undefined) {
        query = query.gte(sizeColumn, min);
      }
      if (max !== undefined) {
        query = query.lte(sizeColumn, max);
      }
    }

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data: properties, error, count } = await query;

    if (error) {
      console.error("Rent search error:", error);
      return res.status(500).json({ error: "Failed to fetch rentals" });
    }

    const propertyIds = (properties || []).map((property) => property.id).filter(Boolean);

    const { data: amenities } = propertyIds.length
      ? await supabaseAdmin
          .from("property_amenities")
          .select("listing_id,amenities(name)")
          .in("listing_id", propertyIds)
      : { data: [] };

    const amenitiesByProperty = (amenities || []).reduce<Record<string, string[]>>(
      (acc, amenity) => {
        const listingId = amenity?.listing_id;
        const name = amenity?.amenities?.name;
        if (!listingId || !name) return acc;
        if (!acc[listingId]) {
          acc[listingId] = [];
        }
        acc[listingId].push(String(name).toLowerCase());
        return acc;
      },
      {}
    );

    const results = (properties || []).map((property) => {
      const amenityList = amenitiesByProperty[property.id] || [];
      return {
        id: property.id,
        title: property.title || "Premium Rental",
        location: property.locations?.name || "",
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area:
          property.type?.toLowerCase?.() === "land"
            ? property.land_size
            : property.house_size,
        image: null,
        property_type: property.type,
        amenities: amenityList,
        parking: amenityList.includes("parking"),
        gym: amenityList.includes("gym"),
        lift: amenityList.includes("lift"),
        pool: amenityList.includes("pool"),
      };
    });

    return res.status(200).json({
      results,
      total: count ?? results.length,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
