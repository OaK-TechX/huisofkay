// Create or update an admin user (bcrypt-hashed). Run:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' DATABASE_URL='...' pnpm exec tsx scripts/create-admin.ts
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { adminUsers } from "../db/schema";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const db = getDb();
  const existing = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (existing[0]) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.email, email));
    console.log("Updated admin:", email);
  } else {
    await db.insert(adminUsers).values({ email, passwordHash });
    console.log("Created admin:", email);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
