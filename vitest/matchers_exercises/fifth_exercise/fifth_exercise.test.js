import { expect, describe, test } from 'vitest'

function averageCalculate(numbers) {
    const sum = numbers.reduce((acc, currentValue) => acc + currentValue, 0)
    return sum / numbers.length
}

describe('Test with toBeCloseTo', () => {
    test('With toBeCloseTo', () => {
        const average = averageCalculate([5, 3, 2])
        expect(average).toBeCloseTo(3.33) // aqui o resultado é 3.333333, mas como por padrão vem com 2 casas decimais, é possível comparar com 3.33
    })
    test('With toEqual', () => {
        const average = averageCalculate([5, 3, 2])
        expect(average).toEqual(3.33)
    })
    test('With toBe', () => {
        const average = averageCalculate([5, 3, 2])
        expect(average).toBe(3.3333333333333335) // aqui só passa porque passei exatamente a mesma quanti. de casas decimais, o mesmo vale para toEqual
    })
})


// para números flutuantes o melhor a se usar é o toBeCloseTo já que ele lida com a imprecisão dos números flutuantes. 
// ele lida melhor do que toEqual e toBe porque ele tolera que um número possa ter somente as primeiras casas decimais sem precisar escrever todos os números