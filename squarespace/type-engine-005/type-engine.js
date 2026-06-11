/* ==================================================
 PixelNorm Type Engine 005
 Canvas Protected Renderer
================================================== */

(function(){

const CDN =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/";

const FONT_JSON =
CDN + "squarespace/type-engine-005/fonts.json";


let fonts = {};
let redrawCanvas = [];


/* LOAD FONT DATABASE */

fetch(FONT_JSON)
.then(r => r.json())
.then(data => {

fonts = data;
init();

});


/* FONT LOADER */

async function loadFont(name,style){


const font =
fonts[name];


if(!font) return;


const info =
font.styles[style];


if(!info) return;


const file =
CDN +
"assets/f/p/" +
font.id +
"/" +
font.id +
"-" +
info.file +
".bin";


const buffer =
await fetch(file)
.then(r=>r.arrayBuffer());


const face =
new FontFace(
font.id+"-"+style,
buffer
);


await face.load();


document.fonts.add(face);


return font.id+"-"+style;


}



/* THEME */

function currentColor(){

return document.documentElement.classList.contains("spark-dark")
?
"#ffffff"
:
"#000000";

}



/* CANVAS */

async function createCanvas(canvas){


const family =
await loadFont(
canvas.dataset.font,
canvas.dataset.style || "regular"
);


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
currentColor();


ctx.textBaseline =
"middle";


ctx.font =
"100px '"+family+"'";


ctx.fillText(
canvas.dataset.text || "Sample",
40,
canvas.height/2
);


}


render();


redrawCanvas.push(render);


}



/* GLYPHS */

async function createGlyphs(box){


const family =
await loadFont(
box.dataset.font,
box.dataset.style || "regular"
);


if(!family) return;


const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@";


box.innerHTML="";


chars.split("").forEach(char=>{


const item =
document.createElement("div");


item.className =
"pn-glyph";


item.style.fontFamily =
family;


item.textContent =
char;


box.appendChild(item);


});


}



/* START */

function init(){


document
.querySelectorAll(".pn-type-canvas")
.forEach(createCanvas);


document
.querySelectorAll(".pn-glyph-grid")
.forEach(createGlyphs);


}



/* DARK MODE UPDATE */

new MutationObserver(()=>{


redrawCanvas.forEach(
fn=>fn()
);


})
.observe(
document.documentElement,
{
attributes:true,
attributeFilter:["class"]
}
);


})();