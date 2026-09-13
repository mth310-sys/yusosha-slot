/* YUYU v0.3.2 — resilient Phaser FX path.
   Core reel locking is isolated from optional FX so visual research can never
   block the 1G game loop. Browser timers are used for the short stop latency. */
(() => {
  state.version='0.3.2';
  state.fx.errors=[];

  const recordFxError=(stage,e)=>{
    const message=String(e?.message||e);
    state.fx.errors.push({stage,message});
    log('FX_ERROR',`${stage}:${message}`);
    console.error(`[YUYU FX ${stage}]`,e);
  };

  YuyuScene.prototype.requestStop=function(i){
    const r=this.reels[i];
    if(!r.spinning||r.braking)return;
    r.braking=true;
    log('REEL_BRAKE',`R${i+1}`);
    const delay=72+i*8;
    window.setTimeout(()=>{
      log('STOP_TIMER',`R${i+1}:${delay}ms`);
      try{this.lock(i)}catch(e){recordFxError(`LOCK_R${i+1}`,e)}
    },delay);
  };

  YuyuScene.prototype.lock=function(i){
    const r=this.reels[i];
    r.spinning=false;
    r.braking=false;
    r.speed=0;
    r.offset=Math.round(r.offset/36)*36;
    r.locked=true;
    this.paint(r);
    state.locks[i]=true;
    log('REEL_ALIGN',`R${i+1}`);
    log('LOCK',String(i+1));
    tone(155+i*18,.035,.16,'sine');
    try{this.stopFx(i)}catch(e){recordFxError(`STOP_FX_R${i+1}`,e)}
  };

  YuyuScene.prototype.stopFx=function(i){
    const x=this.reels[i].x;
    state.fx.stopBursts++;
    try{this.cameras.main.shake(55,.0018);state.fx.cameraImpulses++}catch(e){recordFxError(`CAMERA_STOP_R${i+1}`,e)}
    for(let n=0;n<6;n++){
      const p=this.fxPool[this.fxCursor++%this.fxPool.length];
      const a=(Math.PI*2*n/6)+(i*.35);
      p.setPosition(x,88).setAlpha(.42).setScale(.7);
      this.tweens.add({targets:p,x:x+Math.cos(a)*(18+n*2),y:88+Math.sin(a)*(18+n*2),alpha:0,scale:1.5,duration:170+n*12,ease:'Quad.Out'});
    }
    const ring=this.add.circle(x,88,13,0xffffff,0).setStrokeStyle(2,0xff8dcc,.55).setDepth(49).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({targets:ring,scale:2.8,alpha:0,duration:190,ease:'Quad.Out',onComplete:()=>ring.destroy()});
    log('PHASER_FX',`STOP_BURST_R${i+1}`);
  };

  YuyuScene.prototype.bonusFx=function(){
    state.fx.bonusBursts++;
    try{this.cameras.main.shake(90,.0024);state.fx.cameraImpulses++}catch(e){recordFxError('CAMERA_BONUS',e)}
    this.tweens.add({targets:[this.edgeL,this.edgeR],alpha:.16,duration:110,yoyo:true,repeat:1});
    for(let n=0;n<18;n++){
      const p=this.fxPool[this.fxCursor++%this.fxPool.length];
      const x=25+(n%9)*36,y=48+(n%3)*38;
      p.setPosition(x,y).setAlpha(.55).setScale(.8);
      this.tweens.add({targets:p,y:y-18-(n%4)*5,alpha:0,scale:1.8,duration:260+(n%5)*40,delay:(n%6)*18,ease:'Cubic.Out'});
    }
    log('PHASER_FX','BONUS_BURST');
  };

  const sub=document.querySelector('header small');
  if(sub) sub.textContent='YUYU v0.3.2 · PHASER FX LAB';
  const note=document.querySelector('.note');
  if(note) note.textContent='遊遊 v0.3.2 — Phaser 4.2.1の光学・Tween・Camera・ADD FXを活用しつつ、リール停止系を独立保護。';
  log('PATCH','PHASER_FX_V0_3_2');
})();