import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PropertyInterestPayload = {
  property_id: string;
  interest_type: string;
  timeline: string;
  contact: string;
  message?: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body as PropertyInterestPayload;

    if (!payload.property_id || !payload.interest_type || !payload.timeline || !payload.contact) {
      return res.status(400).json({
        error: "Property, interest type, timeline, and contact are required.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .insert([
        {
          listing_id: payload.property_id,
          request_type: "property_interest",
          interest_type: payload.interest_type,
          timeline: payload.timeline,
          contact: payload.contact,
          message: payload.message ?? null,
        },
      ])
      .select(
        "id,location_id,listing_id,request_type,interest_type,timeline,contact,message,created_at"
      )
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ interest: data ?? null });
  } catch (error: any) {
    console.error("API error @ /api/property-interest:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
