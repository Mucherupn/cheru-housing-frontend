export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    return res.status(200).json({
      data: { id, title: "Sample listing", status: "active" },
    });
  }

  if (req.method === "PUT") {
    return res.status(200).json({
      message: "Listing updated",
      data: { id, ...req.body },
    });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ message: "Listing deleted", id });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
