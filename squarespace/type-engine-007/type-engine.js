(function(){


const ROOT =
"https://cdn.jsdelivr.net/gh/pixelnorm/pixelnorm-cdn@main/";

const ENGINE =
ROOT+"squarespace/type-engine-007/";

const FONTS =
ROOT+"assets/f/p/";



async function start(box){


const key = box.dataset.font;


const json =
await fetch(ENGINE+"fonts.json")
.then(r=>r.json());


const data=json[key];


let styles=data.styles;

let current=Object.keys(styles)[0];


let size=120;
let leading=1.2;
let tracking=0;


let text =
"The quick brown fox\njumps over the lazy dog.";



box.innerHTML=`

<div class="pn-head">
<span>FONT TESTER</span>
<span>${data.name}</span>
</div>


<div class="pn-controls">


<div class="pn-control">
<label>SIZE <span>${size}px</span></label>
<input data-c="size" type="range" min="30" max="250" value="${size}">
</div>


<div class="pn-control">
<label>LEADING <span>${leading}</span></label>
<input data-c="leading" type="range" min=".8" max="2" step=".05" value="${leading}">
</div>


<div class="pn-control">
<label>TRACKING <span>${tracking}</span></label>
<input data-c="tracking" type="range" min="-20" max="100" value="${tracking}">
</div>


</div>


<div class="pn-styles"></div>


<canvas class="pn-canvas"></canvas>


<textarea class="pn-input"></textarea>

`;



const canvas =
box.querySelector("canvas");


const ctx =
canvas.getContext("2d");


const input =
box.querySelector("textarea");


const styleBox =
box.querySelector(".pn-styles");



Object.keys(styles).forEach(s=>{


let b =
document.createElement("button");


b.innerText =
styles[s].label;


if(s===current)
b.classList.add("active");


b.onclick=()=>{


current=s;


styleBox
.querySelectorAll("button")
.forEach(x=>x.classList.remove("active"));


b.classList.add("active");


load();


};


styleBox.appendChild(b);


});




async function load(){


let file =
styles[current].file;



let url =
FONTS+
data.id+
"/"+
data.id+
"-"+
file+
".bin";



let buffer =
await fetch(url)
.then(r=>r.arrayBuffer());



let font =
new FontFace(
"pn-preview",
buffer
);



await font.load();


document.fonts.add(font);


draw();


}





function draw(){


let ratio =
window.devicePixelRatio || 1;



canvas.width =
canvas.clientWidth * ratio;


canvas.height =
400 * ratio;



ctx.setTransform(
ratio,0,0,ratio,0,0
);



ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



let dark =
document.documentElement
.classList
.contains("spark-dark");



ctx.fillStyle =
dark ? "#fff" : "#000";



ctx.font =
size+"px pn-preview";



let y=size;



text.split("\n")
.forEach(line=>{


let x=0;


[...line]
.forEach(ch=>{


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





canvas.onclick=()=>{

input.focus();

};



input.value=text;



input.oninput=()=>{


text=input.value;


draw();


};





box.querySelectorAll("input")
.forEach(i=>{


i.oninput=()=>{


if(i.dataset.c==="size")
size=i.value;


if(i.dataset.c==="leading")
leading=i.value;


if(i.dataset.c==="tracking")
tracking=i.value;


draw();


};


});



window.addEventListener(
"resize",
draw
);



load();



}





document
.querySelectorAll(".pn-font-tester")
.forEach(start);



})();