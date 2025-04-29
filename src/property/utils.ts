import crypto from "crypto";

export function hashToObjectId(input: string) {
  return crypto.createHash("md5").update(input).digest("hex").slice(0, 24);
}
