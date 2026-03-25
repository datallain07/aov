const style=document.createElement("style");
style.innerHTML=`
.menu-item{position:relative;z-index:1;overflow:visible;cursor:pointer}
.menu-item::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:var(--rgb-border,transparent);padding:2px;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;-webkit-mask-composite:destination-out;z-index:1;pointer-events:none;opacity:var(--rgb-alpha-border,0);transition:opacity 0.3s ease}
.menu-item::after{content:"";position:absolute;inset:-6px;border-radius:inherit;background:var(--rgb-border,transparent);filter:blur(12px);opacity:calc(var(--rgb-alpha-inner,0)*0.6);z-index:-1;pointer-events:none;transition:opacity 0.3s ease}
.menu-item.selected{outline:2px solid #ffffff44}`;
document.head.appendChild(style);


function mixColor(c1,c2,t){
  const a=parseInt(c1.slice(1),16),b=parseInt(c2.slice(1),16);
  const r=((a>>16)+(((b>>16)-(a>>16))*t))|0;
  const g=(((a>>8)&255)+((((b>>8)&255)-((a>>8)&255))*t))|0;
  const b2=((a&255)+(((b&255)-(a&255))*t))|0;
  return `rgb(${r},${g},${b2})`;
}

function startRGBGlow(item,innerGlow){
  let t=0,running=true,rafId;
  item.style.setProperty('--rgb-alpha-border',1);
  item.style.setProperty('--rgb-alpha-inner',innerGlow?1:0);
const palette = [];

const step = 51;
const min = 102;

for (let r = min; r <= 255; r += step) {
  for (let g = min; g <= 255; g += step) {
    for (let b = min; b <= 255; b += step) {
      const max = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      if (max - minVal >= 102) {
        palette.push(
          "#" +
          r.toString(16).padStart(2, "0") +
          g.toString(16).padStart(2, "0") +
          b.toString(16).padStart(2, "0")
        );
      }
    }
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(palette);

let index = 0;

function getRandomColor() {
  if (index >= palette.length) {
    shuffle(palette);
    index = 0;
  }
  return palette[index++];
}

function initColor() {
  const color = getRandomColor();
  document.body.style.background = color;
  return color;
}

  function anim(){
    if(!running) return;
    t+=0.01;
    const i=Math.floor(t%palette.length),f=t%1;
    const c1=mixColor(palette[i],palette[(i+1)%palette.length],f),
          c2=mixColor(palette[(i+1)%palette.length],palette[(i+2)%palette.length],f),
          c3=mixColor(palette[(i+2)%palette.length],palette[(i+3)%palette.length],f);
    item.style.setProperty('--rgb-border',`conic-gradient(from 0deg, ${c1} 0%, ${c2} 33%, ${c3} 66%, ${c1} 100%)`);
    rafId=requestAnimationFrame(anim);
  }
  rafId=requestAnimationFrame(anim);
  return ()=>{running=false;cancelAnimationFrame(rafId);item.style.setProperty('--rgb-border','transparent');item.style.setProperty('--rgb-alpha-border',0);item.style.setProperty('--rgb-alpha-inner',0);}
}


const items=document.querySelectorAll('.menu-item'),
      rgbRange=document.getElementById("rgbGlowRange");
let stopGlow = null,
  level = localStorage.getItem("rgbGlowLevel") !== null ?
  parseInt(localStorage.getItem("rgbGlowLevel")) :
  1,
  activeItem = null;
rgbRange.value=level;


function applyLevel(item,lvl){
  if(stopGlow) stopGlow();
  if(item){
    item.style.setProperty('--rgb-border','transparent');
    item.style.setProperty('--rgb-alpha-border',0);
    item.style.setProperty('--rgb-alpha-inner',0);

    if(lvl===1){
      stopGlow=startRGBGlow(item,false);
    } else if(lvl===2){
      stopGlow=startRGBGlow(item,true);
    } else if(lvl===3){
      items.forEach(it=>startRGBGlow(it,true));
    }
  } else if(lvl===3){
    items.forEach(it=>startRGBGlow(it,true));
  }
}


items.forEach((item)=>{
  item.addEventListener('click',()=>{
    if(level!==3){
      items.forEach(i=>{
        i.style.setProperty('--rgb-border','transparent');
        i.style.setProperty('--rgb-alpha-border',0);
        i.style.setProperty('--rgb-alpha-inner',0);
      });
      activeItem=item;
      applyLevel(item,level);
    }
  });
});

rgbRange.addEventListener("input",()=>{
  level=parseInt(rgbRange.value);
  localStorage.setItem("rgbGlowLevel",level);
  if(level===3){
    applyLevel(null,3);
    activeItem=null;
  } else if(activeItem){
    applyLevel(activeItem,level);
  }
});