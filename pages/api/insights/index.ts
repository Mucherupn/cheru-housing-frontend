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
      return res.status(200).json({ insights: [], articles: [], location: null });
    }

    const { data: insights, error: insightsError } = await supabaseAdmin
      .from("insights_data")
      .select("id,title,content,year,location_id,created_at,updated_at")
      .eq("location_id", locationData.id)
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });

    if (insightsError) {
      return res.status(500).json({ error: insightsError.message });
    }

    const { data: articles, error: articlesError } = await supabaseAdmin
      .from("articles")
      .select("id,slug,title,content,featured_image,location_id,created_at")
      .eq("location_id", locationData.id)
      .order("created_at", { ascending: false });

    if (articlesError) {
      return res.status(500).json({ error: articlesError.message });
    }

    return res.status(200).json({
      location: locationData,
      insights: (insights ?? []) as InsightEntry[],
      articles: articles ?? [],
    });
  } catch (error: any) {
    console.error("API error @ /api/insights:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
