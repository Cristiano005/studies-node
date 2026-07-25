export class RepositoryFake {
  constructor() {
    this.pagamentos = [];
  }

  async buscarPorId(id) {
    return this.pagamentos.find((p) => p.id === id) || null;
  }

  async salvar(pagamento) {
    const indiceExistente = this.pagamentos.findIndex((p) => p.id === pagamento.id);
    if (indiceExistente >= 0) {
      this.pagamentos[indiceExistente] = pagamento;
    } else {
      this.pagamentos.push(pagamento);
    }
    return pagamento;
  }
}
