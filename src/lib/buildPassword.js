// @flow

import {pbkdf2} from './pbkdf2'

// Returns a Promise which resolves to the password as string
export const buildPassword = (masterPassword: string, domain: string, letters: string, length: number, interations: number): Promise<string> => {
  return pbkdf2(masterPassword, domain, interations)
  .then(hash => {
    return calcPass(hash, letters, length)
  })
}

// Calculates the a password.
// The first argument has to be an array ob bytes from witch the password is
// calculated.
// The second argument has to a string of letters, which the password should use.
// The third argument is the length of the password.
// Returns the calculated password as string.
export const calcPass = (array: Uint8Array, letters: string, length: number): string => {
  let reminders = []
  while (array.length > 0) {
    let rest
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
export const arrayDivision = (array: Uint8Array, divisor: number): [Uint8Array, number] => {
  let r: number = 0
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
  return [new Uint8Array(quotient), r]
}
