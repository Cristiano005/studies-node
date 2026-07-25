// Erros customizados do domínio de pagamento.
// Cada um representa uma falha de negócio específica — nada de "Error" genérico.

export class ValorInvalidoError extends Error {
  constructor(valor) {
    super(`Valor de pagamento inválido: ${valor}. Deve ser maior que zero.`);
    this.name = 'ValorInvalidoError';
  }
}

export class PagamentoRecusadoError extends Error {
  constructor(motivo) {
    super(`Pagamento recusado pelo gateway: ${motivo}`);
    this.name = 'PagamentoRecusadoError';
  }
}
