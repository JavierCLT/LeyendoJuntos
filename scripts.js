// Define your color palette
const colores = ['#c1121f', '#2a9d8f', '#e9c46a', '#219ebc', '#f4a261', '#e76f51'];

// Define vowels (including accented ones)
const vocales = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú'];

// Track the last consonant color applied
let lastConsonantColor = '';

// Define consonant combinations
const consonantCombinations = ['ch', 'll', 'rr', 'cc', 'qu'];

// Define two-letter combinations
const combinacionesDosLetras = {
  vc: [
    'al', 'an', 'ar', 'as',
    'el', 'em', 'en', 'er', 'es',
    'id', 'im', 'in', 'ir', 'is',
    'ob', 'ol', 'om', 'on', 'or', 'os',
    'ul', 'un', 'ur'
  ],
  cv: [
    'ba', 'be', 'bi', 'bo', 'bu',
    'ca', 'ce', 'ci', 'co', 'cu',
    'da', 'de', 'di', 'do', 'du',
    'fa', 'fe', 'fi', 'fo', 'fu',
    'ga', 'ge', 'gi', 'go', 'gu',
    'ha', 'he', 'hi', 'ho', 'hu',
    'ja', 'je', 'ji', 'jo', 'ju',
    'ka', 'ke', 'ki', 'ko', 'ku',
    'la', 'le', 'li', 'lo', 'lu',
    'ma', 'me', 'mi', 'mo', 'mu',
    'na', 'ne', 'ni', 'no', 'nu',
    'pa', 'pe', 'pi', 'po', 'pu',
    'que', 'qui',
    'ra', 're', 'ri', 'ro', 'ru',
    'sa', 'se', 'si', 'so', 'su',
    'ta', 'te', 'ti', 'to', 'tu',
    'va', 've', 'vi', 'vo', 'vu',
    'xa', 'xe', 'xi', 'xo', 'xu',
    'ya', 'ye', 'yi', 'yo', 'yu',
    'za', 'ce', 'ci', 'zo', 'zu'
  ],
  vv: [
    'ai', 'au', 'ei', 'eu', 'ia', 'ie', 'io', 'iu', 'oi', 'ou', 'ua', 'ue', 'ui', 'uo'
  ],
};

// Define three-letter combinations
const combinacionesTresLetras = {
  cvc: [
    'sol', 'mar', 'pan', 'sal', 'luz', 'fin', 'rey', 'voz', 'pie', 'paz', 
    'té', 'cal', 'del', 'hay', 'mis', 'ver', 'oro', 'sur', 'zar', 
    'son', 'uno', 'dos', 'tres', 'muy', 'sin', 'las', 'por', 'más', 'ser',
    'con', 'bra', 'bre', 'bri', 'bro', 'bru',
    'cla', 'cle', 'cli', 'clo', 'clu',
    'cra', 'cre', 'cri', 'cro', 'cru',
    'dra', 'dre', 'dri', 'dro', 'dru',
    'fra', 'fre', 'fri', 'fro', 'fru',
    'gra', 'gre', 'gri', 'gro', 'gru',
    'pla', 'ple', 'pli', 'plo', 'plu',
    'pra', 'pre', 'pri', 'pro', 'pru',
    'tra', 'tre', 'tri', 'tro', 'tru',
    'bla', 'ble', 'bli', 'blo', 'blu',
    'cha', 'che', 'chi', 'cho', 'chu',
  ],
};

// Define words for Level 3
const palabrasNivel3 = [
  'casa', 'perro', 'gato', 'árbol', 'flor', 'sol', 'luna', 'estrella',
  'agua', 'fuego', 'tierra', 'aire', 'libro', 'mesa', 'silla', 'cama',
  'puerta', 'ventana', 'coche', 'bici', 'tren', 'avión', 'barco', 'pez',
  'pájaro', 'mano', 'pie', 'ojo', 'nariz', 'boca', 'oreja', 'diente',
  'pelo', 'brazo', 'pierna', 'dedo', 'uña', 'corazón', 'cerebro', 'hueso',
  'rojo', 'azul', 'verde', 'amarillo', 'blanco', 'negro', 'rosa', 'naranja',
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'
];

// Define phrases for Level 4
const frasesNivel4 = [
  'El sol brilla', 'La luna es blanca', 'El perro ladra', 'El gato maulla',
  'La flor es roja', 'El cielo es azul', 'La casa es grande', 'El árbol es alto',
  'El pez nada', 'El pájaro vuela', 'La niña corre', 'El niño salta',
  'La mesa es marrón', 'La silla es verde', 'El libro es nuevo',
  'La puerta está abierta', 'La ventana está cerrada', 'El coche es rápido',
  'La bici es pequeña', 'El tren es largo', 'Una casa bonita',
  'La pared es blanca', 'Un parque para niños', 'Un libro pequeño',
  'Mi amigo se llama Adam', 'Mi padre es mayor que yo',
  'Mis zapatos están limpios', 'La moto hace mucho ruido'
];

// MetodoLectura Class
class MetodoLectura {
  constructor() {
    this.nivel = 1;
    this.contenido = {};
    this.consonantColors = {};
    this.colorIndex = 0;
    this.uniqueConsonants = new Set();
    this.init();
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

  // Generate simple syllable for Level 1
  generarSilabaSimple() {
    const tipos = ['vc', 'cv', 'vv'];
    const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
    const combinaciones = combinacionesDosLetras[tipoAleatorio];

    // Pick a random combination
    const combinacionAleatoria = combinaciones[Math.floor(Math.random() * combinaciones.length)];

    if (tipoAleatorio === 'vc') {
      return { consonante: combinacionAleatoria[1], vocal: combinacionAleatoria[0] };
    } else if (tipoAleatorio === 'cv') {
      return { consonante: combinacionAleatoria[0], vocal: combinacionAleatoria[1] };
    } else {
      return { consonante: combinacionAleatoria[0], vocal: combinacionAleatoria[1] };
    }
  }

  // Generate content for Level 2 (three-letter combinations)
  generarContenidoNivel2() {
    const combinaciones = combinacionesTresLetras.cvc;

    // Pick a random combination
    const combinacionAleatoria = combinaciones[Math.floor(Math.random() * combinaciones.length)];

    return {
      consonante: combinacionAleatoria.slice(0, -1),
      vocal: combinacionAleatoria.slice(-1),
    };
  }

  // Generate content based on the current level
  generarContenido() {
    let siguiente;
    try {
      switch (this.nivel) {
        case 1:
          siguiente = this.generarSilabaSimple();
          break;
        case 2:
          siguiente = this.generarContenidoNivel2();
          break;
        case 3:
          siguiente = { palabra: palabrasNivel3[Math.floor(Math.random() * palabrasNivel3.length)] };
          break;
        case 4:
          siguiente = { frase: frasesNivel4[Math.floor(Math.random() * frasesNivel4.length)] };
          break;
        default:
          siguiente = this.generarSilabaSimple();
      }
    } catch (error) {
      console.error("Error generando contenido:", error);
      siguiente = { consonante: 'er', vocal: 'r' }; // Adjusted to a valid default
    }

    this.contenido = siguiente;
    this.render();
  }

  setNivel(newNivel) {
    this.nivel = newNivel;
    this.updateMarginForNivel();
    this.generarContenido();
    this.updateLevelButtons();
  }

  updateMarginForNivel() {
    const contenidoContainer = document.getElementById('contenidoContainer');
    if (this.nivel === 4) {
      contenidoContainer.style.marginLeft = '2em';
    } else {
      contenidoContainer.style.marginLeft = '0';
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

  // Assign colors to consonants and combinations
  getConsonantColor(consonant) {
    consonant = consonant.toLowerCase();
    if (!this.uniqueConsonants.has(consonant)) {
      this.uniqueConsonants.add(consonant);  // Track this consonant as unique
    }

    // Assign a color only if it has not been assigned yet
    if (!this.consonantColors[consonant]) {
      let newColor = colores[this.colorIndex];
      this.colorIndex = (this.colorIndex + 1) % colores.length;  // Loop back if we run out of colors
      this.consonantColors[consonant] = newColor;
      lastConsonantColor = newColor;
    }

    return this.consonantColors[consonant];
  }

  // Render a single letter or consonant combination
  renderLetra(letra, isCombined = false) {
    const span = document.createElement('span');
    span.textContent = letra;
    const isConsonant = !vocales.includes(letra.toLowerCase());

    if (isConsonant) {
      span.style.color = this.getConsonantColor(letra.toLowerCase());
    } else {
      span.style.color = 'black';
    }

    span.classList.add('inline-block', 'font-bold');
    if (isCombined && this.nivel === 4) {
      span.classList.add('mr-4');
    }

    const sizeClass = this.nivel === 1 ? 'text-6xl' : 
                      this.nivel === 2 ? 'text-5xl' : 
                      this.nivel === 3 ? 'text-4xl' : 'text-3xl';
    span.classList.add(sizeClass);

    return span;
  }

  // Render the content based on the current level and content type
  renderContenido() {
    const container = document.getElementById('contenidoContainer');
    container.innerHTML = '';
    container.className = 'flex-grow text-center text-6xl md:text-7xl lg:text-8xl font-bold'; // Updated classes to match HTML

    if ('frase' in this.contenido) {
      // Handle phrases: Split into words, then process each word
      this.contenido.frase.split(' ').forEach((palabra, idx) => {
        const palabraSpan = document.createElement('span');
        palabraSpan.className = 'inline-block mr-4 mb-2'; // Changed from 'flex' to 'inline-block'
        const processedPalabra = this.processConsonantsAndVowels(palabra);
        processedPalabra.forEach(({ letra, isConsonant, isCombined }) => {
          palabraSpan.appendChild(this.renderLetra(letra, isCombined));
        });
        container.appendChild(palabraSpan);
      });
    } else if ('palabra' in this.contenido) {
      // Handle single words
      const palabraSpan = document.createElement('span');
      palabraSpan.className = 'inline-block mb-2'; // Changed from 'flex' to 'inline-block'
      const processedPalabra = this.processConsonantsAndVowels(this.contenido.palabra);
      processedPalabra.forEach(({ letra, isConsonant, isCombined }) => {
        palabraSpan.appendChild(this.renderLetra(letra, isCombined));
      });
      container.appendChild(palabraSpan);
    } else if ('consonante' in this.contenido && 'vocal' in this.contenido) {
      // Handle syllables: consonant + vowel
      const consonantes = this.contenido.consonante;
      const vocalesContent = this.contenido.vocal;

      const processedConsonantes = this.processConsonants(consonantes);
      processedConsonantes.forEach(({ letra, isConsonant, isCombined }) => {
        container.appendChild(this.renderLetra(letra, isCombined));
      });

      const processedVocales = vocalesContent.split('').map(letra => ({
        letra,
        isConsonant: false,
        isCombined: false
      }));
      processedVocales.forEach(({ letra }) => {
        container.appendChild(this.renderLetra(letra, false));
      });
    } else {
      // Handle errors
      const errorSpan = document.createElement('span');
      errorSpan.textContent = 'Error';
      errorSpan.className = 'text-3xl text-red-500';
      container.appendChild(errorSpan);
    }
  }

  // Process a word to separate consonants and vowels, handling combinations
  processConsonantsAndVowels(word) {
    const processed = [];
    let i = 0;
    while (i < word.length) {
      let currentChar = word[i];
      let currentCharLower = currentChar.toLowerCase();
      let combined = false;

      // Check for consonant combinations
      if (i < word.length - 1) {
        const pair = word.substring(i, i + 2).toLowerCase();
        if (consonantCombinations.includes(pair)) {
          const originalPair = word.substring(i, i + 2); // Preserve original casing
          processed.push({
            letra: originalPair,
            isConsonant: true,
            isCombined: true
          });
          i += 2;
          combined = true;
          continue;
        }
      }

      // Determine if current character is consonant or vowel
      const isConsonant = !vocales.includes(currentCharLower);
      processed.push({
        letra: currentChar, // Preserve original casing
        isConsonant: isConsonant,
        isCombined: false
      });
      i += 1;
    }
    return processed;
  }

  // Process consonant string to handle combinations
  processConsonants(consonantes) {
    const processed = [];
    let i = 0;
    while (i < consonantes.length) {
      let currentChar = consonantes[i];
      let currentCharLower = currentChar.toLowerCase();
      let combined = false;

      // Check for consonant combinations
      if (i < consonantes.length - 1) {
        const pair = consonantes.substring(i, i + 2).toLowerCase();
        if (consonantCombinations.includes(pair)) {
          const originalPair = consonantes.substring(i, i + 2); // Preserve original casing
          processed.push({
            letra: originalPair,
            isConsonant: true,
            isCombined: true
          });
          i += 2;
          combined = true;
          continue;
        }
      }

      // Single consonant
      processed.push({
        letra: currentChar, // Preserve original casing
        isConsonant: true,
        isCombined: false
      });
      i += 1;
    }
    return processed;
  }

  // Render the content and update buttons
  render() {
    this.renderContenido();
    this.updateLevelButtons();
  }
}

// Function to create ripple effect on buttons
function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

// Add ripple effect to all buttons
const buttons = document.getElementsByTagName("button");
for (const button of buttons) {
  button.addEventListener("click", createRipple);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const metodoLectura = new MetodoLectura();
});
