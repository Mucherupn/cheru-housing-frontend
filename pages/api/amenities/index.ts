import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // =========================
  // GET: Fetch all amenities
  // =========================
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("amenities")
        .select("id,name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Supabase GET error:", error);
        return res.status(500).json({ error: "Failed to fetch amenities" });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // =========================
  // POST: Create new amenity
  // =========================
  if (req.method === "POST") {
    try {
      const { name } = req.body;

      // Validate input
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Amenity name is required" });
      }

      const cleanName = name.trim();

      // Check for duplicate
      const { data: existing } = await supabase
        .from("amenities")
        .select("id,name")
        .eq("name", cleanName)
        .maybeSingle();

      if (existing) {
        return res.status(409).json({
          error: "Amenity already exists",
        });
      }

      // Insert new amenity
      const { data, error } = await supabase
        .from("amenities")
        .insert([{ name: cleanName }])
        .select("id,name")
        .single();

      if (error) {
        console.error("Supabase POST error:", error);
        return res.status(500).json({ error: "Failed to create amenity" });
      }

      return res.status(201).json(data);
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // =========================
  // Method not allowed
  // =========================
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
