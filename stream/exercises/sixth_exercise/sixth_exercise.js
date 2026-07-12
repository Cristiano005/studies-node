const fs = require('fs');
const writable = fs.createWriteStream('./one_million_lines.txt', {
    // highWaterMark: 100000, Quantidade em KB que defineo limite de acúmulo do balde. Quanto maior, menos vezes o backpressure será atingido.
});
const total = 1000 * 1000;

let i = 0;
let countBackpressure = 0;

function escrever() {

  let goAhead = true;

  while (i < total && goAhead) {
    i++;
    goAhead = writable.write(`linha ${i}\n`);

    if (!goAhead) {
      countBackpressure++;
    }
  }

  if (i < total) {
    // ainda sobra trabalho — o while parou por causa do backpressure
    writable.once('drain', escrever);
    // O drain espera o limite do balde descer até uma quantidade suficiente para executar novamente a função de escrever e continuar com o processo.
  } else {
    // acabou tudo — hora de fechar o stream
    writable.end(() => {
      console.log(`Terminado! Backpressure ativado ${countBackpressure} vezes.`);
    });
  }
}

escrever();