'use strict'
let gImgs = [];
let gMeme={lines:[]};
let gNextId = 0
let gCurrImage;
let gFontSize = 15;
let gLineHeights = {upperText: 20,
                    bottomText:70}
let gLastText;    
let gNextText;             
const KEY = 'savedMemes';
const gReadyMemes = loadReadyMemes()? loadReadyMemes():[] ;

const gNumberOfImgs = 19
function createMeme() {

}
function getImgs(){
    return gImgs;
}
createImages()
function createImages() {
    
    for (let i = 1; i < +gNumberOfImgs; i++) {
        let imgDetails = {
            id : gNextId,
            url:'imgs/' +i+ '.jpg'
        }
        gNextId++
        gImgs.push(imgDetails)
    }
}
function getImgById(imgId){
    imgId = +imgId
    var relevantImg = gImgs.find(img =>{
        return img.id === imgId
    })
    return relevantImg
}

function setMeme(imgId){
    const currImg =  getImgById(imgId)
    gMeme.selectedImgId = currImg.id
    gMeme.selectedLineIdx = 0;
    gMeme.lines = [];
   
}
function getGmeme(){
    return gMeme
}
function getFontSize(){
    let currMeme = getGmeme()
    return currMeme.lines[currMeme.selectedLineIdx].fontSize
}
function resetMeme(imgId){
    setMeme(imgId)
    gLineHeights = {upperText: 20,
        bottomText:70}
}
function saveMeme(readyMeme){
    saveToStorage(KEY, readyMeme)
}
function loadReadyMemes(){
    return loadFromStorage(KEY)
}
function getReadyMemes(){
    return gReadyMemes
}
function deleteMemeFromStorage(meme){
    debugger
    console.log(meme)
    const readyMemes = getReadyMemes()
    const relevantIdx = readyMemes.findIndex(readyMeme =>{
         return readyMeme === meme
    })
    readyMemes.splice(relevantIdx,1)
    saveMeme(readyMemes)
}
function base64EncodeUrl(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}