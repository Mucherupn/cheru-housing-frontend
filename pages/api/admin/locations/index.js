import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data: locations, error: locationError } = await supabaseAdmin
      .from("locations")
      .select("id,name,slug")
      .order("name");

    if (locationError) {
      return res.status(500).json({ error: locationError.message });
    }
    return res.status(200).json({ locations });
  }

  if (req.method === "POST") {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ error: "Location name is required." });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert([{ name, slug }])
      .select("id,name,slug")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ location: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
