-- Migration: Add is_flash_sale column to discount_codes table
-- Run this in your Supabase SQL Editor

ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS is_flash_sale boolean DEFAULT false;
