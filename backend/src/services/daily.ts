const DAILY_API_URL = "https://api.daily.co/v1";

function getApiKey(): string {
  const key = process.env.DAILY_API_KEY;
  if (!key) {
    throw new Error("DAILY_API_KEY is not configured");
  }
  return key;
}

export interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: Record<string, unknown>;
}

export async function createDailyRoom(roomName: string): Promise<DailyRoom> {
  const response = await fetch(`${DAILY_API_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      name: roomName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      properties: {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, // 4 hours
        max_participants: 10,
        enable_chat: false, // we have our own chat
        enable_screenshare: true,
        start_video_off: true,
        start_audio_off: false,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({ error: "Unknown error" })) as Record<string, string>;
    throw new Error(errBody.error || `Daily API error: ${response.status}`);
  }

  return response.json() as Promise<DailyRoom>;
}

export async function getDailyRoom(roomName: string): Promise<DailyRoom | null> {
  const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({ error: "Unknown error" })) as Record<string, string>;
    throw new Error(errBody.error || `Daily API error: ${response.status}`);
  }

  return response.json() as Promise<DailyRoom>;
}

export async function deleteDailyRoom(roomName: string): Promise<void> {
  const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errBody = await response.json().catch(() => ({ error: "Unknown error" })) as Record<string, string>;
    throw new Error(errBody.error || `Daily API error: ${response.status}`);
  }
}
