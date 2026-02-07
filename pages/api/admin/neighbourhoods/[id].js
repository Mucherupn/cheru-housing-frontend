import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin
      .from("neighbourhoods")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
