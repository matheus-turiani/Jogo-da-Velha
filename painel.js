
const RAIO_NEURONIO = 30;
const RAIO_NEURONIO_ATIVO = 36;
const COR_NEURONIO_VAZIO = "rgb(60, 60, 70)";
const COR_LINHA_REDE = "rgba(180, 180, 200, 0.35)";

class PainelNeuronios {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.pontuacoes = {};
    this.posicaoAtual = null;
    this.posicaoEscolhida = null;
    this.desenhar();
  }

  iniciarAnalise() {
    this.pontuacoes = {};
    this.posicaoAtual = null;
    this.posicaoEscolhida = null;
    this.desenhar();
  }

  adicionarAvaliacao(posicao, pontuacao) {
    this.pontuacoes[posicao] = pontuacao;
    this.posicaoAtual = posicao;
    this.desenhar();
  }

  mostrarEscolha(posicao, pontuacao) {
    this.posicaoEscolhida = posicao;
    this.posicaoAtual = null;
    this.desenhar();
  }

  reiniciar() {
    this.pontuacoes = {};
    this.posicaoAtual = null;
    this.posicaoEscolhida = null;
    this.desenhar();
  }

  corParaPontuacao(pontuacao) {
    let intensidade = Math.max(-1, Math.min(1, pontuacao / 10));
    if (intensidade >= 0) {
   
      const r = Math.round(255 * (1 - intensidade));
      const g = 255;
      const b = Math.round(255 * (1 - intensidade));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      intensidade = -intensidade;

      const r = 255;
      const g = Math.round(255 * (1 - intensidade));
      const b = Math.round(255 * (1 - intensidade));
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  centroNeuronio(posicao) {
    const linha = Math.floor(posicao / 3);
    const coluna = posicao % 3;
    const espacoX = this.canvas.width / 4;
    const espacoY = this.canvas.height / 4;
    return [espacoX * (coluna + 1), espacoY * (linha + 1)];
  }

  desenhar() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, w, h);

    const centros = [];
    for (let i = 0; i < 9; i++) {
      centros.push(this.centroNeuronio(i));
    }

  
    ctx.strokeStyle = COR_LINHA_REDE;
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      for (let j = i + 1; j < 9; j++) {
        ctx.beginPath();
        ctx.moveTo(centros[i][0], centros[i][1]);
        ctx.lineTo(centros[j][0], centros[j][1]);
        ctx.stroke();
      }
    }

  
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < 9; i++) {
      const [x, y] = centros[i];
      const raio = i === this.posicaoAtual ? RAIO_NEURONIO_ATIVO : RAIO_NEURONIO;

      let cor;
      if (i in this.pontuacoes) {
        cor = this.corParaPontuacao(this.pontuacoes[i]);
      } else {
        cor = COR_NEURONIO_VAZIO;
      }

    
      if (i === this.posicaoEscolhida) {
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
      }

      ctx.fillStyle = cor;
      ctx.beginPath();
      ctx.arc(x, y, raio, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const texto = i in this.pontuacoes ? String(this.pontuacoes[i]) : "?";
     
      const isClaro = cor !== COR_NEURONIO_VAZIO && this.pontuacoes[i] > -5;
      ctx.fillStyle = isClaro ? "#141414" : "#ffffff";
      ctx.fillText(texto, x, y);
    }
  }
}