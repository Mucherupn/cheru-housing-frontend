import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { location, property_type, budget, contact, message } = req.body;

    if (
      !location ||
      !property_type ||
      !budget ||
      !contact ||
      typeof contact !== "string"
    ) {
      return res.status(400).json({
        error: "Location, property type, budget, and contact are required.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("property_requests")
      .insert([
        {
          location,
          property_type,
          budget,
          contact,
          message: message || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Property request error:", error);
      return res.status(500).json({ error: "Failed to submit request" });
    }

    return res.status(201).json({ request: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
