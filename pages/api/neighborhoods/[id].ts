// File: pages/api/neighborhoods/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

type Neighborhood = {
  id: number;
  name: string;
  created_at: string;
};

type Data =
  | { neighborhood: Neighborhood }
  | { message: string }
  | { error: string };

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
      // Fetch a single neighborhood
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        return res.status(404).json({ error: "Neighborhood not found" });
      }

      return res.status(200).json({ neighborhood: data });
    }

    if (req.method === "PUT") {
      // Update neighborhood
      const { name } = req.body;
      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Neighborhood name is required" });
      }

      // Check if name already exists in another neighborhood
      const { data: existing, error: checkError } = await supabase
        .from("neighborhoods")
        .select("*")
        .eq("name", name)
        .neq("id", Number(id))
        .single();

      if (existing) {
        return res.status(409).json({ error: "Neighborhood name already exists" });
      }

      const { data, error } = await supabase
        .from("neighborhoods")
        .update({ name })
        .eq("id", Number(id))
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ neighborhood: data });
    }

    if (req.method === "DELETE") {
      // Delete neighborhood
      const { error } = await supabase
        .from("neighborhoods")
        .delete()
        .eq("id", Number(id));

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: "Neighborhood deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
