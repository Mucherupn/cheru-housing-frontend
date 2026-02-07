import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type InsightProperty = {
  id: number;
  title: string;
  slug: string;
  location_id: number;
  property_type?: string | null;
  description?: string | null;
  asking_price_min?: number | null;
  asking_price_max?: number | null;
  rent_price_min?: number | null;
  rent_price_max?: number | null;
  year_built?: number | null;
  total_units?: number | null;
  unit_types?: string[] | string | null;
  size_range?: string | null;
  developer?: string | null;
  parking_ratio?: string | null;
  created_at?: string | null;
};

type InsightImage = {
  property_id: number;
  image_url: string;
  is_featured?: boolean | null;
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
    const locationQuery = typeof req.query.location === "string" ? req.query.location : "";

    if (!locationQuery) {
      return res.status(400).json({ error: "Location is required." });
    }

    const { data: locationData, error: locationError } = await supabaseAdmin
      .from("locations")
      .select("id,name,slug")
      .or(`slug.ilike.%${locationQuery}%,name.ilike.%${locationQuery}%`)
      .maybeSingle();

    if (locationError) {
      return res.status(500).json({ error: locationError.message });
    }

    if (!locationData?.id) {
      return res.status(200).json({ properties: [], articles: [], location: null });
    }

    const { data: properties, error: propertiesError } = await supabaseAdmin
      .from("insights_properties")
      .select("*")
      .eq("location_id", locationData.id)
      .order("created_at", { ascending: false });

    if (propertiesError) {
      return res.status(500).json({ error: propertiesError.message });
    }

    const propertyList = (properties ?? []) as InsightProperty[];
    const propertyIds = propertyList.map((property) => property.id);

    let images: InsightImage[] = [];
    if (propertyIds.length > 0) {
      const { data: imagesData, error: imagesError } = await supabaseAdmin
        .from("insights_images")
        .select("property_id,image_url,is_featured")
        .in("property_id", propertyIds);

      if (imagesError) {
        return res.status(500).json({ error: imagesError.message });
      }

      images = (imagesData ?? []) as InsightImage[];
    }

    const { data: articles, error: articlesError } = await supabaseAdmin
      .from("area_articles")
      .select("*")
      .eq("location_id", locationData.id)
      .order("created_at", { ascending: false });

    if (articlesError) {
      return res.status(500).json({ error: articlesError.message });
    }

    const propertiesWithImages = propertyList.map((property) => {
      const propertyImages = images.filter((image) => image.property_id === property.id);
      const featured =
        propertyImages.find((image) => image.is_featured) ?? propertyImages[0] ?? null;

      return {
        ...property,
        featured_image: featured?.image_url ?? null,
        images_count: propertyImages.length,
      };
    });

    return res.status(200).json({
      location: locationData,
      properties: propertiesWithImages,
      articles: articles ?? [],
    });
  } catch (error: any) {
    console.error("API error @ /api/insights:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
