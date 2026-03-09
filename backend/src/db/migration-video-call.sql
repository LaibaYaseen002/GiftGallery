-- Add video call support to shopping_sessions table
ALTER TABLE shopping_sessions
ADD COLUMN IF NOT EXISTS video_room_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS video_room_name TEXT DEFAULT NULL;
