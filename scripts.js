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
    this.voices = [];
    this.spanishVoice = null;
    this.init();
  }

  init() {
    this.generarContenido();
    this.setupEventListeners();
    this.render();
    this.initializeSpeech();
    this.updateSpeechButtonVisibility(); // Initialize speech button visibility
  }

  initializeSpeech() {
    if (!('speechSynthesis' in window)) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length === 0) {
        setTimeout(loadVoices, 100);
      } else {
        // Log all available voices to help with debugging
        console.log('All available voices:', this.voices.map(v => `${v.name} (${v.lang})`));
        
        // Detect platform
        const isApple = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
        console.log('Is Apple device:', isApple);

        // Set priority order for Castilian Spanish voices
        const castilianVoicePriorities = [
          // Names commonly found on iOS/macOS for Castilian Spanish
          { name: 'Jorge', lang: 'es-ES' },
          { name: 'Mónica', lang: 'es-ES' },
          { name: 'Marisol', lang: 'es-ES' },
          { name: 'Español (España)', lang: 'es-ES' },
          { name: 'Spanish (Spain)', lang: 'es-ES' },
          { nameIncludes: 'Spain', lang: 'es-ES' },
          // Fallbacks
          { lang: 'es-ES' },
          { langStartsWith: 'es-' }
        ];

        // Try to find a voice matching the priorities
        for (const priority of castilianVoicePriorities) {
          let matchedVoice = null;
          
          if (priority.name) {
            // Exact name match
            matchedVoice = this.voices.find(voice => 
              voice.name === priority.name && voice.lang === priority.lang
            );
          } else if (priority.nameIncludes) {
            // Name includes a specific string
            matchedVoice = this.voices.find(voice => 
              voice.name.includes(priority.nameIncludes) && voice.lang === priority.lang
            );
          } else if (priority.lang) {
            // Exact language match
            matchedVoice = this.voices.find(voice => voice.lang === priority.lang);
          } else if (priority.langStartsWith) {
            // Language starts with a specific prefix
            matchedVoice = this.voices.find(voice => voice.lang.startsWith(priority.langStartsWith));
          }
          
          if (matchedVoice) {
            this.spanishVoice = matchedVoice;
            console.log('Selected voice:', this.spanishVoice.name, this.spanishVoice.lang);
            break;
          }
        }

        if (!this.spanishVoice) {
          console.warn('No suitable Spanish voice found. Using first available voice.');
          this.spanishVoice = this.voices[0];
        }
      }
    };

    // Initial load
    loadVoices();
    
    // Set up event handler for when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  setupEventListeners() {
    document.getElementById('nextButton').addEventListener('click', () => this.generarContenido());
    document.getElementById('speakButton').addEventListener('click', () => this.speakContent());

    document.querySelectorAll('.level-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const newNivel = parseInt(e.target.dataset.level);
        if (newNivel !== this.nivel) {
          this.setNivel(newNivel);
        }
        this.updateLevelButtons();
      });

      button.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      }, { passive: false });

      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        const newNivel = parseInt(e.target.dataset.level);
        if (newNivel !== this.nivel) {
          this.setNivel(newNivel);
        }
        this.updateLevelButtons();
      });

      button.addEventListener('dblclick', (event) => {
        event.preventDefault();
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
      shownWords.length = 0;
    }

    const availableWords = wordsArray.filter(word => !shownWords.includes(word));
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    shownWords.push(randomWord);

    return this.nivel === 4 ? { frase: randomWord } : { palabra: randomWord };
  }

  setNivel(newNivel) {
    this.nivel = newNivel;
    this.updateLevelButtons();
    
    // Update speech button visibility based on level
    this.updateSpeechButtonVisibility();

    document.querySelectorAll('.level-button').forEach(button => {
      const level = parseInt(button.dataset.level);
      button.disabled = level === newNivel;
    });

    this.generarContenido();
  }

  // New method to handle speech button visibility
  updateSpeechButtonVisibility() {
    const speakButton = document.getElementById('speakButton');
    if (speakButton) {
      if (this.nivel >= 3) {
        speakButton.style.display = 'inline-block'; // Show speak button for levels 3 and 4
        speakButton.disabled = false;
      } else {
        speakButton.style.display = 'none'; // Hide speak button for levels 1 and 2
      }
    }
  }

  updateLevelButtons() {
    document.querySelectorAll('.level-button').forEach((button, index) => {
      const level = index + 1;
      if (level === this.nivel) {
        button.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
        button.classList.add(`active-nivel-${level}`, 'text-nivel');
        button.classList.add('text-red-500');
      } else {
        button.classList.remove(`active-nivel-${level}`, 'text-nivel', 'text-red-500');
        button.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
      }
    });
  }

  getConsonantColor(consonant) {
    return consonantColorMap[consonant.toLowerCase()] || '#000000';
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

  speakContent() {
    // Only allow speech for levels 3 and 4
    if (this.nivel < 3) {
      console.log('Speech is only available for levels 3 and 4');
      // No alert needed since the button should be hidden
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.error('Web Speech API is not supported.');
      alert('Lo siento, la lectura en voz alta no está disponible en este navegador.');
      return;
    }

    if (!this.voices.length) {
      console.warn('Voices not loaded yet. Retrying...');
      this.initializeSpeech();
      setTimeout(() => this.speakContent(), 500);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = this.nivel === 4 ? this.contenido.frase : this.contenido.palabra;
    utterance.lang = 'es-ES';  // Explicitly set to Castilian Spanish
    utterance.volume = 1;
    utterance.rate = 0.4;      // Slow rate for better clarity
    utterance.pitch = 1;

    if (this.spanishVoice) {
      utterance.voice = this.spanishVoice;
      console.log('Speaking with voice:', this.spanishVoice.name, this.spanishVoice.lang);
    } else {
      console.warn('No Spanish voice available. Using default voice.');
      alert('La voz española no está disponible en este dispositivo. Usando voz predeterminada. En iOS, activa las voces españolas en Ajustes > Accesibilidad > Contenido hablado > Voces.');
    }

    utterance.onend = () => {
      console.log('Speech finished');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'network') {
        alert('Error al reproducir el audio. Verifica los permisos o la conexión.');
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  render() {
    this.renderContenido();
    this.updateLevelButtons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MetodoLectura();
});

function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();

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

const tutorialButton = document.getElementById('tutorialButton');
tutorialButton.classList.add('highlight');

setTimeout(() => {
  tutorialButton.classList.remove('highlight');
}, 2000);

const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const closePopupButton = document.getElementById('closePopup');
const scrollIndicator = document.getElementById('scrollIndicator');

function showPopup() {
  popup.style.display = 'block';
  overlay.style.display = 'block';
  popup.scrollTop = 0;
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
