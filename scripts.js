import { combinacionesDosLetras } from './data/combinacionesDosLetras.js';
import { combinacionesTresLetras } from './data/combinacionesTresLetras.js';
import { palabrasNivel3 } from './data/palabrasNivel3.js';
import { frasesNivel4 } from './data/frasesNivel4.js';
import { consonantColorMap } from './data/colorMap.js';

const vocales = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú'];

const shownWordsLevel1 = [];
const shownWordsLevel2 = [];
const shownWordsLevel3 = [];
const shownWordsLevel4 = [];

class MetodoLectura {
  constructor() {
    this.nivel = 1;
    this.contenido = {};
    this.init();
  }

  init() {
    this.generarContenido();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    document.getElementById('nextButton').addEventListener('click', () => this.generarContenido());
    document.getElementById('speakButton').addEventListener('click', () => this.speakContent());

    // Handle level button clicks
    document.querySelectorAll('.level-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const newNivel = parseInt(e.target.dataset.level);
        if (newNivel !== this.nivel) {
          this.setNivel(newNivel);
        }
        this.updateLevelButtons();
      });

      // Prevent zooming when double-tapping level buttons on mobile devices
      button.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
          event.preventDefault(); // Prevent zoom
        }
      }, { passive: false });

      button.addEventListener('touchend', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        const newNivel = parseInt(e.target.dataset.level);
        if (newNivel !== this.nivel) {
          this.setNivel(newNivel);
        }
        this.updateLevelButtons();
      });

      button.addEventListener('dblclick', (event) => {
        event.preventDefault(); // Prevent zooming
      });
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
    let siguiente;
    try {
      switch (this.nivel) {
        case 1:
          siguiente = this.getUniqueWord(combinacionesDosLetras, shownWordsLevel1);
          break;
        case 2:
          siguiente = this.getUniqueWord(combinacionesTresLetras, shownWordsLevel2);
          break;
        case 3:
          siguiente = this.getUniqueWord(palabrasNivel3, shownWordsLevel3);
          break;
        case 4:
          siguiente = this.getUniqueWord(frasesNivel4, shownWordsLevel4);
          break;
        default:
          siguiente = { palabra: 'Nivel no definido' };
      }
    } catch (error) {
      console.error("Error generando contenido:", error);
      siguiente = { palabra: 'Error' };
    }

    this.contenido = siguiente;
    this.render();
  }

  getUniqueWord(wordsObject, shownWords) {
    const wordsArray = Array.isArray(wordsObject) ? wordsObject : Object.values(wordsObject).flat();

    if (shownWords.length === wordsArray.length) {
      shownWords.length = 0; // Reset the shown words list if all have been displayed
    }

    const availableWords = wordsArray.filter(word => !shownWords.includes(word));
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    shownWords.push(randomWord);

    return this.nivel === 4 ? { frase: randomWord } : { palabra: randomWord };
  }

  setNivel(newNivel) {
    this.nivel = newNivel;
    this.updateLevelButtons();

    // Disable the button for the current level
    document.querySelectorAll('.level-button').forEach(button => {
      const level = parseInt(button.dataset.level);
      button.disabled = level === newNivel;  // Disable the button for the current level
    });

    this.generarContenido();
  }

  updateLevelButtons() {
    document.querySelectorAll('.level-button').forEach((button, index) => {
      const level = index + 1;
      if (level === this.nivel) {
        button.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
        button.classList.add(`active-nivel-${level}`, 'text-nivel');
        button.classList.add('text-red-500'); // Ensure immediate red color for the active button
      } else {
        button.classList.remove(`active-nivel-${level}`, 'text-nivel', 'text-red-500');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
      }
    });
  }

  getConsonantColor(consonant) {
    return consonantColorMap[consonant.toLowerCase()] || '#000000'; // Default to black if not found
  }

  renderLetra(letra) {
    const span = document.createElement('span');
    span.textContent = letra;
    span.style.color = !vocales.includes(letra.toLowerCase()) ? this.getConsonantColor(letra.toLowerCase()) : 'black';
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

    if (this.nivel === 4) {
      this.contenido.frase.split(' ').forEach((palabra) => {
        const palabraDiv = document.createElement('div');
        palabraDiv.className = 'flex mr-4 mb-2';
        palabra.split('').forEach(letra => {
          palabraDiv.appendChild(this.renderLetra(letra));
        });
        container.appendChild(palabraDiv);
      });
    } else {
      const palabraDiv = document.createElement('div');
      palabraDiv.className = 'flex';
      this.contenido.palabra.split('').forEach(letra => {
        palabraDiv.appendChild(this.renderLetra(letra));
      });
      container.appendChild(palabraDiv);
    }
  }

  // Method to speak the content
  speakContent() {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = this.nivel === 4 ? this.contenido.frase : this.contenido.palabra;
    utterance.lang = 'es-ES'; // Set to Spanish (Spain)
    utterance.volume = 1; // 0 to 1
    utterance.rate = 0.9; // Slow it down slightly for kids
    utterance.pitch = 1; // Normal pitch

    // Handle end of speech
    utterance.onend = () => {
      console.log('Speech finished');
    };

    // Handle errors
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
  }

  render() {
    this.renderContenido();
    this.updateLevelButtons();
    // Optional: Auto-speak on render (uncomment if desired)
    // this.speakContent();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MetodoLectura();
});

// Ripple effect for button clicks
function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();  // Get button's bounding box

  const circle = document.createElement("span");
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  circle.style.width = `${diameter}px`;
  circle.style.height = `${diameter}px`;
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
