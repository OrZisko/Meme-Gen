'use strict'

function getCanvasHeight(img, canvasWidth) {
    const height = (img.height * canvasWidth) / img.width
    return height;
}

function getImgFromMeme(meme) {
    const imgData = gGallery.find(img => meme.selectedImgId === img.id)
    var img = new Image();
    img.src = imgData.url
    return img
}

function getAdjustedXY(pos, el) {
    var { x, y, } = pos;
    x *= el.width;
    y *= el.height;
    return { x, y, }
}

