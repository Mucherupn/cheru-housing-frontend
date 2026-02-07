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
  id: number;
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
    const propertySlug =
      typeof req.query.property_slug === "string" ? req.query.property_slug : "";

    if (!propertySlug) {
      return res.status(400).json({ error: "Property slug is required." });
    }

    const { data: property, error: propertyError } = await supabaseAdmin
      .from("insights_properties")
      .select("*")
      .eq("slug", propertySlug)
      .maybeSingle();

    if (propertyError) {
      return res.status(500).json({ error: propertyError.message });
    }

    if (!property) {
      const { data: article, error: articleError } = await supabaseAdmin
        .from("area_articles")
        .select("*")
        .eq("slug", propertySlug)
        .maybeSingle();

      if (articleError) {
        return res.status(500).json({ error: articleError.message });
      }

      if (!article) {
        return res
          .status(200)
          .json({ property: null, images: [], articles: [], location: null, article: null });
      }

      const { data: articleLocation, error: articleLocationError } = await supabaseAdmin
        .from("locations")
        .select("id,name,slug")
        .eq("id", article.location_id)
        .maybeSingle();

      if (articleLocationError) {
        return res.status(500).json({ error: articleLocationError.message });
      }

      return res.status(200).json({
        property: null,
        images: [],
        articles: [],
        location: articleLocation ?? null,
        article,
      });
    }

    const insightProperty = property as InsightProperty;

    const { data: locationData, error: locationError } = await supabaseAdmin
      .from("locations")
      .select("id,name,slug")
      .eq("id", insightProperty.location_id)
      .maybeSingle();

    if (locationError) {
      return res.status(500).json({ error: locationError.message });
    }

    const { data: images, error: imagesError } = await supabaseAdmin
      .from("insights_images")
      .select("*")
      .eq("property_id", insightProperty.id)
      .order("is_featured", { ascending: false });

    if (imagesError) {
      return res.status(500).json({ error: imagesError.message });
    }

    const { data: articles, error: articlesError } = await supabaseAdmin
      .from("area_articles")
      .select("*")
      .eq("location_id", insightProperty.location_id)
      .order("created_at", { ascending: false });

    if (articlesError) {
      return res.status(500).json({ error: articlesError.message });
    }

    return res.status(200).json({
      property: insightProperty,
      images: (images ?? []) as InsightImage[],
      articles: articles ?? [],
      location: locationData ?? null,
    });
  } catch (error: any) {
    console.error("API error @ /api/insights/[property_slug]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
