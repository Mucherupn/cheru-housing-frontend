import { supabaseAdmin, requireAdmin } from "../../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select(
        "id,title,slug,content,status,featured_image,location_id,created_at,updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ articles: data });
  }

  if (req.method === "POST") {
    const title = req.body?.title?.trim();
    const slug = req.body?.slug?.trim();
    const content = req.body?.content?.trim();
    const status = req.body?.status?.trim() || "draft";
    const featuredImage = req.body?.featuredImage || null;
    const locationId = req.body?.locationId || null;

    if (!title || !slug) {
      return res.status(400).json({ error: "Title and slug are required." });
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert([
        {
          title,
          slug,
          content: content || null,
          status,
          featured_image: featuredImage,
          location_id: locationId,
        },
      ])
      .select(
        "id,title,slug,content,status,featured_image,location_id,created_at,updated_at"
      )
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ article: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
