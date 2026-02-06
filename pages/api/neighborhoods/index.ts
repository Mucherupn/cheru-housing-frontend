// File: pages/api/neighborhoods/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

type Neighborhood = {
  id: number;
  name: string;
  created_at: string;
};

type Data =
  | { neighborhoods: Neighborhood[] }
  | { neighborhood: Neighborhood }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      // Fetch all neighborhoods
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ neighborhoods: data || [] });
    }

    if (req.method === "POST") {
      // Create a new neighborhood
      const { name } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Neighborhood name is required" });
      }

      // Check for duplicate
      const { data: existing, error: checkError } = await supabase
        .from("neighborhoods")
        .select("*")
        .eq("name", name)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = not found, which is fine
        return res.status(500).json({ error: checkError.message });
      }

      if (existing) {
        return res.status(409).json({ error: "Neighborhood already exists" });
      }

      const { data, error } = await supabase
        .from("neighborhoods")
        .insert({ name })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ neighborhood: data });
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
