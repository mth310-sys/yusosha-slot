/* F5 ダーク・アルカナ アーマーフレーム 第2稿 */
(function registerF5Frame(){
 const overlap={top:5,right:5,bottom:5,left:5};
 const slots=[
  {id:"main-display",shortLabel:"メイン",label:"大型魔導液晶",x:47,y:78,width:296,height:170,overlap:{...overlap}},
  {id:"message",shortLabel:"メッセージ",label:"魔導情報帯",x:53,y:257,width:284,height:37,overlap:{...overlap}},
  {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:76,y:307,width:238,height:90,overlap:{...overlap}},
  {id:"bet-info",shortLabel:"BET列",label:"START・MAX BET・情報表示",x:51,y:404,width:288,height:32,overlap:{...overlap}},
  {id:"start-stop",shortLabel:"START列",label:"STOP左・中・右・操作部",x:66,y:443,width:258,height:45,overlap:{...overlap}},
  {id:"lower-panel",shortLabel:"下パネル",label:"七紋章ビジュアルパネル",x:47,y:501,width:296,height:84,overlap:{...overlap}}
 ];
 function getOpening(s){return{x:s.x+5,y:s.y+5,width:s.width-10,height:s.height-10};}
 function rect(r){return`M ${r.x} ${r.y} H ${r.x+r.width} V ${r.y+r.height} H ${r.x} Z`;}
 function ring(s,i){const o=getOpening(s),r={x:s.x+i,y:s.y+i,width:s.width-i*2,height:s.height-i*2};return`${rect(r)} ${rect(o)}`;}
 function buildSvg(){
  const cuts=slots.map(s=>{const o=getOpening(s);return`<rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="${s.id==='main-display'?5:2}" fill="#000"/>`;}).join('');
  const bezels=slots.map(s=>`<path d="${ring(s,0)}" fill="url(#f5BlackChrome)" fill-rule="evenodd"/><path d="${ring(s,2)}" fill="#5a1777" fill-rule="evenodd" opacity=".78"/>`).join('');
  return`<svg class="frame-shell f5-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true">
  <defs>
   <linearGradient id="f5Armor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#010102"/><stop offset=".12" stop-color="#25162e"/><stop offset=".28" stop-color="#050406"/><stop offset=".45" stop-color="#3b2247"/><stop offset=".62" stop-color="#09060c"/><stop offset=".8" stop-color="#221128"/><stop offset="1" stop-color="#4e2a58"/></linearGradient>
   <linearGradient id="f5BlackChrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050406"/><stop offset=".12" stop-color="#8f7a96"/><stop offset=".25" stop-color="#1a141d"/><stop offset=".38" stop-color="#c0a8c4"/><stop offset=".54" stop-color="#09060a"/><stop offset=".68" stop-color="#5e4165"/><stop offset=".84" stop-color="#b89ac0"/><stop offset="1" stop-color="#050406"/></linearGradient>
   <radialGradient id="f5Purple"><stop stop-color="#f8e8ff"/><stop offset=".18" stop-color="#d96bff"/><stop offset=".52" stop-color="#861fd1"/><stop offset="1" stop-color="#230034"/></radialGradient>
   <filter id="f5Glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <mask id="f5Cuts"><rect width="390" height="600" fill="#fff"/>${cuts}</mask>
  </defs>

  <path d="M 18 4 H 372 L 389 30 V 575 L 370 599 H 20 L 1 575 V 30 Z" fill="url(#f5Armor)" mask="url(#f5Cuts)"/>

  <!-- 厚い上部冠：円形ユニットとロゴ台座を一体化 -->
  <path d="M 29 8 H 361 L 382 31 L 367 68 L 335 78 H 55 L 23 68 L 8 31 Z" fill="url(#f5BlackChrome)" stroke="#6d2b85" stroke-width="2.5"/>
  <path d="M 86 9 Q 126 2 155 23 L 176 12 L 195 30 L 214 12 L 235 23 Q 264 2 304 9 L 323 38 L 305 66 H 85 L 67 38 Z" fill="#09060b" stroke="#4c1b61" stroke-width="2"/>
  <circle cx="47" cy="45" r="35" fill="#070509" stroke="#6f268d" stroke-width="6"/><circle cx="47" cy="45" r="23" fill="#140d18" stroke="#b05bdd" stroke-width="2"/>
  <circle cx="343" cy="45" r="35" fill="#070509" stroke="#6f268d" stroke-width="6"/><circle cx="343" cy="45" r="23" fill="#140d18" stroke="#b05bdd" stroke-width="2"/>
  <polygon points="195,3 211,22 195,42 179,22" fill="url(#f5Purple)" class="f5-crystal" filter="url(#f5Glow)"/>

  <!-- 二重構造の左右サイド装甲 -->
  <path d="M 8 78 L 40 63 L 55 92 L 49 154 L 58 209 L 49 264 L 59 320 L 49 377 L 61 434 L 50 490 L 61 548 L 47 590 L 20 598 L 6 565 L 16 505 L 5 447 L 16 389 L 5 331 L 16 272 L 6 214 L 16 155 Z" fill="url(#f5BlackChrome)" stroke="#5d2473" stroke-width="2"/>
  <path d="M 382 78 L 350 63 L 335 92 L 341 154 L 332 209 L 341 264 L 331 320 L 341 377 L 329 434 L 340 490 L 329 548 L 343 590 L 370 598 L 384 565 L 374 505 L 385 447 L 374 389 L 385 331 L 374 272 L 384 214 L 374 155 Z" fill="url(#f5BlackChrome)" stroke="#5d2473" stroke-width="2"/>
  <path d="M 28 87 L 47 80 L 48 145 L 43 198 L 49 252 L 44 306 L 50 361 L 44 414 L 51 468 L 43 523 L 46 562" fill="none" stroke="#120a17" stroke-width="12"/>
  <path d="M 362 87 L 343 80 L 342 145 L 347 198 L 341 252 L 346 306 L 340 361 L 346 414 L 339 468 L 347 523 L 344 562" fill="none" stroke="#120a17" stroke-width="12"/>

  <!-- 紫の魔力管 -->
  <path d="M 33 89 L 40 111 L 34 151 L 42 207 L 34 262 L 43 318 L 34 375 L 44 431 L 35 488 L 41 548" fill="none" stroke="#b447ef" stroke-width="7" class="f5-mana" filter="url(#f5Glow)"/>
  <path d="M 357 89 L 350 111 L 356 151 L 348 207 L 356 262 L 347 318 L 356 375 L 346 431 L 355 488 L 349 548" fill="none" stroke="#b447ef" stroke-width="7" class="f5-mana" filter="url(#f5Glow)"/>

  <!-- リール周辺へ食い込む縦装甲 -->
  <path d="M 55 292 L 79 300 L 79 399 L 54 405 L 42 381 L 48 336 Z" fill="url(#f5Armor)" stroke="#6f2e88" stroke-width="2"/>
  <path d="M 335 292 L 311 300 L 311 399 L 336 405 L 348 381 L 342 336 Z" fill="url(#f5Armor)" stroke="#6f2e88" stroke-width="2"/>
  <polygon points="58,318 69,329 58,340 47,329" fill="url(#f5Purple)" class="f5-crystal" filter="url(#f5Glow)"/>
  <polygon points="332,318 321,329 332,340 343,329" fill="url(#f5Purple)" class="f5-crystal" filter="url(#f5Glow)"/>

  <!-- 羽根・蔓状彫刻 -->
  <g fill="none" stroke="#a37cab" stroke-width="2" opacity=".82"><path d="M 14 105 Q 50 124 17 153 Q 52 172 18 202 Q 53 220 18 252 M 17 351 Q 52 370 18 400 Q 53 418 19 448 Q 54 468 20 498"/><path d="M 376 105 Q 340 124 373 153 Q 338 172 372 202 Q 337 220 372 252 M 373 351 Q 338 370 372 400 Q 337 418 371 448 Q 336 468 370 498"/></g>

  <!-- 張り出した操作コンソール -->
  <path d="M 37 392 L 353 392 L 372 423 L 359 479 L 333 499 L 57 499 L 31 479 L 18 423 Z" fill="url(#f5Armor)" stroke="#7b3794" stroke-width="2.5"/>
  <path d="M 55 410 H 335 L 350 430 L 340 472 L 320 486 H 70 L 50 472 L 40 430 Z" fill="#08060a" stroke="#472055" stroke-width="1.5"/>
  <circle cx="48" cy="452" r="20" fill="#070508" stroke="#9661a8" stroke-width="3"/><circle cx="342" cy="452" r="20" fill="#070508" stroke="#9661a8" stroke-width="3"/>
  <circle cx="145" cy="466" r="17" fill="#2a0610" stroke="#ff4a65" stroke-width="3"/><circle cx="195" cy="466" r="17" fill="#2a0610" stroke="#ff4a65" stroke-width="3"/><circle cx="245" cy="466" r="17" fill="#2a0610" stroke="#ff4a65" stroke-width="3"/>

  <!-- 下パネルを挟む翼状装甲 -->
  <path d="M 20 500 L 55 487 L 71 513 L 64 583 L 101 575 L 82 598 H 22 L 6 575 Z" fill="url(#f5BlackChrome)"/>
  <path d="M 370 500 L 335 487 L 319 513 L 326 583 L 289 575 L 308 598 H 368 L 384 575 Z" fill="url(#f5BlackChrome)"/>
  <path d="M 78 585 L 146 575 L 195 598 L 244 575 L 312 585" fill="none" stroke="#5d2b73" stroke-width="5"/>
  <polygon points="195,562 212,580 195,599 178,580" fill="url(#f5Purple)" class="f5-crystal" filter="url(#f5Glow)"/>

  ${bezels}
  <path d="M 20 5 H 370 L 387 31 V 574 L 368 597 H 22 L 3 574 V 31 Z" fill="none" stroke="#8f3db4" stroke-width="2" opacity=".82"/>
  </svg>`;
 }
 FRAME_REGISTRY.f5={id:"f5",code:"F5",name:"ダーク・アルカナ アーマーフレーム",description:"艶黒の魔導装甲を多層化し、上部冠と円形ユニットを一体化。左右二重装甲、紫の魔力管、リールへ食い込む縦装甲、張り出した3STOPコンソール、翼状下部装甲を持つ高密度ダークファンタジーフレーム。",slots,getOpening,buildSvg};
})();
