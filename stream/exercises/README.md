# Exercícios de Streams — Node.js
### Do básico ao avançado
 
Como usar este material:
- Tente resolver cada exercício sozinho antes de olhar a dica.
- Só olhe o gabarito (no final do arquivo) depois de ter tentado de verdade — mesmo que dê errado.
- Rode tudo com `node arquivo.js`. Vários exercícios pedem um arquivo de teste (`entrada.txt`); crie um com qualquer conteúdo de texto, uns parágrafos bastam.
---
 
## NÍVEL BÁSICO
 
### Exercício 1 — Seu primeiro Readable Stream
Crie um script que leia um arquivo de texto (`entrada.txt`) usando `fs.createReadStream` e imprima no console **cada pedaço (chunk)** recebido, junto com o tamanho em bytes daquele pedaço.
 
**Requisito extra:** imprima também uma mensagem quando o stream terminar (evento `end`).
 
<details><summary>💡 Dica</summary>
Streams de leitura emitem eventos. Você vai precisar escutar pelo menos dois: um para quando um pedaço de dado chega, e outro para quando não há mais nada a ler.
</details>
---
 
### Exercício 2 — Seu primeiro Writable Stream
Crie um script que escreva 5 linhas de texto num arquivo novo (`saida.txt`) usando `fs.createWriteStream`, uma linha de cada vez, usando o método que uma Writable Stream oferece para enviar dados.
 
**Requisito extra:** depois da última linha, feche o stream corretamente (existe um método específico para isso) e só então imprima "Arquivo salvo com sucesso" no console.
 
<details><summary>💡 Dica</summary>
Fechar o stream não é o mesmo que só parar de escrever nele. Existe um método que sinaliza "não vou mandar mais nada", e ele aceita um callback.
</details>
---
 
### Exercício 3 — Copiando um arquivo com pipe()
Reescreva a lógica dos exercícios 1 e 2 juntos, mas em vez de escrever manualmente, use `.pipe()` para copiar `entrada.txt` inteiro para `copia.txt`, sem escrever nenhum `on('data')` manualmente.
 
**Pergunta para responder no comentário do código:** por que `pipe()` já resolve backpressure automaticamente, sem você precisar fazer nada?
 
<details><summary>💡 Dica</summary>
`pipe()` é praticamente uma linha só: `readable.pipe(writable)`. O desafio aqui não é o código, é você explicar o "porquê" no comentário.
</details>
---
 
## NÍVEL INTERMEDIÁRIO
 
### Exercício 4 — Seu primeiro Transform Stream
Crie um Transform Stream customizado que recebe texto e devolve o mesmo texto **todo em maiúsculas**. Use esse Transform entre a leitura de `entrada.txt` e a escrita em `saida_maiuscula.txt`, encadeando com `pipe()`.
 
**Requisito extra:** o Transform deve funcionar corretamente mesmo que uma palavra fique cortada entre dois chunks diferentes (ou seja, não pode quebrar por causa do tamanho do buffer).
 
<details><summary>💡 Dica</summary>
Um Transform Stream customizado exige que você implemente um método específico chamado `_transform(chunk, encoding, callback)`. Dentro dele, transforme o chunk e chame o callback passando o resultado.
</details>
---
 
### Exercício 5 — Duplex Stream na mão
Crie um Duplex Stream que funcione como uma "calculadora de streaming": tudo que for escrito nele (números separados por vírgula, ex: `"2,4,6"`) deve ser lido de volta como a soma desses números.
 
**Requisito extra:** o stream deve poder receber múltiplas escritas separadas (não assuma que tudo vem de uma vez só).
 
<details><summary>💡 Dica</summary>
Duplex é a junção de Readable + Writable no mesmo objeto. Você precisa implementar `_write()` (para receber dados) e `_read()` (para permitir que os dados sejam lidos), mantendo algum estado interno entre as chamadas.
</details>
---
 
### Exercício 6 — Observando backpressure de verdade
Escreva um script que tente escrever **1 milhão de linhas** num Writable Stream, sem usar `pipe()` (escrita manual em loop). Modifique o código para checar o **valor de retorno** de `.write()` e, quando ele for `false`, pausar as escritas até o evento `'drain'` ser emitido.
 
**Requisito extra:** imprima no console quantas vezes o backpressure foi ativado (quantas vezes `.write()` retornou `false`) durante a execução.
 
<details><summary>💡 Dica</summary>
Se você ignorar o retorno de `.write()` num loop apertado, o Node vai acumular tudo em memória e você pode nem perceber o problema até faltar RAM. O `while` ingênuo é o vilão clássico aqui.
</details>
---
 
## NÍVEL AVANÇADO
 
### Exercício 7 — Trocando pipe() por pipeline()
Pegue o código do Exercício 4 (Transform de maiúsculas) e reescreva usando `pipeline()` (do módulo `stream/promises` ou `stream` com callback) em vez de `pipe()`.
 
**Requisito extra:** force um erro de propósito (por exemplo, tente ler um arquivo que não existe) e comprove que o `pipeline()` captura e reporta esse erro corretamente, fechando todos os streams envolvidos sem vazar recursos.
 
<details><summary>💡 Dica</summary>
Com `pipe()` sozinho, um erro no meio do encadeamento não fecha os outros streams automaticamente — isso é conhecido como vazamento de stream. `pipeline()` foi criado exatamente para resolver isso.
</details>
---
 
### Exercício 8 — Object Mode: stream de objetos, não de bytes
Crie um Readable Stream em **object mode** (`{ objectMode: true }`) que gera objetos `{ id, nome }` (por exemplo, de uma lista de usuários fixa no código). Encadeie com um Transform (também em object mode) que filtra só os objetos cujo `id` é par, e um Writable final que imprime cada objeto recebido no console.
 
**Requisito extra:** explique em um comentário por que streams normais (não-object-mode) não conseguiriam fazer isso diretamente sem serializar os objetos para texto/JSON antes.
 
<details><summary>💡 Dica</summary>
`objectMode: true` precisa ser passado nas opções de **todos** os streams envolvidos na cadeia (Readable, Transform e Writable), não só no primeiro.
</details>
---
 
### Exercício 9 — Consumindo um Readable com async/await
Reescreva o Exercício 1 (leitura de `entrada.txt`), mas em vez de usar `.on('data')`, use a sintaxe `for await (const chunk of stream)` para consumir o stream.
 
**Requisito extra:** compare (em comentário) o comportamento desse código com o do Exercício 1 — o que muda em termos de backpressure automático e legibilidade?
 
<details><summary>💡 Dica</summary>
Desde versões mais recentes do Node, Readable Streams implementam o protocolo de async iteration nativamente — não precisa de nenhuma lib externa.
</details>
---
 
### Exercício 10 — Rate limiter com Transform + backpressure real
Construa um Transform Stream que funcione como um **"limitador de velocidade"**: ele recebe chunks de dados normalmente, mas artificialmente atrasa a entrega de cada chunk em 200ms (simulando, por exemplo, enviar dados por uma rede lenta).
 
Use esse Transform entre a leitura de um arquivo grande (`entrada_grande.txt` — pode ser gerado repetindo um texto várias vezes) e a escrita em `saida_lenta.txt`, usando `pipeline()`.
 
**Requisito extra (o mais avançado do conjunto):** comprove, medindo tempo com `console.time`/`console.timeEnd`, que o Readable de origem **realmente desacelera** a leitura do arquivo por causa do backpressure gerado pelo seu Transform lento — ou seja, o arquivo não é lido tudo de uma vez na memória, esperando o Transform processar.
 
<details><summary>💡 Dica</summary>
Dentro de `_transform()`, use `setTimeout()` antes de chamar o `callback()` final. Enquanto o `callback` não for chamado, o Node não entrega o próximo chunk — é exatamente aí que o backpressure acontece de forma visível.
</details>
---
---
 
# 📘 GABARITO
 
> Tente todos os exercícios antes de olhar aqui. Errar e travar faz parte — é onde mais se aprende sobre streams.
 
<details>
<summary><b>Gabarito — Exercício 1</b></summary>
```javascript
const fs = require('fs');
 
const readable = fs.createReadStream('entrada.txt');
 
readable.on('data', (chunk) => {
  console.log(`Recebi um pedaço de ${chunk.length} bytes`);
});
 
readable.on('end', () => {
  console.log('Leitura finalizada!');
});
 
readable.on('error', (err) => {
  console.error('Erro ao ler o arquivo:', err.message);
});
```
</details>
<details>
<summary><b>Gabarito — Exercício 2</b></summary>
```javascript
const fs = require('fs');
 
const writable = fs.createWriteStream('saida.txt');
 
const linhas = ['linha 1', 'linha 2', 'linha 3', 'linha 4', 'linha 5'];
 
linhas.forEach((linha) => {
  writable.write(linha + '\n');
});
 
writable.end(() => {
  console.log('Arquivo salvo com sucesso');
});
```
</details>
<details>
<summary><b>Gabarito — Exercício 3</b></summary>
```javascript
const fs = require('fs');
 
const readable = fs.createReadStream('entrada.txt');
const writable = fs.createWriteStream('copia.txt');
 
readable.pipe(writable);
 
// pipe() resolve backpressure automaticamente porque, por baixo dos panos,
// ele escuta o retorno de writable.write(): se vier "false", ele pausa
// automaticamente o readable (readable.pause()), e só retoma (readable.resume())
// quando o writable emite o evento 'drain'. Você não precisa reimplementar
// essa lógica manualmente — é o próprio pipe() que gerencia isso.
```
</details>
<details>
<summary><b>Gabarito — Exercício 4</b></summary>
```javascript
const fs = require('fs');
const { Transform } = require('stream');
 
const maiusculaTransform = new Transform({
  transform(chunk, encoding, callback) {
    const textoMaiusculo = chunk.toString().toUpperCase();
    callback(null, textoMaiusculo);
  }
});
 
fs.createReadStream('entrada.txt')
  .pipe(maiusculaTransform)
  .pipe(fs.createWriteStream('saida_maiuscula.txt'));
 
// Nota: .toUpperCase() por chunk pode, tecnicamente, cortar uma palavra
// no meio se ela cair exatamente na borda de dois chunks — mas como
// toUpperCase() não depende de contexto entre caracteres (cada caractere
// vira maiúsculo independentemente), isso não quebra o resultado final.
```
</details>
<details>
<summary><b>Gabarito — Exercício 5</b></summary>
```javascript
const { Duplex } = require('stream');
 
class CalculadoraDuplex extends Duplex {
  constructor(options) {
    super(options);
    this.resultados = [];
  }
 
  _write(chunk, encoding, callback) {
    const numeros = chunk.toString().split(',').map(Number);
    const soma = numeros.reduce((acc, n) => acc + n, 0);
    this.resultados.push(soma);
    callback();
  }
 
  _read(size) {
    if (this.resultados.length > 0) {
      this.push(this.resultados.shift() + '\n');
    } else {
      this.push(null);
    }
  }
}
 
const calc = new CalculadoraDuplex();
 
calc.on('data', (chunk) => console.log('Soma:', chunk.toString().trim()));
 
calc.write('2,4,6');
calc.write('10,20');
calc.end();
```
</details>
<details>
<summary><b>Gabarito — Exercício 6</b></summary>
```javascript
const fs = require('fs');
 
const writable = fs.createWriteStream('milhao_linhas.txt');
let i = 0;
let vezesComBackpressure = 0;
const total = 1_000_000;
 
function escrever() {
  let podeContinuar = true;
 
  while (i < total && podeContinuar) {
    i++;
    const podeEscrever = writable.write(`linha ${i}\n`);
 
    if (!podeEscrever) {
      vezesComBackpressure++;
      podeContinuar = false;
    }
  }
 
  if (i < total) {
    writable.once('drain', escrever);
  } else {
    writable.end(() => {
      console.log(`Terminado! Backpressure ativado ${vezesComBackpressure} vezes.`);
    });
  }
}
 
escrever();
```
</details>
<details>
<summary><b>Gabarito — Exercício 7</b></summary>
```javascript
const fs = require('fs');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');
 
const maiusculaTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});
 
async function executar() {
  try {
    await pipeline(
      fs.createReadStream('arquivo_que_nao_existe.txt'), // erro proposital
      maiusculaTransform,
      fs.createWriteStream('saida_maiuscula.txt')
    );
    console.log('Pipeline concluído com sucesso');
  } catch (err) {
    console.error('Pipeline falhou, mas todos os streams foram fechados:', err.message);
  }
}
 
executar();
```
</details>
<details>
<summary><b>Gabarito — Exercício 8</b></summary>
```javascript
const { Readable, Transform, Writable } = require('stream');
 
const usuarios = [
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bruno' },
  { id: 3, nome: 'Carla' },
  { id: 4, nome: 'Diego' },
];
 
const readableObjetos = new Readable({
  objectMode: true,
  read() {
    this.push(usuarios.shift() || null);
  }
});
 
const filtroPares = new Transform({
  objectMode: true,
  transform(objeto, encoding, callback) {
    if (objeto.id % 2 === 0) {
      callback(null, objeto);
    } else {
      callback(); // descarta, sem passar adiante
    }
  }
});
 
const impressora = new Writable({
  objectMode: true,
  write(objeto, encoding, callback) {
    console.log('Recebido:', objeto);
    callback();
  }
});
 
readableObjetos.pipe(filtroPares).pipe(impressora);
 
// Streams normais trabalham com Buffer/string, que exigem serialização
// (ex: JSON.stringify/parse) para representar objetos JS. Object mode
// permite passar as referências dos objetos diretamente entre os streams,
// sem conversão nenhuma — cada "chunk" é literalmente o objeto JS.
```
</details>
<details>
<summary><b>Gabarito — Exercício 9</b></summary>
```javascript
const fs = require('fs');
 
async function ler() {
  const readable = fs.createReadStream('entrada.txt');
 
  for await (const chunk of readable) {
    console.log(`Recebi um pedaço de ${chunk.length} bytes`);
  }
 
  console.log('Leitura finalizada!');
}
 
ler();
 
// Diferença em relação ao Exercício 1: o for-await já respeita backpressure
// nativamente (ele só pede o próximo chunk depois que o corpo do loop
// termina de rodar), sem precisar registrar handlers de evento manualmente.
// O código fica mais linear e parecido com um loop comum, mais fácil de
// combinar com try/catch para tratamento de erro.
```
</details>
<details>
<summary><b>Gabarito — Exercício 10</b></summary>
```javascript
const fs = require('fs');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');
 
const transformLento = new Transform({
  transform(chunk, encoding, callback) {
    setTimeout(() => {
      callback(null, chunk);
    }, 200);
  }
});
 
async function executar() {
  console.time('tempo total');
 
  await pipeline(
    fs.createReadStream('entrada_grande.txt'),
    transformLento,
    fs.createWriteStream('saida_lenta.txt')
  );
 
  console.timeEnd('tempo total');
  console.log('Se o tempo total for bem maior que o de uma cópia simples, ' +
    'é a prova de que o backpressure segurou a leitura do arquivo.');
}
 
executar();
 
// O motivo do atraso "vazar" para a leitura: enquanto o callback() dentro
// de _transform não é chamado, o Transform não pede mais dados ao Readable
// de origem (ele para de emitir 'data'). Ou seja, o arquivo NÃO é lido
// tudo de uma vez para a memória — a leitura literalmente desacelera para
// acompanhar o ritmo do processamento, que é a essência do backpressure.
```
</details>
---
 
## Checklist de autoavaliação
 
Depois de terminar, marque mentalmente o que você consegue responder sem olhar o código:
 
- [ ] Sei explicar a diferença entre Readable, Writable, Duplex e Transform com um exemplo de cada
- [ ] Sei dizer por que `pipeline()` é preferível a `pipe()` sozinho
- [ ] Sei explicar o que é backpressure sem usar a palavra "backpressure" na explicação
- [ ] Sei dizer quando faria sentido usar `objectMode: true`
- [ ] Consigo prever, sem rodar, se um `.write()` vai retornar `true` ou `false` num cenário simples