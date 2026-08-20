
const COMBINACOES_VITORIA = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function verificarVencedor(tabuleiro) {
  for (const [a, b, c] of COMBINACOES_VITORIA) {
    if (tabuleiro[a] !== "" && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
      return tabuleiro[a];
    }
  }
  return null;
}

function tabuleiroCheio(tabuleiro) {
  return !tabuleiro.includes("");
}

function minimax(tabuleiro, profundidade, maximizando, jogadorIA, jogadorHumano) {
  const vencedor = verificarVencedor(tabuleiro);
  if (vencedor === jogadorIA) return 10 - profundidade;
  if (vencedor === jogadorHumano) return profundidade - 10;
  if (tabuleiroCheio(tabuleiro)) return 0;

  if (maximizando) {
    let melhor = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (tabuleiro[i] === "") {
        tabuleiro[i] = jogadorIA;
        melhor = Math.max(melhor, minimax(tabuleiro, profundidade + 1, false, jogadorIA, jogadorHumano));
        tabuleiro[i] = "";
      }
    }
    return melhor;
  } else {
    let pior = Infinity;
    for (let i = 0; i < 9; i++) {
      if (tabuleiro[i] === "") {
        tabuleiro[i] = jogadorHumano;
        pior = Math.min(pior, minimax(tabuleiro, profundidade + 1, true, jogadorIA, jogadorHumano));
        tabuleiro[i] = "";
      }
    }
    return pior;
  }
}


function melhorJogada(tabuleiro, jogadorIA, jogadorHumano) {
  const avaliacoes = [];
  let melhorPontuacao = -Infinity;
  let melhorPosicao = null;


  const copia = [...tabuleiro];

  for (let i = 0; i < 9; i++) {
    if (copia[i] === "") {
      copia[i] = jogadorIA;
      const pontuacao = minimax(copia, 0, false, jogadorIA, jogadorHumano);
      copia[i] = "";
      avaliacoes.push([i, pontuacao]);
      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        melhorPosicao = i;
      }
    }
  }

  return [melhorPosicao, avaliacoes];
}