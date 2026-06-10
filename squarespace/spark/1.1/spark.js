/*
=================================
PixelNorm SPARK
Version 1.0
Theme Controller
=================================
*/

/* =========================
SPARK PAGE LOADER
========================= */

(function(){

let loader=document.createElement("div");

loader.className="spark-loader";

loader.innerHTML=`
<div class="spark-loader-title">
${document.title.split("|")[0]}
</div>
`;

document.documentElement.appendChild(loader);


window.addEventListener("load",function(){

setTimeout(function(){

document.documentElement.classList.add("spark-loaded");

},500);

});


})();

/*Global Scripts*/

document.addEventListener("DOMContentLoaded", function(){


const savedTheme = localStorage.getItem("spark-theme");


if(savedTheme === "dark"){
 document.documentElement.classList.add("spark-dark");
}


/* create toggle */

const btn=document.createElement("button");

btn.className="spark-theme-toggle";

btn.innerHTML =
document.documentElement.classList.contains("spark-dark")
? "☀︎"
: "◐";



/* desktop placement */

let desktopTarget =
document.querySelector(".header-actions");


if(desktopTarget){
 desktopTarget.prepend(btn);
}


/* mobile placement */

let mobileTarget =
document.querySelector(".header-menu-actions");


if(mobileTarget){

 let mobileBtn = btn.cloneNode(true);

 mobileTarget.prepend(mobileBtn);

 mobileBtn.onclick=function(){
  toggleSparkTheme();
 };

}


/* click */

btn.onclick=function(){

 toggleSparkTheme();

};



function toggleSparkTheme(){

 document.documentElement.classList.toggle("spark-dark");


 let dark =
 document.documentElement.classList.contains("spark-dark");


 localStorage.setItem(
 "spark-theme",
 dark ? "dark" : "light"
 );


 document.querySelectorAll(".spark-theme-toggle")
 .forEach(function(item){

 item.innerHTML = dark ? "☀︎" : "◐";

 });

}


});
