const sampleListings = [
  {
    id: "listing_1",
    title: "Tigoni Heights",
    type: ["sale"],
    price: "KES 43.5M",
    status: "active",
  },
  {
    id: "listing_2",
    title: "Kilimani Skyview",
    type: ["rent"],
    price: "KES 210K",
    status: "active",
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ data: sampleListings });
  }

  if (req.method === "POST") {
    const payload = req.body || {};
    return res.status(201).json({
      message: "Listing created",
      data: { id: "listing_new", ...payload },
    });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
