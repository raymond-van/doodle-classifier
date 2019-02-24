var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var model;
var coords = [];
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

////////////////////////////MODEL PREDICTION///////////////////////////////
var alpha = [];
function pixelData(ctx) {
    var imgData = ctx.getImageData(0,0,canvas.width,canvas.height); // Need to isolate alpha channel, array manip.?
    for (var i = 3; i < imgData.data.length; i+=4) {
        alpha.push(imgData.data[i])
    }
    // console.log(alpha)
    var tensorData = tf.tensor(alpha)
    var resized = tf.reshape(tensorData,[300,300,1])
    resized = tf.image.resizeBilinear(resized, [28, 28]).toFloat()
    // console.log(resized)
    const offset = tf.scalar(255.0);
    const normalized = tf.scalar(1.0).sub(resized.div(offset));
    const batched = normalized.expandDims(0)
    // console.log(batched)
    // batched.print();
    return batched
}

function preprocessing(tensorData) {
    return tf.tidy(() => {
        //resize 
        const resized = tf.image.resizeBilinear(tensorData, [28, 28]).toFloat()
        
        //normalize 
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));

        //We add a dimension to get a batch shape 
        const batched = normalized.expandDims(0)
        return batched
    })
}

async function load_model() {
    //load the model 
    model = await tf.loadModel('http://127.0.0.1:8000/model/tfjs_model/model.json')
}

function predict() {

    var data = pixelData(ctx)
    const pred = model.predict(data).dataSync();

    const indices = findIndicesOfMax(pred, 5)
    const probs = findTopValues(pred, 5)
    // const names = getClassNames(indices)

    console.log(indices)
    console.log(probs)
}

function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}