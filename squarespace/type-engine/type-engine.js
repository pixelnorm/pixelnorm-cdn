/*
====================================
PixelNorm Type Engine
Canvas Font Renderer
Version 1.0
====================================
*/

(function(){

const CDN =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/";

const MANIFEST =
CDN + "squarespace/type-engine/fonts.json";

const FONT_ROOT =
CDN + "assets/f/p/";


let catalogue = {};
let loadedFonts = {};



async function init(){

    const res = await fetch(MANIFEST);
    catalogue = await res.json();

    console.log(
        "PixelNorm Type Engine Loaded",
        catalogue
    );

}



async function loadFont(fontKey,styleKey){


    const font = catalogue[fontKey];

    if(!font){
        console.error("Font missing:",fontKey);
        return;
    }


    const style = font.styles[styleKey];


    const cacheID =
    fontKey + "-" + styleKey;


    if(loadedFonts[cacheID]){
        return loadedFonts[cacheID];
    }


    const url =
    FONT_ROOT +
    font.id +
    "/" +
    font.id +
    "-" +
    style.file +
    ".bin";


    const buffer =
    await fetch(url)
    .then(r=>r.arrayBuffer());


    const blob =
    new Blob(
        [buffer],
        {
            type:"font/woff2"
        }
    );


    const face =
    new FontFace(
        cacheID,
        URL.createObjectURL(blob)
    );


    await face.load();

    document.fonts.add(face);


    loadedFonts[cacheID]=face;


    return face;

}





async function renderCanvas(options){


    await loadFont(
        options.font,
        options.style
    );


    const canvas =
    document.querySelector(
        options.target
    );


    if(!canvas){
        return;
    }


    const ctx =
    canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
    options.color || "#000";


    ctx.font =
    (options.size || 120)
    +
    "px '" +
    options.font +
    "-" +
    options.style +
    "'";


    ctx.fillText(
        options.text || "Type Something",
        40,
        canvas.height/2
    );


}





function glyphGrid(target,font,style){


const holder =
document.querySelector(target);


if(!holder){
return;
}


const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@";


holder.innerHTML="";


chars.split("").forEach(char=>{


let item =
document.createElement("div");


item.className =
"pn-glyph";


item.innerHTML =
char;


item.style.fontFamily =
font+"-"+style;


holder.appendChild(item);


});


}





window.PixelNormType = {

ready:init,

render:renderCanvas,

glyphs:glyphGrid

};



init();


})();
