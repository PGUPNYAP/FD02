import crypto from "crypto";

const ENCRYPTION_KEY = process.env.BANK_ENCRYPTION_KEY ?? "default16byte__"; // Exactly 16 bytes!
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return `${iv.toString("base64")}:${encrypted}`;
}

export function decrypt(text: string): string {
  const [ivPart, encryptedData] = text.split(":");
  const iv = Buffer.from(ivPart, "base64");
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
