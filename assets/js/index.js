let game;
let player;

// Desactiva el botón de inicio hasta que el reproductor de YouTube esté listo
const startButton = document.getElementById("start-button");
startButton.disabled = true;
console.log("Botón de inicio deshabilitado");

// Función de checkpoint para verificar que la API de YouTube esté lista
function checkYouTubeAPIReady() {
    if (window.YT && YT.Player) {
        onYouTubeIframeAPIReady(); // Llama a la función si la API está lista
    } else {
        setTimeout(checkYouTubeAPIReady, 100); // Vuelve a intentar en 100ms
    }
}

// Llama a checkYouTubeAPIReady al cargar la página para verificar la API
checkYouTubeAPIReady();

function onYouTubeIframeAPIReady() {
    console.log("API de YouTube lista");
    player = new YT.Player('video-player', {
        videoId: 'DGCfRIZfhYY',
        playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1
        },
        events: {
            'onReady': (event) => {
                console.log("Reproductor de YouTube listo");
                event.target.unMute();
                game = new Game(player); // Crea una instancia de Game cuando el reproductor esté listo
                startButton.disabled = false; // Habilita el botón de inicio
                console.log("Botón de inicio habilitado");
            },
            'onStateChange': (event) => {
                if (game) {
                    game.handleVideoStateChange(event);
                }
            }
        }
    });
}

// Evento para iniciar el juego
startButton.addEventListener("click", () => {
    console.log("Botón de inicio presionado");
    if (game) {
        game.start();
        player.playVideo();
        console.log("Juego iniciado");
    } else {
        console.error("El juego no está listo. Asegúrate de que el reproductor de YouTube esté cargado.");
    }
});

document.getElementById("pause-button").addEventListener("click", () => {
    if (game) {
        game.togglePause();
    }
});

document.getElementById("resume-button").addEventListener("click", () => {
    if (game) {
        game.resumeGame();
    }
});

document.getElementById("restart-button-pause").addEventListener("click", () => {
    if (game) {
        game.endGame();
        game = new Game(player);
        game.start();
        player.playVideo();
        toggleScreen("pause-screen", "none");
        toggleScreen("game-screen", "flex");
    }
});

document.getElementById("exit-button").addEventListener("click", () => {
    if (game) {
        game.endGame(); // Finaliza el juego correctamente
        player.pauseVideo(); // Pausa el video si está reproduciéndose
        
        // Asegúrate de que solo se muestre el menú principal y se oculten las demás pantallas
        toggleScreen("game-screen", "none");
        toggleScreen("pause-screen", "none");
        toggleScreen("end-screen", "none"); // Oculta el end-screen si estaba visible
        toggleScreen("main-menu", "flex");
    }
});

document.getElementById("restart-button").addEventListener("click", () => {
    if (game) {
        game.endGame();
        game = new Game(player);
        game.start();
        player.playVideo();
        toggleScreen("end-screen", "none");
        toggleScreen("pause-screen", "none");
        toggleScreen("game-screen", "flex");
    }
});

// Función para mostrar/ocultar pantallas
function toggleScreen(screenId, displayStyle) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = displayStyle;
    } else {
        console.warn(`Pantalla con ID "${screenId}" no encontrada.`);
    }
}

// Configura la pantalla inicial
function setupInitialScreen() {
    toggleScreen("main-menu", "flex");
    toggleScreen("game-screen", "none");
    toggleScreen("pause-screen", "none");
    toggleScreen("end-screen", "none");
}

// Llama a la configuración inicial de pantalla al cargar la página
setupInitialScreen();
