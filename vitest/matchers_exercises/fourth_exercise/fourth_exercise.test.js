import { describe, expect, test, beforeEach } from 'vitest'

const findCompletedOrder = () => {
    return {
        customer: {
            name: 'Cristiano',
            email: 'cristiano.sousa@gmail.com',
            adress: 'Street X',
            school: {
                city: 'New York'
            }
        }
    }
}

describe('Tests to know how to use toMatchObject', () => {

    test('With toMatchObject', () => {
        expect(findCompletedOrder()).toMatchObject({
            customer: {
                name: 'Cristiano'
            }
        })
    })

    test('With toMatchObject working to school city', () => {
        expect(findCompletedOrder()).toMatchObject({
            customer: {
                school: {
                    city: 'New York'
                }
            }
        })
    })

    test('With objectContaining failed', () => {
        expect(findCompletedOrder()).toEqual(expect.objectContaining({
            customer: {
                name: 'Cristiano'
            }
        }))
    })

    test('With objectContaining its working', () => {
        expect(findCompletedOrder()).toEqual(expect.objectContaining({
            customer: expect.objectContaining({
                name: 'Cristiano'
            })
        }))
    })

    test('With objectContaining working to school city', () => {
        expect(findCompletedOrder()).toEqual(expect.objectContaining({
            customer: expect.objectContaining({
                school: expect.objectContaining({
                    city: 'New York'
                })
            })
        }))
    })
})

// a diferença entre o objecTcontaining e o toMatchObject... é que o matchObject
// aprofunda no objeto, ou seja, não importa o nível de aninhamento, ele vai buscar
// compara e dá assert. Para isso funcionar no ovjetcContaining, você precisa ficar
// aninhando ele com objectContaining.

// toMatchObject aceita mesmo se tiver um valor a mais no obj, ele é quase igual
// ao obj contaning, mas melhor para aninhamento.