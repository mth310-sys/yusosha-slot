/* =========================================================
   frames/f8.js
   F8 Lupin B4 実機比率ベース構造研究機
   Canva Magic Layersで取得した正面画像の比率を390x600へ変換
========================================================= */
(function registerF8Frame(){
  const overlap={top:4,right:4,bottom:4,left:4};
  const slots=[
    {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:52,y:120,width:286,height:166,overlap:{...overlap}},
    {id:"reels",shortLabel:"リール",label:"リール左・中・右",x:217,y:37,width:114,height:76,overlap:{...overlap}},
    {id:"message",shortLabel:"メッセージ",label:"メッセージ表示枠",x:92,y:291,width:206,height:25,overlap:{...overlap}},
    {id:"bet-info",shortLabel:"BET列",label:"BET・MAX BET・情報表示",x:76,y:314,width:238,height:20,overlap:{...overlap}},
    {id:"start-stop",shortLabel:"START列",label:"START・STOP左・中・右",x:108,y:302,width:174,height:34,overlap:{...overlap}},
    {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:52,y:330,width:286,height:173,overlap:{...overlap}}
  ];

  const lighting={enabled:true,mainColor:"#ff8a18",patternColor:"#ffe066"};
  const layerModel={frame:true,parts:true,shell:true};
  function getOpening(s){return{x:s.x+4,y:s.y+4,width:s.width-8,height:s.height-8};}

  function ledTriplet(x,y,colors){
    return colors.map((c,i)=>`<circle cx="${x}" cy="${y+i*30}" r="10.5" fill="${c}" stroke="#f2f4f6" stroke-width="2"/>`).join("");
  }

  function buildSvg(){
    return `<svg class="frame-shell f8-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="f8Chrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#15171a"/><stop offset=".08" stop-color="#fafafa"/><stop offset=".22" stop-color="#70777d"/><stop offset=".37" stop-color="#fff"/><stop offset=".56" stop-color="#30353a"/><stop offset=".75" stop-color="#d8dde0"/><stop offset="1" stop-color="#1a1d21"/></linearGradient>
        <linearGradient id="f8Gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffef92"/><stop offset=".22" stop-color="#ff9800"/><stop offset=".5" stop-color="#8b4300"/><stop offset=".72" stop-color="#ffc928"/><stop offset="1" stop-color="#532200"/></linearGradient>
        <linearGradient id="f8Rainbow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ff4d86"/><stop offset=".25" stop-color="#ffbd28"/><stop offset=".5" stop-color="#7cff77"/><stop offset=".75" stop-color="#48d9ff"/><stop offset="1" stop-color="#9d58ff"/></linearGradient>
        <radialGradient id="f8Glass"><stop stop-color="#31465c"/><stop offset=".55" stop-color="#07121c"/><stop offset="1" stop-color="#010204"/></radialGradient>
      </defs>

      <g class="f8-layer-frame" style="display:${layerModel.frame?'inline':'none'}">
        <path d="M20 5 H370 L386 24 V575 L368 596 H22 L4 575 V24 Z" fill="#080a0c" stroke="url(#f8Chrome)" stroke-width="4"/>
        <path d="M60 8 H330 L343 22 V502 L333 513 H57 L47 502 V22 Z" fill="none" stroke="#697177" stroke-width="5"/>
        <path d="M15 500 H375 V592 H15 Z" fill="#020304" stroke="#1a1d20" stroke-width="3"/>
      </g>

      <g class="f8-layer-parts" style="display:${layerModel.parts?'inline':'none'}">
        <rect x="52" y="120" width="286" height="166" rx="3" fill="#000" stroke="#1d2226" stroke-width="4"/>
        <rect x="217" y="37" width="114" height="76" rx="3" fill="#050607" stroke="url(#f8Chrome)" stroke-width="4"/>
        <g fill="#101214" stroke="#5d646a" stroke-width="2"><rect x="225" y="45" width="30" height="60" rx="2"/><rect x="259" y="45" width="30" height="60" rx="2"/><rect x="293" y="45" width="30" height="60" rx="2"/></g>
        <circle cx="154" cy="69" r="55" fill="url(#f8Glass)" stroke="url(#f8Gold)" stroke-width="8"/>
        <g fill="#d9edf7" opacity=".92">${Array.from({length:9},(_,r)=>Array.from({length:9},(_,c)=>`<circle cx="${126+c*7}" cy="${41+r*7}" r="1.7"/>`).join('')).join('')}</g>
        <path d="M53 291 H337 L331 335 H59 Z" fill="#111417" stroke="url(#f8Chrome)" stroke-width="4"/>
        <g fill="#ff6f1f" stroke="#ffd8bb" stroke-width="2"><circle cx="156" cy="316" r="10"/><circle cx="195" cy="316" r="10"/><circle cx="234" cy="316" r="10"/></g>
        <rect x="52" y="330" width="286" height="173" rx="4" fill="#241509" stroke="#ff7f23" stroke-width="4"/>
        <rect x="60" y="339" width="270" height="155" rx="2" fill="#4b1d0b" stroke="#ffb355" stroke-width="2"/>
      </g>

      <g class="f8-layer-shell" style="display:${layerModel.shell?'inline':'none'}">
        <path d="M45 6 H115 L127 26 L106 38 H56 Z" fill="#0c0d0f" stroke="url(#f8Chrome)" stroke-width="3"/>
        <path d="M345 6 H275 L263 26 L284 38 H334 Z" fill="#0c0d0f" stroke="url(#f8Chrome)" stroke-width="3"/>
        <path d="M113 7 L189 2 L214 30 L183 39 L126 30 Z" fill="url(#f8Gold)" stroke="#7d3d00" stroke-width="2"/>
        <path d="M15 18 L52 5 V139 L22 151 L9 138 Z" fill="url(#f8Chrome)" stroke="#25292d" stroke-width="2"/>
        <path d="M375 18 L338 5 V139 L368 151 L381 138 Z" fill="url(#f8Chrome)" stroke="#25292d" stroke-width="2"/>
        <path d="M14 150 L53 138 V277 L19 289 L8 277 Z" fill="url(#f8Chrome)" stroke="#25292d" stroke-width="2"/>
        <path d="M376 150 L337 138 V277 L371 289 L382 277 Z" fill="url(#f8Chrome)" stroke="#25292d" stroke-width="2"/>
        <g class="f8-side-led">${ledTriplet(32,52,['#ff4f88','#ff8353','#ffe047'])}${ledTriplet(358,52,['#ff4f88','#ff8353','#ffe047'])}${ledTriplet(32,184,['#5ce3cb','#45cfff','#4592ff'])}${ledTriplet(358,184,['#5ce3cb','#45cfff','#4592ff'])}</g>
        <rect class="f8-lower-led" x="16" y="343" width="24" height="152" rx="8" fill="url(#f8Rainbow)" stroke="#e6e6e6" stroke-width="2"/>
        <rect class="f8-lower-led" x="350" y="343" width="24" height="152" rx="8" fill="url(#f8Rainbow)" stroke="#e6e6e6" stroke-width="2"/>
        <path d="M40 329 L52 314 M350 329 L338 314 M42 505 L58 492 M348 505 L332 492" stroke="#f4f6f7" stroke-width="3" opacity=".8"/>
        <path d="M12 497 H48 L60 511 V584 H20 L10 570 Z" fill="url(#f8Chrome)" stroke="#171a1d" stroke-width="2"/>
        <path d="M378 497 H342 L330 511 V584 H370 L380 570 Z" fill="url(#f8Chrome)" stroke="#171a1d" stroke-width="2"/>
      </g>
    </svg>`;
  }

  FRAME_REGISTRY.f8={
    id:"f8",code:"F8",name:"Lupin B4 実機比率ベース構造研究機",
    description:"ユーザー提供の真正面実機画像をCanva Magic Layersで分解し、取得した主要領域の比率を390×600へ変換して再構築した研究フレーム。上部円形表示、上部リール、左右3連丸LED、中央大型表示、操作卓、下パネル、下部レインボーLED、下部ベースを独立構造としてコード化。",
    slots,getOpening,lighting,layerModel,buildSvg
  };
})();
