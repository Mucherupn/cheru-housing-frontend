import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type InsightEntry = {
  id: string;
  title: string;
  content?: string | null;
  year?: number | null;
  location_id?: string | null;
  created_at?: string | null;
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

    const { data: insight, error: insightError } = await supabaseAdmin
      .from("insights_data")
      .select("id,title,content,year,location_id,created_at,updated_at")
      .eq("id", propertySlug)
      .maybeSingle();

    if (insightError) {
      return res.status(500).json({ error: insightError.message });
    }

    if (!insight) {
      const { data: article, error: articleError } = await supabaseAdmin
        .from("articles")
        .select("id,slug,title,content,featured_image,location_id,created_at")
        .eq("slug", propertySlug)
        .maybeSingle();

      if (articleError) {
        return res.status(500).json({ error: articleError.message });
      }

      if (!article) {
        return res
          .status(200)
          .json({ insight: null, articles: [], location: null, article: null });
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
        insight: null,
        articles: [],
        location: articleLocation ?? null,
        article,
      });
    }

    const insightEntry = insight as InsightEntry;

    const { data: locationData, error: locationError } = await supabaseAdmin
      .from("locations")
      .select("id,name,slug")
      .eq("id", insightEntry.location_id)
      .maybeSingle();

    if (locationError) {
      return res.status(500).json({ error: locationError.message });
    }

    const { data: articles, error: articlesError } = await supabaseAdmin
      .from("articles")
      .select("id,slug,title,content,featured_image,location_id,created_at")
      .eq("location_id", insightEntry.location_id)
      .order("created_at", { ascending: false });

    if (articlesError) {
      return res.status(500).json({ error: articlesError.message });
    }

    return res.status(200).json({
      insight: insightEntry,
      articles: articles ?? [],
      location: locationData ?? null,
      article: null,
    });
  } catch (error: any) {
    console.error("API error @ /api/insights/[property_slug]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
