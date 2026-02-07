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

const resolveImageUrl = (image: Record<string, any>) =>
  image?.image_url ||
  image?.url ||
  image?.src ||
  image?.path ||
  image?.image;

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

    let locationFilter = "";

    if (location && typeof location === "string") {
      const { data: locationData } = await supabaseAdmin
        .from("locations")
        .select("*")
        .or(`slug.ilike.%${location}%,name.ilike.%${location}%`)
        .maybeSingle();

      if (locationData?.name) {
        locationFilter = locationData.name;
      } else {
        locationFilter = location;
      }
    }

    let query = supabaseAdmin
      .from("properties")
      .select("*", { count: "exact" })
      .eq("listing_type", "rent");

    if (locationFilter) {
      query = query.ilike("location", `%${locationFilter}%`);
    }

    if (type && typeof type === "string") {
      query = query.eq("property_type", type);
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
      if (min !== undefined) {
        query = query.gte("area", min);
      }
      if (max !== undefined) {
        query = query.lte("area", max);
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

    const propertyIds = (properties || [])
      .map((property) => property.id)
      .filter(Boolean);

    const [imagesResponse, amenitiesResponse] = await Promise.all([
      propertyIds.length
        ? supabaseAdmin.from("property_images").select("*").in("property_id", propertyIds)
        : Promise.resolve({ data: [] }),
      propertyIds.length
        ? supabaseAdmin.from("amenities").select("*").in("property_id", propertyIds)
        : Promise.resolve({ data: [] }),
    ]);

    const images = imagesResponse.data || [];
    const amenities = amenitiesResponse.data || [];

    const imagesByProperty = images.reduce<Record<number, string>>((acc, image) => {
      const propertyId = image?.property_id;
      if (!propertyId) return acc;
      if (acc[propertyId]) return acc;
      const imageUrl = resolveImageUrl(image);
      if (imageUrl) {
        acc[propertyId] = imageUrl;
      }
      return acc;
    }, {});

    const amenitiesByProperty = amenities.reduce<Record<number, string[]>>(
      (acc, amenity) => {
        const propertyId = amenity?.property_id;
        if (!propertyId) return acc;
        const name = amenity?.name || amenity?.amenity;
        if (!name) return acc;
        if (!acc[propertyId]) {
          acc[propertyId] = [];
        }
        acc[propertyId].push(String(name).toLowerCase());
        return acc;
      },
      {}
    );

    const results = (properties || []).map((property) => {
      const amenityList = amenitiesByProperty[property.id] || [];
      return {
        id: property.id,
        title: property.title || property.name || "Premium Rental",
        location: property.location || locationFilter,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        image: imagesByProperty[property.id],
        property_type: property.property_type,
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
