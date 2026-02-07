import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Validate ID
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid amenity ID" });
  }

  const amenityId = parseInt(id, 10);

  if (isNaN(amenityId)) {
    return res.status(400).json({ error: "Amenity ID must be a number" });
  }

  // =========================
  // GET: Fetch single amenity
  // =========================
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("amenities")
        .select("id,name")
        .eq("id", amenityId)
        .single();

      if (error) {
        console.error("Supabase GET error:", error);
        return res.status(404).json({ error: "Amenity not found" });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // =========================
  // PUT: Update amenity
  // =========================
  if (req.method === "PUT") {
    try {
      const { name } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Amenity name is required" });
      }

      const cleanName = name.trim();

      // Check duplicate (excluding current ID)
      const { data: existing } = await supabase
        .from("amenities")
        .select("id,name")
        .eq("name", cleanName)
        .neq("id", amenityId)
        .maybeSingle();

      if (existing) {
        return res.status(409).json({
          error: "Another amenity with this name already exists",
        });
      }

      const { data, error } = await supabase
        .from("amenities")
        .update({ name: cleanName })
        .eq("id", amenityId)
        .select("id,name")
        .single();

      if (error) {
        console.error("Supabase PUT error:", error);
        return res.status(500).json({ error: "Failed to update amenity" });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // =========================
  // DELETE: Remove amenity
  // =========================
  if (req.method === "DELETE") {
    try {
      const { error } = await supabase
        .from("amenities")
        .delete()
        .eq("id", amenityId);

      if (error) {
        console.error("Supabase DELETE error:", error);
        return res.status(500).json({ error: "Failed to delete amenity" });
      }

      return res.status(200).json({
        message: "Amenity deleted successfully",
      });
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // =========================
  // Method not allowed
  // =========================
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
