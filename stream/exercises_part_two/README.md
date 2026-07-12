Exercício extra — Backpressure com números aleatórios
Escreva um script que gere e escreva 500.000 linhas num arquivo (numeros_aleatorios.txt), onde cada linha contém um número aleatório entre 1 e 1000 (ex: "742\n"), sem usar pipe() — escrita manual em loop, igual ao Exercício 6.
Requisitos:

Controle o backpressure do mesmo jeito que você já fez (checando .write(), pausando, retomando com drain).
Além de contar quantas vezes o backpressure ativou, calcule também em qual número de linha (i) cada ativação aconteceu — guarde isso numa lista (array), não só um contador.
No final, depois do .end(), imprima:

O total de backpressure ativado
As 3 primeiras posições (valores de i) onde o backpressure ativou, só pra você visualizar em que pontos do arquivo isso aconteceu

Dica pra pensar antes de codar: a estrutura geral (a função que se chama de novo sozinha, a variável de controle do loop, o once('drain', ...)) é praticamente idêntica ao Exercício 6. A diferença real está em duas coisas: gerar o número aleatório a cada linha, e trocar o contador simples por uma lista que guarda as posições.
Tenta montar sozinho primeiro. Se travar em alguma parte específica, me diz exatamente onde, e eu te guio com perguntas, do mesmo jeito que fizemos agora.