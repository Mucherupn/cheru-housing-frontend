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
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
    } = req.query;

    let query = supabase.from("properties").select("*");

    if (location && typeof location === "string") {
      query = query.ilike("location", `%${location}%`);
    }

    if (type && typeof type === "string") {
      query = query.eq("property_type", type);
    }

    if (status && typeof status === "string") {
      query = query.eq("status", status);
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

    if (minArea && !Array.isArray(minArea)) {
      query = query.gte("area", Number(minArea));
    }

    if (maxArea && !Array.isArray(maxArea)) {
      query = query.lte("area", Number(maxArea));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Search error:", error);
      return res.status(500).json({ error: "Search failed" });
    }

    return res.status(200).json(data || []);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
