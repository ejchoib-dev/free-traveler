"use server";

import { createClient } from "@/lib/supabase/auth";

export async function createReport(input: {
  targetType: "post" | "user" | "application";
  targetId: string;
  reason: string;
  description?: string;
}) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("report")
    .insert({
      target_type: input.targetType,
      target_id: input.targetId,
      reporter_id: user.id,
      reason: input.reason,
      description: input.description,
      status: "PENDING",
    })
    .select("id, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function listReports(filters?: { status?: string }) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (user as any).user_metadata?.admin === true;
  if (!isAdmin) throw new Error("Forbidden");

  let query = supabase.from("report").select("*");
  if (filters?.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function resolveReport(id: string) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (user as any).user_metadata?.admin === true;
  if (!isAdmin) throw new Error("Forbidden");

  const { error } = await supabase
    .from("report")
    .update({ status: "RESOLVED" })
    .eq("id", id);

  if (error) throw error;
}
