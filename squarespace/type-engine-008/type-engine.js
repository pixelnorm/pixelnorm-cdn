/* PIXELNORM TYPE ENGINE 008 */

(async()=>{


const BASE =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/";

const ENGINE =
BASE+"squarespace/type-engine-008/";

const FONTBASE =
BASE+"assets/f/p/";



const fontData =
await fetch(ENGINE+"fonts.json").then(r=>r.json());



document
.querySelectorAll(".pn-type-engine")
.forEach(init);



async function init(root){


const key=root.dataset.font;
const data=fontData[key];

if(!data)return;


let current =
Object.keys(data.styles)[0];


let size=120;
let leading=1.2;
let tracking=0;


root.innerHTML=`


<canvas class="pn-title-canvas"></canvas>


<div class="pn-tester">

<div class="pn-tester-head">

<span>FONT TESTER</span>
<span>${data.name}</span>

</div>


<div class="pn-controls">

<div class="pn-control">
<label>Size</label>
<input class="pn-size" type="range"
min="20" max="250" value="120">
</div>


<div class="pn-control">
<label>Leading</label>
<input class="pn-leading" type="range"
min=".8" max="2" step=".1" value="1.2">
</div>


<div class="pn-control">
<label>Tracking</label>
<input class="pn-track" type="range"
min="-20" max="50" value="0">
</div>


</div>


<div class="pn-style-list"></div>


<textarea class="pn-editor">
The quick brown fox
jumps over the lazy dog.
</textarea>


<canvas class="pn-test-canvas"></canvas>


</div>


<div class="pn-glyph-grid"></div>

`;



const styleBox =
root.querySelector(".pn-style-list");



Object.entries(data.styles)
.forEach(([id,s])=>{

let b=document.createElement("span");

b.textContent=s.label;
b.className="pn-style-btn";

if(id===current)b.classList.add("active");


b.onclick=()=>{

current=id;

root
.querySelectorAll(".pn-style-btn")
.forEach(x=>x.classList.remove("active"));

b.classList.add("active");

loadFont();

};

styleBox.appendChild(b);

});



const editor=root.querySelector(".pn-editor");

const titleCanvas=root.querySelector(".pn-title-canvas");

const testCanvas=root.querySelector(".pn-test-canvas");

const glyphGrid=root.querySelector(".pn-glyph-grid");



let family;



async function loadFont(){


let style=data.styles[current];


family =
key+"-"+current;


let url =
FONTBASE+
data.id+
"/"+
data.id+
"-"+
style.file+
".bin";



let buffer =
await fetch(url)
.then(r=>r.arrayBuffer());



let blob =
new Blob(
[buffer],
{type:"font/woff2"}
);


let face =
new FontFace(
family,
`url(${URL.createObjectURL(blob)})`
);


await face.load();


document.fonts.add(face);


drawAll();

}



function color(){

return getComputedStyle(document.body)
.color;

}



function setup(c){

let r=devicePixelRatio||1;

c.width=c.clientWidth*r;
c.height=c.clientHeight*r;

let ctx=c.getContext("2d");

ctx.scale(r,r);

return ctx;

}



function drawAll(){

drawTitle();

drawTester();

drawGlyphs();

}



function drawTitle(){


let ctx=setup(titleCanvas);

ctx.clearRect(
0,0,
titleCanvas.width,
titleCanvas.height
);


ctx.fillStyle=color();

ctx.font=
`70px "${family}"`;

ctx.fillText(
data.name,
20,
150
);

}



function drawTester(){


let ctx=setup(testCanvas);


ctx.clearRect(
0,0,
testCanvas.width,
testCanvas.height
);


ctx.fillStyle=color();


ctx.font=
`${size}px "${family}"`;


let y=150;


editor.value
.split("\n")
.forEach(line=>{


let x=0;


[...line].forEach(ch=>{


ctx.fillText(
ch,
x,
y
);


x +=
ctx.measureText(ch).width
+
Number(tracking);


});


y += size*leading;


});


}



function drawGlyphs(){


glyphGrid.innerHTML="";


"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@"
.split("")
.forEach(ch=>{


let c=document.createElement("canvas");

c.className="pn-glyph";


glyphGrid.appendChild(c);


let ctx=setup(c);


ctx.fillStyle=color();


ctx.font=
`42px "${family}"`;


ctx.textAlign="center";


ctx.fillText(
ch,
40,
55
);


});


}




editor.oninput=drawTester;


testCanvas.onclick=()=>{

editor.focus();

};



root.querySelector(".pn-size")
.oninput=e=>{

size=e.target.value;
drawTester();

};



root.querySelector(".pn-leading")
.oninput=e=>{

leading=e.target.value;
drawTester();

};


root.querySelector(".pn-track")
.oninput=e=>{

tracking=e.target.value;
drawTester();

};




new MutationObserver(drawAll)
.observe(
document.documentElement,
{
attributes:true,
attributeFilter:["class"]
}
);



loadFont();



}



})();