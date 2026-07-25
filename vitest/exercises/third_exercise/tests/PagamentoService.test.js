import { describe, it, expect, vi, beforeEach, beforeAll, vitest, afterAll, afterEach } from 'vitest';
import { PagamentoService } from '../services/PagamentoService.js';
import { ValorInvalidoError, PagamentoRecusadoError } from '../utils/errors.js';
import { RepositoryFake } from '../repository/RepositoryFake.js';
import Gateway from '../gateway/Gateway.js';

let service, gateway, repository;

beforeEach(() => {
  gateway = {
    cobrar: vi.fn(),
  }
  repository = {
    salvar: vi.fn((pagamento) => pagamento),
    buscarPorId: vi.fn((id) => Promise.resolve(null))
  }
  service = new PagamentoService(gateway, repository)
});

describe('PagamentoService', () => {

  describe('a) caso feliz — pagamento aprovado de primeira', () => {
    it('deve salvar o pagamento e retornar os dados corretos', async () => {
      const order = { id: 5, valor: 125 }
      gateway.cobrar.mockResolvedValue({
        id: order.id,
        status: 'aprovado',
        valorCobrado: order.valor,
      })
      const result = await service.processarPagamento(order)
      expect(result).toEqual({ id: order.id, valorCobrado: order.valor, status: 'aprovado' })
    });
  });

  describe('b) valor inválido — não deve chamar o gateway', () => {
    it('deve lançar ValorInvalidoError para valor zero ou negativo', async () => {
      const order = { id: 6, valor: 0 }
      await expect(service.processarPagamento(order)).rejects.toThrow(`Valor de pagamento inválido: ${order.valor}. Deve ser maior que zero.`)
      expect(gateway.cobrar).not.toHaveBeenCalled()
    });
  });

  describe('c) gateway recusa o cartão — sem retry', () => {
    it('deve lançar PagamentoRecusadoError e chamar o gateway só uma vez', async () => {
      const order = { id: 5, valor: 100 }
      gateway.cobrar.mockResolvedValue({ status: 'recusado', motivo: '...' })
      await expect(service.processarPagamento(order)).rejects.toThrow('Pagamento recusado pelo gateway: ...')
      expect(gateway.cobrar).toHaveBeenCalledOnce()
    });
  });

  describe('d) erro de rede na 1ª tentativa, sucesso na 2ª', () => {
    it('deve se recuperar e retornar sucesso, chamando o gateway 2 vezes', async () => {
      gateway.cobrar.mockRejectedValueOnce('Erro de rede').mockResolvedValueOnce({ status: 'aprovado' })
      const order = { id: 5, valor: 100 }
      await expect(service.processarPagamento(order)).resolves.toEqual({
        id: order.id,
        status: 'aprovado',
        valorCobrado: order.valor,
      })
      expect(gateway.cobrar).toHaveBeenCalledTimes(2)
    });
  });

  describe('e) idempotência — não cobrar duas vezes o mesmo pedido', () => {
    it('não deve chamar o gateway de novo se o pedido já foi aprovado antes', async () => {
      const order = {
        id: 7,
        valor: 1200
      }

      repository.buscarPorId = vi.fn(() => Promise.resolve({
        id: order.id,
        status: 'aprovado',
        valorCobrado: order.valor
      }))

      await expect(service.processarPagamento(order)).resolves.toEqual({
        id: order.id,
        status: 'aprovado',
        valorCobrado: order.valor
      })

      expect(gateway.cobrar).not.toHaveBeenCalled()
    });
  });
});
