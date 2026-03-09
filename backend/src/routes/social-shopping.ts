import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, getUserId } from "../middleware/auth";

const router = Router();

function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/social-shopping/sessions - Create a shopping session (Auth)
router.post("/sessions", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const sessionCode = generateSessionCode();

    const { data, error } = await supabase
      .from("shopping_sessions")
      .insert({
        host_id: userId,
        session_code: sessionCode,
        title: title.trim(),
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Shopping session created" });
  } catch (err) {
    console.error("Error creating shopping session:", err);
    res.status(500).json({ error: "Failed to create shopping session" });
  }
});

// GET /api/social-shopping/sessions/my - Get user's sessions (Auth)
router.get("/sessions/my", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data, error } = await supabase
      .from("shopping_sessions")
      .select("*")
      .eq("host_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching user sessions:", err);
    res.status(500).json({ error: "Failed to fetch user sessions" });
  }
});

// GET /api/social-shopping/sessions/:code - Get session by code with participants (Public)
router.get("/sessions/:code", async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const { data: session, error: sessionError } = await supabase
      .from("shopping_sessions")
      .select("*")
      .eq("session_code", code)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: "Shopping session not found" });
      return;
    }

    const { data: participants, error: participantsError } = await supabase
      .from("shopping_session_participants")
      .select("*")
      .eq("session_id", session.id)
      .order("joined_at", { ascending: true });

    if (participantsError) {
      res.status(500).json({ error: participantsError.message });
      return;
    }

    res.json({ data: { ...session, participants: participants || [] } });
  } catch (err) {
    console.error("Error fetching shopping session:", err);
    res.status(500).json({ error: "Failed to fetch shopping session" });
  }
});

// POST /api/social-shopping/sessions/:code/join - Join a session (Auth)
router.post("/sessions/:code/join", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { code } = req.params;
    const { display_name } = req.body;

    if (!display_name || typeof display_name !== "string" || display_name.trim().length === 0) {
      res.status(400).json({ error: "display_name is required" });
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from("shopping_sessions")
      .select("id, is_active")
      .eq("session_code", code)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: "Shopping session not found" });
      return;
    }

    if (!session.is_active) {
      res.status(400).json({ error: "Shopping session has ended" });
      return;
    }

    const { data, error } = await supabase
      .from("shopping_session_participants")
      .insert({
        session_id: session.id,
        user_id: userId,
        display_name: display_name.trim(),
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        res.status(400).json({ error: "You have already joined this session" });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Joined shopping session" });
  } catch (err) {
    console.error("Error joining shopping session:", err);
    res.status(500).json({ error: "Failed to join shopping session" });
  }
});

// GET /api/social-shopping/sessions/:code/messages - Get session messages (Auth)
router.get("/sessions/:code/messages", requireAuth, async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const { data: session, error: sessionError } = await supabase
      .from("shopping_sessions")
      .select("id")
      .eq("session_code", code)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: "Shopping session not found" });
      return;
    }

    const { data, error } = await supabase
      .from("shopping_session_messages")
      .select("*, products(id, name, price, image_url, slug)")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const messages = (data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      session_id: item.session_id,
      sender_id: item.sender_id,
      sender_name: item.sender_name,
      message: item.message,
      message_type: item.message_type,
      product_id: item.product_id,
      created_at: item.created_at,
      product: item.products || null,
    }));

    res.json({ data: messages });
  } catch (err) {
    console.error("Error fetching session messages:", err);
    res.status(500).json({ error: "Failed to fetch session messages" });
  }
});

// POST /api/social-shopping/sessions/:code/messages - Send a message (Auth)
router.post("/sessions/:code/messages", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { code } = req.params;
    const { message, message_type, product_id } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (!message_type || typeof message_type !== "string") {
      res.status(400).json({ error: "message_type is required" });
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from("shopping_sessions")
      .select("id, is_active")
      .eq("session_code", code)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: "Shopping session not found" });
      return;
    }

    if (!session.is_active) {
      res.status(400).json({ error: "Shopping session has ended" });
      return;
    }

    // Get sender's display name from participants
    const { data: participant, error: participantError } = await supabase
      .from("shopping_session_participants")
      .select("display_name")
      .eq("session_id", session.id)
      .eq("user_id", userId)
      .single();

    if (participantError || !participant) {
      res.status(403).json({ error: "You must join the session before sending messages" });
      return;
    }

    const { data, error } = await supabase
      .from("shopping_session_messages")
      .insert({
        session_id: session.id,
        sender_id: userId,
        sender_name: participant.display_name,
        message: message.trim(),
        message_type,
        product_id: product_id || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Message sent" });
  } catch (err) {
    console.error("Error sending session message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// PATCH /api/social-shopping/sessions/:code/end - End a session (Auth, host only)
router.patch("/sessions/:code/end", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { code } = req.params;

    const { data: session, error: sessionError } = await supabase
      .from("shopping_sessions")
      .select("id, host_id, is_active")
      .eq("session_code", code)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: "Shopping session not found" });
      return;
    }

    if (session.host_id !== userId) {
      res.status(403).json({ error: "Only the host can end the session" });
      return;
    }

    if (!session.is_active) {
      res.status(400).json({ error: "Shopping session has already ended" });
      return;
    }

    const { data, error } = await supabase
      .from("shopping_sessions")
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq("id", session.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Shopping session ended" });
  } catch (err) {
    console.error("Error ending shopping session:", err);
    res.status(500).json({ error: "Failed to end shopping session" });
  }
});

export default router;
