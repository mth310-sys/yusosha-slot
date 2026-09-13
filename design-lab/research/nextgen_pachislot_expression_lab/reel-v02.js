/* Next-Gen Pachislot Expression Lab v0.2
   Focused reel realism patch. Loaded after app.js and before Phaser scene boot. */
(() => {
  const SYMBOLS = [
    ['BAR',0x15171b,'#eceef1'], ['7',0x9b1020,'#f6e7e9'], ['◆',0x20242a,'#f1f2f4'],
    ['CH',0xd99118,'#fff0bd'], ['●',0x24735e,'#dcfff3'], ['BELL',0xb87b16,'#fff3b8'],
    ['7',0x9b1020,'#f6e7e9'], ['◆',0x20242a,'#f1f2f4'], ['BAR',0x15171b,'#eceef1'],
    ['CH',0xd99118,'#fff0bd'], ['●',0x24735e,'#dcfff3'], ['◆',0x20242a,'#f1f2f4'],
    ['7',0x9b1020,'#f6e7e9'], ['BAR',0x15171b,'#eceef1'], ['BELL',0xb87b16,'#fff3b8'],
    ['◆',0x20242a,'#f1f2f4'], ['CH',0xd99118,'#fff0bd'], ['7',0x9b1020,'#f6e7e9'],
    ['●',0x24735e,'#dcfff3'], ['BAR',0x15171b,'#eceef1'], ['◆',0x20242a,'#f1f2f4']
  ];
  const SPACING = 39;
  const REEL_Y = 342;

  audio.motorOsc = null;
  audio.motorGain = null;
  audio.motorFilter = null;
  audio.stopPress = function(n){
    this.tone(128+n*9,.035,'triangle',.10);
    logEvent('AUDIO',`STOP${n}_PRESS`);
  };
  audio.reelLock = function(n){
    this.tone(118+n*14,.075,'triangle',.36,0,82+n*5);
    this.noise(.055,.075,.004);
    logEvent('AUDIO',`STOP${n}_LOCK`);
  };
  audio.startMotor = function(){
    if(!state.audioEnabled || !this.ctx || !this.master || this.motorOsc)return;
    const now=this.ctx.currentTime;
    this.motorOsc=this.ctx.createOscillator();
    this.motorGain=this.ctx.createGain();
    this.motorFilter=this.ctx.createBiquadFilter();
    this.motorOsc.type='sawtooth';
    this.motorOsc.frequency.setValueAtTime(38,now);
    this.motorOsc.frequency.exponentialRampToValueAtTime(72,now+.20);
    this.motorFilter.type='lowpass'; this.motorFilter.frequency.value=210;
    this.motorGain.gain.setValueAtTime(.0001,now);
    this.motorGain.gain.exponentialRampToValueAtTime(.035,now+.18);
    this.motorOsc.connect(this.motorFilter); this.motorFilter.connect(this.motorGain); this.motorGain.connect(this.master);
    this.motorOsc.start(now);
    logEvent('AUDIO','REEL_MOTOR_START');
  };
  audio.motorLevel = function(activeCount){
    if(!this.ctx || !this.motorGain)return;
    const now=this.ctx.currentTime;
    const level=activeCount<=0?.0001:.012+activeCount*.0075;
    this.motorGain.gain.cancelScheduledValues(now);
    this.motorGain.gain.setTargetAtTime(level,now,.035);
  };
  audio.stopMotor = function(){
    if(!this.ctx || !this.motorOsc || !this.motorGain)return;
    const now=this.ctx.currentTime;
    this.motorGain.gain.cancelScheduledValues(now);
    this.motorGain.gain.setTargetAtTime(.0001,now,.03);
    const osc=this.motorOsc;
    setTimeout(()=>{try{osc.stop()}catch{}},180);
    this.motorOsc=null; this.motorGain=null; this.motorFilter=null;
    logEvent('AUDIO','REEL_MOTOR_STOP');
  };

  NextGenScene.prototype.buildReels = function(){
    const y=REEL_Y, frameW=334, frameH=132;
    this.reelBack=this.add.rectangle(195,y+1,frameW+10,frameH+10,0x06080b,1).setStrokeStyle(2,0x050607).setDepth(20);
    this.reelLamp=this.add.rectangle(195,y,frameW-8,frameH-8,0xe8eef6,.12).setDepth(21);

    for(let i=0;i<3;i++){
      const x=92+i*103;
      const well=this.add.rectangle(x,y,96,114,0xe3e6ea,1).setDepth(22);
      const maskShape=this.make.graphics({x:0,y:0,add:false});
      maskShape.fillStyle(0xffffff).fillRoundedRect(x-46,y-55,92,110,3);
      const mask=maskShape.createGeometryMask();
      const cells=[];
      for(let j=0;j<7;j++){
        const group=this.add.container(x,y+(j-3)*SPACING).setDepth(24).setMask(mask);
        const plate=this.add.rectangle(0,0,90,37,0xf3f4f6,1);
        const label=this.add.text(0,0,'',{fontFamily:'Arial Black,Arial,sans-serif',fontStyle:'bold',fontSize:'22px',color:'#17191d'}).setOrigin(.5);
        group.add([plate,label]);
        cells.push({group,plate,label});
      }
      const topShade=this.add.rectangle(x,y-49,92,15,0x05070a,.38).setDepth(28).setMask(mask);
      const bottomShade=this.add.rectangle(x,y+49,92,15,0x05070a,.44).setDepth(28).setMask(mask);
      const leftShade=this.add.rectangle(x-43,y,11,110,0x05070a,.20).setDepth(28).setMask(mask);
      const rightShade=this.add.rectangle(x+43,y,11,110,0x05070a,.20).setDepth(28).setMask(mask);
      const spec=this.add.rectangle(x-27,y-5,11,101,0xffffff,.055).setAngle(4).setDepth(29).setMask(mask);
      this.reels.push({x,y,well,mask,cells,topShade,bottomShade,leftShade,rightShade,spec,offset:0,speed:0,targetSpeed:0,mode:'idle',baseIndex:(i*3+1)%SYMBOLS.length,onSettled:null});
    }

    this.separatorL=this.add.rectangle(143.5,y,7,116,0x2b3038,1).setStrokeStyle(1,0x7b8490,.55).setDepth(40);
    this.separatorR=this.add.rectangle(246.5,y,7,116,0x2b3038,1).setStrokeStyle(1,0x7b8490,.55).setDepth(40);
    this.reelFrame=this.add.rectangle(195,y,334,132,0x8f98a6,.16).setStrokeStyle(5,0x20252d).setDepth(41);
    this.reelGlass=this.add.rectangle(195,y,326,118,0xdceaff,.04).setStrokeStyle(1,0xaab9c9,.25).setDepth(42);
    this.reelGlassHighlight=this.add.rectangle(163,y-35,188,6,0xffffff,.065).setAngle(-2).setDepth(43);
    this.reelShade=this.add.rectangle(195,y,334,132,0x001020,.06).setDepth(44);
    this.reels.forEach(r=>this.paintReelV02(r));
  };

  NextGenScene.prototype.paintReelV02 = function(r){
    const wrapped=((r.offset%SPACING)+SPACING)%SPACING;
    const step=Math.floor(r.offset/SPACING);
    r.cells.forEach((cell,j)=>{
      let local=(j-3)*SPACING+wrapped;
      while(local>SPACING*3.5)local-=SPACING*7;
      while(local<-SPACING*3.5)local+=SPACING*7;
      const idx=(r.baseIndex-step-j+3+SYMBOLS.length*30)%SYMBOLS.length;
      const [name,ink,paper]=SYMBOLS[idx];
      const norm=Math.min(1,Math.abs(local)/58);
      const curve=1-(norm*norm*.13);
      cell.group.setY(r.y+local).setScale(curve,.94+(1-norm)*.06).setAlpha(.62+(1-norm)*.38);
      cell.plate.setFillStyle(parseInt(paper.slice(1),16),1);
      cell.label.setText(name).setColor(`#${ink.toString(16).padStart(6,'0')}`).setFontSize(name==='BELL'?14:name==='BAR'?17:22);
    });
  };

  NextGenScene.prototype.applyMode = function(mode){
    this.particles.forEach(p=>p.setVisible(mode==='FULL'));
    this.heroAura.setVisible(mode==='FULL');
    this.mecha.setVisible(mode==='FULL');
    this.message.setText(mode==='FULL'?'静かな通常時':'通常状態');
    if(this.reelGlass)this.reelGlass.setAlpha(mode==='FULL'?.055:.02);
    if(this.reelGlassHighlight)this.reelGlassHighlight.setAlpha(mode==='FULL'?.075:.025);
  };

  NextGenScene.prototype.resetRound = function(){
    this.cameras.main.resetFX(); this.cameras.main.setZoom(1); this.cameras.main.centerOn(195,220);
    this.hero.setScale(1).setAngle(0).setX(196); this.heroAura.setScale(1).setAlpha(.06);
    this.eye.setFillStyle(0x8adfff); this.skyGlow.setAlpha(.10).setScale(1);
    this.mecha.setY(50).setAlpha(.35); this.title.setAlpha(1).setText('NOCTURNE // DISTRICT 01').setColor('#70829b');
    this.message.setFontSize(14).setColor('#aeb9ca').setText(state.mode==='FULL'?'静かな通常時':'通常状態');
    this.vignette.setAlpha(.05); this.reelShade.setFillStyle(0x001020,.06); this.reelLamp.setAlpha(.12);
    this.reels.forEach((r,i)=>{r.mode='idle';r.speed=0;r.targetSpeed=0;r.offset=0;r.baseIndex=(i*3+1)%SYMBOLS.length;r.onSettled=null;this.paintReelV02(r);});
  };

  NextGenScene.prototype.beginSpin = function(){
    const now=this.time.now;
    this.reels.forEach((r,i)=>{
      r.mode='accelerating'; r.speed=0;
      r.targetSpeed=state.mode==='FULL'?1.62:1.15;
      r.accelStart=now+i*16;
      r.accelDuration=state.mode==='FULL'?190:70;
    });
    this.message.setText('');
    this.reelShade.setFillStyle(0x001020,.13);
    this.tweens.add({targets:this.reelLamp,alpha:state.mode==='FULL'?.24:.15,duration:140,ease:'Sine.Out'});
    logEvent('REEL','ACCEL_START');
    this.time.delayedCall(state.mode==='FULL'?220:90,()=>{
      if(state.spinning){setPhase('spin','REELS SPINNING');logEvent('REEL','CRUISE');}
    });
  };

  NextGenScene.prototype.update = function(time,delta){
    const dt=Math.min(delta,34);
    this.reels.forEach(r=>{
      if(r.mode==='idle'||r.mode==='locked'||r.mode==='settling')return;
      if(r.mode==='accelerating'){
        const p=Phaser.Math.Clamp((time-r.accelStart)/r.accelDuration,0,1);
        r.speed=r.targetSpeed*(1-Math.pow(1-p,3));
        if(p>=1)r.mode='cruise';
      }else if(r.mode==='stopping'){
        const p=Phaser.Math.Clamp((time-r.stopStart)/r.stopDuration,0,1);
        r.speed=r.stopFromSpeed*Math.pow(1-p,3);
        if(p>=1){this.settleReelV02(r);return;}
      }
      r.offset+=r.speed*dt;
      this.paintReelV02(r);
      const motion=Phaser.Math.Clamp(r.speed/1.62,0,1);
      r.cells.forEach(c=>c.group.setAlpha(c.group.alpha*(1-.16*motion)));
    });
  };

  NextGenScene.prototype.stopReel = function(i,onSettled){
    const r=this.reels[i];
    if(!r||['stopping','settling','locked'].includes(r.mode))return;
    r.mode='stopping'; r.stopStart=this.time.now;
    r.stopDuration=state.mode==='FULL'?175:65;
    r.stopFromSpeed=Math.max(r.speed,state.mode==='FULL'?.9:.65);
    r.onSettled=onSettled;
    if(state.mode==='FULL')this.cameras.main.shake(34,.0011);
    logEvent('REEL',`STOP${i+1}_BRAKE`);
  };

  NextGenScene.prototype.settleReelV02 = function(r){
    if(r.mode==='settling'||r.mode==='locked')return;
    r.mode='settling'; r.speed=0;
    const nearest=Math.round(r.offset/SPACING)*SPACING;
    const overshoot=state.mode==='FULL'?8:2;
    const proxy={v:r.offset};
    this.tweens.add({targets:proxy,v:nearest+overshoot,duration:state.mode==='FULL'?70:30,ease:'Cubic.Out',onUpdate:()=>{r.offset=proxy.v;this.paintReelV02(r);},onComplete:()=>{
      this.tweens.add({targets:proxy,v:nearest,duration:state.mode==='FULL'?92:34,ease:'Back.Out',onUpdate:()=>{r.offset=proxy.v;this.paintReelV02(r);},onComplete:()=>this.lockReelV02(r)});
    }});
  };

  NextGenScene.prototype.lockReelV02 = function(r){
    r.mode='locked'; r.speed=0; this.paintReelV02(r);
    this.tweens.add({targets:r.well,alpha:.82,duration:45,yoyo:true,ease:'Quad.Out'});
    this.tweens.add({targets:this.reelLamp,alpha:state.mode==='FULL'?.30:.18,duration:55,yoyo:true,ease:'Quad.Out'});
    if(state.mode==='FULL')this.cameras.main.shake(54,.0017);
    logEvent('REEL',`LOCK_${this.reels.indexOf(r)+1}`);
    const cb=r.onSettled; r.onSettled=null; if(cb)cb();
  };

  const baseJudgement=NextGenScene.prototype.judgement;
  NextGenScene.prototype.judgement=function(full){
    baseJudgement.call(this,full);
    if(full)this.tweens.add({targets:this.reelLamp,alpha:.035,duration:80});
  };
  const baseHitRelease=NextGenScene.prototype.hitRelease;
  NextGenScene.prototype.hitRelease=function(){
    this.tweens.add({targets:this.reelLamp,alpha:.36,duration:110,yoyo:true});
    baseHitRelease.call(this);
  };

  TIMELINE.leverOn = function(scene){
    logEvent('GAME_EVENT','LEVER_ON');
    setPhase('spin','REELS ACCELERATING');
    audio.start(); audio.startMotor(); scene.beginSpin();
    if(state.mode==='FULL'){scene.cameraPush(1.014,190);scene.characterLean();}
  };
  TIMELINE.stop1 = function(scene){
    logEvent('GAME_EVENT','STOP_1'); audio.stopPress(1);
    scene.stopReel(0,()=>{
      audio.reelLock(1); audio.motorLevel(2);
      if(state.mode==='FULL'){setPhase('omen','違和感…');audio.omen();scene.omenOne();}
      else statusEl.textContent='STOP 1';
    });
  };
  TIMELINE.stop2 = function(scene){
    logEvent('GAME_EVENT','STOP_2'); audio.stopPress(2);
    scene.stopReel(1,()=>{
      audio.reelLock(2); audio.motorLevel(1);
      if(state.mode==='FULL'){setPhase('omen','気配が近い');scene.omenTwo();}
      else statusEl.textContent='STOP 2';
    });
  };
  TIMELINE.stop3 = function(scene){
    logEvent('GAME_EVENT','STOP_3'); audio.stopPress(3);
    scene.stopReel(2,()=>{
      audio.reelLock(3); audio.motorLevel(0); audio.stopMotor();
      logEvent('GAME_EVENT','ALL_REELS_LOCKED');
      setPhase('judge','……'); scene.judgement(state.mode==='FULL');
      if(state.mode==='FULL'){
        audio.silenceBeat();
        setTimeout(()=>scene.mechanismDrop(),200);
        setTimeout(()=>scene.hitRelease(),410);
        setTimeout(()=>{
          machine.classList.remove('full-pulse'); void machine.offsetWidth; machine.classList.add('full-pulse');
          setPhase('bonus','BONUS'); audio.bonus(); scene.bonus(); logEvent('GAME_EVENT','BONUS_ENTER');
        },670);
      }else{
        setTimeout(()=>{setPhase('bonus','BONUS');audio.bonus();scene.basicBonus();logEvent('GAME_EVENT','BONUS_ENTER_BASIC');},360);
      }
      setTimeout(endGame,state.mode==='FULL'?2600:1700);
    });
  };

  document.querySelector('.lab-head small').textContent='Integrated 1G Expression Prototype · REEL v0.2';
  logEvent('PATCH','REEL_REALISM_V0_2');
})();
