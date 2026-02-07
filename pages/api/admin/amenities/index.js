import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("amenities")
      .select("id,name")
      .order("name");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ amenities: data });
  }

  if (req.method === "POST") {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ error: "Amenity name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("amenities")
      .insert([{ name }])
      .select("id,name")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ amenity: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
