const locations = [
  {
    id: "loc_westlands",
    name: "Westlands",
    averagePrice: "KES 22.3M",
    popularTypes: ["Apartments", "Penthouses"],
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ data: locations });
  }

  if (req.method === "POST") {
    return res.status(201).json({
      message: "Location created",
      data: { id: "loc_new", ...req.body },
    });
  }

  if (req.method === "PUT") {
    return res.status(200).json({
      message: "Location updated",
      data: { ...req.body },
    });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ message: "Location deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
