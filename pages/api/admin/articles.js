const articles = [
  {
    id: "article_1",
    title: "Market Pulse: Nairobi",
    slug: "market-pulse-nairobi",
    status: "draft",
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ data: articles });
  }

  if (req.method === "POST") {
    return res.status(201).json({
      message: "Article created",
      data: { id: "article_new", ...req.body },
    });
  }

  if (req.method === "PUT") {
    return res.status(200).json({
      message: "Article updated",
      data: { ...req.body },
    });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ message: "Article deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
