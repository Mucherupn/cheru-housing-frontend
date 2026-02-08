import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("insights_data")
      .select(
        "id,title,content,year,location_id,created_at,updated_at,location:locations(name)"
      )
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ insights: data });
  }

  if (req.method === "POST") {
    const locationId = req.body?.locationId;
    const title = req.body?.title?.trim();
    const content = req.body?.content?.trim();
    const year = req.body?.year;

    if (!locationId || !title || !year) {
      return res.status(400).json({ error: "Missing insights fields." });
    }

    const { data, error } = await supabaseAdmin
      .from("insights_data")
      .insert([
        {
          location_id: locationId,
          title,
          content: content || null,
          year: Number(year),
        },
      ])
      .select("id,title,content,year,location_id,created_at,updated_at")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ insight: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
