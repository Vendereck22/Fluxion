import crypto from "crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  stored: { hash?: string | null; salt?: string | null }
) {
  if (!stored.hash) return false;

  if (stored.hash.startsWith("$2a$") || stored.hash.startsWith("$2b$") || stored.hash.startsWith("$2y$")) {
    return bcrypt.compare(password, stored.hash);
  }

  if (stored.salt) {
    const legacyHash = crypto
      .pbkdf2Sync(password, stored.salt, 1000, 64, "sha512")
      .toString("hex");
    return legacyHash === stored.hash;
  }

  return false;
}
