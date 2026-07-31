import { describe, test, expect } from 'vitest'

const listActiveUsers = () => {
    return [
        {
            id: 1,
            name: 'Cristiano',
            email: 'cristiano38@gmail.com'
        },
        {
            id: 2,
            name: 'João',
            email: 'joao@gmail.com'
        },
        {
            id: 3,
            name: 'Fernanda',
            email: 'fernada_05@outlook.com'
        }
    ]
}

describe('Test to know how to use toContainEqual', () => {
    test('With toContainEqual', () => {
        expect(listActiveUsers()).toContainEqual({
            id: 1,
            name: 'Cristiano',
            email: 'cristiano38@gmail.com'
        })
    })
    test('With objectContaining', () => {
        expect(listActiveUsers()).toEqual(expect.arrayContaining([expect.objectContaining({
            name: 'Cristiano'
        })]))
    })
    test('With toEqual', () => {
        expect(listActiveUsers()).toEqual([{
            id: 1,
            name: 'Cristiano',
            email: 'cristiano38@gmail.com'
        }])
    })
})

// A difença do toContainEqual para o objectContaining é que o toContain precisa que todos os props/dados do obj
// contenham em um item, diferente do objContaining que avalia apenas as props passadas, sem precisar ter todas.