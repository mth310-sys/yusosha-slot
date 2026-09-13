/* =========================================================
   frames/f6.js
   F6 = F1を2.5層構造で再構築
   FRAME + PARTS + SHELL
========================================================= */
(function registerF6Frame(){
    const overlap={top:5,right:5,bottom:5,left:5};
    const slots=[
        {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:45,y:5,width:300,height:210,overlap:{...overlap}},
        {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:95,y:225,width:200,height:90,overlap:{...overlap}},
        {id:"message",shortLabel:"メッセージ",label:"メッセージ表示枠",x:95,y:325,width:200,height:30,overlap:{...overlap}},
        {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:45,y:365,width:300,height:30,overlap:{...overlap}},
        {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:45,y:405,width:300,height:40,overlap:{...overlap}},
        {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:45,y:455,width:300,height:140,overlap:{...overlap}}
    ];

    const lighting={enabled:true,mainColor:"#45e9ff",patternColor:"#bdfaff"};
    const layerModel={frame:true,parts:true,shell:true};

    function getOpening(slot){return{x:slot.x+5,y:slot.y+5,width:slot.width-10,height:slot.height-10};}
    function rectPath(r){return`M ${r.x} ${r.y} H ${r.x+r.width} V ${r.y+r.height} H ${r.x} Z`;}
    function ringPath(slot,inset){const o=getOpening(slot);const r={x:slot.x+inset,y:slot.y+inset,width:slot.width-inset*2,height:slot.height-inset*2};return`${rectPath(r)} ${rectPath(o)}`;}

    function buildSvg(){
        const cutouts=slots.map(s=>{const o=getOpening(s);return`<rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="2" fill="#000"/>`;}).join("");
        const shellBezels=slots.map(s=>{const o=getOpening(s);return`<path d="${ringPath(s,0)}" fill="url(#f6BlueMetal)" fill-rule="evenodd"/><path d="${ringPath(s,2)}" fill="url(#f6Chrome)" fill-rule="evenodd"/><rect x="${o.x+.5}" y="${o.y+.5}" width="${o.width-1}" height="${o.height-1}" fill="none" stroke="#03131f"/>`;}).join("");
        const frameDisplay=layerModel.frame?"inline":"none";
        const partsDisplay=layerModel.parts?"inline":"none";
        const shellDisplay=layerModel.shell?"inline":"none";
        const ledOpacity=lighting.enabled?1:.08;

        return`<svg class="frame-shell f6-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true" style="--f6-led:${lighting.mainColor};--f6-pattern:${lighting.patternColor}">
        <defs>
            <linearGradient id="f6Chassis" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#353b42"/><stop offset=".25" stop-color="#11151a"/><stop offset=".5" stop-color="#69717a"/><stop offset=".75" stop-color="#15191e"/><stop offset="1" stop-color="#3d444b"/></linearGradient>
            <linearGradient id="f6Chrome" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#7c8a99"/><stop offset=".58" stop-color="#fff"/><stop offset="1" stop-color="#526170"/></linearGradient>
            <linearGradient id="f6BlueMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071b3c"/><stop offset=".22" stop-color="#0a57a0"/><stop offset=".5" stop-color="#062453"/><stop offset=".76" stop-color="#137bd1"/><stop offset="1" stop-color="#03152f"/></linearGradient>
            <linearGradient id="f6ShellMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".18" stop-color="#c7d0d9"/><stop offset=".42" stop-color="#f8fbff"/><stop offset=".68" stop-color="#9da8b4"/><stop offset="1" stop-color="#f5f8fb"/></linearGradient>
            <radialGradient id="f6LedSource"><stop stop-color="#fff"/><stop offset=".22" stop-color="var(--f6-pattern)"/><stop offset=".55" stop-color="var(--f6-led)"/><stop offset="1" stop-color="#07304a"/></radialGradient>
            <filter id="f6Glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <mask id="f6Cutouts"><rect x="2" y="2" width="386" height="596" rx="10" fill="#fff"/>${cutouts}</mask>
        </defs>

        <!-- 1層目 FRAME / シャーシ -->
        <g style="display:${frameDisplay}">
            <rect x="8" y="8" width="374" height="584" rx="9" fill="#0a0c0f" stroke="#69717a" stroke-width="3"/>
            <path d="M 28 28 H 362 V 572 H 28 Z" fill="none" stroke="url(#f6Chassis)" stroke-width="12"/>
            <path d="M 54 36 V 562 M 336 36 V 562" stroke="#626b74" stroke-width="5" opacity=".8"/>
            <g fill="#9099a2" stroke="#111" stroke-width="1"><circle cx="32" cy="34" r="5"/><circle cx="358" cy="34" r="5"/><circle cx="32" cy="566" r="5"/><circle cx="358" cy="566" r="5"/><circle cx="57" cy="220" r="4"/><circle cx="333" cy="220" r="4"/><circle cx="57" cy="449" r="4"/><circle cx="333" cy="449" r="4"/></g>
            <g fill="none" stroke="#4c535b" stroke-width="2" stroke-dasharray="5 4"><rect x="48" y="8" width="294" height="204"/><rect x="98" y="228" width="194" height="84"/><rect x="48" y="408" width="294" height="34"/><rect x="48" y="458" width="294" height="134"/></g>
        </g>

        <!-- 1.5層目 PARTS / 機能部品 -->
        <g style="display:${partsDisplay}">
            <!-- 液晶モジュール -->
            <rect x="51" y="11" width="288" height="198" rx="5" fill="#101820" stroke="#58636e" stroke-width="4"/>
            <rect x="59" y="19" width="272" height="182" rx="3" fill="#07101a" stroke="#263c50"/>
            <text x="195" y="112" text-anchor="middle" fill="#536575" font-size="13" font-family="sans-serif">DISPLAY MODULE</text>
            <!-- リールユニット -->
            <rect x="99" y="229" width="192" height="82" rx="4" fill="#191c20" stroke="#68717a" stroke-width="3"/>
            <g fill="#f4f4f4" stroke="#6b737c"><rect x="106" y="236" width="55" height="68" rx="4"/><rect x="168" y="236" width="55" height="68" rx="4"/><rect x="230" y="236" width="54" height="68" rx="4"/></g>
            <g fill="#444" font-size="10" text-anchor="middle" font-family="sans-serif"><text x="133" y="274">REEL L</text><text x="195" y="274">REEL C</text><text x="257" y="274">REEL R</text></g>
            <!-- 情報基板 -->
            <rect x="99" y="329" width="192" height="22" rx="2" fill="#151a1e" stroke="#4f5961"/><circle cx="112" cy="340" r="3" fill="#5ee05e"/><circle cx="122" cy="340" r="3" fill="#ffcc3a"/>
            <!-- 操作部品 -->
            <rect x="49" y="369" width="292" height="72" rx="6" fill="#16191d" stroke="#616b75" stroke-width="3"/>
            <circle cx="82" cy="424" r="15" fill="#1a1a1a" stroke="#9ea7af" stroke-width="3"/><circle cx="308" cy="424" r="15" fill="#1a1a1a" stroke="#9ea7af" stroke-width="3"/>
            <g fill="#b71925" stroke="#ff606a" stroke-width="2"><circle cx="147" cy="424" r="14"/><circle cx="195" cy="424" r="14"/><circle cx="243" cy="424" r="14"/></g>
            <!-- 下部パネルモジュール -->
            <rect x="49" y="459" width="292" height="132" rx="5" fill="#101419" stroke="#59636d" stroke-width="4"/><rect x="58" y="468" width="274" height="114" fill="#06090c" stroke="#263441"/>
            <!-- LED基板 / 光源。外装より内側 -->
            <g opacity="${ledOpacity}" class="f6-led-source" filter="url(#f6Glow)">
                ${[54,91,128,165,202,239,276,313,350,387,424,487,526,565].map(y=>`<circle cx="34" cy="${y}" r="7" fill="url(#f6LedSource)"/><circle cx="356" cy="${y}" r="7" fill="url(#f6LedSource)"/>`).join("")}
            </g>
        </g>

        <!-- 2層目 SHELL / F1系外装 -->
        <g style="display:${shellDisplay}">
            <rect x="2" y="2" width="386" height="596" rx="10" fill="url(#f6ShellMetal)" mask="url(#f6Cutouts)"/>
            <path d="M 12 14 L 42 14 L 48 207 L 88 224 L 92 315 L 49 325 L 49 446 L 39 456 L 39 590 L 10 590 Z M 378 14 L 348 14 L 342 207 L 302 224 L 298 315 L 341 325 L 341 446 L 351 456 L 351 590 L 380 590 Z" fill="url(#f6BlueMetal)" fill-rule="evenodd" opacity=".96"/>
            <!-- 導光窓。下のLED光源が透ける -->
            <path class="f6-shell-window" d="M 18 25 L 31 18 L 35 207 L 75 224 L 79 312 L 37 323 L 37 438 L 27 446 Z M 372 25 L 359 18 L 355 207 L 315 224 L 311 312 L 353 323 L 353 438 L 363 446 Z" fill="var(--f6-led)" opacity=".42" stroke="var(--f6-pattern)" stroke-width="2"/>
            <path d="M 118 4 H 272 L 254 10 H 136 Z M 58 215 H 332 L 295 226 H 95 Z" fill="url(#f6BlueMetal)" opacity=".92"/>
            ${shellBezels}
            <path d="M 20 466 L 41 459 V 583 L 20 575 Z M 370 466 L 349 459 V 583 L 370 575 Z" fill="#071421" stroke="#165aa0" stroke-width="2"/>
            <rect x="2.5" y="2.5" width="385" height="595" rx="9.5" fill="none" stroke="#f8fbff" stroke-width="3"/>
            <rect x="6" y="6" width="378" height="588" rx="7" fill="none" stroke="#6c7782" opacity=".9"/>
        </g>
        </svg>`;
    }

    FRAME_REGISTRY.f6={
        id:"f6",code:"F6",name:"F1 2.5層構造プロトタイプ",
        description:"F1の見た目を、FRAME（骨格）＋PARTS（液晶・リール・LED・操作部）＋SHELL（外装）へ分離して再構築した第2世代構造の検証フレーム。",
        slots,getOpening,lighting,layerModel,buildSvg
    };
})();
