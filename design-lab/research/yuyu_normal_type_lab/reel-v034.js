/* YUYU v0.3.6 — visible reel motion driver.
   Use Phaser Scene UPDATE event constant and guard against duplicate attachment. */
(() => {
  state.version='0.3.6';
  state.fx.reelModel='CONTINUOUS_CONVEYOR';
  state.fx.visualTravel=0;state.fx.spinFrames=0;state.fx.spinTravel=0;
  const SPACING=36,LOOP=252,mod=(n,m)=>((n%m)+m)%m;

  YuyuScene.prototype.paint=function(r){
    const travel=Number.isFinite(r.travel)?r.travel:(r.offset||0);
    const turns=Math.floor(travel/LOOP);
    r.cells.forEach((c,k)=>{
      const local=mod(k*SPACING-travel+LOOP/2,LOOP)-LOOP/2,y=88+local;
      const s=SYMBOLS[mod(k+turns*7+(r.symbolShift||0),SYMBOLS.length)];
      c.plate.y=y;c.label.y=y-2;c.sub.y=y+11;c.label.setText(s.t).setColor(s.c);c.sub.setText(s.sub).setColor(s.k==='bar'?'#7b6b51':s.c);
      const visible=y>=19&&y<=157,edge=Math.min(1,Math.max(.38,1-Math.abs(y-88)/118));
      c.plate.setVisible(visible).setAlpha((r.spinning?.92:1)*edge);c.label.setVisible(visible).setAlpha((r.spinning?.9:1)*edge);c.sub.setVisible(visible).setAlpha((r.spinning?.88:1)*edge);
    });
  };

  YuyuScene.prototype.begin=function(){
    this.reels.forEach((r,i)=>{r.travel=Number.isFinite(r.travel)?r.travel:(r.offset||i*72);r.symbolShift=i*2;r.spinning=true;r.braking=false;r.locked=false;r.speed=520+i*18;this.paint(r)});
    state.locks=[false,false,false];state.fx.spinFrames=0;state.fx.spinTravel=0;state.fx.visualTravel=0;
    try{this.tweens.add({targets:[this.edgeL,this.edgeR],alpha:.075,duration:140,yoyo:true});this.cameras.main.zoomTo(1.008,130,'Sine.Out');this.time.delayedCall(160,()=>this.cameras.main.zoomTo(1,180,'Sine.InOut'))}catch(e){log('FX_ERROR',`BEGIN:${String(e?.message||e)}`)}
    log('REEL','SPIN');log('REEL_MODEL','CONTINUOUS_CONVEYOR');
  };
  YuyuScene.prototype.requestStop=function(i){const r=this.reels[i];if(!r.spinning||r.braking)return;r.braking=true;log('REEL_BRAKE',`R${i+1}`);const delay=118+i*14;window.setTimeout(()=>{log('STOP_TIMER',`R${i+1}:${delay}ms`);this.lock(i)},delay)};
  YuyuScene.prototype.lock=function(i){const r=this.reels[i];r.spinning=false;r.braking=false;r.speed=0;r.travel=Math.round((r.travel||0)/SPACING)*SPACING;r.offset=mod(r.travel,432);r.locked=true;this.paint(r);state.locks[i]=true;log('REEL_ALIGN',`R${i+1}`);log('LOCK',String(i+1));tone(155+i*18,.035,.16,'sine');try{this.stopFx(i)}catch(e){log('FX_ERROR',`STOP_FX_R${i+1}:${String(e?.message||e)}`)}};

  function drive(_time,delta){
    const scene=state.scene;if(!scene)return;const dt=Math.min(Math.max(delta||16.666,4),50)/1000;let moving=0;
    scene.reels.forEach(r=>{if(!r.spinning)return;if(r.braking)r.speed=Math.max(175,r.speed*(1-Math.min(.82,dt*6.4)));const d=r.speed*dt;r.travel=(r.travel||0)+d;r.offset=mod(r.travel,432);state.fx.spinTravel+=d;state.fx.visualTravel+=d;moving++;scene.paint(r)});
    if(moving){state.fx.spinFrames++;if(state.fx.spinFrames===2)log('REEL_ROTATION','VISIBLE_ACTIVE')}
  }
  function attachDriver(){const scene=state.scene;if(!scene){requestAnimationFrame(attachDriver);return}if(scene.__yuyuReelDriverAttached)return;scene.__yuyuReelDriverAttached=true;const eventName=Phaser.Scenes?.Events?.UPDATE||'update';scene.events.on(eventName,drive);log('REEL_DRIVER',`ATTACHED:${eventName}`)}
  attachDriver();

  const priorState=window.__YUYU_STATE__;window.__YUYU_STATE__=()=>{const s=priorState?priorState():{};return {...s,version:'0.3.6',phaser:{...(s.phaser||{}),reelModel:'CONTINUOUS_CONVEYOR',spinFrames:state.fx.spinFrames,spinTravel:state.fx.spinTravel,visualTravel:state.fx.visualTravel},reels:state.scene?.reels.map((r,i)=>({index:i+1,offset:r.offset||0,travel:r.travel||0,speed:r.speed||0,spinning:!!r.spinning,braking:!!r.braking,locked:!!r.locked,latticeError:r.locked?Math.abs((r.travel||0)-Math.round((r.travel||0)/36)*36):null,sampleY:r.cells?.[0]?.label?.y??null}))||[]}};
  const sub=document.querySelector('header small');if(sub)sub.textContent='YUYU v0.3.6 · REEL DRIVER FIX';const note=document.querySelector('.note');if(note)note.textContent='遊遊 v0.3.6 — Phaser Scene UPDATEイベントへ回転ドライバを接続し、図柄座標の連続移動を検査。';log('PATCH','REEL_DRIVER_FIX_V0_3_6');
})();