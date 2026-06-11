/* ==================================================
 PixelNorm Type Engine 004
 Canvas Protected Renderer
================================================== */

(function(){

const CDN =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/";

const FONT_JSON =
CDN + "squarespace/type-engine-004/fonts.json";


let fonts = {};
let canvasRenders = [];


/* LOAD JSON */

fetch(FONT_JSON)
.then(r=>r.json())
.then(data=>{

fonts=data;

init();

});


/* LOAD FONT */

async function loadFont(id,style){

let font = fonts[id];
if(!font) return null;

let item = font.styles[style];
if(!item) return null;


let path =
CDN +
"assets/f/p/" +
id +
"/" +
id +
"-" +
item.file +
".bin";


let response =
await fetch(path);


let buffer =
await response.arrayBuffer();


let face =
new FontFace(
id+"-"+style,
buffer
);


await face.load();

document.fonts.add(face);


return id+"-"+style;

}



/* THEME COLOR */

function themeColor(){

return document.documentElement
.classList.contains("spark-dark")
?
"#fff"
:
"#000";

}


/* CANVAS */

async function initCanvas(el){


let family =
await loadFont(
el.dataset.font,
el.dataset.style || "regular"
);


if(!family) return;


let ctx =
el.getContext("2d");


function draw(){


ctx.clearRect(
0,
0,
el.width,
el.height
);


ctx.fillStyle =
themeColor();


ctx.font =
"100px '"+family+"'";


ctx.textBaseline =
"middle";


ctx.fillText(
el.dataset.text || "Ingrida",
40,
el.height/2
);


}


draw();


canvasRenders.push(draw);


}



/* GLYPH GRID */

async function initGlyphs(el){


let family =
await loadFont(
el.dataset.font,
el.dataset.style || "regular"
);


if(!family) return;


let chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@";


el.innerHTML="";


chars.split("").forEach(c=>{


let d =
document.createElement("div");


d.className =
"pn-glyph";


d.style.fontFamily =
family;


d.textContent=c;


el.appendChild(d);


});


}



/* INIT */

function init(){


document
.querySelectorAll(".pn-type-canvas")
.forEach(initCanvas);


document
.querySelectorAll(".pn-glyph-grid")
.forEach(initGlyphs);


}



/* WATCH SPARK THEME */

new MutationObserver(()=>{


canvasRenders.forEach(fn=>fn());


})
.observe(
document.documentElement,
{
attributes:true,
attributeFilter:["class"]
}
);



})();
