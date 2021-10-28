'use strict'

var gElCanvas;
var gCtx;
var gMarkedLinePos;
var gIsThereASquare = false;
var gIsLineMarked = false;
var gFontSize = 40;
var gAlign = 'center'



function onInit() {
    gElCanvas = document.querySelector('.my-canvas');
    console.log(gElCanvas);
    gCtx = gElCanvas.getContext('2d');
    renderGallery();
}


function renderGallery() {
    const gallery = getGalleryForDisplay();
    const displayGallery = gallery.map(img => `<img onclick="onOpenEditMeme(${img.id})" src=${img.url}>`)
    document.querySelector('.images-container').innerHTML = displayGallery.join('');
}

function onOpenEditMeme(id) {
    makeMemeDeta(id);
    _renderCanvas()
    addListeners();
    document.querySelector('.meme-editor').classList.add('open');
}

function renderImageOnCanvas(url) {
    var img = new Image();
    img.src = url;
    gElCanvas.height = (img.height * gElCanvas.width) / img.width;
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderLinesOnImg(lines) {
    lines = lines.forEach(line => {
        gCtx.textAlign = line.align
        gCtx.strokeStyle = line.strokeColor;
        gCtx.fillStyle = line.fillColor;
        gCtx.font = line.font;
        const { x, y } = line.pos;
        gCtx.fillText(line.txt, x, y)
        gCtx.strokeText(line.txt, x, y)
    });
}

function onCloseEditor() {
    document.querySelector('.meme-editor').classList.remove('open');
}


function onAddLine() {
    var lineExists = getNumOfLines()
    var x = 20;
    var y = 20;
    switch (lineExists) {
        case 0:
            drawRect(x, y);
            break;
        case 1:
            y = gElCanvas.height - 60
            drawRect(x, y);
            break;
        default:
            y = (gElCanvas.height / 2) - 30;
            drawRect(x, y)
    }
    gMarkedLinePos = { x, y: y + gFontSize }
    gIsThereASquare = true;
}

function onShowMemeText(val, ev) {
    var evKey = (!ev) ? '' : ev.key;
    if (!gIsThereASquare) return;
    _renderCanvas()
    drawRect(gMarkedLinePos.x, gMarkedLinePos.y - gFontSize)
    const { y } = gMarkedLinePos;
    const x = getXPos(gAlign, gElCanvas.width);
    gCtx.textAlign = gAlign
    gCtx.strokeStyle = document.querySelector('#line-color-btn').value;
    gCtx.fillStyle = document.querySelector('#fill-color-btn').value;
    gCtx.font = `${gFontSize}px ${document.querySelector('#font-select').value}`;
    gCtx.fillText((val + evKey), x, y)
    gCtx.strokeText((val + evKey), x, y)

}

function drawRect(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, gElCanvas.width - 40, gFontSize + 10);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
}

function _renderCanvas() {
    const imageUrl = getImageForEditor();
    const lines = getLinesToRender()
    renderImageOnCanvas(imageUrl)
    renderLinesOnImg(lines)
}

function onSubmitLine() {
    const { y } = gMarkedLinePos;
    const x = getXPos(gAlign, gElCanvas.width)
    const line = {
        txt: document.querySelector('.meme-text').value,
        size: gFontSize,
        font: `${gFontSize}px ${document.querySelector('#font-select').value}`,
        strokeColor: document.querySelector('#line-color-btn').value,
        fillColor: document.querySelector('#fill-color-btn').value,
        align: gAlign,
        pos: { x, y, }
    }
    document.querySelector('.meme-text').value = ' ';
    creatNewLine(line)
    _renderCanvas()
    gIsThereASquare = false;
}


function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onMove(ev) {
    const pos = getEvPos(ev)
    if (gIsLineMarked) {
        moveLine(pos);
        _renderCanvas();
    } else {
        if (!isLineClicked(pos, gElCanvas.width)) return
        document.body.style.cursor = 'pointer'
    }
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos, gElCanvas.width)) return;
    gIsLineMarked = true;
    setStartPos(pos);
    document.body.style.cursor = 'grabbing';
}

function onUp() {
    gIsLineMarked = false;
}

function onAlignText(alignment) {
    gAlign = alignment;
    const val = document.querySelector('.meme-text').value;
    onShowMemeText(val)
}

function onMoveLine(dir) {
    (dir === 'up') ? moveLineUp() : moveLineDown();
    _renderCanvas()
}

function onRemoveLine() {
    removeLine();
    _renderCanvas();
}

function onChangeFontSize(sign) {
    debugger
    (sign === '+') ? gFontSize++ : gFontSize--;
    const val = document.querySelector('.meme-text').value
    onShowMemeText(val);
}

function onChangeTextShow() {
    const val = document.querySelector('.meme-text').value;
    onShowMemeText(val)
}