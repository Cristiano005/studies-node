import { describe, expect, test, beforeEach } from 'vitest'

const createOrder = (overload) => {
    return {
        id: 'pedido_8f2a1c',
        status: 'novo',
        total: 150,
        subtotal: 135,
        frete: 15,
        desconto: 0,
        cliente: {
            id: 42,
            nome: 'Cristiano',
            email: 'cristiano@email.com',
        },
        itens: [
            { produtoId: 'p1', nome: 'Teclado mecânico', quantidade: 1, preco: 135 },
        ],
        formaPagamento: 'cartao_credito',
        criadoEm: new Date('2026-07-26T10:00:00'),
        atualizadoEm: new Date('2026-07-26T10:00:00'),
        metadata: {
            origem: 'site',
            cupomAplicado: null,
        },
        ...overload
    };
}

describe('Tests to know how to use objectContaining', () => {
    test('With toEqual', () => {
        expect(createOrder()).toEqual({ status: 'novo', total: 150 }) // vai gerar erro porque verifica se os objs por inteiro são iguais
    })
    test('With objectContaining', () => {
        expect(createOrder()).toEqual(expect.objectContaining({
            status: 'novo',
            total: 150,
        }))
    })
})