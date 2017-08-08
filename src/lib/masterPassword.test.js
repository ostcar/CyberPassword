// @flow

import {hasMasterPassword, savePassword} from './masterPassword'

jest.mock('./config', () => {
  let mockPassword = null
  return {
    getPassword: jest.fn(() => {
      return Promise.resolve(mockPassword)
    }),

    storePassword: jest.fn((password: string) => {
      mockPassword = password
      return Promise.resolve(null)
    }),
  }
})

describe('hasMasterPassword', () => {
  test('not stored', () => {
    expect.assertions(1)
    return hasMasterPassword()
    .then(value => {
      expect(value).toBe(false)
    })
  })

  test('in memory', () => {
    savePassword('session', 'foobar')

    expect.assertions(1)
    return hasMasterPassword()
    .then(value => {
      expect(value).toBe(true)
    })
  })

  test('in storage', () => {
    savePassword('store', 'foobar')

    expect.assertions(1)
    return hasMasterPassword()
    .then(value => {
      expect(value).toBe(true)
    })
  })
})
