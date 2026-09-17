"use server";

import { createClient } from "@/lib/supabase/auth";

export async function createApplication(input: {
  matePostId: string;
  message: string;
}) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  if (input.message.length > 500) throw new Error("Message too long");

  const { error } = await supabase.from("mate_application").insert({
    mate_post_id: input.matePostId,
    user_id: user.id,
    message: input.message,
    status: "PENDING",
  });

  if (error) throw error;
}

export async function getApplication(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mate_application")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function listApplicationsForPost(matePostId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mate_application")
    .select("*")
    .eq("mate_post_id", matePostId);
  if (error) throw error;
  return data;
}

export async function approveApplication(id: string) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("mate_application")
    .update({ status: "APPROVED" })
    .eq("id", id);

  if (error) throw error;
}

export async function rejectApplication(id: string) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("mate_application")
    .update({ status: "REJECTED" })
    .eq("id", id);

  if (error) throw error;
}
