class MetodoLectura {
  constructor() {
    this.nivel = 1;
    this.contenido = {};
    this.uniqueConsonants = new Set();
    this.shownCombinationsLevel1 = [];
    this.shownCombinationsLevel2 = [];
    this.shownWordsLevel3 = [];
    this.shownWordsLevel4 = [];
    this.level1Pool = [];
    this.level1PoolSize = 30;
    this.init();
  }

  init() {
    this.refreshLevel1Pool();
    this.setupEventListeners();
    this.generarContenido();
    this.render();
  }

  setupEventListeners() {
    // Only add event listeners once
    document.getElementById('nextButton').addEventListener('click', () => this.generarContenido());

    // Bind level buttons only to update the level, no reinitialization
    document.querySelectorAll('.level-button').forEach(button => {
      button.addEventListener('click', (e) => this.setNivel(parseInt(e.target.dataset.level)));
    });

    document.getElementById('shareButton').addEventListener('click', () => this.shareApp());
    document.getElementById('contactButton').addEventListener('click', () => {
      window.open('https://www.linkedin.com/in/javiersz/', '_blank');
    });
  }

  shareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'Leyendo Juntos',
        text: 'Estoy usando esta aplicación para enseñar a leer a mi hijo, ¡pruébala!',
        url: window.location.href
      }).then(() => {
        console.log('Compartido exitosamente.');
      }).catch((error) => {
        console.error('Error al compartir:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Enlace copiado al portapapeles');
        })
        .catch((error) => {
          console.error('Error al copiar el enlace:', error);
        });
    }
  }

  setNivel(newNivel) {
    // Only update the level, don't generate new content immediately
    if (this.nivel !== newNivel) {
      this.nivel = newNivel;
      this.updateLevelButtons();
    }
  }

  updateLevelButtons() {
    document.querySelectorAll('.level-button').forEach(button => {
      const buttonLevel = parseInt(button.dataset.level);
      if (buttonLevel === this.nivel) {
        button.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
        button.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white');
      } else {
        button.classList.remove('bg-green-500', 'hover:bg-green-600', 'text-white');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
      }
    });
  }

  generarContenido() {
    let siguiente;
    try {
      switch (this.nivel) {
        case 1:
          siguiente = this.getUniqueLevel1Combination();
          break;
        case 2:
          siguiente = this.getUniqueLevel2Combination();
          break;
        case 3:
          siguiente = this.getUniqueWord(palabrasNivel3, this.shownWordsLevel3);
          break;
        case 4:
          siguiente = this.getUniqueWord(frasesNivel4, this.shownWordsLevel4);
          break;
        default:
          siguiente = this.generarSilabaSimple();
      }
    } catch (error) {
      console.error("Error generando contenido:", error);
      siguiente = { consonante: 'e', vocal: 'r' };
    }

    this.contenido = siguiente;
    this.render();
  }

  getUniqueLevel1Combination() {
    if (this.level1Pool.length === 0) {
      this.refreshLevel1Pool();
    }
    return this.level1Pool.pop();
  }

  getUniqueLevel2Combination() {
    if (this.shownCombinationsLevel2.length === combinacionesTresLetras.cvc.length) {
      this.shownCombinationsLevel2 = [];
    }

    let combination;
    do {
      combination = this.generarContenidoNivel2();
    } while (this.shownCombinationsLevel2.some(shown =>
      shown.consonante === combination.consonante && shown.vocal === combination.vocal
    ));

    this.shownCombinationsLevel2.push(combination);
    return combination;
  }

  refreshLevel1Pool() {
    const allCombinations = this.getAllPossibleLevel1Combinations();
    this.level1Pool = this.shuffleArray(allCombinations).slice(0, this.level1PoolSize);
  }

  getAllPossibleLevel1Combinations() {
    const allCombinations = [];
    for (const type in combinacionesDosLetras) {
      combinacionesDosLetras[type].forEach(combo => {
        if (type === 'vc') {
          allCombinations.push({ consonante: combo[1], vocal: combo[0] });
        } else {
          allCombinations.push({ consonante: combo[0], vocal: combo[1] });
        }
      });
    }
    return allCombinations;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getUniqueWord(wordsArray, shownWords) {
    if (shownWords.length === wordsArray.length) {
      shownWords.length = 0; // Reset when all words have been shown
    }

    const remainingWords = wordsArray.filter(word => !shownWords.includes(word));
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];

    shownWords.push(randomWord);  // Keep track to avoid repetition
    return { palabra: randomWord };
  }

  render() {
    this.renderContenido();
    this.updateLevelButtons();
  }

  renderContenido() {
    const container = document.getElementById('contenidoContainer');
    container.innerHTML = '';
    container.className = 'flex flex-wrap justify-center items-center';

    if ('frase' in this.contenido) {
      this.contenido.frase.split(' ').forEach((palabra, idx) => {
        const palabraDiv = document.createElement('div');
        palabraDiv.className = 'flex mr-4 mb-2';
        palabra.split('').forEach((letra, letraIdx, arr) => {
          palabraDiv.appendChild(this.renderLetra(letra, letraIdx, letraIdx === arr.length - 1));
        });
        container.appendChild(palabraDiv);
      });
    } else if ('palabra' in this.contenido) {
      const palabraDiv = document.createElement('div');
      palabraDiv.className = 'flex';
      this.contenido.palabra.split('').forEach((letra, index) => {
        palabraDiv.appendChild(this.renderLetra(letra, index));
      });
      container.appendChild(palabraDiv);
    } else if ('consonante' in this.contenido && 'vocal' in this.contenido) {
      const consonantes = this.contenido.consonante;
      const vocales = this.contenido.vocal;
      let i = 0;
      while (i < consonantes.length) {
        let letra = consonantes[i];
        let combined = false;

        if (i < consonantes.length - 1) {
          const nextLetra = consonantes[i + 1];
          if ((letra === 'c' && nextLetra === 'h') || (letra === 'l' && nextLetra === 'l') || (letra === 'r' && nextLetra === 'r')) {
            letra += nextLetra;
            i += 2;
            combined = true;
          } else {
            i += 1;
          }
        } else {
          i += 1;
        }

        container.appendChild(this.renderLetra(letra, i, combined));
      }

      vocales.split('').forEach((letra, index) => {
        container.appendChild(this.renderLetra(letra, index, false));
      });
    }
  }

  renderLetra(letra) {
    const span = document.createElement('span');
    span.textContent = letra;
    span.style.color = vocales.includes(letra.toLowerCase()) ? 'black' : this.getConsonantColor(letra.toLowerCase());
    span.classList.add('inline-block', 'font-bold');
    span.classList.add(this.nivel === 1 ? 'text-6xl' : this.nivel === 2 ? 'text-5xl' : this.nivel === 3 ? 'text-4xl' : 'text-3xl');
    return span;
  }

  getConsonantColor(consonant) {
    return consonantColorMap[consonant.toLowerCase()] || '#000000'; // Default to black if not found
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MetodoLectura();
});
