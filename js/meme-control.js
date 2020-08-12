'use strict'

function init() {
    renderImgs()
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
    <canvas id="meme-canvas" width= "540" height="550"></canvas>
    <section class ="meme-edit-tools">
    <form onsubmit="updateMemeTemplate(event)">
    <label for="meme-text">enter meme text:</label>
    <input type="text" id="meme-text" >
    <label for="font-size">select font size</label>
    <input type="image" class="font-input" src="ICONS/1.png" onclick="changeFontSize(true)">
    
    <input type="submit" value="Generate Meme!">

    </form>
    </section>

</div>`
    drawImg(currImg)
}

function drawImg(image) {
    let Canvas = document.querySelector('#meme-canvas');
    let Ctx = Canvas.getContext('2d');
    console.log(image)
    Ctx.drawImage(image, 10, 10)
}
function updateMemeTemplate(ev) {
    ev.preventDefault()
    const currMeme = getGmeme()
    console.log('hi')
    let canvas = document.querySelector('#meme-canvas');
    // let ctx = canvas.getContext('2d');
    let elText = document.querySelector('#meme-text').value
    currMeme.lines.push({text:elText})
    renderUpdatedMeme(currMeme.selectedImgId)
}

function renderUpdatedMeme(){
    const currMeme = getGmeme()
    let canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    const fontSizeInput = document.querySelector('#font-size').value
    let fontSize = canvas.width / fontSizeInput;
    const sizeHelper = canvas.width / 15
    ctx.font = fontSize + 'px Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 15;
    ctx.textBaseLine = 'top'
    ctx.textAlign='center'
    if(currMeme.selectedLineIdx === 0){
    ctx.fillText(currMeme.lines[0].text,canvas.width/2,sizeHelper+20,canvas.width)
    ctx.strokeText(currMeme.lines[0].text,canvas.width/2,sizeHelper+20,canvas.width)
    currMeme.selectedLineIdx++
    document.querySelector('#meme-text').value = '';
    }
    if(currMeme.selectedLineIdx === 1){
        ctx.fillText(currMeme.lines[1].text,canvas.width/2,canvas.height-70,canvas.width)
        ctx.strokeText(currMeme.lines[1].text,canvas.width/2,canvas.height-70,canvas.width)
        currMeme.selectedLineIdx++
        document.querySelector('#meme-text').value = '';
        }
}