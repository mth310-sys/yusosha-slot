/* =========================================================
   frames/f3.js
   F3 クローム・ゴールド ジュエルフレーム
   第2稿：実機比較後の造形調整
========================================================= */

(function registerF3Frame(){
    const overlap={top:5,right:5,bottom:5,left:5};
    const slots=[
        {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:64,y:58,width:262,height:165,overlap:{...overlap}},
        {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:78,y:238,width:234,height:92,overlap:{...overlap}},
        {id:"message",shortLabel:"メッセージ",label:"メッセージ表示枠",x:78,y:340,width:234,height:30,overlap:{...overlap}},
        {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:70,y:382,width:250,height:30,overlap:{...overlap}},
        {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:70,y:422,width:250,height:40,overlap:{...overlap}},
        {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:64,y:474,width:262,height:98,overlap:{...overlap}}
    ];
    function getOpening(s){return{x:s.x+5,y:s.y+5,width:s.width-10,height:s.height-10};}
    function rectanglePath(r){return`M ${r.x} ${r.y} H ${r.x+r.width} V ${r.y+r.height} H ${r.x} Z`;}
    function ringPath(s,i){const o=getOpening(s),r={x:s.x+i,y:s.y+i,width:s.width-i*2,height:s.height-i*2};return`${rectanglePath(r)} ${rectanglePath(o)}`;}

    function buildSvg(){
        const cutouts=slots.map(s=>{const o=getOpening(s);return`<rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="2" fill="#000"/>`;}).join("");
        const bezels=slots.map(s=>{const o=getOpening(s);return`<path d="${ringPath(s,0)}" fill="url(#f3Chrome)" fill-rule="evenodd"/><rect x="${o.x+.5}" y="${o.y+.5}" width="${o.width-1}" height="${o.height-1}" rx="1.5" fill="none" stroke="#111"/>`;}).join("");
        const jewels=[
          "17,69 45,50 62,66 57,119 27,131 10,107",
          "12,146 43,128 59,147 57,202 26,214 8,187",
          "9,226 41,209 58,229 57,284 24,297 6,268",
          "8,307 40,291 57,311 57,367 24,379 5,349",
          "9,389 41,373 58,394 57,450 26,462 6,432",
          "13,472 44,454 61,476 57,532 28,544 9,516"
        ];
        const jewelPolys=jewels.map((points,i)=>{
            const mirror=points.split(" ").map(pair=>{const p=pair.split(",");return`${390-Number(p[0])},${p[1]}`;}).join(" ");
            return`<polygon points="${points}" fill="url(#f3Gold)" stroke="#fff0a0" stroke-width="1" class="f3-jewel${i%2?' f3-jewel-delay':''}" filter="url(#f3Glow)"/><polygon points="${mirror}" fill="url(#f3Gold)" stroke="#fff0a0" stroke-width="1" class="f3-jewel${i%2?'':' f3-jewel-delay'}" filter="url(#f3Glow)"/>`;
        }).join("");
        return`<svg class="frame-shell f3-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="f3Black" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#020202"/><stop offset=".48" stop-color="#1b1b1b"/><stop offset="1" stop-color="#030303"/></linearGradient>
          <linearGradient id="f3Chrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#222"/><stop offset=".09" stop-color="#fefefe"/><stop offset=".19" stop-color="#696969"/><stop offset=".3" stop-color="#fff"/><stop offset=".43" stop-color="#333"/><stop offset=".56" stop-color="#f5f5f5"/><stop offset=".7" stop-color="#555"/><stop offset=".84" stop-color="#fff"/><stop offset="1" stop-color="#292929"/></linearGradient>
          <linearGradient id="f3Gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff8b0"/><stop offset=".16" stop-color="#ffd522"/><stop offset=".35" stop-color="#9f5900"/><stop offset=".52" stop-color="#fff36b"/><stop offset=".7" stop-color="#c57400"/><stop offset=".86" stop-color="#ffe23c"/><stop offset="1" stop-color="#8d4a00"/></linearGradient>
          <filter id="f3Glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <mask id="f3Cutouts"><rect width="390" height="600" fill="#fff"/>${cutouts}</mask>
        </defs>

        <path d="M 16 3 H 374 L 390 30 V 570 L 369 599 H 21 L 0 570 V 30 Z" fill="url(#f3Black)" mask="url(#f3Cutouts)"/>

        <!-- 実機に寄せた太く直線的な左右装飾柱 -->
        <path d="M 1 31 L 38 7 L 66 28 L 61 570 L 38 596 L 2 573 Z" fill="url(#f3Chrome)"/>
        <path d="M 389 31 L 352 7 L 324 28 L 329 570 L 352 596 L 388 573 Z" fill="url(#f3Chrome)"/>
        <path d="M 7 39 L 28 20 L 57 35 L 53 558 L 34 581 L 8 563 Z" fill="#111" opacity=".72"/>
        <path d="M 383 39 L 362 20 L 333 35 L 337 558 L 356 581 L 382 563 Z" fill="#111" opacity=".72"/>

        ${jewelPolys}

        <!-- 各ジュエル間を挟む彫刻的クロームフィン -->
        <g fill="url(#f3Chrome)" stroke="#2c2c2c" stroke-width="1.2">
          <path d="M 4 42 L 54 15 L 43 46 L 10 66 Z M 5 127 L 60 102 L 48 139 L 8 158 Z M 5 210 L 58 185 L 47 221 L 7 241 Z M 4 291 L 58 269 L 46 302 L 6 321 Z M 4 373 L 58 350 L 47 384 L 7 403 Z M 5 455 L 59 432 L 48 466 L 8 486 Z M 6 540 L 59 514 L 55 550 L 13 570 Z"/>
          <path d="M 386 42 L 336 15 L 347 46 L 380 66 Z M 385 127 L 330 102 L 342 139 L 382 158 Z M 385 210 L 332 185 L 343 221 L 383 241 Z M 386 291 L 332 269 L 344 302 L 384 321 Z M 386 373 L 332 350 L 343 384 L 383 403 Z M 385 455 L 331 432 L 342 466 L 382 486 Z M 384 540 L 331 514 L 335 550 L 377 570 Z"/>
        </g>
        <g fill="none" stroke="#fff" stroke-width="1" opacity=".75"><path d="M 9 55 L 48 29 M 8 140 L 50 117 M 8 223 L 49 201 M 8 305 L 49 284 M 8 387 L 49 366 M 8 469 L 50 448 M 10 552 L 50 532"/><path d="M 381 55 L 342 29 M 382 140 L 340 117 M 382 223 L 341 201 M 382 305 L 341 284 M 382 387 L 341 366 M 382 469 L 340 448 M 380 552 L 340 532"/></g>

        <!-- 上辺：左右大型ゴールドユニット＋中央放射フィン -->
        <polygon points="58,7 142,7 155,34 66,48" fill="url(#f3Gold)" class="f3-jewel" filter="url(#f3Glow)"/>
        <polygon points="332,7 248,7 235,34 324,48" fill="url(#f3Gold)" class="f3-jewel f3-jewel-delay" filter="url(#f3Glow)"/>
        <g fill="url(#f3Chrome)" stroke="#343434"><path d="M 143 39 L 157 5 L 174 38 Z"/><path d="M 158 39 L 176 2 L 187 39 Z"/><path d="M 174 39 L 195 0 L 216 39 Z"/><path d="M 203 39 L 214 2 L 232 39 Z"/><path d="M 216 39 L 233 5 L 247 39 Z"/></g>

        <!-- 下辺：左右・中央の大型黄金ユニットと収束フィン -->
        <polygon points="47,572 123,551 151,580 130,598 55,594" fill="url(#f3Gold)" class="f3-jewel f3-jewel-delay" filter="url(#f3Glow)"/>
        <polygon points="343,572 267,551 239,580 260,598 335,594" fill="url(#f3Gold)" class="f3-jewel" filter="url(#f3Glow)"/>
        <polygon points="153,577 174,555 216,555 237,577 220,598 170,598" fill="url(#f3Gold)" class="f3-jewel" filter="url(#f3Glow)"/>
        <g fill="url(#f3Chrome)" stroke="#343434"><path d="M 115 588 L 154 558 L 168 594 Z"/><path d="M 275 588 L 236 558 L 222 594 Z"/></g>

        ${bezels}
        <path d="M 18 3 H 372 L 388 31 V 570 L 366 597 H 24 L 2 570 V 31 Z" fill="none" stroke="url(#f3Chrome)" stroke-width="4"/>
        </svg>`;
    }
    FRAME_REGISTRY.f3={id:"f3",code:"F3",name:"クローム・ゴールド ジュエルフレーム",description:"太く直線的な左右装飾柱に大型黄金クリスタルを縦連結し、彫刻的なクロームフィンで分節。上辺は左右の大型発光体と中央放射フィン、下辺も黄金ユニットで閉じた全周型メカニカル・ジュエルフレーム。",slots,getOpening,buildSvg};
})();
