import { beforeAll, beforeEach, describe, expect, test } from 'vitest'

import { Pizza, createUser } from './first_exercise'

describe('Tests to know whats difference between toEqual and toStrictEqual', () => {
    describe('When it comes to property with undefined value', () => {

        const name = 'Cristiano'
        let user

        beforeEach(() => {
            user = createUser(name)
        })

        test('With toEqual', () => {
            expect(user).toEqual({
                name: 'Cristiano',
                active: true
            })
        })
        test('With toStrictEqual', () => {
            expect(user).toStrictEqual({
                name: 'Cristiano',
                active: true
            })
        })
    })
    describe('When it comes to literal object and class object', () => {

        let pizzaClass

        beforeEach(() => {
            pizzaClass = new Pizza('calabresa', 70)
            console.log(Object.getPrototypeOf(pizzaClass), Object.getPrototypeOf({
                flavour: 'calabresa',
                price: 70
            }))
        })

        test('With toEqual', () => {
            expect(pizzaClass).toEqual({
                flavour: 'calabresa',
                price: 70
            })
        })
        test('With toStrictEqual', () => {
            expect(pizzaClass).toStrictEqual({ // errado
                flavour: 'calabresa',
                price: 70
            })
            // expect(pizzaClass).toStrictEqual(new Pizza('calabresa', 70)) // certo
        })
    })
    describe.only('When it comes to array with undefined value', () => {

        let numbers

        beforeEach(() => {
            numbers = [1, 2, 3, , 5] // Aqui não tem valor no índice 3, ele é vazio, se eu comparar com um que tem undefined nesse mesmo índice, é pra dá erro
            // o toEqual ignora isso, mas o strictEqual não, porque existe uma diferença entre um indíce vazio, que não tem valor e outro com valor undefined
        })

        test('With toEqual', () => {
            expect(numbers).toEqual([
                1, 2, 3, undefined, 5,
            ])
        })
        test('With toStrictEqual', () => {
            expect(numbers).toStrictEqual([ 
                // aqui dá erro porque estou comparando um array que tem valor no penúltimo índice como vazio e paassando um valor
                // que tem o penúltimo índice como undefined.
                1, 2, 3, undefined, 5,
            ])
        })
    })
})

// Importante: array criada a partir do Array.from, mesmo sendo declarado array esparso, ele corrige isso
// Por isso é bom testar com criação 'manual' de array.

// Resumindo... a diferença do toEqual para toStrictEqual é que o strict verifica props com valores undefined,
// verifica o prototype do objeto, se as classes de origem são iguais (instância ou literal) e verifica array esparsos