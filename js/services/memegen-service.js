'use strict'

const G_TOUCH_EV = ['touchstart', 'touchmove', 'touchend'];
var gKeywords;
var gKeywordsIdx
var gGallery;
var gMemes;
var gMeme;

var gFontSize;

var gStartPos;


function init() {
    _setImgsToGallery()
    gMemes = loadFromStorage('userMemesDB')
    gKeywords = _getKeywords()
    gKeywordsIdx = 0
    if (!gMemes) gMemes = [];
    gFontSize = 20;
}

function setKeyFilter(keyFilter) {
    var regex = new RegExp(keyFilter, 'i')
    var filterdGallery = gGallery.filter(img => {
        return regex.test(img.keywords.join(' '))
    })
    gGallery = filterdGallery
}

function makeMemeData(id) {
    gMeme = {
        id: (!gMemes) ? 0 : gMemes.length,
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [
            {
                text: 'Write something',
                sizeRatio: 0.1,
                font: 'Impact',
                strokeColor: 'white',
                fillColor: 'black',
                align: 'center',
                posRatio: { x: 0.5, y: 0.2 },
            },
            {
                text: 'Write something',
                sizeRatio: 0.1,
                font: 'Impact',
                strokeColor: 'white',
                fillColor: 'black',
                align: 'center',
                posRatio: { x: 0.5, y: 0.85 },
            },
        ],
    }
}

function moveKeywordsForward() {
    if ((gKeywordsIdx + 4) >= gKeywords.length) return
    else gKeywordsIdx += 4
}

function moveKeywordsBack() {
    if ((gKeywordsIdx - 4) < 0) gKeywordsIdx = 0
    else gKeywordsIdx -= 4
}

function increaseKeywordCount(keywordToIncrease) {
    keywordToIncrease = keywordToIncrease.toLowerCase()
    var currKeyword = gKeywords.find(keyword => keyword.keyword === keywordToIncrease)
    if (currKeyword.count > 3) return;
    currKeyword.count += 0.5
    gKeywords.sort((a, b) => { return b.count - a.count })
    var currKeywordNewIdx = gKeywords.findIndex(keyword => keyword.keyword === keywordToIncrease)
    gKeywordsIdx = Math.floor(currKeywordNewIdx / 4);
}

function placeMemeInEditor(id) {
    const meme = gMemes.find(meme => meme.id === id);
    gMeme = meme;
}

function changeLineText(val) {
    var line = getCurrLine();
    line.text = val;
}

function drawRect() {
    const line = getCurrLine()
    var { y } = getAdjustedXY(line.posRatio, gElCanvas)
    const height = line.sizeRatio * gElCanvas.height;
    gCtx.beginPath();
    gCtx.strokeStyle = 'lightgray';
    gCtx.fillStyle = '#00000025'
    gCtx.rect(10, y - height, gElCanvas.width - 20, height + 10);
    gCtx.fillRect(10, y - height, gElCanvas.width - 20, height + 10);
    gCtx.stroke();
}

function moveLineUp() {
    var line = getCurrLine();
    if (line.posRatio.y - line.sizeRatio <= 0) return
    line.posRatio.y -= 0.01;
}

function moveLineDown() {
    var line = getCurrLine();
    if (line.posRatio.y >= 1) return
    line.posRatio.y += 0.01;
}

function switchLines() {
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function addLine() {
    const line = {
        text: 'Write something',
        sizeRatio: 0.1,
        font: 'Impact',
        strokeColor: 'black',
        fillColor: 'black',
        align: 'center',
        posRatio: { x: 0.5, y: 0.55 },
    }
    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}

function changeFontSize(val) {
    (val === '+') ? gFontSize += 3 : gFontSize -= 3
    var line = getCurrLine();
    line.sizeRatio = gFontSize / gElCanvas.height;
}

function changeAlign(val) {
    var line = getCurrLine();
    line.align = val;
}

function changeStrokeColor(val) {
    var line = getCurrLine();
    line.strokeColor = val;
}

function changeFillColor(val) {
    var line = getCurrLine();
    line.fillColor = val;
}

function changeFont(val) {
    var line = getCurrLine();
    line.font = val;
}

function saveMeme() {
    gMemes.push(gMeme)
    saveToStorage('userMemesDB', gMemes);
}

function isLineClicked(clickpPos) {
    const lineIdx = gMeme.lines.findIndex(line => {
        const { y } = getAdjustedXY(line.posRatio, gElCanvas)
        return clickpPos.y >= (y - (line.sizeRatio * gElCanvas.height)) &&
            clickpPos.y <= y
    })
    if (lineIdx !== -1) {
        gMeme.selectedLineIdx = lineIdx;
        return true;
    } else {
        return false;
    }
}

function getKeywordsForDisplay() {
    const only4Keys = gKeywords.slice(gKeywordsIdx, gKeywordsIdx + 4)
    return only4Keys;
}

function getGalleryForDisplay() {
    return gGallery
}

function getImgForDisplay() {
    const img = gGallery.find(img => img.id === gMeme.selectedImgId)
    return img
}

function getLinesForDisplay() {
    return gMeme.lines
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
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function setMovementStart(el, clickpPos) {
    gFontSize = getCurrLine().sizeRatio * el.height;
    gStartPos = clickpPos;

}

function getMemesToGallery() {
    gMemes = loadFromStorage('userMemesDB');
    return gMemes;
}


function moveLine(clickpPos) {
    const disX = clickpPos.x - gStartPos.x;
    const disY = clickpPos.y - gStartPos.y;
    const disXRatio = (disX === 0) ? disX : disX / gElCanvas.width;
    const disYRatio = (disY === 0) ? disY : disY / gElCanvas.height;
    var line = getCurrLine();
    line.posRatio.x += disXRatio;
    line.posRatio.y += disYRatio;
    gStartPos = clickpPos
}

function getCurrLineText() {
    var line = getCurrLine();
    return line.text;
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function _setImgsToGallery() {
    gGallery = [
        { id: 1, url: `images/meme-imgs/${1}.jpg`, keywords: ['trump', 'condesending', 'knowitall', 'president', 'finger'] },
        { id: 2, url: `images/meme-imgs/${2}.jpg`, keywords: ['dogs', 'cute', 'pair', 'animals'] },
        { id: 3, url: `images/meme-imgs/${3}.jpg`, keywords: ['dogs', 'cute', 'pair', 'baby', 'sleeping', 'animals'] },
        { id: 4, url: `images/meme-imgs/${4}.jpg`, keywords: ['cats', 'cute', 'sleeping', 'computer', 'keyboard', 'animals'] },
        { id: 5, url: `images/meme-imgs/${5}.jpg`, keywords: ['baby', 'power', 'victory'] },
        { id: 6, url: `images/meme-imgs/${6}.jpg`, keywords: ['knowitall', 'explain'] },
        { id: 7, url: `images/meme-imgs/${7}.jpg`, keywords: ['baby', 'exited', 'surprise'] },
        { id: 8, url: `images/meme-imgs/${8}.jpg`, keywords: ['willy wanka', 'exited', 'tell me', 'movies'] },
        { id: 9, url: `images/meme-imgs/${9}.jpg`, keywords: ['baby', 'laughing', 'cruel'] },
        { id: 10, url: `images/meme-imgs/${10}.jpg`, keywords: ['barak', 'obama', 'laughing', 'happy', 'president'] },
        { id: 11, url: `images/meme-imgs/${11}.jpg`, keywords: ['players', 'kissing', 'pair', 'accident'] },
        { id: 12, url: `images/meme-imgs/${12}.jpg`, keywords: ['busted', 'finger'] },
        { id: 13, url: `images/meme-imgs/${13}.jpg`, keywords: ['leo', 'leonardo', 'decaprio', 'great gatsby', 'cheers', 'condesending', 'movies'] },
        { id: 14, url: `images/meme-imgs/${14}.jpg`, keywords: ['metrix', 'morphiuse', 'choise', 'movies', 'pills'] },
        { id: 15, url: `images/meme-imgs/${15}.jpg`, keywords: ['lord of the rings', 'one cannot', 'explain', 'movies', 'boromir'] },
        { id: 16, url: `images/meme-imgs/${16}.jpg`, keywords: ['star trek', 'laughing', 'happy', 'movies'] },
        { id: 17, url: `images/meme-imgs/${17}.jpg`, keywords: ['putin', 'finger', 'counting', 'president'] },
        { id: 18, url: `images/meme-imgs/${18}.jpg`, keywords: ['toy story', 'explain', 'telling', 'movies'] },
        { id: 19, url: `images/meme-imgs/${19}.jpg`, keywords: ['yelling', 'surprise'] },
        { id: 20, url: `images/meme-imgs/${20}.jpg`, keywords: ['happy', 'dencing', 'movies', 'sounds of music'] },
        { id: 21, url: `images/meme-imgs/${21}.jpg`, keywords: ['dr evil', 'mike mayers', 'movies', 'austin powers'] },
        { id: 22, url: `images/meme-imgs/${22}.jpg`, keywords: ['dancing', 'kids', 'happy', 'party'] },
        { id: 23, url: `images/meme-imgs/${23}.jpg`, keywords: ['trump', 'president', 'finger', 'blame'] },
        { id: 24, url: `images/meme-imgs/${24}.jpg`, keywords: ['dogs', 'yoga', 'relax', 'animals'] },
        { id: 25, url: `images/meme-imgs/${25}.jpg`, keywords: ['opra', 'happy', 'giving', 'you get'] },
    ]
}

function _getKeywords() {
    var keywords = [];
    gGallery.forEach(imgData => {
        imgData.keywords.forEach(keyword => {
            var currWord = keywords.find(keywordData => {
                return (keywordData.keyword === keyword)
            })
            if (!currWord) keywords.push({ keyword, count: 1 })
        })
    })
    return keywords
}
