'use strict'
var gGallery = [];
var gMeme = {};
var gStartPos;
const G_TOUCH_EV = ['touchstart', 'touchmove', 'touchend']

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
        selectedLineIdx: null,
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
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function getXPos(align, width) {
    switch (align) {
        case 'start':
            return 22;
        case 'center':
            return width / 2;
        case 'end':
            return width - 22;
    }
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (G_TOUCH_EV.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clinetLeft,
            y: ev.PageY - ev.target.offsetTop - ev.target.clinetTop,
        }
    }
    return pos
}

function isLineClicked(clickPos, width) {
    const lineIdx = gMeme.lines.findIndex(line =>
        clickPos.y > line.pos.y - line.size &&
        clickPos.y < line.pos.y)
    if (lineIdx !== -1) {
        gMeme.selectedLineIdx = lineIdx;
        return true;
    } else {
        return false;
    }
}

function setStartPos(pos) {
    gStartPos = pos;
}

function moveLine(pos) {
    const { x, y } = pos;
    const dx = x - gStartPos.x;
    const dy = y - gStartPos.y;
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx;
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy;
    gStartPos = pos;
}

function moveLineUp() {
    gMeme.lines[gMeme.selectedLineIdx].pos.y -= 10;
}

function moveLineDown() {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += 10;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}