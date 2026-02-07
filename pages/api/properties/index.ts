import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Server‑side Supabase client using service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Type helper for listing
type Listing = {
  id?: string;
  title: string;
  type: string;
  location_id: string;
  description?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  house_size?: number | null;
  land_size?: number | null;
  year_built?: number | null;
  floor?: number | null;
  apartment_name?: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ========================
    // GET /api/properties
    // Optionally filter by query params: type, location, available
    // Example: /api/properties?type=HOUSE&location=Westlands&isAvailable=true
    // ========================
    if (req.method === "GET") {
      const { type, location } = req.query;

      let query = supabaseAdmin.from("listings").select(
        "id,title,description,price,bedrooms,bathrooms,house_size,land_size,year_built,floor,apartment_name,type,location_id,created_at,updated_at,locations(name,slug)"
      );

      // Apply filters if provided
      if (type && typeof type === "string") {
        query = query.eq("type", type);
      }
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

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ properties: data });
    }

    // ========================
    // POST /api/properties
    // Create a new property
    // ========================
    if (req.method === "POST") {
      const body: Listing = req.body;

      // Basic validation
      if (!body.title || !body.type || !body.location_id) {
        return res
          .status(400)
          .json({ error: "Title, type, and location are required." });
      }

      const { data, error } = await supabaseAdmin
        .from("listings")
        .insert([body])
        .select(
          "id,title,description,price,bedrooms,bathrooms,house_size,land_size,year_built,floor,apartment_name,type,location_id,created_at,updated_at"
        );

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ listing: data?.[0] ?? null });
    }

    // ========================
    // Method not allowed
    // ========================
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err: any) {
    console.error("API error @ /api/properties:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
