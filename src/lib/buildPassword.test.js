// @flow
import {arrayDivision, calcPass} from './buildPassword'

describe('arrayDivition', () => {
  test('one digit', () => {
    expect(arrayDivision([10], 2)).toEqual([[5], 0])
  })

  test('two digit', () => {
    expect(arrayDivision([10, 10], 2)).toEqual([[5, 5], 0])
  })

  test('two digit with rest', () => {
    expect(arrayDivision([5, 5], 2)).toEqual([[2, 130], 1])
  })
})

describe('calcPass', () => {
  test('max length', () => {
    // with the right alphabet, it shoud behave like base64
    const alphabet = 'abc'
    expect(calcPass([4], alphabet, 1)).toEqual('b')
  })

  test('min length', () => {
    // with the right alphabet, it shoud behave like base64
    const alphabet = 'abc'
    expect(calcPass([1], alphabet, 3)).toEqual('aab')
  })

  test('two digit input', () => {
    // with the right alphabet, it shoud behave like base64
    const alphabet = 'abc'
    expect(calcPass([1, 1], alphabet, 3)).toEqual(calcPass([257], alphabet, 3))
  })
})
