# Exercício — Teste de Processamento de Pagamento

## Estrutura

```
src/
├── PagamentoService.js       ← implementação pronta (não precisa mexer)
├── errors.js                 ← erros customizados (não precisa mexer)
├── RepositoryFake.js          ← bônus opcional: um Fake de repository já pronto
└── PagamentoService.test.js  ← SEU trabalho começa aqui (só esqueleto, com TODOs)
```

## Como rodar

```bash
npm install
npm test
```

Enquanto estiver escrevendo os testes, rode em modo watch (roda de novo a cada salvamento):

```bash
npm run test:watch
```

## O que fazer

Abra `src/PagamentoService.test.js`. Cada `it(...)` já tem o título e uma lista de
comentários `// TODO` descrevendo o que aquele teste precisa verificar — a
implementação (o corpo do teste) é com você.

Não mexa em `PagamentoService.js` nem em `errors.js` — a regra de negócio já
está implementada, exatamente como descrita no exercício (validação de valor,
retry em erro de rede, sem retry em recusa, idempotência por `pedido.id`).

## Dica de ordem

Resolve na ordem que os `describe` aparecem (a → e). O último grupo (e,
idempotência) é o mais importante e o mais fácil de fazer errado — capricha
nele.

## Bônus opcional

Depois de terminar usando `vi.fn()` para o `repository`, tenta reescrever
**só o teste do item (e)** usando `RepositoryFake` no lugar do mock, e
compara: qual versão deixa mais claro o que está sendo testado?
