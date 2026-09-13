/* =========================================================
   frames/f9.js
   F9 Lovable Hybrid / mechanism port + Yusosha exterior study
========================================================= */
(function registerF9Frame(){
  const overlap={top:4,right:4,bottom:4,left:4};
  const slots=[
    {id:"main-display",shortLabel:"メイン",label:"メインディスプレイ",x:43,y:173,width:304,height:151,overlap:{...overlap}},
    {id:"reels",shortLabel:"リール",label:"上部3リール",x:222,y:49,width:112,height:98,overlap:{...overlap}},
    {id:"start-stop",shortLabel:"操作卓",label:"操作卓・START/MAX BET/STOPボタン",x:42,y:326,width:306,height:50,overlap:{...overlap}},
    {id:"lower-panel",shortLabel:"下パネル",label:"下パネル",x:50,y:382,width:290,height:140,overlap:{...overlap}}
  ];

  const layerModel={frame:true,parts:true,shell:true};
  const lighting={enabled:true,mainColor:"#78b7ff",patternColor:"#ffd25f"};
  const state={sideMode:"normal",lowerMode:"normal",ledsOn:true};
  function getOpening(s){return{x:s.x+4,y:s.y+4,width:s.width-8,height:s.height-8};}

  const topColors=[["#ff4d72","#8b0c2a"],["#ff9c35","#883900"],["#ffe34f","#7a6000"]];
  const midColors=[["#4ff2c0","#046d55"],["#43a8ff","#0a3e95"],["#7c82ff","#34217f"]];

  function ledDots(){
    const n=15,c=(n-1)/2,out=[];
    for(let y=0;y<n;y++) for(let x=0;x<n;x++){
      const dx=x-c,dy=y-c,r=Math.hypot(dx,dy);
      const on=r<1.5 || ((Math.abs(dx)===Math.abs(dy)||dx===0||dy===0)&&r<5.4);
      out.push(`<i class="f9-dot ${on?'on':''}"></i>`);
    }
    return out.join("");
  }
  function ringDots(count=34){
    return Array.from({length:count},(_,i)=>{
      const a=(i/count)*Math.PI*2;
      const x=50+Math.cos(a)*50,y=50+Math.sin(a)*50;
      return `<i class="f9-ring-dot" style="left:${x}%;top:${y}%;animation-delay:${(i/count)*1.8}s"></i>`;
    }).join("");
  }
  function sideUnit(side,zone,colors){
    const leds=colors.map(c=>`<i class="f9-big-led" style="--c1:${c[0]};--c2:${c[1]}"></i>`).join("");
    return `<div class="f9-side-mech ${side} ${zone} ${state.sideMode==='open'?'open':''}">
      <div class="f9-mech-housing"><div class="f9-mech-prism">
        <div class="f9-mech-face cover"><i class="f9-led-bar"></i><i class="f9-prism-ridge"></i></div>
        <div class="f9-mech-face leds">${leds}</div>
      </div></div>
    </div>`;
  }

  function buildSvg(){
    const off=(!lighting.enabled||!state.ledsOn)?" leds-off":"";
    const lower=state.lowerMode==='rainbow'?" rainbow":"";
    const frameDisplay=layerModel.frame?'':' style="display:none"';
    const partsDisplay=layerModel.parts?'':' style="display:none"';
    const shellDisplay=layerModel.shell?'':' style="display:none"';
    return `<div class="f9-cabinet${off}" style="--f9-led-main:${lighting.mainColor};--f9-led-pattern:${lighting.patternColor}">
      <div class="f9-black-body"></div>

      <div class="f9-frame-layer"${frameDisplay}>
        <div class="f9-inner-spine"></div>
      </div>

      <div class="f9-parts-layer"${partsDisplay}>
        <section class="f9-top-unit">
          <div class="f9-top-speaker left"></div><div class="f9-top-speaker right"></div>
          <div class="f9-gold-crown"></div>
          <div class="f9-gold-mesh left"></div><div class="f9-gold-mesh center"></div>
          <div class="f9-dot-circle"><div class="f9-dot-grid">${ledDots()}</div><div class="f9-ring">${ringDots()}</div></div>
          <div class="f9-reel-box">${['7','★','7'].map(v=>`<div class="f9-reel"><span>${v}</span></div>`).join('')}</div>
        </section>

        <section class="f9-main-display"><div class="f9-screen"><div class="f9-rays"></div><strong>AURUM</strong><small>DUMMY VISUAL LAYER</small></div></section>

        <section class="f9-deck">
          <div class="f9-deck-lip"></div>
          <div class="f9-left-controls">
            <button type="button" class="f9-maxbet" aria-label="MAX BET"></button>
            <button type="button" class="f9-start-lever" aria-label="START"><i class="f9-lever-stem"></i><i class="f9-lever-knob"></i></button>
          </div>
          <div class="f9-stops">${[0,1,2].map(i=>`<button type="button" class="f9-stop" aria-label="stop ${i+1}"></button>`).join('')}</div>
        </section>

        <section class="f9-lower${lower}"><div class="f9-lower-led left"></div><div class="f9-lower-frame"><div class="f9-lower-art"><div class="f9-art-glow"></div></div></div><div class="f9-lower-led right"></div></section>
      </div>

      <div class="f9-shell-layer"${shellDisplay}>
        <div class="f9-shoulder left"><i></i><b></b></div><div class="f9-shoulder right"><i></i><b></b></div>
        <div class="f9-mid-shell left"><i></i><b></b></div><div class="f9-mid-shell right"><i></i><b></b></div>
        <div class="f9-waist left"></div><div class="f9-waist right"></div>
        <div class="f9-lower-shell left"><i></i></div><div class="f9-lower-shell right"><i></i></div>
        ${sideUnit('left','upper',topColors)}${sideUnit('right','upper',topColors)}
        ${sideUnit('left','middle',midColors)}${sideUnit('right','middle',midColors)}
      </div>

      <button type="button" class="f9-preview-side-toggle" onclick="window.F9PreviewToggleSide()" style="position:absolute;right:8px;bottom:8px;z-index:30;pointer-events:auto;padding:7px 10px;border-radius:8px;border:1px solid #68d9ff;background:#07131dcc;color:#8fe9ff;font-weight:800;font-size:11px;box-shadow:0 0 10px #31cfff66">SIDE ${state.sideMode==='open'?'CLOSE':'OPEN'}</button>
    </div>`;
  }

  function toggleSide(){
    state.sideMode=state.sideMode==='open'?'normal':'open';
    const isOpen=state.sideMode==='open';
    const cabinet=document.querySelector('.f9-cabinet');
    if(!cabinet){redrawFrameShell(FRAME_REGISTRY.f9);return;}
    cabinet.querySelectorAll('.f9-side-mech').forEach(mech=>mech.classList.toggle('open',isOpen));
    const button=cabinet.querySelector('.f9-preview-side-toggle');
    if(button) button.textContent=`SIDE ${isOpen?'CLOSE':'OPEN'}`;
  }
  window.F9PreviewToggleSide=toggleSide;

  function controls(){
    return `<section class="f9-controls" aria-labelledby="f9-control-heading">
      <h3 id="f9-control-heading">F9 Mechanism Test</h3>
      <div class="f9-control-grid">
        <button type="button" data-f9-action="side">SIDE LED : ${state.sideMode==='open'?'OPEN':'NORMAL'}</button>
        <button type="button" data-f9-action="lower">LOWER LED : ${state.lowerMode==='rainbow'?'RAINBOW':'NORMAL'}</button>
        <button type="button" data-f9-action="all">ALL LED : ${state.ledsOn?'ON':'OFF'}</button>
      </div>
      <p>Lovable版の3D回転プリズム機構をvanilla JSへ移植。外装はF9専用の多層CSS造形。</p>
    </section>`;
  }

  function bindControls(){
    document.querySelectorAll('[data-f9-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.f9Action;
      if(action==='side') state.sideMode=state.sideMode==='open'?'normal':'open';
      if(action==='lower') state.lowerMode=state.lowerMode==='rainbow'?'normal':'rainbow';
      if(action==='all') state.ledsOn=!state.ledsOn;
      redrawFrameShell(FRAME_REGISTRY.f9);
      renderDimensionEditor(FRAME_REGISTRY.f9);
    }));
  }

  FRAME_REGISTRY.f9={
    id:"f9",code:"F9",name:"Lovable Hybrid / 機構移植＋外装研究機",
    description:"Lovableで成立したSIDE LEDのNORMAL↔OPEN 3D回転プリズム、下パネルLEDのNORMAL↔RAINBOW、ALL LED ON/OFFをDesign Labのvanilla HTML/CSS/JSへ移植。外装は実機写真を基準に遊創舎側で再構築するハイブリッド研究フレーム。",
    slots,getOpening,lighting,layerModel,buildSvg,customControls:controls,bindCustomControls:bindControls
  };
})();