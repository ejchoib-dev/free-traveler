"use server";

import { createClient } from "@/lib/supabase/auth";

function validateHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createOutboundUrl(input: {
  urlType: "flight" | "hotel";
  url: string;
}) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (user as any).user_metadata?.admin === true;
  if (!isAdmin) throw new Error("Forbidden");

  if (!validateHttpsUrl(input.url)) throw new Error("HTTPS URL required");

  const { error } = await supabase.from("outbound_url_setting").insert({
    url_type: input.urlType,
    url: input.url,
  });

  if (error) throw error;
}

export async function getOutboundUrl(urlType: "flight" | "hotel") {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("outbound_url_setting")
    .select("url")
    .eq("url_type", urlType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (error && (error as any).code !== "PGRST116") throw error;
  return data?.url ?? null;
}

export async function listOutboundUrls() {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (user as any).user_metadata?.admin === true;
  if (!isAdmin) throw new Error("Forbidden");

  const { data, error } = await supabase
    .from("outbound_url_setting")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
