import { supabase } from "./supabaseClient";

const getAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

export const apiRequest = async (path, options = {}) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Missing admin session.");
  }

  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = payload?.error || "Request failed.";
    throw new Error(error);
  }

  return payload;
};
