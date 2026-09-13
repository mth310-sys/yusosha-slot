/* =========================================================
   frames/f7.js
   F7 High Detail Structural Jewel Frame
   F3系デザインを実機構造研究に基づいて高密度化
   FRAME + PARTS + OPTICS + SHELL
========================================================= */
(function registerF7Frame(){
    const overlap={top:5,right:5,bottom:5,left:5};
    const slots=[
        {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:64,y:58,width:262,height:165,overlap:{...overlap}},
        {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:78,y:238,width:234,height:92,overlap:{...overlap}},
        {id:"message",shortLabel:"メッセージ",label:"メッセージ表示枠",x:78,y:340,width:234,height:30,overlap:{...overlap}},
        {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:70,y:382,width:250,height:30,overlap:{...overlap}},
        {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:70,y:422,width:250,height:40,overlap:{...overlap}},
        {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:64,y:474,width:262,height:98,overlap:{...overlap}}
    ];

    const lighting={enabled:true,mainColor:"#ffc51f",patternColor:"#fff2a0"};
    const layerModel={frame:true,parts:true,shell:true};

    function getOpening(s){return{x:s.x+5,y:s.y+5,width:s.width-10,height:s.height-10};}
    function rectPath(r){return`M ${r.x} ${r.y} H ${r.x+r.width} V ${r.y+r.height} H ${r.x} Z`;}
    function ringPath(s,i){const o=getOpening(s),r={x:s.x+i,y:s.y+i,width:s.width-i*2,height:s.height-i*2};return`${rectPath(r)} ${rectPath(o)}`;}
    function mirrorPoints(points){return points.split(" ").map(pair=>{const [x,y]=pair.split(",").map(Number);return`${390-x},${y}`;}).join(" ");}

    const jewelModules=[
        {p:"13,60 36,42 58,57 55,116 35,135 11,116",cy:89},
        {p:"9,139 34,124 58,141 56,199 33,217 7,196",cy:170},
        {p:"7,219 33,204 57,222 56,279 31,299 5,276",cy:250},
        {p:"6,300 32,285 57,304 56,361 30,381 4,357",cy:331},
        {p:"7,382 34,366 58,386 56,443 32,463 5,439",cy:413},
        {p:"10,464 37,448 60,469 56,529 34,548 8,524",cy:496}
    ];

    function jewelShells(){
        return jewelModules.map((j,i)=>{
            const m=mirrorPoints(j.p);
            return `
            <g class="f7-jewel-module${i%2?' f7-phase-b':''}">
                <polygon points="${j.p}" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
                <polygon points="${m}" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
                <polyline points="18,${j.cy-24} 34,${j.cy-36} 49,${j.cy-20} 45,${j.cy+19} 32,${j.cy+30} 17,${j.cy+18}" fill="none" stroke="#fff7c2" stroke-width="1.4" opacity=".78"/>
                <polyline points="372,${j.cy-24} 356,${j.cy-36} 341,${j.cy-20} 345,${j.cy+19} 358,${j.cy+30} 373,${j.cy+18}" fill="none" stroke="#fff7c2" stroke-width="1.4" opacity=".78"/>
                <path d="M 15 ${j.cy} L 53 ${j.cy-12} M 15 ${j.cy+8} L 49 ${j.cy+17}" stroke="#7b4100" stroke-width="1" opacity=".7"/>
                <path d="M 375 ${j.cy} L 337 ${j.cy-12} M 375 ${j.cy+8} L 341 ${j.cy+17}" stroke="#7b4100" stroke-width="1" opacity=".7"/>
            </g>`;
        }).join("");
    }

    function ledSources(opacity){
        return jewelModules.map((j,i)=>`
            <g class="f7-led-source${i%2?' f7-phase-b':''}" opacity="${opacity}" filter="url(#f7SourceGlow)">
                <circle cx="31" cy="${j.cy-18}" r="5.5" fill="url(#f7LedCore)"/>
                <circle cx="42" cy="${j.cy}" r="5.5" fill="url(#f7LedCore)"/>
                <circle cx="29" cy="${j.cy+18}" r="5.5" fill="url(#f7LedCore)"/>
                <circle cx="359" cy="${j.cy-18}" r="5.5" fill="url(#f7LedCore)"/>
                <circle cx="348" cy="${j.cy}" r="5.5" fill="url(#f7LedCore)"/>
                <circle cx="361" cy="${j.cy+18}" r="5.5" fill="url(#f7LedCore)"/>
            </g>`).join("");
    }

    function armorFins(){
        const ys=[45,126,207,288,369,450,531];
        return ys.map((y,i)=>`
            <g class="f7-fin">
                <path d="M 1 ${y} L 57 ${y-26} L 49 ${y+3} L 9 ${y+24} Z" fill="url(#f7Chrome)" stroke="#16191d" stroke-width="1.4"/>
                <path d="M 389 ${y} L 333 ${y-26} L 341 ${y+3} L 381 ${y+24} Z" fill="url(#f7Chrome)" stroke="#16191d" stroke-width="1.4"/>
                <path d="M 9 ${y+4} L 45 ${y-12}" stroke="#fff" stroke-width="1.1" opacity=".8"/>
                <path d="M 381 ${y+4} L 345 ${y-12}" stroke="#fff" stroke-width="1.1" opacity=".8"/>
                ${i<6?`<path d="M 12 ${y+20} L 53 ${y+8} L 49 ${y+29} L 17 ${y+39} Z" fill="#11151a" opacity=".96"/><path d="M 378 ${y+20} L 337 ${y+8} L 341 ${y+29} L 373 ${y+39} Z" fill="#11151a" opacity=".96"/>`:""}
            </g>`).join("");
    }

    function buildSvg(){
        const openings=slots.map(s=>{const o=getOpening(s);return`<rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="2" fill="#000"/>`;}).join("");
        const bezels=slots.map((s,i)=>{const o=getOpening(s);return`
            <g class="f7-bezel f7-bezel-${i}">
                <path d="${ringPath(s,0)}" fill="url(#f7Chrome)" fill-rule="evenodd"/>
                <path d="${ringPath(s,2)}" fill="url(#f7DarkChrome)" fill-rule="evenodd" opacity=".95"/>
                <rect x="${o.x+.5}" y="${o.y+.5}" width="${o.width-1}" height="${o.height-1}" rx="2" fill="none" stroke="#040506" stroke-width="2"/>
                <rect x="${o.x+2}" y="${o.y+2}" width="${o.width-4}" height="${o.height-4}" rx="1" fill="none" stroke="#d9e2e8" stroke-width=".7" opacity=".52"/>
            </g>`;}).join("");

        const frameDisplay=layerModel.frame?"inline":"none";
        const partsDisplay=layerModel.parts?"inline":"none";
        const shellDisplay=layerModel.shell?"inline":"none";
        const ledOpacity=lighting.enabled?1:.035;

        return`<svg class="frame-shell f7-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true" style="--f7-led:${lighting.mainColor};--f7-pattern:${lighting.patternColor}">
        <defs>
            <linearGradient id="f7Chassis" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#727a82"/><stop offset=".15" stop-color="#171b1f"/><stop offset=".38" stop-color="#4a5158"/><stop offset=".6" stop-color="#0c0e10"/><stop offset=".84" stop-color="#5c646c"/><stop offset="1" stop-color="#16191d"/></linearGradient>
            <linearGradient id="f7Chrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#16191d"/><stop offset=".07" stop-color="#f9fcff"/><stop offset=".16" stop-color="#737b82"/><stop offset=".27" stop-color="#fff"/><stop offset=".39" stop-color="#34393e"/><stop offset=".52" stop-color="#dce4ea"/><stop offset=".62" stop-color="#545b62"/><stop offset=".75" stop-color="#f7fbff"/><stop offset=".87" stop-color="#6a7177"/><stop offset="1" stop-color="#181b1f"/></linearGradient>
            <linearGradient id="f7DarkChrome" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c8d0d5"/><stop offset=".2" stop-color="#24282d"/><stop offset=".48" stop-color="#08090b"/><stop offset=".72" stop-color="#4a5056"/><stop offset="1" stop-color="#111317"/></linearGradient>
            <linearGradient id="f7BlackArmor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050607"/><stop offset=".32" stop-color="#202327"/><stop offset=".5" stop-color="#060708"/><stop offset=".74" stop-color="#2a2e32"/><stop offset="1" stop-color="#050607"/></linearGradient>
            <linearGradient id="f7GoldEdge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4a8"/><stop offset=".25" stop-color="#c67b00"/><stop offset=".48" stop-color="#fff279"/><stop offset=".72" stop-color="#8d4c00"/><stop offset="1" stop-color="#ffd743"/></linearGradient>
            <linearGradient id="f7CrystalOuter" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff8bf" stop-opacity=".94"/><stop offset=".18" stop-color="var(--f7-pattern)" stop-opacity=".88"/><stop offset=".42" stop-color="var(--f7-led)" stop-opacity=".74"/><stop offset=".57" stop-color="#7a3d00" stop-opacity=".8"/><stop offset=".75" stop-color="#ffd740" stop-opacity=".9"/><stop offset="1" stop-color="#3b1b00" stop-opacity=".9"/></linearGradient>
            <radialGradient id="f7LedCore"><stop stop-color="#fff"/><stop offset=".16" stop-color="var(--f7-pattern)"/><stop offset=".5" stop-color="var(--f7-led)"/><stop offset="1" stop-color="#6e3400"/></radialGradient>
            <radialGradient id="f7Glass"><stop stop-color="#203347" stop-opacity=".35"/><stop offset=".65" stop-color="#07111b" stop-opacity=".82"/><stop offset="1" stop-color="#000" stop-opacity=".96"/></radialGradient>
            <filter id="f7SourceGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="f7SoftGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.7" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <mask id="f7ShellMask"><rect x="0" y="0" width="390" height="600" fill="#fff"/>${openings}</mask>
            <pattern id="f7Carbon" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#090b0d"/><rect width="3" height="8" fill="#15191d"/></pattern>
        </defs>

        <!-- FRAME: 装飾を外した構造体 -->
        <g style="display:${frameDisplay}" class="f7-layer-frame">
            <path d="M 18 8 H 372 L 384 25 V 575 L 369 594 H 21 L 6 575 V 25 Z" fill="#090b0e" stroke="#707981" stroke-width="3"/>
            <path d="M 45 25 H 345 V 575 H 45 Z" fill="none" stroke="url(#f7Chassis)" stroke-width="10"/>
            <path d="M 58 35 V 563 M 332 35 V 563" stroke="#555d65" stroke-width="5"/>
            <path d="M 46 225 H 344 M 46 372 H 344 M 46 466 H 344" stroke="#3d444a" stroke-width="4"/>
            <g fill="#9ba4ac" stroke="#111" stroke-width="1.3">
                <circle cx="30" cy="30" r="5"/><circle cx="360" cy="30" r="5"/><circle cx="30" cy="570" r="5"/><circle cx="360" cy="570" r="5"/>
                <circle cx="59" cy="225" r="4"/><circle cx="331" cy="225" r="4"/><circle cx="59" cy="371" r="4"/><circle cx="331" cy="371" r="4"/><circle cx="59" cy="466" r="4"/><circle cx="331" cy="466" r="4"/>
            </g>
            <g fill="none" stroke="#596168" stroke-width="1.5" stroke-dasharray="5 4" opacity=".9">
                <rect x="61" y="55" width="268" height="171"/><rect x="75" y="235" width="240" height="98"/><rect x="67" y="379" width="256" height="86"/><rect x="61" y="471" width="268" height="104"/>
            </g>
        </g>

        <!-- PARTS: 機能部品＋内部光源 -->
        <g style="display:${partsDisplay}" class="f7-layer-parts">
            <rect x="68" y="62" width="254" height="157" rx="5" fill="#101419" stroke="#505a63" stroke-width="3"/>
            <rect x="73" y="67" width="244" height="147" rx="3" fill="url(#f7Glass)" stroke="#26313a"/>
            <text x="195" y="144" text-anchor="middle" fill="#61717d" font-size="12" font-family="sans-serif">DISPLAY UNIT</text>

            <rect x="82" y="242" width="226" height="84" rx="4" fill="#15191d" stroke="#626a72" stroke-width="3"/>
            <g fill="#f5f3e9" stroke="#596069" stroke-width="1.5"><rect x="88" y="247" width="67" height="74" rx="3"/><rect x="161" y="247" width="67" height="74" rx="3"/><rect x="234" y="247" width="68" height="74" rx="3"/></g>
            <g fill="#444" font-size="9" text-anchor="middle" font-family="sans-serif"><text x="121" y="286">REEL L</text><text x="194" y="286">REEL C</text><text x="268" y="286">REEL R</text></g>

            <rect x="82" y="344" width="226" height="22" rx="3" fill="#13171b" stroke="#4e565d"/><circle cx="95" cy="355" r="3" fill="#66df69"/><circle cx="105" cy="355" r="3" fill="#ffc536"/>
            <rect x="74" y="386" width="242" height="72" rx="7" fill="#121519" stroke="#5d666e" stroke-width="3"/>
            <circle cx="95" cy="437" r="14" fill="#0d0f11" stroke="#8d969e" stroke-width="3"/>
            <circle cx="296" cy="437" r="14" fill="#0d0f11" stroke="#8d969e" stroke-width="3"/>
            <g fill="#971520" stroke="#ff5360" stroke-width="2"><circle cx="150" cy="437" r="14"/><circle cx="195" cy="437" r="14"/><circle cx="240" cy="437" r="14"/></g>
            <rect x="68" y="478" width="254" height="90" rx="4" fill="#101318" stroke="#505960" stroke-width="3"/>
            <rect x="74" y="484" width="242" height="78" fill="#050709" stroke="#222c34"/>

            <!-- LED SOURCE：完成外観の黄金ジュエルより内側 -->
            ${ledSources(ledOpacity)}
            <g opacity="${ledOpacity}" filter="url(#f7SourceGlow)">
                <circle cx="91" cy="27" r="7" fill="url(#f7LedCore)"/><circle cx="118" cy="24" r="7" fill="url(#f7LedCore)"/>
                <circle cx="272" cy="24" r="7" fill="url(#f7LedCore)"/><circle cx="299" cy="27" r="7" fill="url(#f7LedCore)"/>
                <circle cx="132" cy="578" r="7" fill="url(#f7LedCore)"/><circle cx="195" cy="573" r="8" fill="url(#f7LedCore)"/><circle cx="258" cy="578" r="7" fill="url(#f7LedCore)"/>
            </g>
        </g>

        <!-- SHELL / OPTICS: 多層装甲・トリム・透明ジュエル -->
        <g style="display:${shellDisplay}" class="f7-layer-shell">
            <path d="M 15 3 H 375 L 390 28 V 572 L 368 599 H 22 L 0 572 V 28 Z" fill="url(#f7BlackArmor)" mask="url(#f7ShellMask)"/>

            <!-- 左右大型ベース装甲 -->
            <path d="M 0 28 L 33 5 L 66 24 L 62 571 L 39 598 L 0 575 Z" fill="url(#f7Chrome)" stroke="#111" stroke-width="2"/>
            <path d="M 390 28 L 357 5 L 324 24 L 328 571 L 351 598 L 390 575 Z" fill="url(#f7Chrome)" stroke="#111" stroke-width="2"/>
            <path d="M 7 35 L 28 18 L 55 31 L 52 558 L 34 580 L 8 563 Z" fill="url(#f7Carbon)" stroke="#08090b" stroke-width="2"/>
            <path d="M 383 35 L 362 18 L 335 31 L 338 558 L 356 580 L 382 563 Z" fill="url(#f7Carbon)" stroke="#08090b" stroke-width="2"/>

            <!-- 分割フィンと奥の暗部 -->
            ${armorFins()}

            <!-- 内部LEDを覆う透明黄金光学パーツ -->
            <g filter="url(#f7SoftGlow)">${jewelShells()}</g>

            <!-- ジュエルを保持する内側クロームクランプ -->
            <g fill="url(#f7DarkChrome)" stroke="#cfd5d9" stroke-width=".8" opacity=".98">
                ${[89,170,250,331,413,496].map(y=>`<path d="M 49 ${y-18} L 61 ${y-10} L 58 ${y+13} L 47 ${y+21} Z"/><path d="M 341 ${y-18} L 329 ${y-10} L 332 ${y+13} L 343 ${y+21} Z"/>`).join("")}
            </g>

            <!-- 上部：多層クラウン -->
            <path d="M 55 4 H 144 L 157 35 L 65 50 L 49 30 Z" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
            <path d="M 335 4 H 246 L 233 35 L 325 50 L 341 30 Z" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
            <g fill="url(#f7Chrome)" stroke="#171a1d" stroke-width="1"><path d="M 135 43 L 152 3 L 170 40 Z"/><path d="M 151 42 L 174 0 L 187 41 Z"/><path d="M 171 41 L 195 -2 L 219 41 Z"/><path d="M 203 41 L 216 0 L 239 42 Z"/><path d="M 220 40 L 238 3 L 255 43 Z"/></g>
            <path d="M 159 39 L 195 8 L 231 39 L 219 48 H 171 Z" fill="#0b0d10" stroke="#dce3e8" stroke-width="1.4"/>
            <path d="M 174 38 L 195 19 L 216 38" fill="none" stroke="var(--f7-pattern)" stroke-width="2" opacity="${lighting.enabled?.85:.08}"/>

            <!-- 各機能領域の多層ベゼル -->
            ${bezels}

            <!-- リール周辺の前方装甲／段差表現 -->
            <path d="M 65 225 L 79 231 V 337 L 65 345 L 58 333 V 238 Z" fill="url(#f7Chrome)" stroke="#17191c" stroke-width="1.5"/>
            <path d="M 325 225 L 311 231 V 337 L 325 345 L 332 333 V 238 Z" fill="url(#f7Chrome)" stroke="#17191c" stroke-width="1.5"/>
            <path d="M 73 232 L 82 237 V 330 L 73 336" fill="none" stroke="#fff" stroke-width="1" opacity=".55"/>
            <path d="M 317 232 L 308 237 V 330 L 317 336" fill="none" stroke="#fff" stroke-width="1" opacity=".55"/>

            <!-- 操作卓前縁：張り出しを疑似表現 -->
            <path d="M 63 374 L 327 374 L 321 382 H 69 Z" fill="url(#f7Chrome)" stroke="#111"/>
            <path d="M 65 465 L 325 465 L 315 474 H 75 Z" fill="url(#f7DarkChrome)" stroke="#111"/>

            <!-- 下部大型ユニット -->
            <path d="M 43 571 L 121 548 L 154 579 L 132 600 H 51 L 31 588 Z" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
            <path d="M 347 571 L 269 548 L 236 579 L 258 600 H 339 L 359 588 Z" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
            <path d="M 149 577 L 173 552 H 217 L 241 577 L 222 600 H 168 Z" fill="url(#f7CrystalOuter)" stroke="url(#f7GoldEdge)" stroke-width="2"/>
            <g fill="url(#f7Chrome)" stroke="#171a1d"><path d="M 108 591 L 153 554 L 170 596 Z"/><path d="M 282 591 L 237 554 L 220 596 Z"/></g>

            <!-- 細トリムと外周ハイライト -->
            <path d="M 18 4 H 372 L 388 30 V 570 L 366 597 H 24 L 2 570 V 30 Z" fill="none" stroke="url(#f7Chrome)" stroke-width="4"/>
            <path d="M 24 11 H 366 L 380 34 V 564 L 360 589 H 30 L 10 564 V 34 Z" fill="none" stroke="#f7fbff" stroke-width="1" opacity=".52"/>
            <path d="M 62 52 V 568 M 328 52 V 568" stroke="#fff" stroke-width=".8" opacity=".35"/>
        </g>
        </svg>`;
    }

    FRAME_REGISTRY.f7={
        id:"f7",code:"F7",name:"High Detail クローム・ジュエル構造検証機",
        description:"F3系のクローム＋黄金ジュエル構成を、実機構造研究を反映して高密度化。STRUCTURAL FRAME、機能PARTS、内部LED SOURCE、透明光学ジュエル、多層装甲、フィン、トリム、暗部、疑似Z段差を分離した品質上限検証フレーム。",
        slots,getOpening,lighting,layerModel,buildSvg
    };
})();
