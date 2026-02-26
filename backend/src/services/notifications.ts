import { supabase } from "./supabase";

export async function createNotification(params: {
  type: string;
  title: string;
  message: string;
  reference_id?: string;
}) {
  try {
    await supabase.from("notifications").insert({
      type: params.type,
      title: params.title,
      message: params.message,
      reference_id: params.reference_id || null,
      is_read: false,
    });
  } catch (err) {
    // Non-blocking: don't fail the main operation if notification fails
    console.error("Failed to create notification:", err);
  }
}
