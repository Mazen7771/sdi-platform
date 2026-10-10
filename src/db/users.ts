import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to upsert user:", error);
    throw new Error("Failed to register/sync user profile.", { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Failed to fetch user by UID:", error);
    throw new Error("Failed to fetch user profile.", { cause: error });
  }
}

export async function updateUserCredentialId(uid: string, credentialId: string) {
  try {
    const result = await db.update(users)
      .set({ credentialId })
      .where(eq(users.uid, uid))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Failed to link credential to user:", error);
    throw new Error("Failed to update user credential.", { cause: error });
  }
}
