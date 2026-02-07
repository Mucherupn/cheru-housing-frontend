export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({
      message: "Bulk upload queued",
      summary: {
        rowsReceived: 148,
        validRows: 142,
        flaggedRows: 6,
      },
    });
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
