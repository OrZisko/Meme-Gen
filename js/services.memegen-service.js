'use strict'
var gGallery = [];
var gMeme = {};

function getGalleryForDisplay() {
    for (var i = 0; i < 25; i++) {
        var img = {
            id: i + 1,
            url: `images/meme-imgs/${i + 1}.jpg`
        }
        gGallery.push(img);
    }
    return gGallery;
}

function makeMemeDeta(id) {
    gMeme = {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [],
    }
}

function getImageForEditor() {
    var img = gGallery.find(img => img.id === gMeme.selectedImgId);
    return img.url;
}

function getLinesToRender() {
    return gMeme.lines
}

function getNumOfLines() {
    return gMeme.lines.length
}

function creatNewLine(line) {
    gMeme.lines.push(line)
}

