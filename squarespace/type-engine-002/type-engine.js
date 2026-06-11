/* ==================================================
   PixelNorm Type Engine 001
   Canvas Font Renderer
   ================================================== */

(function(){

const CDN =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/";

const FONT_JSON =
CDN + "squarespace/type-engine-001/fonts.json";


let PN_FONTS = {};
let PN_RENDERERS = [];


/* =========================
LOAD FONT DATABASE
========================= */

async function loadFonts(){

const res = await fetch(FONT_JSON);
PN_FONTS = await res.json();

initTypeEngine();

}


/* =========================
LOAD PROTECTED FONT
========================= */

async function loadFont(fontId, style){

const font = PN_FONTS[fontId];

if(!font) return null;

const item = font.styles[style];

if(!item) return null;


const url =
CDN +
"assets/f/p/" +
font.id +
"/" +
font.id +
"-" +
item.file +
".bin";


const buffer = await fetch(url)
.then(r=>r.arrayBuffer());


const blob = new Blob(
[buffer],
{type:"font/woff2"}
);


const fontFace = new FontFace(
font.name + "-" + style,
`url(${URL.createObjectURL(blob)})`
);


await fontFace.load();

document.fonts.add(fontFace);

return fontFace.family;

}


/* =========================
THEME COLOR
========================= */

function getCanvasColor(){

return document.documentElement
.classList
.contains("spark-dark")
? "#ffffff"
: "#000000";

}


/* =========================
CANVAS DRAW
========================= */

async function drawCanvas(canvas){

const fontId =
canvas.dataset.font;

const style =
canvas.dataset.style || "regular";

const text =
canvas.dataset.text || "Sample Text";


const family =
await loadFont(fontId,style);


if(!family) return;


const ctx =
canvas.getContext("2d");


function render(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);


ctx.fillStyle =
getCanvasColor();


ctx.textBaseline =
"middle";


ctx.font =
"90px '" + family + "'";


ctx.fillText(
text,
40,
canvas.height/2
);

}


render();


PN_RENDERERS.push(render);

}


/* =========================
GLYPH GRID
========================= */

async function drawGlyphGrid(el){

const fontId =
el.dataset.font;

const style =
el.dataset.style || "regular";


const family =
await loadFont(fontId,style);


if(!family) return;


const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@";


el.innerHTML="";


chars.split("").forEach(ch=>{

const box =
document.createElement("div");

box.innerHTML = ch;

box.style.fontFamily =
family;

box.className =
"pn-glyph";


el.appendChild(box);

});

}


/* =========================
INIT ENGINE
========================= */

function initTypeEngine(){


document
.querySelectorAll(".pn-type-canvas")
.forEach(drawCanvas);



document
.querySelectorAll(".pn-glyph-grid")
.forEach(drawGlyphGrid);


}


/* =========================
SPARK DARK MODE WATCHER
========================= */

const observer =
new MutationObserver(()=>{


PN_RENDERERS.forEach(
render=>render()
);


});


observer.observe(
document.documentElement,
{
attributes:true,
attributeFilter:["class"]
}
);



/* =========================
START
========================= */

loadFonts();


})();
