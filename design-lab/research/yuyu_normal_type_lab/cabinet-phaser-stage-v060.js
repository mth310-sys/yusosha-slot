/* YUYU v0.6.0 — Phaser-driven cabinet compositor.
   This is intentionally a generation jump: Phaser now renders a transparent cabinet-wide optical / material stage,
   while the stable reel core remains isolated in the original scene. No moving glass sweep is introduced. */
(()=>{
 const attach=()=>{
  if(!window.Phaser||typeof state==='undefined'||!state.scene||state.version!=='0.5.3'){requestAnimationFrame(attach);return}
  const telemetry={
   mode:'PHASER_CABINET_COMPOSITOR_V060',enabled:false,separatePhaserStage:false,
   technologyStack:['Mesh2D','ADD_BLEND','GRAPHICS_MATERIAL_PLANES','DOM_GEOMETRY_BINDING','BONUS_TWEEN'],
   meshRails:0,orderedIndices:false,materialPlanes:0,lampOptics:0,controlRings:0,
   reelWindowOptics:true,lowerPanelOptics:true,movingGlass:false,reelGeometryChanged:false,symbolGeometryChanged:false,
   errors:[]
  };
  try{
   const machine=document.querySelector('#machine');
   const stageHost=document.createElement('div');stageHost.id='cabinet-phaser-stage';stageHost.setAttribute('aria-hidden','true');machine.appendChild(stageHost);
   const w=Math.max(1,Math.round(machine.clientWidth)),h=Math.max(1,Math.round(machine.clientHeight));
   const rel=el=>{const mr=machine.getBoundingClientRect(),r=el.getBoundingClientRect();return{x:r.left-mr.left+r.width/2,y:r.top-mr.top+r.height/2,w:r.width,h:r.height}};
   class CabinetStage extends Phaser.Scene{
    constructor(){super('cabinet-v060');this.bonusLatched=false;this.lampLayers=[]}
    create(){
     try{
      this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
      const ADD=Phaser.BlendModes.ADD;
      const top=rel(document.querySelector('.top-crown')),reel=rel(document.querySelector('.reel-bezel')),meter=rel(document.querySelector('.meter')),deck=rel(document.querySelector('.deck')),lower=rel(document.querySelector('.lower'));
      const lamps=[...document.querySelectorAll('.flower')].map(rel),stopRects=[...document.querySelectorAll('.stop')].map(rel),deckButtons=[...document.querySelectorAll('.deck>button')].map(rel);
      const g=this.add.graphics().setDepth(3);
      g.lineStyle(1,0xffe8f5,.18);g.strokeRoundedRect(4,4,w-8,h-8,26);
      g.lineStyle(4,0x160b12,.88);g.strokeRoundedRect(9,9,w-18,h-18,22);
      g.lineStyle(1,0xb889a8,.12);g.strokeRoundedRect(13,13,w-26,h-26,19);
      telemetry.materialPlanes+=3;
      const key='yuyu_v060_rail_metal';
      if(!this.textures.exists(key)){
       const tex=this.textures.createCanvas(key,48,256),ctx=tex.context;
       ctx.clearRect(0,0,48,256);
       const xg=ctx.createLinearGradient(0,0,48,0);
       xg.addColorStop(0,'rgba(0,0,0,.92)');xg.addColorStop(.16,'rgba(79,42,65,.92)');xg.addColorStop(.34,'rgba(228,190,215,.36)');xg.addColorStop(.48,'rgba(255,239,249,.68)');xg.addColorStop(.59,'rgba(122,72,101,.48)');xg.addColorStop(.82,'rgba(29,13,24,.9)');xg.addColorStop(1,'rgba(0,0,0,.96)');
       ctx.fillStyle=xg;ctx.fillRect(0,0,48,256);
       const yg=ctx.createLinearGradient(0,0,0,256);yg.addColorStop(0,'rgba(255,255,255,.16)');yg.addColorStop(.18,'rgba(255,255,255,0)');yg.addColorStop(.78,'rgba(0,0,0,.08)');yg.addColorStop(1,'rgba(0,0,0,.42)');ctx.fillStyle=yg;ctx.fillRect(0,0,48,256);tex.refresh();
      }
      const rows=7,cols=3,verts=[],idx=[];const railH=h-36,ys=[-railH/2,-railH*.34,-railH*.17,0,railH*.17,railH*.34,railH/2],xs=[-10,0,10];
      for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++){const bow=(1-Math.abs(ys[ry])/(railH/2))*.95;verts.push(xs[cx]+(cx===1?bow:0),ys[ry],cx/2,ry/(rows-1));}
      for(let ry=0;ry<rows-1;ry++)for(let cx=0;cx<cols-1;cx++){const a=ry*cols+cx,b=a+1,c=a+cols,d=c+1;idx.push(a,b,c,0,b,d,c,0)}
      const rails=[this.add.mesh2d(12,h/2,key,[...verts],[...idx],false),this.add.mesh2d(w-12,h/2,key,[...verts],[...idx],false)];
      rails.forEach((m,i)=>{m.setDepth(4).setAlpha(.92);if(i===1)m.setScale(-1,1);m.buildOrderedIndices(2,true).setUseOrderedIndices(true)});
      telemetry.meshRails=rails.length;telemetry.orderedIndices=rails.every(m=>m.useOrderedIndices===true);
      const material=this.add.graphics().setDepth(5);
      material.lineStyle(2,0xffe5f4,.14);material.strokeRoundedRect(top.x-top.w/2+7,top.y-top.h/2+7,top.w-14,top.h-14,18);
      material.lineStyle(3,0x090406,.72);material.strokeRoundedRect(reel.x-reel.w/2+8,reel.y-reel.h/2+8,reel.w-16,reel.h-16,8);
      material.lineStyle(1,0xf5dcc7,.20);material.strokeRoundedRect(reel.x-reel.w/2+12,reel.y-reel.h/2+12,reel.w-24,reel.h-24,6);
      material.lineStyle(2,0x000000,.58);material.strokeRoundedRect(meter.x-meter.w/2+2,meter.y-meter.h/2+2,meter.w-4,meter.h-4,4);
      material.lineStyle(1,0xf7edf2,.12);material.strokeRoundedRect(deck.x-deck.w/2+4,deck.y-deck.h/2+4,deck.w-8,deck.h-8,9);
      material.lineStyle(1,0xffdbef,.13);material.strokeRoundedRect(lower.x-lower.w/2+8,lower.y-lower.h/2+8,lower.w-16,lower.h-16,7);
      telemetry.materialPlanes+=6;
      lamps.forEach((r,i)=>{
       const shadow=this.add.circle(r.x,r.y,r.w*.52,0x16050f,.24).setDepth(6);
       const rim=this.add.circle(r.x,r.y,r.w*.47,0xffffff,0).setStrokeStyle(2,0xffd8ed,.16).setDepth(7).setBlendMode(ADD);
       const lens=this.add.circle(r.x,r.y,r.w*.39,0xff8ccd,.025).setStrokeStyle(1,0xffffff,.13).setDepth(7).setBlendMode(ADD);
       const halo=this.add.circle(r.x,r.y,r.w*.46,0xff55b7,.018).setDepth(6).setBlendMode(ADD);
       this.lampLayers.push({shadow,rim,lens,halo,index:i});telemetry.lampOptics+=4;
      });
      stopRects.forEach(r=>{this.add.circle(r.x,r.y,Math.min(r.w,r.h)*.51,0xffffff,0).setStrokeStyle(2,0xc9aebd,.24).setDepth(8);this.add.circle(r.x,r.y,Math.min(r.w,r.h)*.42,0xffffff,0).setStrokeStyle(1,0xffffff,.12).setDepth(8).setBlendMode(ADD);telemetry.controlRings+=2;});
      deckButtons.forEach(r=>{this.add.circle(r.x,r.y,Math.min(r.w,r.h)*.50,0xffffff,0).setStrokeStyle(1,0xe7dae1,.18).setDepth(8);telemetry.controlRings++;});
      this.add.rectangle(reel.x-reel.w*.42,reel.y,8,reel.h*.72,0x000000,.20).setDepth(6);
      this.add.rectangle(reel.x+reel.w*.42,reel.y,8,reel.h*.72,0x000000,.20).setDepth(6);
      this.add.ellipse(lower.x,lower.y,lower.w*.50,lower.h*.44,0xff4fae,.018).setDepth(5).setBlendMode(ADD);
      telemetry.materialPlanes+=3;
      telemetry.enabled=true;telemetry.separatePhaserStage=true;
      log('CABINET_STAGE','PHASER_COMPOSITOR_READY');log('CABINET_STAGE_MESH',`RAILS:${telemetry.meshRails}`);log('CABINET_STAGE_LENS',`LAYERS:${telemetry.lampOptics}`);
     }catch(e){telemetry.errors.push(String(e?.message||e));log('CABINET_STAGE_ERROR',String(e?.message||e));}
    }
    update(){
     if(state.phase==='bonus'&&!this.bonusLatched){
      this.bonusLatched=true;
      try{this.lampLayers.forEach((x,i)=>{x.lens.setAlpha(.14);x.halo.setAlpha(.10);this.tweens.add({targets:[x.lens,x.halo],scale:1.17,alpha:{from:.16,to:.055},duration:420+i*45,yoyo:true,repeat:1});x.rim.setStrokeStyle(2,0xffc8e7,.42)});log('CABINET_STAGE_BONUS','LENS_TWEEN')}
      catch(e){telemetry.errors.push(String(e?.message||e));log('CABINET_STAGE_ERROR',String(e?.message||e));}
     }
    }
   }
   const game=new Phaser.Game({type:Phaser.WEBGL,width:w,height:h,parent:stageHost,transparent:true,scene:CabinetStage,render:{antialias:true,pixelArt:false,transparent:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});
   state.version='0.6.0';state.fx.cabinetRenderer='PHASER_2_5D_COMPOSITOR_V060';state.fx.cabinetStageGame=true;
   const prior=window.__YUYU_STATE__;
   window.__YUYU_STATE__=()=>{const x=prior();return {...x,version:'0.6.0',phaser:{...x.phaser,cabinetRenderer:'PHASER_2_5D_COMPOSITOR_V060',cabinetStageGame:true},cabinetStage:{...telemetry,gameRenderer:game?.renderer?.type??null,width:w,height:h}}};
   document.documentElement.dataset.yuyuPhaserStage='v060';
   log('PATCH','PHASER_CABINET_COMPOSITOR_V0_6_0');log('CABINET_MOVING_GLASS','FALSE');
  }catch(e){telemetry.errors.push(String(e?.message||e));log('CABINET_STAGE_BOOT_ERROR',String(e?.message||e));}
 };
 attach();
})();
