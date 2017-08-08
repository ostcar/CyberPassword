// @flow

import {secondLevelDomain} from './utils'

describe('secondLevelDomain', () => {
  test('basic', () => {
    expect(secondLevelDomain('http://foo.bar.com/blub')).toBe('bar.com')
  })

  test('first level domain', () => {
    expect(secondLevelDomain('http://kinder/blub')).toBe('kinder')
  })

  test('file', () => {
    // I don't know, what the expected behavior is
    expect(secondLevelDomain('file:///kinder/blub')).toBe('file')
  })
})
