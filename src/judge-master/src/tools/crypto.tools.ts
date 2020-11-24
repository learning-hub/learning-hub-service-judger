import { createHash } from "crypto";

export class CryptoTools {
  static md5 (str: string) {
    return createHash('md5').update(str).digest('hex');
  }

  static sha256 (str: string) {
    return createHash('sha256').update(str).digest('hex');
  }
}

export const md5 = CryptoTools.md5;

export const sha256 = CryptoTools.sha256;
