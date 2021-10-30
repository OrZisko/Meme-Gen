'use strict'
const G_TOUCH_EV = ['touchstart', 'touchmove', 'touchend'];
var gGallery;
var gKeywords;
var gKeywordsIdx
var gMeme;
var gMemes;
var gStartPos;

function init() {
    gKeywordsIdx = 0
    gMemes = loadFromStorage('userMemeDB')
    if (!gMemes) gMemes = [];
    setImgsToGallery()
    gKeywords = _getKeywords()
}

function getGalleryForDisplay() {
    return gGallery;
}

function getKeywordsForDisplay() {
    gKeywords.sort((a, b) => { return b.count - a.count })
    const only4Keys = gKeywords.slice(gKeywordsIdx, gKeywordsIdx + 4)
    return only4Keys;
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

function changeFontSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size;
}

function moveLineUp() {
    if (!gMeme.selectedLineIdx) return
    gMeme.lines[gMeme.selectedLineIdx].pos.y -= 10;
}

function moveLineDown() {
    if (!gMeme.selectedLineIdx) return
    gMeme.lines[gMeme.selectedLineIdx].pos.y += 10;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0;
}

function switchLines() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx > gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
}

function addMemeToStorage(url) {
    gMemes.push(url);
    saveToStorage('userMemeDB', gMemes)
}

function getMemesToGallery() {
    gMemes = loadFromStorage('userMemeDB');
    return gMemes;
}

function getLineFontSize() {
    return gMeme.lines[gMeme.selectedLineIdx].size;
}

function _getKeywords() {
    var keywords = [];
    gGallery.forEach(img => {
        img.keywords.forEach(keyword => {
            var currWord = keywords.find(obj => {
                return (obj.keyword === keyword)
            })
            if (!currWord) keywords.push({ keyword, count: 1 })
        })
    })
    return keywords
}

function setImgsToGallery() {
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

function setKeyFilter(keyFilter) {
    var regex = new RegExp(keyFilter)
    var filterdGallery = gGallery.filter(img => {
        return regex.test(img.keywords.join(' '))
    })
    gGallery = filterdGallery
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
    var currKeyword = gKeywords.find(keyword => keyword.keyword === keywordToIncrease)
    if (currKeyword.count > 3) return;
    currKeyword.count += 0.5
    gKeywordsIdx = 0;
}

function changeFillColor(val) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = val;
}

function changeStrokeColor(val) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = val;
}