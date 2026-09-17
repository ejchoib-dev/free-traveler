"use server";

import { createClient } from "@/lib/supabase/auth";

export async function blockUser(blockedId: string) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");
  if (user.id === blockedId) throw new Error("Cannot block yourself");

  const { error } = await supabase.from("user_block").insert({
    blocker_id: user.id,
    blocked_id: blockedId,
  });

  if (error) throw error;
}

export async function unblockUser(blockedId: string) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("user_block")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", blockedId);

  if (error) throw error;
}

export async function isUserBlocked(userId: string, targetId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_block")
    .select("id")
    .eq("blocker_id", userId)
    .eq("blocked_id", targetId)
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
