// File: pages/api/neighborhoods/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
type Data = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid neighborhood ID" });
  }

  try {
    if (req.method === "GET") {
      return res.status(410).json({ error: "Neighborhoods are no longer supported." });
    }

    if (req.method === "PUT") {
      return res.status(410).json({ error: "Neighborhoods are no longer supported." });
    }

    if (req.method === "DELETE") {
      return res.status(410).json({ error: "Neighborhoods are no longer supported." });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
