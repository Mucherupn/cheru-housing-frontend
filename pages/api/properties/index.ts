import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Server‑side Supabase client using service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Type helper for property
type Property = {
  id?: number;
  name: string;
  type: string;
  location: string;
  neighborhood: string;
  price: number;
  isAvailable?: boolean;
  landSize?: number | null;
  houseSize?: number | null;
  apartmentFloor?: number | null;
  yearBuilt?: number | null;
  amenities?: string[] | null;
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
      const { type, location, isAvailable } = req.query;

      let query = supabaseAdmin.from("properties").select("*");

      // Apply filters if provided
      if (type && typeof type === "string") {
        query = query.eq("type", type);
      }
      if (location && typeof location === "string") {
        query = query.ilike("location", `%${location}%`);
      }
      if (isAvailable === "true" || isAvailable === "false") {
        query = query.eq("isAvailable", isAvailable === "true");
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
      const body: Property = req.body;

      // Basic validation
      if (!body.name || !body.type || !body.location) {
        return res.status(400).json({ error: "Name, type, and location are required." });
      }

      // Set defaults if needed
      const newProperty = {
        ...body,
        isAvailable: body.isAvailable ?? true,
        landSize: body.landSize ?? null,
        houseSize: body.houseSize ?? null,
        apartmentFloor: body.apartmentFloor ?? null,
        yearBuilt: body.yearBuilt ?? null,
        amenities: body.amenities ?? null,
      };

      const { data, error } = await supabaseAdmin
        .from("properties")
        .insert([newProperty])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ property: data?.[0] ?? null });
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
