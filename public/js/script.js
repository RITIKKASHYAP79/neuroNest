
let darkButton = document.getElementById("dark");
let lightButton = document.getElementById("light");
let footer = document.getElementById("foot");


darkButton.addEventListener("click",()=>{
    document.body.style.background="linear-gradient(130deg, #30cfd0 0%, #330867 100%)";
    footer.style.background = "linear-gradient(to left, #09203f 0%, #537895 100%)";
    document.body.style.color="white";
    darkButton.style.display="none";
    lightButton.style.display="inline";
})

lightButton.addEventListener("click",()=>{
    document.body.style.background="linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)";
    footer.style.background = "linear-gradient(to left, #a8edea 0%, #fed6e3 100%)";
    document.body.style.color="var(--color)";
    lightButton.style.display="none";
    darkButton.style.display="inline";
})


let navbar = document.getElementById("menu");
let logo = document.getElementById("logo");
let menu = document.getElementById("menu-right");
let menuLogo = document.getElementById("menu-logo");
let crossLogo  = document.getElementById("cross-logo");

menuLogo.addEventListener("click",()=>{
    navbar.style.height="18rem";
    navbar.style.flexDirection="column";
    navbar.style.justifyContent="center";
    navbar.style.alignItems="center";
    logo.style.width="7rem";
    menu.style.flexDirection="column";
    menu.style.display="flex";
    menuLogo.style.display="none";
    crossLogo.style.display="inline";

})

crossLogo.addEventListener("click",()=>{
    navbar.style.height="4rem";
    navbar.style.flexDirection="row";
    menu.style.display="none";
    logo.style.width="21%";
    crossLogo.style.display="none";
    menuLogo.style.display="flex";
})



let button = document.getElementsByClassName("btn");

button[0].addEventListener("click",()=>{
    window.location.href="/auth";
})

button[1].addEventListener("click",()=>{
    window.location.href="/auth";
})


