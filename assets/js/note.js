class Note {
    constructor(key, columnId, game) {
        this.key = key;
        this.columnId = columnId;
        this.game = game; 
        this.isHittable = true;
        this.isFailed = false; // Para marcar si la nota ya fue fallada
        this.position = 0; // Posición inicial de la nota
        this.interval = null;
        this.element = this.createNoteElement();

        // Agrega la nota al DOM en la columna correcta
        const column = document.getElementById(columnId);
        if (column) {
            column.appendChild(this.element);
        }
    }

    createNoteElement() {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        return noteElement;
    }

    move() {
        const columnEnd = 700;
        const hitRange = 80;
        const removalPosition = columnEnd + hitRange;

        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.position += 8;
                this.element.style.top = `${this.position}px`;

                // Verificar si la nota pasa el rango de acierto sin ser golpeada
                if (this.position > removalPosition && !this.isFailed) {
                    if (this.game && typeof this.game.incrementMissedNotes === 'function') {
                        this.game.incrementMissedNotes(); // Cuenta la nota como fallida
                    }
                    this.isFailed = true;
                    this.remove();
                    this.isHittable = false;
                }
            }
        }, 50);
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        clearInterval(this.interval);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}



