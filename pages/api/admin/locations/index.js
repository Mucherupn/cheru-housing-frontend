import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data: locations, error: locationError } = await supabaseAdmin
      .from("locations")
      .select("*")
      .order("name");

    if (locationError) {
      return res.status(500).json({ error: locationError.message });
    }

    const { data: neighbourhoods, error: neighbourhoodError } = await supabaseAdmin
      .from("neighbourhoods")
      .select("*")
      .order("name");

    if (neighbourhoodError) {
      return res.status(500).json({ error: neighbourhoodError.message });
    }

    return res.status(200).json({ locations, neighbourhoods });
  }

  if (req.method === "POST") {
    const entity = req.body?.entity || "location";

    if (entity === "neighbourhood") {
      const name = req.body?.name?.trim();
      const locationId = req.body?.locationId;

      if (!name || !locationId) {
        return res.status(400).json({ error: "Missing neighbourhood fields." });
      }

      const { data, error } = await supabaseAdmin
        .from("neighbourhoods")
        .insert([{ name, location_id: locationId }])
        .select("*")
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ neighbourhood: data });
    }

    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ error: "Location name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert([{ name }])
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ location: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
