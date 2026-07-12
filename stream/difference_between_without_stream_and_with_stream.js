const fs = require('fs');

function mostrarMemoria(rotulo) {
  const uso = process.memoryUsage();
  console.log(`${rotulo}:`);
  console.log(`  heapUsed: ${(uso.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  external: ${(uso.external / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  rss (memória real total do processo): ${(uso.rss / 1024 / 1024).toFixed(2)} MB`);
}

// Passo 1: gera um arquivo grande de teste (só roda uma vez, comenta depois)
const linha = 'Testando diferença de memória entre readFile e stream.\n';
fs.writeFileSync('./arquivo_grande.txt', linha.repeat(2_000_000));
console.log('Arquivo de teste gerado.\n');

// ===== TESTE 1: ORDEM DE EXECUÇÃO =====
console.log('=== TESTE 1: ordem de execução ===');

fs.readFile('./arquivo_grande.txt', (err, data) => {
  console.log('✅ readFile terminou (arquivo inteiro pronto)');
});

const streamOrdem = fs.createReadStream('./arquivo_grande.txt');
streamOrdem.once('data', (chunk) => {
  console.log('✅ createReadStream: primeiro chunk chegou, tamanho:', chunk.length);
});
streamOrdem.on('end', () => {
  console.log('✅ createReadStream terminou (arquivo inteiro processado)\n');

  // só começa o teste de memória depois que o Teste 1 terminar,
  // pra não misturar os resultados dos dois
  rodarTesteDeMemoria();
});

// ===== TESTE 2: USO DE MEMÓRIA =====
function rodarTesteDeMemoria() {
  console.log('=== TESTE 2: uso de memória ===');

  mostrarMemoria('Antes de qualquer leitura');

  fs.readFile('./arquivo_grande.txt', (err, data) => {
    mostrarMemoria('DEPOIS do readFile (arquivo inteiro na memória)');

    // só começa a testar o stream depois do readFile terminar,
    // pra não competir por memória ao mesmo tempo
    testarMemoriaComStream();
  });
}

function testarMemoriaComStream() {
  const stream = fs.createReadStream('./arquivo_grande.txt');
  let maiorPico = 0;

  stream.on('data', (chunk) => {
    const atual = process.memoryUsage().external / 1024 / 1024; // trocado heapUsed por external
    if (atual > maiorPico) maiorPico = atual;
  });

  stream.on('end', () => {
    console.log(`Pico de external DURANTE o createReadStream: ${maiorPico.toFixed(2)} MB`);
  });
}