import { expect, test } from 'vitest'
import sum from './sum'

test('Should return result of sum two numbers', () => {
    expect(sum(2, 3)).toBe(5)
})