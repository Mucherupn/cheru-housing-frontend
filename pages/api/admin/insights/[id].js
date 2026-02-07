import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const payload = {
      property_type: req.body?.propertyType?.trim(),
      average_price:
        req.body?.averagePrice !== "" ? Number(req.body?.averagePrice) : null,
      month: req.body?.month ? Number(req.body?.month) : null,
      year: req.body?.year ? Number(req.body?.year) : null,
    };

    const { data, error } = await supabaseAdmin
      .from("insights_data")
      .update(payload)
      .eq("id", id)
      .select("*")
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
