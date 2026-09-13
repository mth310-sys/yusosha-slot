/* =========================================================
   frames/f2.js
   F2 ブラック・レッド アーマーフレーム
========================================================= */

(function registerF2Frame(){
    const overlap = {top:5,right:5,bottom:5,left:5};

    const slots = [
        {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:45,y:5,width:300,height:210,overlap:{...overlap}},
        {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:95,y:225,width:200,height:90,overlap:{...overlap}},
        {id:"message",shortLabel:"メッセージ",label:"メッセージ表示枠",x:95,y:325,width:200,height:30,overlap:{...overlap}},
        {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:45,y:365,width:300,height:30,overlap:{...overlap}},
        {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:45,y:405,width:300,height:40,overlap:{...overlap}},
        {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:45,y:455,width:300,height:140,overlap:{...overlap}}
    ];

    function getOpening(slot){
        return {
            x:slot.x + slot.overlap.left,
            y:slot.y + slot.overlap.top,
            width:slot.width - slot.overlap.left - slot.overlap.right,
            height:slot.height - slot.overlap.top - slot.overlap.bottom
        };
    }

    function rectanglePath(rect){
        const right = rect.x + rect.width;
        const bottom = rect.y + rect.height;
        return `M ${rect.x} ${rect.y} H ${right} V ${bottom} H ${rect.x} Z`;
    }

    function ringPath(slot,outerInset){
        const opening = getOpening(slot);
        const outer = {
            x:slot.x + outerInset,
            y:slot.y + outerInset,
            width:slot.width - (outerInset * 2),
            height:slot.height - (outerInset * 2)
        };
        return `${rectanglePath(outer)} ${rectanglePath(opening)}`;
    }

    function buildSvg(){
        const cutouts = slots.map(function(slot){
            const opening = getOpening(slot);
            return `<rect x="${opening.x}" y="${opening.y}" width="${opening.width}" height="${opening.height}" rx="2" fill="#000"/>`;
        }).join("");

        const bezels = slots.map(function(slot){
            const opening = getOpening(slot);
            return `
                <path d="${ringPath(slot,0)}" fill="url(#f2ArmorEdge)" fill-rule="evenodd"/>
                <path d="${ringPath(slot,2)}" fill="url(#f2RedEdge)" fill-rule="evenodd" opacity=".9"/>
                <rect x="${opening.x + .5}" y="${opening.y + .5}" width="${opening.width - 1}" height="${opening.height - 1}" rx="1.5" fill="none" stroke="#050505" stroke-width="1"/>
            `;
        }).join("");

        return `
            <svg class="frame-shell f2-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                    <linearGradient id="f2Armor" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#35383d"/>
                        <stop offset=".18" stop-color="#111318"/>
                        <stop offset=".48" stop-color="#292c31"/>
                        <stop offset=".72" stop-color="#08090c"/>
                        <stop offset="1" stop-color="#24272c"/>
                    </linearGradient>
                    <linearGradient id="f2ArmorEdge" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#555960"/>
                        <stop offset=".28" stop-color="#15171b"/>
                        <stop offset=".62" stop-color="#050608"/>
                        <stop offset="1" stop-color="#383b40"/>
                    </linearGradient>
                    <linearGradient id="f2RedEdge" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#3a0508"/>
                        <stop offset=".45" stop-color="#d0141e"/>
                        <stop offset=".65" stop-color="#5d070d"/>
                        <stop offset="1" stop-color="#ff313c"/>
                    </linearGradient>
                    <linearGradient id="f2Led" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ff9a9a"/>
                        <stop offset=".22" stop-color="#ff2936"/>
                        <stop offset=".68" stop-color="#a5000b"/>
                        <stop offset="1" stop-color="#ff4b54"/>
                    </linearGradient>
                    <pattern id="f2Texture" width="7" height="7" patternUnits="userSpaceOnUse">
                        <path d="M 0 7 L 7 0 M -3 3 L 3 -3 M 4 10 L 10 4" stroke="#777b82" stroke-width=".45" opacity=".18"/>
                    </pattern>
                    <filter id="f2Glow" x="-120%" y="-20%" width="340%" height="140%">
                        <feGaussianBlur stdDeviation="3.6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <mask id="f2Cutouts" maskUnits="userSpaceOnUse" x="0" y="0" width="390" height="600">
                        <rect x="2" y="2" width="386" height="596" rx="7" fill="#fff"/>
                        ${cutouts}
                    </mask>
                </defs>

                <rect x="2" y="2" width="386" height="596" rx="7" fill="url(#f2Armor)" mask="url(#f2Cutouts)"/>

                <!-- 上部ショルダー装甲 -->
                <path d="M 8 12 H 105 L 124 3 H 266 L 285 12 H 382 L 374 72 L 350 88 L 344 207 L 304 224 L 298 315 L 340 326 L 340 445 L 354 456 L 354 590 H 36 V 456 L 50 445 V 326 L 92 315 L 86 224 L 46 207 L 40 88 L 16 72 Z" fill="url(#f2Texture)" opacity=".82"/>

                <!-- 左右の多層装甲 -->
                <path d="M 8 18 L 39 30 L 45 199 L 83 222 L 88 310 L 45 323 L 45 442 L 28 458 L 28 582 L 8 590 Z" fill="#0b0d10" stroke="#484b50" stroke-width="2"/>
                <path d="M 382 18 L 351 30 L 345 199 L 307 222 L 302 310 L 345 323 L 345 442 L 362 458 L 362 582 L 382 590 Z" fill="#0b0d10" stroke="#484b50" stroke-width="2"/>
                <path d="M 14 28 L 31 39 L 36 202 L 72 224 L 77 301 L 37 316 L 37 431 L 21 446 Z" fill="url(#f2ArmorEdge)"/>
                <path d="M 376 28 L 359 39 L 354 202 L 318 224 L 313 301 L 353 316 L 353 431 L 369 446 Z" fill="url(#f2ArmorEdge)"/>

                <!-- 装甲の隙間を走る赤LED -->
                <path d="M 20 40 L 27 45 L 31 205 L 64 225 L 69 294 L 30 311 L 30 422" fill="none" stroke="url(#f2Led)" stroke-width="6" class="f2-led" filter="url(#f2Glow)"/>
                <path d="M 370 40 L 363 45 L 359 205 L 326 225 L 321 294 L 360 311 L 360 422" fill="none" stroke="url(#f2Led)" stroke-width="6" class="f2-led f2-led-delay" filter="url(#f2Glow)"/>

                <!-- 肩・中央装甲 -->
                <path d="M 76 12 L 119 12 L 132 4 H 258 L 271 12 H 314 L 300 25 H 90 Z" fill="url(#f2ArmorEdge)" stroke="#5d6065" stroke-width="1"/>
                <path d="M 112 8 H 278 L 260 17 H 130 Z" fill="url(#f2RedEdge)" opacity=".75"/>
                <path d="M 57 211 H 333 L 306 224 H 84 Z" fill="#08090b" stroke="#5b0b10" stroke-width="2"/>
                <path d="M 73 218 H 317 L 297 226 H 93 Z" fill="url(#f2RedEdge)" opacity=".72"/>

                ${bezels}

                <!-- 下部の重量感あるベース装甲 -->
                <path d="M 14 462 L 41 451 H 349 L 376 462 L 370 588 L 350 596 H 40 L 20 588 Z" fill="none" stroke="#44474c" stroke-width="3"/>
                <path d="M 19 474 L 35 466 V 575 L 19 568 Z M 371 474 L 355 466 V 575 L 371 568 Z" fill="#070709" stroke="#8e0b13" stroke-width="2"/>
                <path d="M 24 480 H 31 V 562 H 24 Z M 359 480 H 366 V 562 H 359 Z" fill="url(#f2Led)" class="f2-led" opacity=".8"/>

                <!-- 外周エッジ -->
                <path d="M 10 8 H 105 L 121 2 H 269 L 285 8 H 380 L 387 22 V 578 L 378 594 H 12 L 3 578 V 22 Z" fill="none" stroke="#5a5d62" stroke-width="3"/>
                <path d="M 14 12 H 103 L 119 7 H 271 L 287 12 H 376" fill="none" stroke="#9d1119" stroke-width="1.5" opacity=".85"/>
            </svg>
        `;
    }

    FRAME_REGISTRY.f2 = {
        id:"f2",
        code:"F2",
        name:"ブラック・レッド アーマーフレーム",
        description:"黒鉄の多層装甲、斜めの切り込みと張り出し、装甲の隙間から深紅のLEDが漏れる重厚で攻撃的な次世代フレーム。F1と同じ390×600・同一スロット規格を維持する。",
        slots:slots,
        getOpening:getOpening,
        buildSvg:buildSvg
    };
})();
