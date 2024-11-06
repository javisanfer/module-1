let game;
let player;

const startButton = document.getElementById("start-button");
startButton.disabled = true;
console.log("Botón de inicio deshabilitado");

function checkYouTubeAPIReady() {
    if (window.YT && YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        setTimeout(checkYouTubeAPIReady, 100);
    }
}

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
                game = new Game(player);
                startButton.disabled = false;
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
        game.endGame();
        player.pauseVideo();
        
        
        toggleScreen("game-screen", "none");
        toggleScreen("pause-screen", "none");
        toggleScreen("end-screen", "none");
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

function toggleScreen(screenId, displayStyle) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = displayStyle;
    } else {
        console.warn(`Pantalla con ID "${screenId}" no encontrada.`);
    }
}

function setupInitialScreen() {
    toggleScreen("main-menu", "flex");
    toggleScreen("game-screen", "none");
    toggleScreen("pause-screen", "none");
    toggleScreen("end-screen", "none");
}

setupInitialScreen();
