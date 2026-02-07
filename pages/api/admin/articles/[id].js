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
      slug: req.body?.slug?.trim(),
      content: req.body?.content?.trim() || null,
      status: req.body?.status?.trim() || "draft",
      featured_image: req.body?.featuredImage || null,
    };

    if (!payload.title || !payload.slug) {
      return res.status(400).json({ error: "Title and slug are required." });
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ article: data });
  }

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
