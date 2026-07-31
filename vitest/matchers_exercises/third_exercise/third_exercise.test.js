import { describe, expect, test, beforeEach } from 'vitest'

describe('Tests to know how to use arrayContaining', () => {
    test('list one', () => {
        expect(['offer', 'new', 'highlight']).toEqual(expect.arrayContaining(['new']))
    })
    test('list two', () => {
        expect(['offer', 'new', 'highlight', 'old']).toEqual(expect.arrayContaining(['highlight', 'offer', 'new']))
    })

    // o arrayContaining não importa se o array de origem onde é
    // buscado se o dado existe tem mais valores, ele se importa somente
    // se o array passado para o arrayContaining tem todos os valores
    // no toEqual, no array original e ele não se importa com a ordem.
})