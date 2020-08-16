'use strict'
let gImgs = [];
let gMeme={lines:[]};
let gNextId = 0
let gCurrImage;
let gFontSize = 15;
let gLineHeights = {upperText: 20,
                    bottomText:70,
                    middleText:45}
let gKeyWords = {'politics':1,'dog':1,'cute':3,'baby':0,'kid':0,'actor':5};
let gCurrKeyWord = 'all'

let gNextText;             
const KEY = 'savedMemes';
const gReadyMemes = loadReadyMemes()? loadReadyMemes():[] ;

// const gNumberOfImgs = 19
function createMeme() {

}
function getImgs(){
    if(gCurrKeyWord === 'all') return gImgs;
    else{
        let imgsToDisplay = gImgs.filter(img =>{
            return img.keyWords.includes(gCurrKeyWord)
        })
        return imgsToDisplay
    }
    
}
function getGkeyWords(){
    return gKeyWords
}
// createImages()
function createImg(urlIdx,desc){
    return{
        id:gNextId++,
        url:`imgs/${urlIdx}.jpg`,
        keyWords:desc
    }
}
createImages()
function createImages() {
    const createdImgs = [
    createImg(1,['politics','stupid']),
    createImg(2,['dog','cute']),
    createImg(3,['dog','cute','baby']),
    createImg(4,['cat','cute']),
    createImg(5,['baby','epic']),
    createImg(6,['epic','aliens','history channel']),
    createImg(7,['baby','cute']),
    createImg(8,['willi wonka','cynical']),
    createImg(9,['baby','evil']),
    createImg(10,['politics','awsome']),
    createImg(11,['sports','gay']),
    createImg(12,['israeli']),
    createImg(13,['actor','awsome']),
    createImg(14,['actor','awsome','cynical']),
    createImg(15,['actor','awsome','cynical']),
    createImg(16,['actor','cynical']),
    createImg(17,['politics']),
    createImg(18,['toy story','awsome']),
    ]
    createdImgs.forEach(img =>{
         gImgs.push(img)

    })
    
}
function getCurrKeyWord(){
    return gCurrKeyWord;
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
// function base64EncodeUrl(str){
//     return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
// }