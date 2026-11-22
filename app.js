const defaults = [
  {title:"Kenapa tidur penting?",body:"Saat tidur, tubuh menjalankan proses pemulihan. Tidur yang cukup membantu mendukung konsentrasi, suasana hati, dan kesehatan secara menyeluruh.",symbol:"☾"},
  {title:"Dampaknya bukan cuma rasa kantuk",body:"Kurang tidur dapat memengaruhi energi, nafsu makan, fokus, dan kemampuan tubuh mengelola stres. Efeknya bisa terasa sepanjang hari.",symbol:"✳"},
  {title:"Bangun rutinitas yang realistis",body:"Coba tidur dan bangun pada jam yang relatif sama. Kurangi kafein menjelang malam dan buat suasana kamar lebih nyaman.",symbol:"⌂"},
  {title:"Mulai dari satu kebiasaan kecil",body:"Redupkan lampu, jauhkan ponsel sebelum tidur, dan lakukan aktivitas menenangkan. Pilih kebiasaan yang paling mungkin kamu pertahankan.",symbol:"♡"},
  {title:"Tubuhmu layak mendapat istirahat",body:"Tidak perlu mengubah semuanya sekaligus. Mulai dengan langkah kecil dan konsisten. Simpan konten ini sebagai pengingat.",symbol:"✦"}
];
const $ = s => document.querySelector(s);
const topic = $("#topic"), introText = $("#introText"), fields = $("#fields"), canvas = $("#canvas"), thumbs = $("#thumbs");
let slides = defaults.map(x => ({...x})), active = 0;
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderFields(){
  fields.innerHTML = slides.map((s,i)=>'<div class="slide-field"><strong>SLIDE '+(i+2)+'</strong><label>Judul</label><input data-i="'+i+'" data-k="title" maxlength="70" value="'+esc(s.title)+'"><label>Isi edukasi</label><textarea data-i="'+i+'" data-k="body" maxlength="250">'+esc(s.body)+'</textarea></div>').join("");
}
function renderThumbs(){
  thumbs.innerHTML = Array.from({length:5},(_,i)=>'<button type="button" data-slide="'+i+'" class="'+(i===active?"active":"")+'">Slide '+(i+1)+'</button>').join("");
  thumbs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{active=Number(b.dataset.slide);render();}));
}
function render(){
  const n=String(active+1).padStart(2,"0");
  $("#count").textContent=n+" / 05";
  thumbs.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("active",i===active));
  const top='<div class="slide-top"><span>HEALTHY BALANCE LIFE</span><span>'+n+' / 05</span></div>';
  const bottom='<div class="slide-bottom"><span>EDUKASI • WELLNESS • 35+</span><span>COACH KHARINA</span></div>';
  if(active===0){
    canvas.innerHTML=top+'<div class="cover-body"><span class="tag">WELLNESS NOTES</span><h2>'+esc(topic.value||"Topik Carousel")+'</h2><p>'+esc(introText.value||"Tambahkan pengantar singkat.")+'</p><div class="art" aria-hidden="true"><span class="moon">☾</span><span class="spark">✳</span><span class="z">Z<span>z</span></span><div class="horizon"></div></div><span class="swipe">GESER UNTUK MEMBACA →</span></div>'+bottom;
  } else {
    const s=slides[active-1];
    canvas.innerHTML=top+'<div class="detail-body"><span class="index">INSIGHT 0'+active+'</span><h2>'+esc(s.title)+'</h2><p>'+esc(s.body)+'</p><div class="symbol" aria-hidden="true">'+esc(s.symbol)+'</div>'+(active===4?'<div class="callout">Simpan • Bagikan • Mulai dari langkah kecil hari ini.</div>':"")+'</div>'+bottom;
  }
}
fields.addEventListener("input",e=>{
  const t=e.target;if(!t.dataset.k)return;
  slides[Number(t.dataset.i)][t.dataset.k]=t.value;render();
});
topic.addEventListener("input",render);introText.addEventListener("input",render);
$("#prev").addEventListener("click",()=>{active=(active+4)%5;render();});
$("#next").addEventListener("click",()=>{active=(active+1)%5;render();});
$("#reset").addEventListener("click",()=>{
  topic.value="Tidur Berkualitas";
  introText.value="Tidur bukan sekadar waktu istirahat. Tubuh menggunakan waktu ini untuk memulihkan diri dan menjaga berbagai fungsi penting.";
  slides=defaults.map(x=>({...x}));active=0;renderFields();renderThumbs();render();
});
$("#download").addEventListener("click",async()=>{
  if(!window.htmlToImage){alert("Library ekspor tidak termuat. Periksa koneksi internet, lalu muat ulang.");return;}
  const btn=$("#download"),original=active;btn.disabled=true;btn.textContent="Menyiapkan...";
  try{
    for(let i=0;i<5;i++){
      active=i;render();
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const png=await htmlToImage.toPng(canvas,{pixelRatio:1080/canvas.offsetWidth,cacheBust:true});
      const a=document.createElement("a");a.download="healthy-balance-life-slide-"+String(i+1).padStart(2,"0")+".png";a.href=png;a.click();
      await new Promise(resolve=>setTimeout(resolve,250));
    }
  }catch(err){console.error(err);alert("Ekspor gagal. Coba lagi menggunakan browser desktop.");}
  finally{active=original;render();btn.disabled=false;btn.textContent="Unduh 5 slide PNG";}
});
renderFields();renderThumbs();render();
