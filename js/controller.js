'use strict'

var gElCanvas;
var gCtx;
var gMarkedLinePos;
var isLineMarked = false;
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

function onChangeMemeText(val, ev) {
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
        case 2:
            y = (gElCanvas.height / 2) - 30;
            drawRect(x, y)
    }
    gMarkedLinePos = { x, y: y + gFontSize }
    isLineMarked = true;
}

function onShowMemeText(val, ev) {
    if (!isLineMarked) return;
    _renderCanvas()
    drawRect(gMarkedLinePos.x, gMarkedLinePos.y - gFontSize)
    const { x, y } = gMarkedLinePos
    gCtx.strokeStyle = document.querySelector('#line-color-btn').value;
    gCtx.fillStyle = document.querySelector('#fill-color-btn').value;
    gCtx.font = `${gFontSize}px ${document.querySelector('#font-select').value}`;
    console.log(gFontSize + 'px', document.querySelector('#font-select').value);
    gCtx.fillText((val + ev.key), x, y)
    gCtx.strokeText((val + ev.key), x, y)
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
    var line = {
        txt: document.querySelector('.meme-text').value,
        font: `${gFontSize}px ${document.querySelector('#font-select').value}`,
        strokeColor: document.querySelector('#line-color-btn').value,
        fillColor: document.querySelector('#fill-color-btn').value,
        pos: gMarkedLinePos,
    }
    document.querySelector('.meme-text').value = ' ';
    creatNewLine(line)
    _renderCanvas()
}