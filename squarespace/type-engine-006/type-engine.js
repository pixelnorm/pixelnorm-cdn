(function(){


const BASE =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@squarespace/type-engine-006/";

const FONTBASE =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/assets/f/p/";



async function initTester(el){


const fontKey = el.dataset.font;

const data =
await fetch(BASE+"fonts.json").then(r=>r.json());


const font=data[fontKey];


let styleKey=Object.keys(font.styles)[0];
let size=120;
let tracking=0;
let leading=1.2;

let text=
"The quick brown fox\njumps over the lazy dog.";


el.innerHTML=`

<div class="pn-tester-head">
<span>FONT TESTER</span>
<span>${font.name}</span>
</div>


<div class="pn-controls">


<div class="pn-control">
<label>
<span>SIZE</span>
<span id="pn-size">${size}px</span>
</label>
<input type="range" min="40" max="240" value="${size}" data-control="size">
</div>


<div class="pn-control">
<label>
<span>LEADING</span>
<span id="pn-leading">${leading}</span>
</label>
<input type="range" min="0.8" max="2" step=".05" value="${leading}" data-control="leading">
</div>


<div class="pn-control">
<label>
<span>TRACKING</span>
<span id="pn-track">${tracking}</span>
</label>
<input type="range" min="-20" max="80" value="${tracking}" data-control="tracking">
</div>


</div>


<div class="pn-style-list"></div>


<div class="pn-canvas-wrap">

<canvas class="pn-type-canvas"></canvas>

<textarea class="pn-hidden-input"></textarea>

</div>

`;



const canvas =
el.querySelector("canvas");

const ctx =
canvas.getContext("2d");

const textarea =
el.querySelector("textarea");

const styleBox =
el.querySelector(".pn-style-list");



Object.keys(font.styles).forEach(k=>{

let b=document.createElement("button");

b.className="pn-style-btn";

b.textContent=font.styles[k].label;

if(k===styleKey)
b.classList.add("active");


b.onclick=()=>{

styleKey=k;

styleBox.querySelectorAll("button")
.forEach(x=>x.classList.remove("active"));

b.classList.add("active");

loadFont();

};

styleBox.appendChild(b);

});




async function loadFont(){


let style=font.styles[styleKey];


let url =
FONTBASE+
font.id+
"/"+
font.id+
"-"+
style.file+
".bin";


let buffer =
await fetch(url).then(r=>r.arrayBuffer());


let face =
new FontFace(
"pn-active",
buffer
);


await face.load();


document.fonts.add(face);


draw();


}




function draw(){


let ratio=devicePixelRatio||1;


canvas.width=
canvas.offsetWidth*ratio;


canvas.height=
350*ratio;


ctx.scale(ratio,ratio);


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



let dark =
document.documentElement
.classList.contains("spark-dark");


ctx.fillStyle =
dark ? "#fff" : "#000";


ctx.font =
`${size}px pn-active`;



let y=size;


text.split("\n").forEach(line=>{


let x=0;


for(let c of line){

ctx.fillText(c,x,y);

x += ctx.measureText(c).width + Number(tracking);

}


y += size*leading;


});


}



textarea.value=text;


canvas.onclick=()=>{

textarea.focus();

};


textarea.oninput=()=>{

text=textarea.value;

draw();

};




el.querySelectorAll("input").forEach(i=>{


i.oninput=()=>{


if(i.dataset.control==="size")
size=i.value;


if(i.dataset.control==="leading")
leading=i.value;


if(i.dataset.control==="tracking")
tracking=i.value;


draw();


};


});



window.addEventListener(
"resize",
draw
);


loadFont();



}




document
.querySelectorAll(".pn-font-tester")
.forEach(initTester);



})();