import { combinacionesDosLetras } from './data/combinacionesDosLetras.js';
import { combinacionesTresLetras } from './data/combinacionesTresLetras.js';
import { palabrasNivel3 } from './data/palabrasNivel3.js';
import { frasesNivel4 } from './data/frasesNivel4.js';
import { consonantColorMap } from './data/colorMap.js';

const vocales = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú'];

class MetodoLectura {
  constructor() {
    this.nivel = 1;
    this.contenido = {};
    this.uniqueConsonants = new Set();
    this.shownCombinationsLevel1 = [];
    this.shownCombinationsLevel2 = [];
    this.shownWordsLevel3 = [];
    this.shownWordsLevel4 = [];
    this.currentIndex = [0, 0, 0, 0];
    this.contentArrays = [
      this.getAllPossibleLevel1Combinations(),
      combinacionesTresLetras.cvc,
      palabrasNivel3,
      frasesNivel4
    ];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateLevelButtons();
    this.generarContenido();
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

  generarContenido() {
    switch (this.nivel) {
      case 1:
        this.contenido = this.getUniqueLevel1Combination();
        break;
      case 2:
        this.contenido = this.getUniqueLevel2Combination();
        break;
      case 3:
        this.contenido = { palabra: this.getUniqueWord(2) };
        break;
      case 4:
        this.contenido = { frase: this.getUniqueWord(3) };
        break;
    }
    this.renderContenido();
  }

  getUniqueLevel1Combination() {
    const combinations = this.contentArrays[0];
    const index = this.getNextIndex(0);
    const item = combinations[index];
    return { consonante: item.consonante, vocal: item.vocal };
  }

  getUniqueLevel2Combination() {
    const combinations = this.contentArrays[1];
    const index = this.getNextIndex(1);
    const item = combinations[index];
    return { consonante: item.slice(0, -1), vocal: item.slice(-1) };
  }

  getUniqueWord(levelIndex) {
    const words = this.contentArrays[levelIndex];
    const index = this.getNextIndex(levelIndex);
    return words[index];
  }

  getNextIndex(levelIndex) {
    let index = this.currentIndex[levelIndex];
    if (index >= this.contentArrays[levelIndex].length) {
      index = 0;
    }
    this.currentIndex[levelIndex] = (index + 1) % this.contentArrays[levelIndex].length;
    return index;
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
    return this.shuffleArray(allCombinations);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
    
  setNivel(newNivel) {
    this.nivel = newNivel;
    this.updateLevelButtons();
    this.generarContenido();
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
    if (!this.uniqueConsonants.has(consonant)) {
      this.uniqueConsonants.add(consonant);
    }
    return consonantColorMap[consonant] || '#000000';
  }

  renderLetra(letra) {
    const span = document.createElement('span');
    span.textContent = letra;
    const isConsonant = !vocales.includes(letra.toLowerCase());
    span.style.color = isConsonant ? this.getConsonantColor(letra.toLowerCase()) : 'black';
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
      this.renderFrase(container);
    } else if ('palabra' in this.contenido) {
      this.renderPalabra(container);
    } else if ('consonante' in this.contenido && 'vocal' in this.contenido) {
      this.renderSilaba(container);
    } else {
      this.renderError(container);
    }
  }

  renderFrase(container) {
    this.contenido.frase.split(' ').forEach((palabra) => {
      const palabraDiv = document.createElement('div');
      palabraDiv.className = 'flex mr-4 mb-2';
      palabra.split('').forEach((letra) => {
        palabraDiv.appendChild(this.renderLetra(letra));
      });
      container.appendChild(palabraDiv);
    });
  }

  renderPalabra(container) {
    const palabraDiv = document.createElement('div');
    palabraDiv.className = 'flex';
    this.contenido.palabra.split('').forEach((letra) => {
      palabraDiv.appendChild(this.renderLetra(letra));
    });
    container.appendChild(palabraDiv);
  }

  renderSilaba(container) {
    const consonantes = this.contenido.consonante;
    const vocales = this.contenido.vocal;
    let i = 0;
    while (i < consonantes.length) {
      let letra = consonantes[i];
      if (i < consonantes.length - 1) {
        const nextLetra = consonantes[i + 1];
        if (['ch', 'll', 'rr', 'cc', 'qu'].includes(letra + nextLetra)) {
          letra += nextLetra;
          i += 2;
        } else {
          i += 1;
        }
      } else {
        i += 1;
      }
      container.appendChild(this.renderLetra(letra));
    }
    vocales.split('').forEach((letra) => {
      container.appendChild(this.renderLetra(letra));
    });
  }

  renderError(container) {
    const errorSpan = document.createElement('span');
    errorSpan.textContent = 'Error';
    errorSpan.className = 'text-3xl text-red-500';
    container.appendChild(errorSpan);
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

  // This to disable double-tap zoom on mobile
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  tutorialButton.addEventListener('click', showPopup);
  closePopupButton.addEventListener('click', hidePopup);
  overlay.addEventListener('click', hidePopup);
  window.addEventListener('resize', checkScrollIndicator);
});
