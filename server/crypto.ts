import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

// Encryption algorithm and key derivation
const ALGORITHM = "aes-256-gcm";
const SALT_LENGTH = 16;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Get encryption key from environment variable
 * This should be a 32-byte hex string or will be derived from a password
 */
function getEncryptionKey(): Buffer {
  const encryptionSecret = process.env.ENCRYPTION_SECRET;
  
  if (!encryptionSecret) {
    throw new Error(
      "ENCRYPTION_SECRET environment variable is required for password encryption. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }

  // If it's a 64-character hex string, use it directly
  if (/^[0-9a-f]{64}$/i.test(encryptionSecret)) {
    return Buffer.from(encryptionSecret, "hex");
  }

  // Otherwise, derive a key from the secret using a fixed salt
  // Note: In production, consider using a more robust key derivation
  const salt = Buffer.from("subscription-manager-salt");
  return scryptSync(encryptionSecret, salt, KEY_LENGTH);
}

/**
 * Encrypt a password string
 * Returns base64-encoded string containing: salt + iv + authTag + encryptedData
 */
export function encryptPassword(password: string | null | undefined): string | null {
  if (!password) {
    return null;
  }

  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const salt = randomBytes(SALT_LENGTH);
    
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(password, "utf8", "base64");
    encrypted += cipher.final("base64");
    
    const authTag = cipher.getAuthTag();
    
    // Combine: salt + iv + authTag + encrypted data
    const combined = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, "base64"),
    ]);
    
    return combined.toString("base64");
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw new Error("Failed to encrypt password");
  }
}

/**
 * Decrypt a password string
 * Expects base64-encoded string containing: salt + iv + authTag + encryptedData
 */
export function decryptPassword(encryptedPassword: string | null | undefined): string | null {
  if (!encryptedPassword) {
    return null;
  }

  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedPassword, "base64");
    
    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = combined.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
    );
    const encryptedData = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData.toString("base64"), "base64", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Error decrypting password:", error);
    throw new Error("Failed to decrypt password - data may be corrupted or key may be incorrect");
  }
}

/**
 * Check if a password string appears to be encrypted (base64 with correct length)
 */
export function isEncrypted(password: string | null | undefined): boolean {
  if (!password) {
    return false;
  }

  try {
    const decoded = Buffer.from(password, "base64");
    // Encrypted passwords should be at least: salt + iv + authTag + some data
    return decoded.length >= SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH + 16;
  } catch {
    return false;
  }
}
