# 10 Exercícios — Matchers do Vitest além do básico
### toBe e toEqual você já domina — hora dos outros

Cada exercício foca num matcher (ou combinação) que resolve um problema real de comparação que `toBe`/`toEqual` sozinhos não resolvem bem. Curtos de propósito — a ideia é sentir a diferença na prática, não escrever muito código.

---

## 1 — toEqual vs toStrictEqual: a diferença escondida

**Cenário:** uma função `criarUsuario(nome)` que devolve `{ nome, ativo: true }` — mas, por um bug, alguém adicionou `idade: undefined` no objeto sem querer.

**Tarefa:** escreva um teste com `toEqual({ nome: 'Ana', ativo: true })` — ele passa, mesmo com o `idade: undefined` sobrando. Agora troque para `toStrictEqual({ nome: 'Ana', ativo: true })` e observe o teste **falhar**.

<details><summary>💡 Dica</summary>
<code>toEqual</code> ignora propriedades com valor <code>undefined</code>. <code>toStrictEqual</code> não perdoa isso — ele também diferencia <code>{}</code> de uma instância de classe vazia, e array esparso de array normal. É o matcher certo quando "propriedade a mais, mesmo undefined" é um bug real pro seu domínio.
</details>

---

## 2 — expect.objectContaining: checando só parte de um objeto grande

**Cenário:** uma função `criarPedido()` devolve um objeto com 10+ campos (id, timestamps, metadata) — mas seu teste só se importa com 2 deles: `status` e `total`.

**Tarefa:** em vez de escrever um `toEqual` gigante repetindo todos os campos, use `expect(resultado).toEqual(expect.objectContaining({ status: 'novo', total: 150 }))`.

<details><summary>💡 Dica</summary>
Sem <code>objectContaining</code>, você precisaria copiar TODOS os campos no <code>toEqual</code> — e se alguém adicionar um campo novo no futuro (tipo <code>criadoEm</code>), seu teste quebraria por um motivo que nem te interessa.
</details>

---

## 3 — expect.arrayContaining: array tem pelo menos esses itens

**Cenário:** uma função `listarTags(produto)` devolve tags em ordem não garantida (ex: `['promo', 'novo', 'destaque']`, mas a ordem pode variar).

**Tarefa:** teste que o array **contém** `'promo'` e `'novo'`, sem se importar com a ordem nem com outras tags extras, usando `expect(tags).toEqual(expect.arrayContaining(['promo', 'novo']))`.

<details><summary>💡 Dica</summary>
Repare que é o oposto do que parece: <code>arrayContaining(['promo', 'novo'])</code> checa se ESSES itens estão dentro do array recebido — o array recebido pode ter mais itens além desses, e ainda passa.
</details>

---

## 4 — toMatchObject: parecido com objectContaining, mas para objetos aninhados

**Cenário:** uma função `buscarPedidoCompleto()` devolve um objeto com um sub-objeto `cliente: { nome, email, endereco: {...} }`.

**Tarefa:** teste só que `cliente.nome` é o esperado, sem precisar descrever `endereco` inteiro, usando `toMatchObject({ cliente: { nome: 'Ana' } })`.

<details><summary>💡 Dica</summary>
<code>toMatchObject</code> funciona em profundidade (aninhado), enquanto <code>objectContaining</code> sozinho só funciona bem no primeiro nível — para estruturas aninhadas, <code>toMatchObject</code> costuma ser mais direto de escrever.
</details>

---

## 5 — toBeCloseTo: comparando números decimais sem sofrer com float

**Cenário:** uma função `calcularMedia([1, 2, 2])` que, por causa de ponto flutuante, pode devolver `1.6666666666666667` em vez de um valor "redondo".

**Tarefa:** teste usando `expect(resultado).toBeCloseTo(1.667, 2)` (2 casas de precisão) em vez de `toBe`, que quebraria por causa da imprecisão do float.

<details><summary>💡 Dica</summary>
Isso resolve o mesmo problema que você já viu no exercício de desconto/arredondamento — só que em vez de arredondar no código de produção, aqui você aceita uma margem de tolerância diretamente no teste, quando isso faz sentido.
</details>

---

## 6 — toHaveLength: tamanho de array ou string, sem comparar o conteúdo

**Cenário:** uma função `gerarSenhaAleatoria()` que devolve uma string de exatamente 12 caracteres, com conteúdo que muda a cada chamada (por isso `toBe` nunca serviria aqui).

**Tarefa:** teste que o resultado tem `toHaveLength(12)`, sem se importar com o conteúdo exato (que é aleatório de propósito).

<details><summary>💡 Dica</summary>
Isso também funciona em arrays: <code>expect([1,2,3]).toHaveLength(3)</code>. É mais legível que <code>expect(resultado.length).toBe(12)</code>, e gera mensagem de erro mais clara quando falha.
</details>

---

## 7 — toContainEqual: array contém um objeto específico (não string/número)

**Cenário:** uma função `listarUsuariosAtivos()` devolve um array de objetos `{ id, nome }`, e você quer confirmar que um usuário específico está na lista.

**Tarefa:** teste com `expect(lista).toContainEqual({ id: 3, nome: 'Carla' })` — e compare com tentar `toContain` (sem "Equal") no mesmo caso, observando o erro.

<details><summary>💡 Dica</summary>
<code>toContain</code> funciona só para valores primitivos (usa <code>===</code>) — para checar se um array contém um OBJETO com determinado conteúdo, o matcher certo é <code>toContainEqual</code>, que compara por estrutura, igual o <code>toEqual</code> faz.
</details>

---

## 8 — Matcher assimétrico dentro de toHaveBeenCalledWith

**Cenário:** um `EmailService.enviar(destinatario, corpo)` é chamado dentro de um service, onde `corpo` inclui um timestamp (`Enviado em: ${new Date()}`) — impossível prever o valor exato no teste.

**Tarefa:** verifique a chamada do mock usando `expect(mock).toHaveBeenCalledWith('ana@email.com', expect.stringContaining('Enviado em:'))`, ignorando a parte variável (o timestamp).

<details><summary>💡 Dica</summary>
<code>expect.stringContaining</code>, <code>expect.any(String)</code>, <code>expect.objectContaining</code> — todos esses "matchers assimétricos" podem ser usados DENTRO de <code>toHaveBeenCalledWith</code>, não só em <code>expect(valor)</code> direto. Resolve exatamente o problema de "parte do argumento é imprevisível".
</details>

---

## 9 — toBeInstanceOf: garantindo o tipo do erro lançado

**Cenário:** reaproveitando os erros customizados do exercício de pagamento (`ValorInvalidoError`, `PagamentoRecusadoError`).

**Tarefa:** em vez de só `toThrow(ValorInvalidoError)`, capture o erro manualmente com `try/catch` (ou `.catch()`) e confirme com `expect(erro).toBeInstanceOf(ValorInvalidoError)` — útil quando você também quer inspecionar outras propriedades do erro além do tipo.

```javascript
try {
  await service.processarPagamento({ id: 1, valor: 0 });
} catch (erro) {
  expect(erro).toBeInstanceOf(ValorInvalidoError);
  expect(erro.message).toContain('inválido');
}
```

<details><summary>💡 Dica</summary>
<code>toThrow(Classe)</code> já faz isso por baixo dos panos, mas capturar manualmente com try/catch te dá acesso ao objeto de erro inteiro, útil quando quer checar múltiplas propriedades dele (não só o tipo).
</details>

---

## 10 — Combinando objectContaining + arrayContaining num caso realista

**Cenário:** uma função `buscarRelatorio()` devolve `{ titulo: string, itens: [{ id, valor }, ...] }`, com vários campos e vários itens — mas você só quer confirmar duas coisas: o título é o esperado, e existe um item específico na lista.

**Tarefa:** combine os dois matchers no mesmo `expect`:

```javascript
expect(relatorio).toEqual(
  expect.objectContaining({
    titulo: 'Relatório Mensal',
    itens: expect.arrayContaining([
      expect.objectContaining({ id: 5 }),
    ]),
  })
);
```

<details><summary>💡 Dica</summary>
Matchers assimétricos podem ser aninhados uns dentro dos outros — isso é extremamente útil pra testar respostas de API grandes, checando só os campos que realmente importam pro teste, sem descrever a resposta inteira.
</details>

---

## Qual usar quando — tabela rápida de referência

| Situação | Matcher |
|---|---|
| Objeto pode ter campo `undefined` a mais, e isso importa | `toStrictEqual` |
| Só quero checar alguns campos de um objeto grande | `objectContaining` |
| Array com ordem/itens extras não importam, só presença | `arrayContaining` |
| Objeto aninhado, checar só parte da estrutura | `toMatchObject` |
| Número decimal com imprecisão de float | `toBeCloseTo` |
| Tamanho de array/string, não o conteúdo | `toHaveLength` |
| Array contém um objeto específico (não primitivo) | `toContainEqual` |
| Argumento de mock parcialmente previsível | `expect.stringContaining` / `expect.any()` dentro de `toHaveBeenCalledWith` |
| Verificar tipo/classe de um erro capturado | `toBeInstanceOf` |
