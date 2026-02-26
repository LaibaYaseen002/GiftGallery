// Migration runner for Feature 18: Enhanced Order Management
// Run: node src/db/run-migration-orders-enhanced.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function runMigration() {
  console.log("Running Feature 18 migration...\n");

  // Test 1: Check if admin_notes column exists
  const { error: colErr } = await supabase
    .from("orders")
    .select("admin_notes")
    .limit(1);

  if (colErr && colErr.message.includes("admin_notes")) {
    console.log("❌ admin_notes column missing on orders table.");
    console.log("   Please run this SQL in the Supabase Dashboard SQL Editor:\n");
    console.log("   ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes text;\n");
  } else {
    console.log("✅ admin_notes column exists on orders table.");
  }

  // Test 2: Check if status_history table exists
  const { error: tblErr } = await supabase
    .from("status_history")
    .select("id")
    .limit(1);

  if (tblErr && tblErr.message.includes("does not exist")) {
    console.log("❌ status_history table missing.");
    console.log("   Please run this SQL in the Supabase Dashboard SQL Editor:\n");
    console.log(`   CREATE TABLE IF NOT EXISTS status_history (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
     old_status varchar(20),
     new_status varchar(20) NOT NULL,
     changed_by varchar(200) NOT NULL,
     note text,
     created_at timestamptz DEFAULT now()
   );
   CREATE INDEX IF NOT EXISTS idx_status_history_order ON status_history(order_id);\n`);
  } else {
    console.log("✅ status_history table exists.");
  }

  // If both exist, we're good
  if (
    !(colErr && colErr.message.includes("admin_notes")) &&
    !(tblErr && tblErr.message.includes("does not exist"))
  ) {
    console.log("\n🎉 Migration already applied! All good.");
  } else {
    console.log("\n⚠️  Please run the SQL above in Supabase Dashboard → SQL Editor, then re-run this script to verify.");
  }
}

runMigration().catch(console.error);
