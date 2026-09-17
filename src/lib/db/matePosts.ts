"use server";

import { createClient } from "@/lib/supabase/auth";

export async function createMatePost(input: {
  title: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  recruitmentCount: number;
  preferredConditions?: string;
  travelStyle: string[];
  description: string;
  safetyAgreed: boolean;
}) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("mate_post").insert({
    user_id: user.id,
    title: input.title,
    country: input.country,
    region: input.region,
    start_date: input.startDate,
    end_date: input.endDate,
    recruitment_count: input.recruitmentCount,
    preferred_conditions: input.preferredConditions,
    travel_style: input.travelStyle,
    description: input.description,
    safety_agreed: input.safetyAgreed,
    status: "OPEN",
  });

  if (error) throw error;
}

export async function listMatePostsOpen(filters?: {
  country?: string;
  region?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("mate_post").select("*").eq("status", "OPEN");

  if (filters?.country) query = query.eq("country", filters.country);
  if (filters?.region) query = query.eq("region", filters.region);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getMatePost(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mate_post")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateMatePost(
  id: string,
  input: Partial<{ title: string; description: string; preferredConditions: string }>
) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("mate_post")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function closeMatePost(id: string) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("mate_post")
    .update({ status: "CLOSED" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
