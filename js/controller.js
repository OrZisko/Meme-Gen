'use strict'

var gElCanvas;
var gCtx;

var gIsLineMarked;

function onInit() {
    init();
    gIsLineMarked = false;
    gElCanvas = document.querySelector('.my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderKeywords();
    renderGallery();
    _addListeners()
}

function renderKeywords() {
    var keywords = getKeywordsForDisplay().map(keyword =>
        `<li onclick="onFilterGalleryByKeyword(this)" style="font-size:${keyword.count}em;">${keyword.keyword}</li>`)
    document.querySelector('.keywords-container').innerHTML = keywords.join('')
}

function renderGallery() {
    const gallery = getGalleryForDisplay();
    const displayGallery = gallery.map(img => `<img onclick="onOpenEditor(${img.id})" src="${img.url}">`)
    document.querySelector('.images-container').innerHTML = displayGallery.join('');
}

function renderMemes() {
    const memes = getMemesToGallery();
    if (!memes) alert('There are noe memes to show. Create some')
    const displayGallery = memes.map(meme => `<div  onclick="onPlaceMemeInEditor(${meme.id})"><canvas id="saved-meme${meme.id}" width="200" height="${getCanvasHeight(getImgFromMeme(meme), 200)}"></canvas></div>`)
    document.querySelector('.images-container').innerHTML = displayGallery.join('');
    memes.forEach(meme => {
        const elCanvas = document.querySelector(`#saved-meme${meme.id}`)
        const ctx = elCanvas.getContext('2d');
        ctx.drawImage(getImgFromMeme(meme), 0, 0, elCanvas.width, elCanvas.height)
        meme.lines.forEach(line => {
            ctx.textAlign = line.align;
            ctx.strokeStyle = line.strokeColor;
            ctx.lineWidth = 0.1
            ctx.fillStyle = line.fillColor;
            ctx.font = `${line.sizeRatio * elCanvas.height}px ${line.font}`;
            const { x, y } = getAdjustedXY(line.posRatio, elCanvas)
            ctx.fillText(line.txt, x, y)
            ctx.strokeText(line.txt, x, y)
        })
    })

}

function renderShareButton(url, encUpUrl, upUrl) {
    document.querySelector('.share-container').innerHTML = `
    <a class="share-link" href="https://www.facebook.com/sharer/sharer.php?u=${encUpUrl}&t=${encUpUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${upUrl}&t=${upUrl}'); return false;">
       Share   
    </a>    
    <a href="${url}" class="download-link" download="my-meme.jpg">Download</a>`
}

function onFilterGallery(val) {
    setKeyFilter(val)
    renderGallery()
    _setImgsToGallery();
    renderKeywords()
}

function onMoveKeywordsForward() {
    moveKeywordsForward()
    renderKeywords()
}

function onMoveKeywordsBack() {
    moveKeywordsBack()
    renderKeywords()
}

function onFilterGalleryByKeyword(el) {
    const currKeyWord = el.innerText;
    setKeyFilter(currKeyWord);
    renderGallery();
    _setImgsToGallery();
    increaseKeywordCount(currKeyWord)
    renderKeywords()
}

function filterGalleryBySearch(val, ev) {
    if (ev.key === 'Backspace') {
        renderGallery();
        return;
    }
    setKeyFilter(val)
    renderGallery()
    _setImgsToGallery();
}

function onOpenEditor(id) {
    makeMemeData(id)
    _openEditor()
}

function onPlaceMemeInEditor(id) {
    placeMemeInEditor(id);
    _openEditor()
}

function onCloseEditor() {
    document.querySelector('.meme-editor').classList.remove('open')
}

function onChangeLineText(val) {
    changeLineText(val);
    _renderCanvas()
}

function onMoveLine(dir) {
    (dir === 'up') ? moveLineUp() : moveLineDown()
    _renderCanvas()
}

function onSwitchLines() {
    switchLines()
    _renderCanvas()
}

function onAddLine() {
    addLine();
    _renderCanvas()
}

function onRemoveLine() {
    removeLine();
    _renderCanvas();
}

function onChangeFontSize(val) {
    changeFontSize(val);
    _renderCanvas();
}

function onChangeAlign(val) {
    changeAlign(val);
    _renderCanvas()
}

function onChangeStrokeColor(val) {
    changeStrokeColor(val);
    _renderCanvas();
}

function onChangeFillColor(val) {
    changeFillColor(val);
    _renderCanvas();
}

function onChangeFont(val) {
    changeFont(val);
    _renderCanvas();
}

function onSaveMeme() {
    saveMeme();
    _renderCanvas('without')
    uploadImg(gElCanvas)
}

function onDown(ev) {
    const pos = getEvPos(ev);
    if (!isLineClicked(pos)) return
    setMovementStart(gElCanvas, pos);
    _renderCanvas()
    gIsLineMarked = true;
    document.querySelector('.my-canvas').style.cursor = 'grabbing'
    _renderMemeEditorContent()
}

function onMove(ev) {
    const pos = getEvPos(ev)
    if (gIsLineMarked) {
        moveLine(pos);
        _renderCanvas();
    } else {
        if (isLineClicked(pos)) document.querySelector('.my-canvas').style.cursor = 'pointer';
        else {
            document.querySelector('.my-canvas').style.cursor = 'default'
            return;
        }
    }
}

function onUp() {
    gIsLineMarked = false;
}

function _renderCanvas(withRect) {
    const imgData = getImgForDisplay()
    const lines = getLinesForDisplay()
    var img = new Image();
    img.src = imgData.url
    gElCanvas.height = getCanvasHeight(img, gElCanvas.width)
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    lines.forEach(line => {
        gCtx.textAlign = line.align
        gCtx.strokeStyle = line.strokeColor;
        gCtx.fillStyle = line.fillColor;
        gCtx.font = `${line.sizeRatio * gElCanvas.height}px ${line.font}`;
        const { x, y } = getAdjustedXY(line.posRatio, gElCanvas)
        gCtx.fillText(line.text, x, y)
        gCtx.strokeText(line.text, x, y)
    })
    if (!withRect) drawRect()
}

function _addListeners() {
    _addMouseListeners()
    _addTouchListeners()
}

function _addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function _addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function _renderMemeEditorContent() {
    const line = getCurrLine()
    document.querySelector('.meme-text').value = line.text;
    document.querySelector('.line-color input').value = line.strokeColor;
    document.querySelector('.fill-color input').value = line.fillColor;
    document.querySelector('#font-select').value = line.font;


}

function _openEditor() {
    _renderCanvas()
    document.querySelector('.meme-editor').classList.add('open')
}