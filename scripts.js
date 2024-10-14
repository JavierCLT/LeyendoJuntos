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
    this.shownCombinationsLevel1 = [];
    this.level1Pool = [];
    this.level1PoolSize = 30; // Adjust this number as needed
    this.shownCombinationsLevel2 = [];
    this.init();
  }

  init() {
    this.refreshLevel1Pool();  // Populate the level1Pool initially
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
    // ... (unchanged)
  }

  generarSilabaSimple() {
    // ... (unchanged)
  }

  generarContenidoNivel2() {
    // ... (unchanged)
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

  getUniqueLevel1Combination() {
    if (this.level1Pool.length === 0) {
      this.refreshLevel1Pool();
    }
    return this.level1Pool.pop();
  }

  getUniqueLevel2Combination() {
    if (this.shownCombinationsLevel2.length === combinacionesTresLetras.cvc.length) {
      this.shownCombinationsLevel2 = []; // Reset if all combinations have been shown
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

  shuffleArray(array) {
    // ... (unchanged)
  }

  getAllPossibleLevel1Combinations() {
    // ... (unchanged)
  }
  
  getUniqueWord(wordsArray, shownWords) {
    // ... (unchanged)
  }

  setNivel(newNivel) {
    this.nivel = newNivel;
    this.generarContenido();
    this.updateLevelButtons();
  }

  updateLevelButtons() {
    // ... (unchanged)
  }

  getConsonantColor(consonant) {
    // ... (unchanged)
  }

  renderLetra(letra, index) {
    // ... (unchanged)
  }

  renderContenido() {
    // ... (unchanged)
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
    // ... (unchanged)
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
    // ... (unchanged)
  }

  function hidePopup() {
    // ... (unchanged)
  }

  function checkScrollIndicator() {
    // ... (unchanged)
  }

  if (popup && scrollIndicator) {
    popup.addEventListener('scroll', checkScrollIndicator);
  }

  tutorialButton.addEventListener('click', showPopup);
  closePopupButton.addEventListener('click', hidePopup);
  overlay.addEventListener('click', hidePopup);
  
  window.addEventListener('resize', checkScrollIndicator);
});
