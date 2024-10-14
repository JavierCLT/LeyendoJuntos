import { combinacionesDosLetras } from './data/combinacionesDosLetras.js';
import { combinacionesTresLetras } from './data/combinacionesTresLetras.js';
import { palabrasNivel3 } from './data/palabrasNivel3.js';
import { frasesNivel4 } from './data/frasesNivel4.js';
import { consonantColorMap } from './data/colorMap.js';

const vocales = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú'];

// Arrays to keep track of shown words for each level
const shownWordsLevel3 = [];
const shownWordsLevel4 = [];

class MetodoLectura {
  constructor() {
    this.nivel = 1;
    this.contenido = {};
    this.uniqueConsonants = new Set();
    this.init();
    this.shownCombinationsLevel1 = [];
    this.shownCombinationsLevel2 = [];
  }

  init() {
    this.generarContenido();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    document.getElementById('nextButton').addEventListener('click', () => this.generarContenido());
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

  generarSilabaSimple() {
    const tipos = ['vc', 'cv', 'vv'];
    const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
    const combinaciones = combinacionesDosLetras[tipoAleatorio];
    const combinacionAleatoria = combinaciones[Math.floor(Math.random() * combinaciones.length)];

    if (tipoAleatorio === 'vc') {
      return { consonante: combinacionAleatoria[1], vocal: combinacionAleatoria[0] };
    } else if (tipoAleatorio === 'cv') {
      return { consonante: combinacionAleatoria[0], vocal: combinacionAleatoria[1] };
    } else {
      return { consonante: combinacionAleatoria[0], vocal: combinacionAleatoria[1] };
    }
  }

  generarContenidoNivel2() {
    const combinacionAleatoria = combinacionesTresLetras.cvc[Math.floor(Math.random() * combinacionesTresLetras.cvc.length)];
    return {
      consonante: combinacionAleatoria.slice(0, -1),
      vocal: combinacionAleatoria.slice(-1)
    };
  }

  generarContenido() {
    let siguiente;
    try {
      switch (this.nivel) {
        case 1:
          siguiente = this.getUniqueCombination(this.generarSilabaSimple, this.shownCombinationsLevel1, this.getAllPossibleLevel1Combinations());
          break;
        case 2:
          siguiente = this.getUniqueCombination(this.generarContenidoNivel2, this.shownCombinationsLevel2, combinacionesTresLetras.cvc);
          break;
        case 3:
          siguiente = this.getUniqueWord(palabrasNivel3, shownWordsLevel3);
          break;
        case 4:
          siguiente = this.getUniqueWord(frasesNivel4, shownWordsLevel4);
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

  getUniqueCombination(generatorFunction, shownCombinations, allPossibleCombinations) {
    if (shownCombinations.length === allPossibleCombinations.length) {
      shownCombinations.length = 0; // Reset the shown combinations list
    }

    let combination;
    do {
      combination = generatorFunction.call(this);
    } while (this.combinationExists(combination, shownCombinations));

    shownCombinations.push(combination);
    return combination;
  }

  combinationExists(combination, shownCombinations) {
    return shownCombinations.some(shown => 
      shown.consonante === combination.consonante && shown.vocal === combination.vocal
    );
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
  
  getUniqueWord(wordsArray, shownWords) {
    if (shownWords.length === wordsArray.length) {
      shownWords.length = 0; // Reset the shown words list
    }

    let availableWords = wordsArray.filter(word => !shownWords.includes(word));
    let randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    shownWords.push(randomWord);

    return this.nivel === 3 ? { palabra: randomWord } : { frase: randomWord };
  }

  setNivel(newNivel) {
    this.nivel = newNivel;
    this.generarContenido();
    this.updateLevelButtons();
  }

  updateLevelButtons() {
  document.querySelectorAll('.level-button').forEach((button, index) => {
    const level = index + 1;
    if (level === this.nivel) {
      button.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
      button.classList.add(`active-nivel-${level}`, 'text-nivel');
    } else {
      button.classList.remove(`active-nivel-${level}`, 'text-nivel');
      button.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
    }
  });
}

  getConsonantColor(consonant) {
    consonant = consonant.toLowerCase();
    if (!this.uniqueConsonants.has(consonant)) {
      this.uniqueConsonants.add(consonant);
    }
    return consonantColorMap[consonant] || '#000000'; // Default to black if consonant not found
  }

  renderLetra(letra, index) {
    const span = document.createElement('span');
    span.textContent = letra;
    const isConsonant = !vocales.includes(letra.toLowerCase());

    if (isConsonant) {
      span.style.color = this.getConsonantColor(letra.toLowerCase());
    } else {
      span.style.color = 'black';
    }

    span.classList.add('inline-block', 'font-bold');
    const sizeClass = this.nivel === 1 ? 'text-6xl' :
      this.nivel === 2 ? 'text-5xl' :
        this.nivel === 3 ? 'text-4xl' : 'text-3xl';
    span.classList.add(sizeClass);

    return span;
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
          if ((letra === 'c' && nextLetra === 'h') || (letra === 'l' && nextLetra === 'l') || (letra === 'r' && nextLetra === 'r') || (letra === 'c' && nextLetra === 'c') || (letra === 'q' && nextLetra === 'u')) {
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
    } else {
      const errorSpan = document.createElement('span');
      errorSpan.textContent = 'Error';
      errorSpan.className = 'text-3xl text-red-500';
      container.appendChild(errorSpan);
    }
  }

  render() {
    this.renderContenido();
    this.updateLevelButtons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const metodoLectura = new MetodoLectura();

  // Ripple effect for button clicks
  function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();  // Get button's bounding box

  const circle = document.createElement("span");
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;

  // Adjust positioning to be relative to the button itself
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;

  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

  const buttons = document.getElementsByTagName("button");
  for (const button of buttons) {
    button.addEventListener("click", createRipple);
  }

  // Highlight tutorial button on page load
  const tutorialButton = document.getElementById('tutorialButton');
  tutorialButton.classList.add('highlight');

  setTimeout(() => {
    tutorialButton.classList.remove('highlight');
  }, 1000);

  // Show/Hide Popup logic
  const popup = document.getElementById('popup');
  const overlay = document.getElementById('overlay');
  const closePopupButton = document.getElementById('closePopup');
  const scrollIndicator = document.getElementById('scrollIndicator');
  

  function showPopup() {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    popup.scrollTop = 0; // Reset scroll position
    checkScrollIndicator();
    if (scrollIndicator) {
      scrollIndicator.classList.remove('hidden');
      scrollIndicator.classList.add('bounce');
      setTimeout(() => {
        scrollIndicator.classList.remove('bounce');
      }, 1000);
    }
  }

  function hidePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }

  function checkScrollIndicator() {
    if (scrollIndicator && popup) {
      if (popup.scrollHeight > popup.clientHeight && popup.scrollTop < 5) {
        scrollIndicator.classList.remove('hidden');
      } else {
        scrollIndicator.classList.add('hidden');
      }
    }
  }

  if (popup && scrollIndicator) {
    popup.addEventListener('scroll', checkScrollIndicator);
  }

  tutorialButton.addEventListener('click', showPopup);
  closePopupButton.addEventListener('click', hidePopup);
  overlay.addEventListener('click', hidePopup);
  
  window.addEventListener('resize', checkScrollIndicator);
});
