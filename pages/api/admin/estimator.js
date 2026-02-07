const estimatorData = {
  basePriceByLocation: {
    Westlands: 18200000,
    Karen: 25600000,
  },
  pricePerSqm: 134000,
  landRatePerAcre: 42000000,
  adjustments: {
    luxuryAmenities: 0.12,
    ageOver20: -0.06,
    panoramicView: 0.08,
    poorCondition: -0.1,
  },
};

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ data: estimatorData });
  }

  if (req.method === "PUT") {
    return res.status(200).json({
      message: "Estimator data updated",
      data: { ...req.body },
    });
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ message: "Method not allowed" });
}
