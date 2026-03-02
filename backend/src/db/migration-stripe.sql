-- Migration: Add Stripe payment columns to orders table
-- Run this in Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id varchar(200);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status varchar(20) DEFAULT 'pending';
