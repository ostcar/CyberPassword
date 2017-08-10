// @flow
import {arrayDivision, calcPass} from './buildPassword'

describe('arrayDivition', () => {
  test('one digit', () => {
    expect(arrayDivision(new Uint8Array([10]), 2)).toEqual([new Uint8Array([5]), 0])
  })

  test('two digit', () => {
    expect(arrayDivision(new Uint8Array([10, 10]), 2)).toEqual([new Uint8Array([5, 5]), 0])
  })

  test('two digit with rest', () => {
    expect(arrayDivision(new Uint8Array([5, 5]), 2)).toEqual([new Uint8Array([2, 130]), 1])
  })

  test('small input', () => {
    expect(arrayDivision(new Uint8Array([1]), 3)).toEqual([new Uint8Array([]), 1])
  })
})

describe('calcPass', () => {
  test('max length', () => {
    const alphabet = 'abc'
    expect(calcPass(new Uint8Array([4]), alphabet, 1)).toEqual('b')
  })

  test('min length', () => {
    const alphabet = 'abc'
    expect(calcPass(new Uint8Array([1]), alphabet, 3)).toEqual('aab')
  })

  test('two digit input', () => {
    const alphabet = 'abc'
    expect(calcPass(new Uint8Array([1, 1]), alphabet, 3)).toEqual('cbb')
  })
})
