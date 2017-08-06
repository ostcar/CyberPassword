declare module "asmcrypto.js" {
  declare export class PBKDF2_HMAC_SHA256 {
    static bytes(password: string, salt: string, interation: number, length: number): Array<number>
  }
}
