const colores = ['#c1121f', '#2a9d8f', '#e9c46a', '#219ebc', '#f4a261', '#e76f51'];
const vocales = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú'];
let lastConsonantColor = '';  // Track the last consonant color applied

// Arrays to keep track of shown words for each level
const shownWordsLevel3 = [];
const shownWordsLevel4 = [];

const combinacionesDosLetras = {
  vc: ['al', 'an', 'ar', 'as', 'el', 'em', 'en', 'er', 'es', 'id', 'im', 'in', 'ir', 'is', 'ob', 'ol', 'om', 'on', 'or', 'os', 'ul', 'un', 'ur'],
  cv: ['ba', 'be', 'bi', 'bo', 'bu', 'ca', 'ce', 'ci', 'co', 'cu', 'da', 'de', 'di', 'do', 'du', 'fa', 'fe', 'fi', 'fo', 'fu', 'ga', 'ge', 'gi', 'go', 'gu', 'ha', 'he', 'hi', 'ho', 'hu', 'ja', 'je', 'ji', 'jo', 'ju', 'ka', 'ke', 'ki', 'ko', 'ku', 'la', 'le', 'li', 'lo', 'lu', 'ma', 'me', 'mi', 'mo', 'mu', 'na', 'ne', 'ni', 'no', 'nu', 'pa', 'pe', 'pi', 'po', 'pu', 'que', 'qui', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su', 'ta', 'te', 'ti', 'to', 'tu', 'va', 've', 'vi', 'vo', 'vu', 'xa', 'xe', 'xi', 'xo', 'xu', 'ya', 'ye', 'yi', 'yo', 'yu', 'za', 'ce', 'ci', 'zo', 'zu'],
  vv: ['ai', 'au', 'ei', 'eu', 'ia', 'ie', 'io', 'iu', 'oi', 'ou', 'ua', 'ue', 'ui', 'uo'],
};

const combinacionesTresLetras = {
  cvc: ['sol', 'mar', 'pan', 'sal', 'luz', 'fin', 'rey', 'voz', 'pie', 'paz', 'té', 'cal', 'del', 'hay', 'mis', 'ver', 'oro', 'sur', 'zar', 'son', 'uno', 'dos', 'tres', 'muy', 'sin', 'las', 'por', 'más', 'ser', 'con', 'bra', 'bre', 'bri', 'bro', 'bru', 'cla', 'cle', 'cli', 'clo', 'clu', 'cra', 'cre', 'cri', 'cro', 'cru', 'dra', 'dre', 'dri', 'dro', 'dru', 'fra', 'fre', 'fri', 'fro', 'fru', 'gra', 'gre', 'gri', 'gro', 'gru', 'pla', 'ple', 'pli', 'plo', 'plu', 'pra', 'pre', 'pri', 'pro', 'pru', 'tra', 'tre', 'tri', 'tro', 'tru', 'bla', 'ble', 'bli', 'blo', 'blu', 'cha', 'che', 'chi', 'cho', 'chu'],
};

const palabrasNivel3 = ['casa', 'perro', 'gato', 'árbol', 'flor', 'sol', 'luna', 'estrella', 'agua', 'fuego', 'tierra', 'aire', 'libro', 'mesa', 'silla', 'cama', 'puerta', 'ventana', 'coche', 'bici', 'tren', 'avión', 'barco', 'pez', 'pájaro', 'mano', 'pie', 'ojo', 'nariz', 'boca', 'oreja', 'diente', 'pelo', 'brazo', 'pierna', 'dedo', 'uña', 'corazón', 'cerebro', 'hueso', 'rojo', 'azul', 'verde', 'amarillo', 'blanco', 'negro', 'rosa', 'naranja', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'niño', 'papel', 'lápiz', 'sopa', 'planta', 'escuela', 'calor', 'nieve', 'hoja', 'camisa', 'reloj', 'pelota', 'gafas', 'fruta'];

const frasesNivel4 = ['El sol brilla', 'La luna es blanca', 'El perro ladra', 'El gato maulla', 'La flor es roja', 'El cielo es azul', 'La casa es grande', 'El árbol es alto', 'El pez nada', 'El pájaro vuela', 'La niña corre', 'El niño salta', 'La mesa es marrón', 'La silla es verde', 'El libro es nuevo', 'La puerta está abierta', 'La ventana está cerrada', 'El coche es rápido', 'La bici es pequeña', 'El tren es largo', 'Una casa bonita', 'La pared es blanca', 'Un parque para niños', 'Un libro pequeño', 'Mi amigo se llama Adam', 'Mi padre es mayor que yo', 'Mis zapatos están limpios', 'La moto hace mucho ruido', 'El perro está durmiendo', 'La niña lee un libro', 'Me gusta comer manzanas', 'Vamos al parque por la tarde', 'El bebé está riendo', 'Hoy jugamos al escondite', 'juego con mi hermano', 'los sábados veo películas', 'me gusta comer tomates y fresas', 'mi camiseta es azul', 'el fútbol es un deporte'];

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

    const tutorialButton = document.getElementById('tutorialButton');
    tutorialButton.classList.add('animate-pulse');
    setTimeout(() => {
      tutorialButton.classList.remove('animate-pulse');
    }, 2000);
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

  // Function to generate content and ensure words don't repeat until all are shown
  generarContenido() {
    let siguiente;
    let wordsArray;
    let shownWords;

    try {
      switch (this.nivel) {
        case 1:
          siguiente = this.generarSilabaSimple();
          break;
        case 2:
          siguiente = this.generarContenidoNivel2();
          break;
        case 3:
          wordsArray = palabrasNivel3;
          shownWords = shownWordsLevel3;
          siguiente = this.getUniqueWord(wordsArray, shownWords);
          break;
        case 4:
          wordsArray = frasesNivel4;
          shownWords = shownWordsLevel4;
          siguiente = this.getUniqueWord(wordsArray, shownWords);
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

  // Function to get unique words and reset when all have been shown
  getUniqueWord(wordsArray, shownWords) {
    if (shownWords.length === wordsArray.length) {
      shownWords.length = 0;  // Reset the shown words
    }

    const remainingWords = wordsArray.filter(word => !shownWords.includes(word));
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];

    shownWords.push(randomWord);  // Add to shown words to avoid repetition

    return { palabra: randomWord };
  }

  setNivel(newNivel) {
    this.nivel = newNivel;
    this.generarContenido();
    this.updateLevelButtons();
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

  getConsonantColor(consonant) {
    consonant = consonant.toLowerCase();
    if (!this.uniqueConsonants.has(consonant)) {
      this.uniqueConsonants.add(consonant);
    }

    if (!this.consonantColors[consonant]) {
      let newColor = colores[this.colorIndex];
      this.colorIndex = (this.colorIndex + 1) % colores.length;
      this.consonantColors[consonant] = newColor;
    }

    return this.consonantColors[consonant];
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
        // Handling phrases
        this.contenido.frase.split(' ').forEach((palabra) => {
            const palabraDiv = document.createElement('div');
            palabraDiv.className = 'inline-block mx-2 mb-2';  // Ensure spacing between words
            palabraDiv.style.display = 'inline-block';  // Ensure words are inline-block elements
            palabraDiv.style.marginRight = '1rem';  // Add space between words
            palabra.split('').forEach((letra) => {
                const letraSpan = this.renderLetra(letra);
                palabraDiv.appendChild(letraSpan);
            });
            container.appendChild(palabraDiv);
        });
    } else if ('palabra' in this.contenido) {
        // Handling single words
        const palabraDiv = document.createElement('div');
        palabraDiv.className = 'inline-block mx-2 mb-2';  // Ensure spacing between words
        palabraDiv.style.display = 'inline-block';
        palabraDiv.style.marginRight = '1rem';
        this.contenido.palabra.split('').forEach((letra) => {
            const letraSpan = this.renderLetra(letra);
            palabraDiv.appendChild(letraSpan);
        });
        container.appendChild(palabraDiv);
    } else if ('consonante' in this.contenido && 'vocal' in this.contenido) {
        // Handling syllables
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

            const letraSpan = this.renderLetra(letra, i, combined);
            container.appendChild(letraSpan);
        }

        vocales.split('').forEach((letra, index) => {
            const letraSpan = this.renderLetra(letra, index, false);
            container.appendChild(letraSpan);
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

  // Function to show popup
  function showPopup() {
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }

  // Function to hide popup
  function hidePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }

  // Event listener for tutorial button click
  tutorialButton.addEventListener('click', showPopup);

  // Event listener for closing the popup
  closePopupButton.addEventListener('click', hidePopup);

  // Hide popup if overlay is clicked
  overlay.addEventListener('click', hidePopup);
});
