/* =========================================================
   frames/f4.js
   F4 アルカナ・ファンタジーフレーム
   完全オリジナル骨格 / 専用機能領域
========================================================= */
(function registerF4Frame(){
 const overlap={top:5,right:5,bottom:5,left:5};
 const slots=[
  {id:"main-display",shortLabel:"メイン",label:"魔導メインディスプレイ",x:57,y:72,width:276,height:190,overlap:{...overlap}},
  {id:"reels",shortLabel:"リール",label:"ワイドリール左・中・右",x:69,y:278,width:252,height:82,overlap:{...overlap}},
  {id:"message",shortLabel:"メッセージ",label:"ルーンメッセージ表示枠",x:103,y:369,width:184,height:24,overlap:{...overlap}},
  {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:77,y:405,width:236,height:28,overlap:{...overlap}},
  {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:62,y:443,width:266,height:43,overlap:{...overlap}},
  {id:"lower-panel",shortLabel:"下パネル",label:"紋章下パネル",x:91,y:500,width:208,height:82,overlap:{...overlap}}
 ];
 function getOpening(s){return{x:s.x+5,y:s.y+5,width:s.width-10,height:s.height-10};}
 function rect(r){return`M ${r.x} ${r.y} H ${r.x+r.width} V ${r.y+r.height} H ${r.x} Z`;}
 function ring(s,i){const o=getOpening(s),r={x:s.x+i,y:s.y+i,width:s.width-i*2,height:s.height-i*2};return`${rect(r)} ${rect(o)}`;}
 function buildSvg(){
  const cuts=slots.map(s=>{const o=getOpening(s);return`<rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="${s.id==='main-display'?12:3}" fill="#000"/>`;}).join('');
  const bezels=slots.map(s=>`<path d="${ring(s,0)}" fill="url(#f4AncientGold)" fill-rule="evenodd" opacity=".96"/>`).join('');
  return`<svg class="frame-shell f4-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true">
  <defs>
   <linearGradient id="f4Stone" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171124"/><stop offset=".25" stop-color="#40344d"/><stop offset=".48" stop-color="#16101f"/><stop offset=".75" stop-color="#51445a"/><stop offset="1" stop-color="#0c0812"/></linearGradient>
   <linearGradient id="f4AncientGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#604817"/><stop offset=".2" stop-color="#e0bd62"/><stop offset=".4" stop-color="#72541d"/><stop offset=".62" stop-color="#f0d783"/><stop offset=".82" stop-color="#80601f"/><stop offset="1" stop-color="#3b2a0d"/></linearGradient>
   <radialGradient id="f4Crystal"><stop stop-color="#f0e7ff"/><stop offset=".18" stop-color="#b79cff"/><stop offset=".55" stop-color="#7049d8"/><stop offset="1" stop-color="#241052"/></radialGradient>
   <linearGradient id="f4Mana" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e9dcff"/><stop offset=".3" stop-color="#8e68ff"/><stop offset="1" stop-color="#432092"/></linearGradient>
   <filter id="f4Glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <mask id="f4Cuts"><rect width="390" height="600" fill="#fff"/>${cuts}</mask>
  </defs>
  <!-- 左右非直線の古代遺跡シェル -->
  <path d="M 36 8 Q 13 35 24 76 L 8 132 L 27 188 L 15 246 L 34 305 L 18 365 L 36 426 L 19 489 L 48 596 H 342 L 371 489 L 354 426 L 372 365 L 356 305 L 375 246 L 363 188 L 382 132 L 366 76 Q 377 35 354 8 Z" fill="url(#f4Stone)" mask="url(#f4Cuts)"/>
  <!-- 尖塔状の左右支柱 -->
  <path d="M 35 18 L 67 61 L 55 126 L 70 183 L 55 246 L 73 304 L 57 365 L 76 425 L 59 489 L 82 579 L 43 596 L 19 489 L 36 426 L 18 365 L 34 305 L 15 246 L 27 188 L 8 132 L 24 76 Z" fill="url(#f4AncientGold)" opacity=".72"/>
  <path d="M 355 18 L 323 61 L 335 126 L 320 183 L 335 246 L 317 304 L 333 365 L 314 425 L 331 489 L 308 579 L 347 596 L 371 489 L 354 426 L 372 365 L 356 305 L 375 246 L 363 188 L 382 132 L 366 76 Z" fill="url(#f4AncientGold)" opacity=".72"/>
  <!-- 蔦のような魔力ライン -->
  <path d="M 44 70 Q 72 108 43 150 T 48 238 T 46 330 T 53 420 T 51 518" fill="none" stroke="url(#f4Mana)" stroke-width="5" class="f4-magic" filter="url(#f4Glow)"/>
  <path d="M 346 70 Q 318 108 347 150 T 342 238 T 344 330 T 337 420 T 339 518" fill="none" stroke="url(#f4Mana)" stroke-width="5" class="f4-magic" filter="url(#f4Glow)"/>
  <!-- 上部尖塔・大魔晶石 -->
  <path d="M 89 68 L 124 18 L 157 55 L 195 4 L 233 55 L 266 18 L 301 68 L 272 80 H 118 Z" fill="url(#f4AncientGold)" stroke="#e7cf88" stroke-width="2"/>
  <polygon points="195,12 218,43 195,68 172,43" fill="url(#f4Crystal)" class="f4-magic" filter="url(#f4Glow)"/>
  <circle cx="195" cy="43" r="31" fill="none" stroke="#a887ff" stroke-width="1.5" class="f4-rune"/>
  <path d="M 195 16 L 207 35 L 229 39 L 211 53 L 214 75 L 195 63 L 176 75 L 179 53 L 161 39 L 183 35 Z" fill="none" stroke="#d8c8ff" stroke-width="1" class="f4-rune"/>
  <!-- アーチ状メイン画面冠 -->
  <path d="M 57 94 Q 195 35 333 94 L 323 116 Q 195 66 67 116 Z" fill="url(#f4AncientGold)"/>
  <path d="M 75 99 Q 195 55 315 99" fill="none" stroke="#9e7cff" stroke-width="3" class="f4-magic" filter="url(#f4Glow)"/>
  <!-- 石柱の節・ルーン -->
  <g fill="url(#f4Crystal)" class="f4-rune" filter="url(#f4Glow)"><polygon points="42,170 53,181 42,192 31,181"/><polygon points="348,170 359,181 348,192 337,181"/><polygon points="45,292 56,303 45,314 34,303"/><polygon points="345,292 356,303 345,314 334,303"/><polygon points="48,414 59,425 48,436 37,425"/><polygon points="342,414 353,425 342,436 331,425"/></g>
  <!-- 下部は祭壇のように中央へ絞る -->
  <path d="M 57 488 L 91 496 L 76 590 L 145 576 L 195 598 L 245 576 L 314 590 L 299 496 L 333 488 L 347 596 H 43 Z" fill="url(#f4AncientGold)" opacity=".85"/>
  <polygon points="195,548 218,570 195,594 172,570" fill="url(#f4Crystal)" class="f4-magic" filter="url(#f4Glow)"/>
  ${bezels}
  <path d="M 37 8 Q 14 36 25 76 L 10 132 L 29 188 L 17 246 L 36 305 L 20 365 L 38 426 L 21 489 L 49 595 H 341 L 369 489 L 352 426 L 370 365 L 354 305 L 373 246 L 361 188 L 380 132 L 365 76 Q 376 36 353 8" fill="none" stroke="#d4b96e" stroke-width="3"/>
  </svg>`;
 }
 FRAME_REGISTRY.f4={id:"f4",code:"F4",name:"アルカナ・ファンタジーフレーム",description:"古代魔法遺跡と聖堂を融合した完全オリジナル骨格。尖塔、アーチ、古金属、魔晶石、蔦状の魔力ラインを持ち、機能領域もF4専用比率へ再設計したファンタジーフレーム。",slots,getOpening,buildSvg};
})();
