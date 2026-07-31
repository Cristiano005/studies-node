import {
    describe, test, expect,
    beforeEach
} from 'vitest'

import crypto from 'node:crypto'

let fruits
let password

beforeEach(() => {
    fruits = ['banana', 'apple', 'orange']
    password = crypto.randomBytes(6).toString('hex') // cada byte encoded no hex equivale a 2 caracteres.
})

describe('To get lenght of string for example with toHaveLength', () => {
    test('With string', () => {
        expect(password).toHaveLength(12)
    })
    test('With array', () => {
        expect(fruits).toHaveLength(3)
    })
    test('With toBe', () => {
        expect(password).toBe("367a0abd45d0")
    })
})

// o toHaveLength pode verificar tanto o tamanho de um array quanto de uma string.