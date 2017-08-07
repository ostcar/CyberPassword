declare type asmcrypto$PBKDF2HMACSHA256 = {|
  bytes: (password: string, salt: string, interation: number, length: number) => Array<number>
|}

declare var asmCrypto: {
  PBKDF2_HMAC_SHA256: asmcrypto$PBKDF2HMACSHA256
}
