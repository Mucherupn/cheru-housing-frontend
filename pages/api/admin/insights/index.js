import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("insights_data")
      .select("*, locations(name)")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ insights: data });
  }

  if (req.method === "POST") {
    const locationId = req.body?.locationId;
    const propertyType = req.body?.propertyType?.trim();
    const averagePrice = req.body?.averagePrice;
    const month = req.body?.month;
    const year = req.body?.year;

    if (!locationId || !propertyType || !month || !year) {
      return res.status(400).json({ error: "Missing insights fields." });
    }

    const { data, error } = await supabaseAdmin
      .from("insights_data")
      .insert([
        {
          location_id: locationId,
          property_type: propertyType,
          average_price: averagePrice !== "" ? Number(averagePrice) : null,
          month: Number(month),
          year: Number(year),
        },
      ])
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ insight: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
