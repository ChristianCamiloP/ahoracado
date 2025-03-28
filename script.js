// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA3oslVWKJQTqpDRkHxTRm14NCtd4oMDn8",
    authDomain: "dbdigitar-8eafa.firebaseapp.com",
    projectId: "dbdigitar-8eafa",
    storageBucket: "dbdigitar-8eafa.firebasestorage.app",
    messagingSenderId: "600216230142",
    appId: "1:600216230142:web:5ded152bf7f72c8633edaf",
    measurementId: "G-396G472VL7"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Palabras para el juego
const palabras = ["perro", "gato", "cielo", "flor", "piedra", "mundo"];
let palabraSeleccionada = "";
let letrasAdivinadas = [];
let errores = 0;
let intentosRestantes = 6;
let nombreJugador = "";

// Iniciar el juego
document.getElementById("iniciar").addEventListener("click", () => {
    nombreJugador = document.getElementById("nombreJugador").value;
    if (!nombreJugador) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    // Guardar el nombre del jugador en Firebase
    db.collection("jugadores").add({
        nombre: nombreJugador,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Jugador guardado en Firebase");
    }).catch((error) => {
        console.error("Error al guardar el jugador:", error);
    });

    // Seleccionar una palabra al azar
    palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)];
    letrasAdivinadas = Array(palabraSeleccionada.length).fill("_");
    errores = 0;
    intentosRestantes = 6;

    // Mostrar palabra oculta
    document.getElementById("palabra").textContent = letrasAdivinadas.join(" ");
    document.getElementById("errores").textContent = errores;
    document.getElementById("intentosRestantes").textContent = intentosRestantes;
    document.getElementById("juego").style.display = "block";
    document.getElementById("nombreJugador").style.display = "none";
    document.getElementById("iniciar").style.display = "none";
});

// Adivinar letra
document.getElementById("adivinada").addEventListener("click", () => {
    const letra = document.getElementById("letra").value.toLowerCase();
    if (!letra || letra.length !== 1) {
        alert("Por favor, ingresa una letra válida.");
        return;
    }

    // Comprobar si la letra ya fue adivinada
    if (letrasAdivinadas.includes(letra)) {
        alert("Ya adivinaste esta letra.");
        return;
    }

    let letraCorrecta = false;
    for (let i = 0; i < palabraSeleccionada.length; i++) {
        if (palabraSeleccionada[i] === letra) {
            letrasAdivinadas[i] = letra;
            letraCorrecta = true;
        }
    }

    // Actualizar palabra
    document.getElementById("palabra").textContent = letrasAdivinadas.join(" ");

    if (!letraCorrecta) {
        errores++;
        intentosRestantes--;
        document.getElementById("errores").textContent = errores;
        document.getElementById("intentosRestantes").textContent = intentosRestantes;
    }

    if (intentosRestantes === 0) {
        document.getElementById("mensaje").textContent = "¡Perdiste! La palabra era: " + palabraSeleccionada;
    }

    if (!letrasAdivinadas.includes("_")) {
        document.getElementById("mensaje").textContent = "¡Ganaste! La palabra es: " + palabraSeleccionada;
    }

    document.getElementById("letra").value = "";  // Limpiar input
});

// Cargar historial de jugadores
function cargarHistorial() {
    const listaJugadores = document.getElementById("listaJugadores");
    listaJugadores.innerHTML = "";

    db.collection("jugadores").orderBy("fecha", "desc").limit(10).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const item = document.createElement("li");
                item.textContent = data.nombre;
                listaJugadores.appendChild(item);
            });
        })
        .catch(error => console.error("Error al cargar historial:", error));
}

// Ejecutar al cargar la página
cargarHistorial();
