import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || "Mucherupn@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "mnmn,,223@kia-Ngocivlghu";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const ensureLocation = async (name: string) => {
  const { data: existing } = await supabase
    .from("locations")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existing?.id) return;

  await supabase.from("locations").insert([{ name }]);
};

const run = async () => {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing.users.some(
    (user) => user.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!alreadyExists) {
    await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });
  }

  const defaultLocations = [
    "Karen",
    "Kilimani",
    "Kileleshwa",
    "Runda",
    "Lavington",
    "Westlands",
  ];

  for (const location of defaultLocations) {
    await ensureLocation(location);
  }

  console.log("Seed complete.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
