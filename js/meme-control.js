'use strict'

function init() {
    renderImgs();
    let elBody = document.querySelector('body');
    if (elBody.classList.contains('menu-open')) elBody.classList.remove('menu-open')
}


function renderImgs() {
    let elImgsCont = document.querySelector('.imgs-container');
    var imgs = getImgs();
    let strHtml1 = `<div class="templates ">`
    let strHtml2 = imgs.map(function (img) {
        return `
        <a onclick="renderMemeGenerator(${img.id})">
        <img class="template-${img.id}" id=${img.id} src="${img.url}" alt="template-${img.id}
         onclick="renderMemeGenerator(this)"></a>
    `
    })

    let strHtml = strHtml1 + strHtml2.join('') + `</div>`
    elImgsCont.innerHTML = strHtml
    renderKeyWords()

}
function filterImagetoDisplay(){
    const elKeyWord = document.querySelector('#gsearch').value
    if (elKeyWord === '') gCurrKeyWord = 'all'
    else gCurrKeyWord = elKeyWord;
    renderImgs();
}
function renderKeyWords(){
    let keyWords  = getGkeyWords();
    let keyWordsKeys = Object.keys(keyWords);
    let keyWordsValues =  Object.values(keyWords);
    var strHtml = '<ul>'
    for(let i =0; i<5; i++){
        strHtml +=`<li> <div class="keyword" onclick="updateAndRenderKeywordPopularity('${keyWordsKeys[i]}')" 
        style= "font-size:(16/${keyWordsValues[i]})px" >
        ${keyWordsKeys[i]}
        </div></li> `
    }
    strHtml+= '</ul>'
    var elKeywordsContainer = document.querySelector('.top-keywords')
    elKeywordsContainer.innerHTML = strHtml
}
function updateAndRenderKeywordPopularity(clickedKeyWord){
    const keyWords = getGkeyWords()
        keyWords[clickedKeyWord]++;
        renderKeyWords()
}

function renderMemeGenerator(imgId) {
    const currImgDetails = getImgById(imgId)
    const currImg = document.querySelector(`.template-${currImgDetails.id}`)
    setMeme(imgId)
    let elImgsCont = document.querySelector('.imgs-container');
    elImgsCont.innerHTML = '';
    elImgsCont.innerHTML = ` <div class="generator-page" >
    <div class ="canvas-container">
    <canvas id="meme-canvas" width= "500" height="500"></canvas>
    </div>

    <section class ="meme-edit-tools flex column align-items">

    <label for="meme-text"></label>
    <input type="text" id="meme-text" class="meme-text-input" placeholder="enter meme text:" oninput="updateMemeTemplate(event)" >
    <label for="font-size"></label>
    <div class="btns-container">
    <div class="basic-btns flex space-between">
    <input type="image" class="font-input" src="icons/7.png" onclick="switchLines()">
    <input type="image" class="font-input" src="icons/8.png" onclick="reserMemeTemplate(${imgId})" >
    <input type="image" class="font-input" src="icons/9.png"onclick="goToNextLine(event)" >
    </div>
    <label for="font-size"></label>
    <div class="secondery-btns flex space-between">
    <input type="image" class="font-input" src="icons/1.png" onclick="changeFontSize(event,false)">
    <input type="image" class="font-input" src="icons/2.png" onclick="changeFontSize(event,true)">
    <input type="image" class="font-input" src="icons/4.svg" onclick=" changeTextPosition(${true})">
    <input type="image" class="font-input" src="icons/5.svg" onclick=" changeTextPosition(${false})">
    <div class= color-pick>
    <input type="color" class="font-input color-picker" onchange="changeTextColor()">
    </div>
    </div>
    <div class="meme-done-btns">
    <a href="#" onclick="downloadCanvas(this)" download="my-meme.jpg">
    <button class="meme-done-btn">Download</button>
    </a>  
    <button class="meme-done-btn" onclick="onSaveMeme()">Save</button>  
    <button class="meme-done-btn">Share</button>  
    </div>
    </div>
    
    </section>

</div>
`

    drawImg(currImg)
    gCurrImage = currImg;
}
function renderReadyMemes() {
    const elBody = document.querySelector('body')
    if (elBody.classList.contains('menu-open')) elBody.classList.remove('menu-open')
    const readyMemes = getReadyMemes()
    let elImgsCont = document.querySelector('.imgs-container');
    elImgsCont.innerHTML = '';
    let strHtml1 = `
    <div class ="ready-memes templates">`
    let strHtml2 = readyMemes.map(meme => {
        return `
        <div class="readyMeme">
        <a herf = "" onclick ="openReadyMeme('${meme}')" >
        <img src="${meme}"  >
        </div></a>
    `
    })
    elImgsCont.innerHTML = strHtml1 + strHtml2.join('') + `</div> </div> `

}

function drawImg(image) {

    let canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0)
    ctx.fill()
}

function updateMemeTemplate(ev) {

    ev.preventDefault();
    ev.stopPropagation();
    let currMeme = getGmeme()
    if(currMeme.selectedLineIdx === 2) return

    let canvas = document.querySelector('#meme-canvas');
    let elText = document.querySelector('#meme-text').value

    if (currMeme.lines[currMeme.selectedLineIdx] === undefined) {
        currMeme.lines.push({
            text: elText,
            fontSize: gFontSize
        })
    }
    else {
        currMeme.lines[currMeme.selectedLineIdx].text = elText

    }
    renderUpdatedMeme(true)
}

function setTextDetails(lineIdx){
    const currMeme = getGmeme();
    const canvas = document.querySelector('#meme-canvas');
    const ctx = canvas.getContext('2d');
    currMeme.selectedLineIdx = lineIdx
    let fontSize = canvas.width / currMeme.lines[currMeme.selectedLineIdx].fontSize;
    let textColor = currMeme.lines[currMeme.selectedLineIdx].color
    ctx.font = fontSize + 'px Impact';
    ctx.fillStyle = textColor ? textColor : 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 15;
    let helper = ctx.lineWidth;
    ctx.textBaseLine = 'top';
    ctx.textAlign = 'center';
}
function printMemeText(lineidx){
    const currMeme = getGmeme();
    const canvas = document.querySelector('#meme-canvas');
    const ctx = canvas.getContext('2d');
    var sizeHelper = canvas.width / 15;
    var lineHeight;
    currMeme.selectedLineIdx = lineidx;
    if(currMeme.selectedLineIdx === 1){
        currMeme.lines[currMeme.selectedLineIdx].lineHeight = gLineHeights.bottomText;
        lineHeight = currMeme.lines[currMeme.selectedLineIdx].lineHeight;
        ctx.fillText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, canvas.height - lineHeight, canvas.width)
        ctx.strokeText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, canvas.height - lineHeight, canvas.width)
    
    }
    if(currMeme.selectedLineIdx === 0){
    currMeme.lines[currMeme.selectedLineIdx].lineHeight = gLineHeights.upperText
    lineHeight = currMeme.lines[currMeme.selectedLineIdx].lineHeight;
    ctx.fillText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, sizeHelper + lineHeight, canvas.width)
    ctx.strokeText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, sizeHelper + lineHeight, canvas.width)
    }
}

function renderUpdatedMeme(renderBothLines = false) {
    const currMeme = getGmeme();
    const canvas = document.querySelector('#meme-canvas');
    const ctx = canvas.getContext('2d');
    // var sizeHelper = canvas.width / 15;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImg(gCurrImage);
    if (currMeme.selectedLineIdx === 0) {
        setTextDetails(0);
        printMemeText(0)
        return
    }
    if (currMeme.selectedLineIdx === 1) {
        if (renderBothLines) {

            setTextDetails(0);
            printMemeText(0)
        }

        setTextDetails(1);
        printMemeText(1)
        return
    }
}
function changeFontSize(ev, value) {
    const currMeme = getGmeme();
    const canvas = document.querySelector('#meme-canvas');
    const ctx = canvas.getContext('2d');
    ev.stopPropagation();
    ev.preventDefault();
    var currFontSize = gMeme.lines[currMeme.selectedLineIdx].fontSize;
    if (value) {
        if (currFontSize < 25) currMeme.lines[currMeme.selectedLineIdx].fontSize++;
    }
    else if (currFontSize > 10) currMeme.lines[currMeme.selectedLineIdx].fontSize--;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImg(gCurrImage);
    renderUpdatedMeme(true)
}

function changeTextPosition(value) {
    const currMeme = getGmeme()
    if (currMeme.selectedLineIdx >= 2) return

    const canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    if (currMeme.selectedLineIdx === 0) {
        if (value) gLineHeights.upperText -= 5;
        else gLineHeights.upperText += 5;
    }
    if (currMeme.selectedLineIdx === 1) {
        if (value) gLineHeights.bottomText += 5;
        else gLineHeights.bottomText -= 5;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImg(gCurrImage);
    renderUpdatedMeme(true)
}

function goToNextLine(ev) {
    ev.preventDefault();
    const currMeme = getGmeme();
    if(currMeme.selectedLineIdx === 2) return
    currMeme.selectedLineIdx++;
    document.querySelector('#meme-text').value = '';
}
function switchLines() {
    let currMeme = getGmeme()
    const canvas = document.querySelector('#meme-canvas');
    if (currMeme.selectedLineIdx > 1) return
    let pivotValue = gLineHeights.upperText;
    gLineHeights.upperText = canvas.width - gLineHeights.bottomText - 30;
    gLineHeights.bottomText = canvas.width - pivotValue - 30;
    drawImg(gCurrImage);
    updateMemeTemplate(event)

}
function changeTextColor() {
    const currMeme = getGmeme();
    let newColor = document.querySelector('.color-picker').value
    currMeme.lines[currMeme.selectedLineIdx].color = newColor
    renderUpdatedMeme(true)

}
function reserMemeTemplate(imdId) {
    // renderMemeGenerator(imdId)
    resetMeme(imdId)
    drawImg(gCurrImage)

}
function downloadCanvas(elLink) {
    const canvas = document.querySelector('#meme-canvas');
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function onSaveMeme() {
    const canvas = document.querySelector('#meme-canvas');
    let readyMemes = getReadyMemes();
    readyMemes.push(canvas.toDataURL('imgp/ng'));
    saveToStorage(KEY, readyMemes);
}

function toggleMenu() {
        document.body.classList.toggle('menu-open');
}

function toggleScreen(){
                document.body.classList.remove('menu-open')
}
function openReadyMeme(meme) {
    document.body.classList.toggle('screen-toggle')
    const uploadMemeUrl = encodeURIComponent(meme)
    const memeModalContent = `
    <img src="${meme}""${meme}" class="modal-img">
    <div class ="saved-meme-btns">
    <a href="${meme}" download="my-meme.jpg">
    <button class="meme-done-btn full-size">Download</button>
    </a>  
    <a herf="https://www.facebook.com/sharer/sharer.php?u=${uploadMemeUrl}&t=${uploadMemeUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadMemeUrl}&t=${uploadMemeUrl}'); return false;">
    <button class="meme-done-btn full-size">Share</button> 
    </a>  
    <button class="meme-done-btn delete-btn full-size" onclick="onDeleteMeme('${meme}')">Delete</button>  
    <button class="meme-done-btn full-size" onclick="onCloseMemeModal()">Close</button>  
    </div>
    `
    const elMemeModal = document.querySelector('.meme-modal')
    elMemeModal.innerHTML = memeModalContent
    elMemeModal.style.display = 'flex'
}
function onCloseMemeModal() {
    document.body.classList.toggle('screen-toggle')
    document.querySelector('.meme-modal').style.display = 'none'
}
function onDeleteMeme(meme) {
    let confirmDelete = confirm('are you sure you want to delete thos meme?')
    if (confirmDelete) {
        deleteMemeFromStorage(meme)
        document.body.classList.toggle('screen-toggle')
        document.querySelector('.meme-modal').style.display = 'none'
        renderReadyMemes()
    }
}