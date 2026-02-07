import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase environment variables are missing.");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const fallbackAdminEmail = "Mucherupn@gmail.com";

export const getAdminEmail = () =>
  (process.env.ADMIN_EMAIL || fallbackAdminEmail).toLowerCase();

export const requireAdmin = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Missing authorization header." });
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    res.status(401).json({ error: "Missing access token." });
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    res.status(401).json({ error: "Invalid or expired session." });
    return null;
  }

  const adminEmail = getAdminEmail();

  if (data.user.email?.toLowerCase() !== adminEmail) {
    res.status(403).json({ error: "Admin access required." });
    return null;
  }

  return data.user;
};
