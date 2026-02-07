import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("estimator_configs")
      .select("*, locations(name)")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ configs: data });
  }

  if (req.method === "POST") {
    const locationId = req.body?.locationId;
    const pricePerSqm = req.body?.pricePerSqm;
    const landPricePerAcre = req.body?.landPricePerAcre;

    if (!locationId) {
      return res.status(400).json({ error: "Location is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("estimator_configs")
      .insert([
        {
          location_id: locationId,
          price_per_sqm: pricePerSqm !== "" ? Number(pricePerSqm) : null,
          land_price_per_acre:
            landPricePerAcre !== "" ? Number(landPricePerAcre) : null,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ config: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
