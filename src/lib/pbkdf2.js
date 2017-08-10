// @flow

const asciiToUint8Array = (str: string):Uint8Array => {
  let chars = []
  for (let i = 0; i < str.length; ++i) {
    chars.push(str.charCodeAt(i))
  }
  return new Uint8Array(chars)
}

export const pbkdf2 = (password:string, salt:string, interations:number):Promise<Uint8Array> => {
  return window.crypto.subtle.importKey('raw', asciiToUint8Array(password), 'PBKDF2', false, ['deriveBits'])
  .then(baseKey => {
    return window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: asciiToUint8Array(salt),
        iterations: interations,
        hash: 'sha-256',
      },
      baseKey,
      128,
    )
  })
  .then(result => {
    return new Uint8Array(result)
  })
}
