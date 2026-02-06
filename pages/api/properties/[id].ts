import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  try {
    switch (req.method) {
      case "GET":
        // Fetch single property with related data
        const { data: property, error: getError } = await supabase
          .from("Property")
          .select(`
            *,
            Neighborhood(name),
            Amenity(name)
          `)
          .eq("id", id)
          .single();

        if (getError) return res.status(404).json({ error: getError.message });
        return res.status(200).json(property);

      case "PUT":
        // Update property (expecting JSON body with fields to update)
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
          return res.status(400).json({ error: "No update data provided" });
        }

        const { data: updatedProperty, error: updateError } = await supabase
          .from("Property")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (updateError) return res.status(400).json({ error: updateError.message });
        return res.status(200).json(updatedProperty);

      case "DELETE":
        // Delete property
        const { data: deletedProperty, error: deleteError } = await supabase
          .from("Property")
          .delete()
          .eq("id", id)
          .select()
          .single();

        if (deleteError) return res.status(400).json({ error: deleteError.message });
        return res.status(200).json({ message: "Property deleted successfully", deletedProperty });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (err) {
    console.error("Property [id] API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
