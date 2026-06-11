/*
====================================
PixelNorm Type Engine
Canvas Font Renderer
Version 1.2
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
let loaded = {};



async function init(){

const r = await fetch(MANIFEST);

catalogue = await r.json();

console.log(
"PixelNorm Type Engine Ready",
catalogue
);

}



async function loadFont(fontKey,styleKey){


const font =
catalogue[fontKey];


const style =
font.styles[styleKey];


const family =
"pn-" + font.id + "-" + styleKey;



if(loaded[family]){

return family;

}



const url =

FONT_ROOT +

font.id +

"/" +

font.id +

"-" +

style.file +

".bin";



console.log(
"Fetching:",
url
);



const buffer =
await fetch(url)
.then(r=>r.arrayBuffer());



const blob =
new Blob([buffer]);



const objectURL =
URL.createObjectURL(blob);



const face =
new FontFace(

family,

"url(" + objectURL + ")"

);



await face.load();


document.fonts.add(face);



loaded[family]=true;



console.log(
"Font active:",
family
);



return family;


}




async function render(options){


const family =
await loadFont(
options.font,
options.style
);



const canvas =
document.querySelector(
options.target
);


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
(options.size || 150)

+ "px '" +

family +

"'";



ctx.fillText(
options.text,

40,

180

);


}





async function glyphs(target,font,style){


const family =
await loadFont(
font,
style
);



const holder =
document.querySelector(target);


const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@";


holder.innerHTML="";



chars.split("").forEach(c=>{


let d =
document.createElement("div");


d.className =
"pn-glyph";


d.style.fontFamily =
"'" + family + "'";


d.innerHTML=c;


holder.appendChild(d);


});


}



window.PixelNormType={

render,

glyphs

};



init();



})();
