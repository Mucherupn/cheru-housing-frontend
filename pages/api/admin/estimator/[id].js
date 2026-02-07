import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const payload = {
      price_per_sqm:
        req.body?.pricePerSqm !== "" ? Number(req.body?.pricePerSqm) : null,
      land_price_per_acre:
        req.body?.landPricePerAcre !== ""
          ? Number(req.body?.landPricePerAcre)
          : null,
    };

    const { data, error } = await supabaseAdmin
      .from("estimator_configs")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ config: data });
  }

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin
      .from("estimator_configs")
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
