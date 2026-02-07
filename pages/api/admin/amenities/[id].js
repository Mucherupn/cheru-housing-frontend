import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ error: "Amenity name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("amenities")
      .update({ name })
      .eq("id", id)
      .select("id,name")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ amenity: data });
  }

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin.from("amenities").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
