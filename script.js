const $ = (s) => document.querySelector(s);
const screens = [...document.querySelectorAll(".screen")];
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W, H, particles = [], fireworks = [], running = true;

function resize(){
  W = canvas.width = innerWidth * devicePixelRatio;
  H = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener("resize",resize); resize();

function show(id){
  screens.forEach(s=>s.classList.toggle("active",s.id===id));
}
function rand(a,b){return Math.random()*(b-a)+a}
function burst(x,y,count=110,colors=["#ff63d8","#8e67ff","#62e9ff","#ffd866","#ffffff"]){
  for(let i=0;i<count;i++){
    const a=rand(0,Math.PI*2), speed=rand(2,10);
    particles.push({
      x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-rand(1,4),
      g:.16,life:rand(55,110),size:rand(2,5),
      color:colors[(Math.random()*colors.length)|0],rot:rand(0,6.28),vr:rand(-.15,.15),
      shape:Math.random()>.45?"rect":"dot"
    });
  }
}
function firework(x=rand(60,innerWidth-60),y=rand(60,innerHeight*.65)){
  const colors=["#ff6bdc","#9b72ff","#63e9ff","#ffd86b"];
  for(let i=0;i<80;i++){
    const a=Math.PI*2*i/80+rand(-.05,.05), s=rand(2,7);
    fireworks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:70,color:colors[(Math.random()*colors.length)|0]});
  }
}
function animate(){
  if(!running)return;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.vy*=.99;p.rot+=p.vr;p.life--;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=Math.max(0,p.life/100);
    ctx.fillStyle=p.color;
    if(p.shape==="rect")ctx.fillRect(-p.size,-p.size/2,p.size*2,p.size);
    else{ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  });
  particles=particles.filter(p=>p.life>0);
  fireworks.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.055;p.vx*=.985;p.vy*=.985;p.life--;
    ctx.globalAlpha=Math.max(0,p.life/70);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,2,0,7);ctx.fill();
  });
  fireworks=fireworks.filter(p=>p.life>0);ctx.globalAlpha=1;
  requestAnimationFrame(animate);
}
animate();

function explosion(){
  document.body.classList.add("shake","flash");
  setTimeout(()=>document.body.classList.remove("shake","flash"),700);
  burst(innerWidth/2,innerHeight*.54,260);
  setTimeout(()=>burst(rand(20,innerWidth-20),rand(80,innerHeight*.65),100),220);
  setTimeout(()=>burst(rand(20,innerWidth-20),rand(80,innerHeight*.65),100),450);
  setTimeout(()=>show("envelopeScreen"),850);
}
function typeLetter(){
  const text=`Selamat ulang tahun. Hari ini bukan cuma tentang bertambahnya usia, tapi tentang semua perjalanan yang sudah kamu lewati sampai bisa berada di titik ini.

Semoga di tahun yang baru ini, kamu menemukan lebih banyak alasan untuk tersenyum. Semoga hal-hal yang selama ini kamu doakan perlahan menemukan jalannya, dan ketika hari terasa berat, semoga selalu ada seseorang yang mengingatkanmu bahwa kamu tidak sendirian.

Terima kasih karena sudah menjadi dirimu sendiri. Jangan pernah merasa bahwa keberadaanmu tidak berarti. Ada begitu banyak hal baik yang masih menunggumu di depan sana.

Jadi hari ini, nikmati harimu. Tersenyumlah. Kamu pantas mendapatkan banyak hal baik. ♡`;
  const el=$("#letterText");el.textContent="";
  let i=0;
  const tick=()=>{if(i<text.length){el.textContent+=text[i++];setTimeout(tick,text[i-1]==="\n"?180:18)}};
  tick();
}

$("#cake").addEventListener("click",()=>{
  if($("#intro").classList.contains("active")){
    burst(innerWidth/2,innerHeight*.62,80);
    setTimeout(explosion,280);
  }
});
$("#cake").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$("#cake").click()}});

$("#openBtn").addEventListener("click",()=>{
  burst(innerWidth/2,innerHeight*.45,130);
  $("#envelope").animate(
    [{transform:"scale(1) rotate(0)"},{transform:"scale(1.12) rotate(-2deg)"},{transform:"scale(.05) rotate(12deg)",opacity:0}],
    {duration:900,easing:"cubic-bezier(.22,1,.36,1)"}
  );
  setTimeout(()=>{show("letterScreen");typeLetter()},760);
});
$("#finishBtn").addEventListener("click",()=>{
  show("finalScreen");
  for(let i=0;i<5;i++)setTimeout(()=>firework(rand(70,innerWidth-70),rand(70,innerHeight*.58)),i*420);
  for(let i=0;i<4;i++)setTimeout(()=>burst(rand(30,innerWidth-30),rand(70,innerHeight*.7),80),i*520);
});
$("#replayBtn").addEventListener("click",()=>{
  $("#envelope").style.opacity="1";
  $("#envelope").style.transform="";
  show("intro");
});

setInterval(()=>{
  if($("#finalScreen").classList.contains("active") && Math.random()<.65) firework();
},1100);

document.addEventListener("pointerdown",e=>{
  if(e.target.closest("button")||e.target.closest("#cake"))return;
  if($("#intro").classList.contains("active")) burst(e.clientX,e.clientY,18,["#ffffff","#a979ff","#ff7de2"]);
});
                                    
