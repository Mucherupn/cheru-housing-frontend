const amenities = [
  { id: "amenity_pool", name: "Pool" },
  { id: "amenity_gym", name: "Gym" },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ data: amenities });
  }

  if (req.method === "POST") {
    return res.status(201).json({
      message: "Amenity created",
      data: { id: "amenity_new", ...req.body },
    });
  }

  if (req.method === "PUT") {
    return res.status(200).json({
      message: "Amenity updated",
      data: { ...req.body },
    });
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ message: "Amenity deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
