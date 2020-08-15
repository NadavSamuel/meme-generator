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
        <img class="template-${img.id}" id={${img.id}} src="${img.url}" alt="template-${img.id}
         onclick="renderMemeGenerator(this)"></a>
    `
    })

    let strHtml = strHtml1 + strHtml2.join('') + `</div>`
    elImgsCont.innerHTML = strHtml
}

function renderMemeGenerator(imgId) {
    const currImgDetails = getImgById(imgId)
    const currImg = document.querySelector(`.template-${currImgDetails.id}`)
    setMeme(imgId)
    console.log('hi')
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
    let canvas = document.querySelector('#meme-canvas');
    // let ctx = canvas.getContext('2d');
    let elText = document.querySelector('#meme-text').value

    if (currMeme.lines[currMeme.selectedLineIdx] === undefined) {
        currMeme.lines.push({
            text: elText,
            fontSize: gFontSize
        })
    }
    else {
        currMeme.lines[currMeme.selectedLineIdx].text = elText
        console.log('hi')

        console.log(currMeme.lines[currMeme.selectedLineIdx].fontSize)
        // currMeme.lines[currMeme.selectedLineIdx].fontSize = gFontSize
    }
    renderUpdatedMeme(true)
}

function renderUpdatedMeme(renderBothLines = false) {

    const currMeme = getGmeme();
    const canvas = document.querySelector('#meme-canvas');
    const ctx = canvas.getContext('2d');
    console.log(currMeme.lines)
    let fontSize = canvas.width / currMeme.lines[currMeme.selectedLineIdx].fontSize;
    const sizeHelper = canvas.width / 15;
    let textColor = currMeme.lines[currMeme.selectedLineIdx].color
    ctx.font = fontSize + 'px Impact';
    ctx.fillStyle = textColor ? textColor : 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 15;
    let helper = ctx.lineWidth;
    ctx.textBaseLine = 'top'
    ctx.textAlign = 'center'

    // const relevantTextPos = currMeme.lines.length - 1;

    if (currMeme.selectedLineIdx === 0) {
        if (currMeme.lines[currMeme.selectedLineIdx].text) gLastText = currMeme.lines[currMeme.selectedLineIdx].text
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImg(gCurrImage);
        ctx.fillText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, sizeHelper + gLineHeights.upperText, canvas.width)
        ctx.strokeText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, sizeHelper + gLineHeights.upperText, canvas.width)
        return
    }
    if (currMeme.selectedLineIdx === 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImg(gCurrImage);
        currMeme.lines[0].text = gLastText;
        if (renderBothLines) {
            let preTextColor = currMeme.lines[currMeme.selectedLineIdx - 1].color
            ctx.fillStyle = preTextColor ? preTextColor : 'white';
            fontSize = canvas.width / currMeme.lines[currMeme.selectedLineIdx - 1].fontSize;
            ctx.font = fontSize + 'px Impact';
            ctx.lineWidth = fontSize / 15;
            ctx.fillText(currMeme.lines[0].text, canvas.width / 2, sizeHelper + gLineHeights.upperText, canvas.width)
            ctx.strokeText(currMeme.lines[0].text, canvas.width / 2, sizeHelper + gLineHeights.upperText, canvas.width)
        }
        debugger
        ctx.fillStyle = textColor ? textColor : 'white';
        fontSize = canvas.width / currMeme.lines[currMeme.selectedLineIdx].fontSize;
        ctx.font = fontSize + 'px Impact';
        // if (currMeme.lines[relevantTextPos].text) gNextText = currMeme.lines[relevantTextPos].text
        fontSize = currMeme.lines[currMeme.selectedLineIdx].fontSize
        ctx.lineWidth = helper;

        ctx.fillText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, canvas.height - gLineHeights.bottomText, canvas.width)
        ctx.strokeText(currMeme.lines[currMeme.selectedLineIdx].text, canvas.width / 2, canvas.height - gLineHeights.bottomText, canvas.width)
        return
    }
}
function changeFontSize(ev, value) {
    const currMeme = getGmeme();
    const canvas = document.querySelector('#meme-canvas');
    const ctx = canvas.getContext('2d');
    ev.stopPropagation();
    ev.preventDefault();
    var currFontSize = gMeme.lines[currMeme.selectedLineIdx].fontSize

    if (value) {
        if (currFontSize < 25) currMeme.lines[currMeme.selectedLineIdx].fontSize++;
    }
    else if (currFontSize > 10) currMeme.lines[currMeme.selectedLineIdx].fontSize--;
    console.log(currMeme)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImg(gCurrImage);
    // updateMemeTemplate(event)
    renderUpdatedMeme(true)
}

function changeTextPosition(value) {
    const currMeme = getGmeme()
    if (currMeme.selectedLineIdx === 0 || currMeme.selectedLineIdx >= 3) return

    console.log(currMeme.selectedLineIdx)
    currMeme.selectedLineIdx--
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
    currMeme.selectedLineIdx++;
    console.log(currMeme.selectedLineIdx)
}

function goToNextLine(ev) {
    ev.preventDefault();
    const currMeme = getGmeme();
    currMeme.selectedLineIdx++;
    document.querySelector('#meme-text').value = '';
}
function switchLines() {
    debugger
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
    readyMemes.push(canvas.toDataURL());
    saveToStorage(KEY, readyMemes);
}

function toggleMenu() {
        document.body.classList.toggle('menu-open');
}
function openReadyMeme(meme) {
    document.body.classList.toggle('screen-toggle')
    const uploadMemeUrl = encodeURIComponent(meme)
    console.log(uploadMemeUrl)
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