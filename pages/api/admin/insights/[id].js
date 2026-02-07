import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const payload = {
      title: req.body?.title?.trim(),
      content: req.body?.content?.trim() || null,
      year: req.body?.year ? Number(req.body?.year) : null,
      location_id: req.body?.locationId || null,
    };

    if (!payload.title || !payload.year || !payload.location_id) {
      return res.status(400).json({ error: "Missing insights fields." });
    }

    const { data, error } = await supabaseAdmin
      .from("insights_data")
      .update(payload)
      .eq("id", id)
      .select("id,title,content,year,location_id,created_at,updated_at")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ insight: data });
  }

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin
      .from("insights_data")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
