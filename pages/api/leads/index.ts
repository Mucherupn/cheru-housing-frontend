import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type LeadPayload = {
  property_id: string;
  property_title: string;
  interest_type: string;
  timeline: string;
  phone: string;
  name?: string | null;
  email?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as LeadPayload;

  if (!body.property_id || !body.property_title || !body.interest_type || !body.timeline || !body.phone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert([
      {
        property_id: body.property_id,
        property_title: body.property_title,
        interest_type: body.interest_type,
        timeline: body.timeline,
        phone: body.phone,
        name: body.name ?? null,
        email: body.email ?? null,
        created_at: new Date().toISOString(),
      },
    ])
    .select("id")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ lead: data });
}
