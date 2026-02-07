import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  const { id } = req.query;

  if (req.method === "DELETE") {
    return res.status(410).json({ error: "Neighbourhoods are no longer supported." });
  }

  res.setHeader("Allow", ["DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
