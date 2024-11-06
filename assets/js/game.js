class Game {
    constructor(player) {
        this.player = player;
        this.score = 0;
        this.notes = [];
        this.isPaused = false;
        this.missedNotes = 0;
        this.totalNotes = 0;
        this.hitNotes = 0;
        this.noteTimers = [];
        this.isGeneratingNotes = false;
    }

    handleVideoStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            this.showEndScreen();
        } else if (event.data === YT.PlayerState.PAUSED) {
            this.pauseGame(); // Llama a pauseGame cuando el video se pausa
        }
    }


    start() {
        this.toggleScreen("main-menu", "none");
        this.toggleScreen("end-screen", "none");
        this.toggleScreen("game-screen", "flex");
        this.resetGame();
        this.playVideo();
        this.spawnNotes();
        this.setupKeyListener();
    }

    endGame() {
        this.player.pauseVideo();
        this.notes.forEach(note => note.remove());
        this.notes = [];
        this.clearNoteTimers();
        this.noteTimers = [];
        this.isGeneratingNotes = false;
    
        // Oculta las demás pantallas y muestra solo la pantalla de fin de juego
        toggleScreen("game-screen", "none");
        toggleScreen("pause-screen", "none");
        toggleScreen("end-screen", "flex");
    
        // Actualiza el puntaje final en la pantalla de fin
        document.getElementById("final-score").innerText = `Score: ${this.score}`;
    }

    resetGame() {
        this.score = 0;
        this.missedNotes = 0;
        this.hitNotes = 0;
        this.totalNotes = 0;

        this.notes.forEach(note => note.remove());
        this.notes = [];
        this.clearNoteTimers(); // Limpia los temporizadores antes de reiniciar
        this.isGeneratingNotes = false;

        this.updateScoreDisplay();
    }

    playVideo() {
        if (this.player && typeof this.player.seekTo === "function") {
            this.player.seekTo(0);
            this.player.playVideo();
        } else {
            console.error("El reproductor de YouTube no está listo.");
        }
    }

    spawnNotes() {
        if (this.isGeneratingNotes) return;
        this.isGeneratingNotes = true;

        track.forEach(note => {
            const noteTime = note.time;
            const noteTimer = setTimeout(() => {
                if (!this.isPaused) {
                    const newNote = new Note(note.key, `column-${String.fromCharCode(note.key)}`, this);
                    newNote.move();
                    this.notes.push(newNote);
                    this.totalNotes += 1;
                    this.markNoteAsGenerated(note.key); // Marca la nota como generada
                }
            }, noteTime);

            this.noteTimers.push({
                timer: noteTimer,
                startTime: Date.now(),
                delay: noteTime,
                remainingTime: noteTime,
                key: note.key,
                generated: false // Indica si la nota ya se ha generado
            });
        });
    }

    setupKeyListener() {
        document.addEventListener("keydown", (e) => {
            if (!this.isPaused) {
                this.handleKeyPress(e.keyCode);
                this.activateHitZone(e.keyCode);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (!this.isPaused) {
                this.deactivateHitZone(e.keyCode);
            }
        });
    }

    handleKeyPress(keyCode) {
        const validKeys = [KEY_A, KEY_S, KEY_D, KEY_F, KEY_G];
        if (!validKeys.includes(keyCode)) return;

        this.activateHitZone(keyCode);

        // Buscar una nota que esté en la hit zone y que coincida con la tecla presionada
        const hitNote = this.notes.find(note => this.checkHit(note, keyCode));

        if (hitNote) {
            // Se encontró una nota en la hit zone: actualizar puntaje y marcar acierto
            hitNote.isHittable = false;
            this.updateScore(POINTS_PER_HIT);
            this.markHitZoneSuccess(keyCode);
            this.hitNotes += 1;

            if (hitNote.element) {
                hitNote.element.classList.add("hit");
            }
            hitNote.remove();
        } else {
            // Solo marcar la hit zone como fallida sin reproducir el sonido de error
            this.markHitZoneMiss(keyCode);
            this.incrementMissedNotes();
        }
    }

    incrementMissedNotes() {
        this.missedNotes += 1;
        if (this.missedNotes >= 10) {
            this.endGame();
        }
    }

    markHitZoneSuccess(keyCode) {
        const hitZoneWrapperId = `hit-zone-wrapper-${String.fromCharCode(keyCode)}`;
        const hitZoneWrapper = document.getElementById(hitZoneWrapperId);

        if (hitZoneWrapper) {
            hitZoneWrapper.classList.add("active");
            setTimeout(() => {
                hitZoneWrapper.classList.remove("active");
            }, 200);
        }
    }

    markHitZoneMiss(keyCode) {
        const hitZoneWrapperId = `hit-zone-wrapper-${String.fromCharCode(keyCode)}`;
        const hitZoneWrapper = document.getElementById(hitZoneWrapperId);

        if (hitZoneWrapper) {
            hitZoneWrapper.classList.add("miss"); // Cambia a rojo
            setTimeout(() => {
                hitZoneWrapper.classList.remove("miss"); // Vuelve al color original
            }, 200);
        }
    }

    checkHit(note, keyCode) {
        const columnEnd = 700;
        const hitRange = 80;

        return (
            note.key === keyCode &&
            note.position >= columnEnd - 20 &&
            note.position <= columnEnd + hitRange &&
            note.isHittable
        );
    }

    updateScore(points) {
        this.score += points;
        this.hitNotes += 1;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById("score");
        if (scoreElement) scoreElement.innerText = `Score: ${this.score}`;
    }

    activateHitZone(keyCode) {
        const hitZoneId = `hit-zone-${String.fromCharCode(keyCode)}`;
        const hitZone = document.getElementById(hitZoneId);
        if (hitZone) hitZone.classList.add("active");
    }

    deactivateHitZone(keyCode) {
        const hitZoneId = `hit-zone-${String.fromCharCode(keyCode)}`;
        const hitZone = document.getElementById(hitZoneId);
        if (hitZone) hitZone.classList.remove("active");
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    markNoteAsGenerated(key) {
        this.noteTimers = this.noteTimers.map(noteData =>
            noteData.key === key ? { ...noteData, generated: true } : noteData
        );
    }

    clearNoteTimers() {
        // Cancela todos los temporizadores activos
        this.noteTimers.forEach(noteData => clearTimeout(noteData.timer));
        this.noteTimers = [];
    }

    pauseGame() {
        this.isPaused = true;
        this.player.pauseVideo();
        this.notes.forEach(note => note.pause());
        document.getElementById("pause-screen").style.display = "flex";

        // Cancela los temporizadores y guarda los tiempos restantes solo para notas que no se han generado
        this.noteTimers.forEach(noteData => {
            clearTimeout(noteData.timer);
            if (!noteData.generated) { // Solo calcula el tiempo restante para los que no se han generado
                const elapsed = Date.now() - noteData.startTime;
                noteData.remainingTime = noteData.delay - elapsed;
            }
        });
    }

    resumeGame() {
        this.isPaused = false;
        this.player.playVideo();
        this.notes.forEach(note => note.resume());
        document.getElementById("pause-screen").style.display = "none";

        // Reanudar solo los temporizadores de notas no generadas
        this.noteTimers = this.noteTimers.map(noteData => {
            if (!noteData.generated) { // Solo reanuda los temporizadores de notas no generadas
                const remainingTimer = setTimeout(() => {
                    if (!this.isPaused) {
                        const newNote = new Note(
                            noteData.key,
                            `column-${String.fromCharCode(noteData.key)}`,
                            this
                        );
                        newNote.move();
                        this.notes.push(newNote);
                        this.totalNotes += 1;
                        this.markNoteAsGenerated(noteData.key); // Marca la nota como generada
                    }
                }, noteData.remainingTime);

                return {
                    ...noteData,
                    timer: remainingTimer,
                    startTime: Date.now()
                };
            }
            return noteData;
        });
    }

    toggleScreen(screenId, displayStyle) {
        document.getElementById(screenId).style.display = displayStyle;
    }

    activateHitZone(keyCode) {
        const validKeys = [KEY_A, KEY_S, KEY_D, KEY_F, KEY_G];
        if (validKeys.includes(keyCode)) {
            const hitZoneId = `hit-zone-${String.fromCharCode(keyCode)}`;
            const hitZone = document.getElementById(hitZoneId);
            if (hitZone) hitZone.classList.add("active");
        }
    }

    deactivateHitZone(keyCode) {
        const validKeys = [KEY_A, KEY_S, KEY_D, KEY_F, KEY_G];
        if (validKeys.includes(keyCode)) {
            const hitZoneId = `hit-zone-${String.fromCharCode(keyCode)}`;
            const hitZone = document.getElementById(hitZoneId);
            if (hitZone) hitZone.classList.remove("active");
        }
    }

    showEndScreen() {
        this.toggleScreen("game-screen", "none");
        this.toggleScreen("end-screen", "flex");
        this.toggleScreen("pause-screen", "none");
    
        const totalNotesCount = this.hitNotes + this.missedNotes;
        const accuracy = totalNotesCount > 0 ? (this.hitNotes / totalNotesCount) * 100 : 0;
        const accuracyDisplay = `${accuracy.toFixed(2)}%`;
    
        // Asegúrate de que los elementos existen antes de asignarles valores
        const finalScoreElement = document.getElementById("final-score");
        const accuracyElement = document.getElementById("accuracy");
    
        if (finalScoreElement) {
            finalScoreElement.innerText = `Score: ${this.score}`;
        } else {
            console.warn("Elemento 'final-score' no encontrado en el DOM.");
        }
    
        if (accuracyElement) {
            accuracyElement.innerText = `Accuracy: ${accuracyDisplay}`;
        } else {
            console.warn("Elemento 'accuracy' no encontrado en el DOM.");
        }
    }
}


