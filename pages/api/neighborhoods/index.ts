// File: pages/api/neighborhoods/index.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Data = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      return res.status(410).json({ error: "Neighborhoods are no longer supported." });
    }

    if (req.method === "POST") {
      return res.status(410).json({ error: "Neighborhoods are no longer supported." });
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
