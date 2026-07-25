import { ValorInvalidoError, PagamentoRecusadoError } from '../utils/errors.js';

// PagamentoService recebe suas dependências por parâmetro (injeção de dependência).
// Isso é o que torna ele testável: nos testes, você passa um gateway e um
// repository falsos (mock ou fake) em vez dos reais.
export class PagamentoService {
  constructor(gateway, repository) {
    this.gateway = gateway;       // objeto com método cobrar(cartao, valor)
    this.repository = repository; // objeto com métodos buscarPorId(id) e salvar(pagamento)
  }

  async processarPagamento(pedido) {
    // 1. Validação de negócio, antes de qualquer chamada externa
    if (!pedido.valor || pedido.valor <= 0) {
      throw new ValorInvalidoError(pedido.valor);
    }

    // 5/6. Idempotência: se já processamos esse pedido, não cobra de novo
    const existente = await this.repository.buscarPorId(pedido.id);
    if (existente && existente.status === 'aprovado') {
      return existente;
    }

    // 2/3/4. Chamada ao gateway, com uma tentativa extra em caso de falha de rede
    const resultado = await this._cobrarComRetry(pedido);

    if (resultado.status === 'recusado') {
      throw new PagamentoRecusadoError(resultado.motivo);
    }

    const pagamento = {
      id: pedido.id,
      status: 'aprovado',
      valorCobrado: pedido.valor,
    };

    await this.repository.salvar(pagamento);
    return pagamento;
  }

  async _cobrarComRetry(pedido) {
    try {
      return await this.gateway.cobrar(pedido.cartao, pedido.valor);
    } catch (erroDeRede) {
      // só tenta de novo em erro de rede/timeout — não em recusa
      // (recusa não lança erro, ela vem como retorno normal do gateway)
      return await this.gateway.cobrar(pedido.cartao, pedido.valor);
    }
  }
}
