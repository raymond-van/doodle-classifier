var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var radius = 5;
var mouseDown = false;
ctx.lineWidth = radius*2;

canvas.addEventListener('mousedown', down);
canvas.addEventListener('mousemove', move);
document.onmouseup = up;

function down(e) {
    mouseDown = true;
    move(e)
}

function move(e) {
    if (mouseDown) {
        ctx.lineTo(e.clientX-30, e.clientY-85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(e.clientX-30, e.clientY-85, radius, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.clientX-30, e.clientY-85);
    }
}

function up() {
    mouseDown = false;
    ctx.beginPath();
}

function clearCanvas(canvas) {
    canvas.width = canvas.width;
    ctx.lineWidth = radius*2;
}