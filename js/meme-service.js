'use strict'
let gImgs = [];
let gMeme={lines:[]};
let gNextId = 0
let gFontSize = 15;


const gNumberOfImgs = 18
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
   
}
function getGmeme(){
    return gMeme
}
