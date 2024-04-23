class CanvasTextDrawer {

    constructor(canvasId, cursorCanvasId, options = {}) {

        const defaults = {
            font: "150px Georgia",
            textBaseline: 'middle',
            textAlign: 'center',
            fillStyle: '#000000', // Default color
            text: 'A', // Default text
            brushSize: 180, // Default brush size
            lineCap: "round", // Circular brush
            lineJoin: "round" // Circular brush
        };

        // Merge defaults with the provided options using the spread operator
        const settings = Object.assign({}, defaults, options);

        this.canvas = document.getElementById(canvasId);
        this.cursorCanvas = document.getElementById(cursorCanvasId);
        this.context = this.canvas.getContext('2d');
        this.cursorContext = this.cursorCanvas.getContext('2d');

        // Apply settings dynamically
        Object.keys(settings).forEach(key => {
            this[key] = settings[key];
        });

        this.initCanvas();
        this.tool_pencil();
    }

    setColor(newColor) {
        this.fillStyle = newColor;
        this.context.fillStyle = newColor;
        this.context.strokeStyle = newColor;
    }

    setBrushSize(newSize) {
        this.brushSize = newSize;
        this.context.lineWidth = newSize;
    }

    paint() {
        this.context.stroke(); // Perform the actual drawing
        canvasChange(); // Save the canvas to dataURL
    }

    tool_pencil() {
        this.context.lineWidth = this.brushSize;
        this.context.lineCap = this.lineCap;
        this.context.lineJoin = this.lineJoin;
        // Set up cursor canvas for visual feedback
        this.canvas.addEventListener('pointermove', (ev) => this.updateCursor(ev));
        this.canvas.addEventListener('pointerout', () => this.clearCursor());
        // Start drawing
        this.canvas.addEventListener('pointerdown', (ev) => {
            this.started = true;
            this.context.beginPath();
            this.context.moveTo(ev.offsetX, ev.offsetY);
            this.context.lineTo(ev.offsetX, ev.offsetY);
            this.paint();
        }, false);
        // Keep drawing
        this.canvas.addEventListener('pointermove', (ev) => {
            if (this.started) {
                this.context.lineTo(ev.offsetX, ev.offsetY);
                this.paint()
            }
        }, false);
        // Stop drawing
        this.canvas.addEventListener('pointerup', (ev) => {
            if (this.started) {
                this.context.lineTo(ev.offsetX, ev.offsetY);
                this.paint();
                this.started = false; // End the drawing state
            }
        }, false);
    }

    initCanvas() {
        this.context.font = this.font;
        this.context.textBaseline = this.textBaseline;
        this.context.textAlign = this.textAlign;
        this.context.fillStyle = this.fillStyle;
        this.context.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);
        this.context.globalCompositeOperation = 'source-atop';
        this.context.strokeStyle = this.fillStyle;

    }

    updateCursor(ev) {
        this.cursorContext.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
        this.cursorContext.beginPath();
        this.cursorContext.arc(ev.offsetX, ev.offsetY, this.brushSize / 2, 0, 2 * Math.PI, false);
        this.cursorContext.lineWidth = 3;
        this.cursorContext.strokeStyle = '#ffffff';
        this.cursorContext.stroke();
        this.cursorContext.beginPath();
        this.cursorContext.arc(ev.offsetX, ev.offsetY, this.brushSize / 2, 0, 2 * Math.PI, false);
        this.cursorContext.lineWidth = 1;
        this.cursorContext.strokeStyle = '#000000';
        this.cursorContext.stroke();
    }

    clearCursor() {
        this.cursorContext.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
    }

}