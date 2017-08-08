// @flow

// Syncron function that returns the password for a given master password and
// given domain.
export const buildPassword = (masterPassword: string, domain: string, letters: string, length: number, interations: number): string => {
  // TODO: Calculate the needed bytes (last argument of the following line) from
  //       the passwordLength variable and alphabet.length
  const hash: Array<number> = asmCrypto.PBKDF2_HMAC_SHA256.bytes(masterPassword, domain, interations, 64)
  return calcPass(hash, letters, length)
}

// Calculates the a password.
// The first argument has to be an array ob bytes from witch the password is
// calculated.
// The second argument has to be an array of letters, which the password should
// use.
// The third argument is the length of the password.
// Returns the calculated password as string.
export const calcPass = (array: Array<number>, letters: string, length: number): string => {
  let reminders = []
  while (array.length > 0) {
    let rest;
    [array, rest] = arrayDivision(array, letters.length)
    reminders.push(rest)
  }
  let password = ''
  for (let letter of reminders) {
    password += letters[letter]
  }
  while (password.length < length) {
    password = letters[0] + password
  }
  return password.slice(0, length)
}

// Divides a array of bytes.
// The first argument is an array of bytes. It is treated as one number. For
// example [1, 0] is the same as the number 256.
// The second argument is the devisor for the devision.
// Returns an two element tuple (an array with two elements). The first element
// the result of the devision (rounded down), represented as an array of bytes
// like the first input element. The second element is the remainder of the
// devision.
export const arrayDivision = (array: Array<number>, divisor: number): [Array<number>, number] => {
  let r:number = 0
  let x: number = 0
  let quotient = []
  for (let element of array) {
    x = (r << 8) + element
    let q = Math.floor(x / divisor)
    r = x % divisor
    if (quotient.length > 0 || q > 0) {
      quotient.push(q)
    }
  }
  return [quotient, r]
}
