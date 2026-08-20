

const JOGADOR_HUMANO = "X";
const JOGADOR_IA = "O";
const ATRASO_ENTRE_ANALISES_MS = 300;

const DIFICULDADES = {
  "Fácil": 0.75,
  "Mediano": 0.4,
  "Difícil": 0.15,
  "Minimax": 0.0,
};

const DIFICULDADE_PADRAO = "Mediano";

class Jogo {
  constructor() {
    this.tabuleiro = Array(9).fill("");
    this.jogoAtivo = true;
    this.dificuldadeAtual = DIFICULDADE_PADRAO;
    this.probabilidadeAleatoria = DIFICULDADES[DIFICULDADE_PADRAO];
    this.placar = { jogador: 0, ia: 0, empates: 0 };
    this.celulas = [];

    this.statusEl = document.getElementById("status");
    this.placarEl = document.getElementById("placar");
    this.tituloPainelEl = document.getElementById("titulo-painel");
    this.tabuleiroEl = document.getElementById("tabuleiro");

    const canvas = document.getElementById("painel-neuronios");
    this.painel = new PainelNeuronios(canvas);

    this.criarTabuleiro();
    this.configurarEventos();
    this.atualizarPlacar();
  }

  criarTabuleiro() {
    this.tabuleiroEl.innerHTML = "";
    this.celulas = [];
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement("button");
      btn.className = "celula";
      btn.dataset.pos = i;
      btn.addEventListener("click", () => this.jogadaHumano(i));
      this.tabuleiroEl.appendChild(btn);
      this.celulas.push(btn);
    }
  }

  configurarEventos() {
    document.querySelectorAll(".btn-dif").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-dif").forEach((b) => b.classList.remove("ativo"));
        btn.classList.add("ativo");
        this.selecionarDificuldade(btn.dataset.dif);
      });
    });

    document.getElementById("btn-reiniciar").addEventListener("click", () => this.reiniciar());
    document.getElementById("btn-nova").addEventListener("click", () => this.reiniciar());
  }

  selecionarDificuldade(nome) {
    this.dificuldadeAtual = nome;
    this.probabilidadeAleatoria = DIFICULDADES[nome];
  }

  jogadaHumano(posicao) {
    if (!this.jogoAtivo || this.tabuleiro[posicao] !== "") return;

    this.tabuleiro[posicao] = JOGADOR_HUMANO;
    this.celulas[posicao].textContent = JOGADOR_HUMANO;
    this.celulas[posicao].classList.add("x");
    this.celulas[posicao].disabled = true;

    if (this.verificarFimDeJogo()) return;

    this.statusEl.textContent = "Vez da IA";
    this.travarTabuleiro(true);
    setTimeout(() => this.turnoIA(), 300);
  }

  escolherJogada(melhorPosicao, avaliacoes) {
    if (Math.random() < this.probabilidadeAleatoria) {
      const piores = avaliacoes
        .filter(([pos]) => pos !== melhorPosicao)
        .map(([pos]) => pos);
      if (piores.length > 0) {
        return piores[Math.floor(Math.random() * piores.length)];
      }
    }
    return melhorPosicao;
  }

  turnoIA() {
    const [melhorPosicao, avaliacoes] = melhorJogada(
      this.tabuleiro,
      JOGADOR_IA,
      JOGADOR_HUMANO
    );
    const posicaoEscolhida = this.escolherJogada(melhorPosicao, avaliacoes);

    this.painel.iniciarAnalise();
    this.tituloPainelEl.textContent = "Analisando jogadas possíveis com Minimax...";

    avaliacoes.forEach(([pos, pontuacao], indice) => {
      const atraso = ATRASO_ENTRE_ANALISES_MS * (indice + 1);
      setTimeout(() => {
        this.painel.adicionarAvaliacao(pos, pontuacao);
      }, atraso);
    });

    const atrasoFinal = ATRASO_ENTRE_ANALISES_MS * (avaliacoes.length + 1);
    setTimeout(() => {
      this.executarJogadaIA(posicaoEscolhida, avaliacoes);
    }, atrasoFinal);
  }

  executarJogadaIA(posicao, avaliacoes) {
    const mapa = Object.fromEntries(avaliacoes);
    const pontuacaoEscolhida = mapa[posicao];

    this.painel.mostrarEscolha(posicao, pontuacaoEscolhida);
    this.tituloPainelEl.textContent = `Melhor jogada encontrada: posição ${posicao} (pontuação ${pontuacaoEscolhida})`;

    this.tabuleiro[posicao] = JOGADOR_IA;
    this.celulas[posicao].textContent = JOGADOR_IA;
    this.celulas[posicao].classList.add("o");
    this.celulas[posicao].disabled = true;

    if (this.verificarFimDeJogo()) return;

    this.statusEl.textContent = "Sua vez (X)";
    this.travarTabuleiro(false);
  }

  verificarFimDeJogo() {
    const vencedor = verificarVencedor(this.tabuleiro);
    if (vencedor) {
      this.jogoAtivo = false;
      let texto;
      if (vencedor === JOGADOR_HUMANO) {
        texto = "Você venceu!";
        this.placar.jogador++;
      } else {
        texto = "A IA venceu!";
        this.placar.ia++;
      }
      this.statusEl.textContent = texto;
      this.atualizarPlacar();
      setTimeout(() => alert(texto), 100);
      return true;
    }

    if (tabuleiroCheio(this.tabuleiro)) {
      this.jogoAtivo = false;
      this.placar.empates++;
      this.statusEl.textContent = "Empate!";
      this.atualizarPlacar();
      setTimeout(() => alert("Empate!"), 100);
      return true;
    }

    return false;
  }

  atualizarPlacar() {
    this.placarEl.textContent =
      `Jogador: ${this.placar.jogador} | IA: ${this.placar.ia} | Empates: ${this.placar.empates}`;
  }

  travarTabuleiro(travado) {
    for (let i = 0; i < 9; i++) {
      if (this.tabuleiro[i] === "") {
        this.celulas[i].disabled = travado;
      }
    }
  }

  reiniciar() {
    this.tabuleiro = Array(9).fill("");
    this.jogoAtivo = true;
    this.statusEl.textContent = "Sua vez (X)";
    this.celulas.forEach((cel) => {
      cel.textContent = "";
      cel.classList.remove("x", "o");
      cel.disabled = false;
    });
    this.painel.reiniciar();
    this.tituloPainelEl.textContent = "Aguardando sua jogada...";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  new Jogo();
});