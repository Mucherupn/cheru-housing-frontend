const insights = [
  {
    id: "insight_1",
    location: "Westlands",
    propertyType: "Apartments",
    averagePrice: "KES 22.3M",
    month: "Aug",
    year: 2024,
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ data: insights });
  }

  if (req.method === "POST") {
    return res.status(201).json({
      message: "Insight created",
      data: { id: "insight_new", ...req.body },
    });
  }

  if (req.method === "PUT") {
    return res.status(200).json({
      message: "Insight updated",
      data: { ...req.body },
    });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ message: "Insight deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
