-- Migration: Add gift_font column to orders table
-- Run this in your Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_font varchar(30);
