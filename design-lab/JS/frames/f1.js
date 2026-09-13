/* =========================================================
   frames/f1.js
   F1 ホワイト・ブルーフレーム
========================================================= */

(function registerF1Frame(){
    const overlap={top:5,right:5,bottom:5,left:5};
    const slots=[
        {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:45,y:5,width:300,height:210,overlap:{...overlap}},
        {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:95,y:225,width:200,height:90,overlap:{...overlap}},
        {id:"message",shortLabel:"メッセージ",label:"メッセージ表示枠",x:95,y:325,width:200,height:30,overlap:{...overlap}},
        {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:45,y:365,width:300,height:30,overlap:{...overlap}},
        {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:45,y:405,width:300,height:40,overlap:{...overlap}},
        {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:45,y:455,width:300,height:140,overlap:{...overlap}}
    ];

    const lighting={
        enabled:true,
        mainColor:"#45e9ff",
        patternColor:"#bdfaff"
    };

    function getOpening(slot){return{x:slot.x+slot.overlap.left,y:slot.y+slot.overlap.top,width:slot.width-slot.overlap.left-slot.overlap.right,height:slot.height-slot.overlap.top-slot.overlap.bottom};}
    function rectanglePath(rect){return`M ${rect.x} ${rect.y} H ${rect.x+rect.width} V ${rect.y+rect.height} H ${rect.x} Z`;}
    function ringPath(slot,outerInset){const opening=getOpening(slot);const outer={x:slot.x+outerInset,y:slot.y+outerInset,width:slot.width-(outerInset*2),height:slot.height-(outerInset*2)};return`${rectanglePath(outer)} ${rectanglePath(opening)}`;}

    function buildSvg(){
        const cutouts=slots.map(slot=>{const opening=getOpening(slot);return`<rect x="${opening.x}" y="${opening.y}" width="${opening.width}" height="${opening.height}" rx="2" fill="#000"/>`;}).join("");
        const bezels=slots.map(slot=>{const opening=getOpening(slot);return`<path d="${ringPath(slot,0)}" fill="url(#f1BlueMetal)" fill-rule="evenodd"/><path d="${ringPath(slot,2)}" fill="url(#f1ChromeEdge)" fill-rule="evenodd"/><rect x="${opening.x+.5}" y="${opening.y+.5}" width="${opening.width-1}" height="${opening.height-1}" rx="1.5" fill="none" stroke="#03131f" stroke-width="1"/>`;}).join("");
        return`<svg class="frame-shell f1-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true" style="--f1-led-main:${lighting.mainColor};--f1-led-pattern:${lighting.patternColor}">
        <defs>
        <linearGradient id="f1ShellMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="#c7d0d9"/><stop offset=".42" stop-color="#f8fbff"/><stop offset=".68" stop-color="#9da8b4"/><stop offset="1" stop-color="#f5f8fb"/></linearGradient>
        <linearGradient id="f1ChromeEdge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9fdff"/><stop offset=".45" stop-color="#7c8a99"/><stop offset=".58" stop-color="#fff"/><stop offset="1" stop-color="#526170"/></linearGradient>
        <linearGradient id="f1BlueMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071b3c"/><stop offset=".22" stop-color="#0a57a0"/><stop offset=".5" stop-color="#062453"/><stop offset=".76" stop-color="#137bd1"/><stop offset="1" stop-color="#03152f"/></linearGradient>
        <linearGradient id="f1Led" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--f1-led-pattern)"/><stop offset=".28" stop-color="var(--f1-led-main)"/><stop offset=".68" stop-color="var(--f1-led-main)"/><stop offset="1" stop-color="var(--f1-led-pattern)"/></linearGradient>
        <pattern id="f1Mesh" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M 0 5 L 5 0 M -2 2 L 2 -2 M 3 7 L 7 3" stroke="var(--f1-led-pattern)" stroke-width=".45" opacity=".65"/></pattern>
        <filter id="f1Glow" x="-100%" y="-15%" width="300%" height="130%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <mask id="f1Cutouts" maskUnits="userSpaceOnUse" x="0" y="0" width="390" height="600"><rect x="2" y="2" width="386" height="596" rx="10" fill="#fff"/>${cutouts}</mask>
        </defs>
        <rect x="2" y="2" width="386" height="596" rx="10" fill="url(#f1ShellMetal)" mask="url(#f1Cutouts)"/>
        <path d="M 12 14 L 42 14 L 48 207 L 88 224 L 92 315 L 49 325 L 49 446 L 39 456 L 39 590 L 10 590 Z" fill="url(#f1BlueMetal)" opacity=".96"/><path d="M 378 14 L 348 14 L 342 207 L 302 224 L 298 315 L 341 325 L 341 446 L 351 456 L 351 590 L 380 590 Z" fill="url(#f1BlueMetal)" opacity=".96"/>
        <g class="f1-lighting${lighting.enabled?'':' is-off'}">
        <path d="M 18 25 L 31 18 L 35 207 L 75 224 L 79 312 L 37 323 L 37 438 L 27 446 Z" fill="url(#f1Led)" class="f1-led" filter="url(#f1Glow)"/><path d="M 372 25 L 359 18 L 355 207 L 315 224 L 311 312 L 353 323 L 353 438 L 363 446 Z" fill="url(#f1Led)" class="f1-led f1-led-delay" filter="url(#f1Glow)"/>
        <path d="M 22 28 L 29 25 L 31 204 L 67 224 L 71 304 L 31 318 L 31 425" fill="none" stroke="url(#f1Mesh)" stroke-width="7" opacity=".75"/><path d="M 368 28 L 361 25 L 359 204 L 323 224 L 319 304 L 359 318 L 359 425" fill="none" stroke="url(#f1Mesh)" stroke-width="7" opacity=".75"/>
        </g>
        <path d="M 118 4 H 272 L 254 10 H 136 Z" fill="url(#f1BlueMetal)"/><path d="M 58 215 H 332 L 295 226 H 95 Z" fill="url(#f1BlueMetal)" opacity=".9"/>${bezels}
        <path d="M 20 466 L 41 459 V 583 L 20 575 Z M 370 466 L 349 459 V 583 L 370 575 Z" fill="#071421" stroke="#165aa0" stroke-width="2"/><path d="M 24 471 H 36 V 572 H 24 Z M 354 471 H 366 V 572 H 354 Z" fill="url(#f1Mesh)" opacity=".7"/>
        <rect x="2.5" y="2.5" width="385" height="595" rx="9.5" fill="none" stroke="#f8fbff" stroke-width="3"/><rect x="6" y="6" width="378" height="588" rx="7" fill="none" stroke="#6c7782" stroke-width="1" opacity=".9"/>
        </svg>`;
    }

    FRAME_REGISTRY.f1={id:"f1",code:"F1",name:"ホワイト・ブルーフレーム",description:"四角い外周、白い立体外装、メタリックブルーの内縁、左右の発光レールを持つフレーム試験型。発光色とパターン色をフレーム設定から変更可能。",slots,getOpening,lighting,buildSvg};
})();
