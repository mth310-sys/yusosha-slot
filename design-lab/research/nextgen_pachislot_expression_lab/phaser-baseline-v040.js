/* YuSosha Phaser Baseline v0.4.0
   First integrated Phaser-first presentation baseline.
   Goal: one polished 1G using already-proven Phaser Camera/Tween/Blend/pooling,
   before introducing newer research features such as Stencil or Mesh2D. */
(() => {
  const baseline = { version:'0.4.0', hitBursts:0, stopBursts:0, transitions:0 };

  function buildRig(scene){
    if(scene.__baseline040) return scene.__baseline040;
    const horizon=scene.add.rectangle(195,214,390,2,0x7dcfff,0).setBlendMode(Phaser.BlendModes.ADD).setDepth(58);
    const halo=scene.add.circle(195,151,20,0x8bdcff,0).setStrokeStyle(3,0xd7f5ff,.75).setBlendMode(Phaser.BlendModes.ADD).setDepth(73);
    const streaks=[];
    for(let i=0;i<24;i++){
      streaks.push(scene.add.rectangle(195,151,2,10+(i%5)*3,0xc8efff,0).setBlendMode(Phaser.BlendModes.ADD).setDepth(74));
    }
    scene.__baseline040={horizon,halo,streaks};
    return scene.__baseline040;
  }

  function stopBurst(scene,index){
    const rig=buildRig(scene); baseline.stopBursts++;
    const x=92+index*103;
    rig.halo.setPosition(x,342).setScale(.35).setAlpha(.55);
    scene.tweens.add({targets:rig.halo,scale:1.65,alpha:0,duration:170,ease:'Cubic.Out'});
    scene.cameras.main.shake(34,.0012+(index*.00025));
  }

  function hitBurst(scene){
    const rig=buildRig(scene); baseline.hitBursts++; baseline.transitions++;
    rig.horizon.setAlpha(.65).setScale(0.15,1);
    scene.tweens.add({targets:rig.horizon,scaleX:1,alpha:0,duration:240,ease:'Cubic.Out'});
    rig.streaks.forEach((s,i)=>{
      const a=(Math.PI*2*i)/rig.streaks.length;
      const d=74+(i%6)*12;
      s.setPosition(195,151).setRotation(a).setScale(1).setAlpha(.55);
      scene.tweens.add({targets:s,x:195+Math.cos(a)*d,y:151+Math.sin(a)*d*.62,alpha:0,scaleY:.25,duration:250+(i%4)*25,delay:(i%4)*7,ease:'Cubic.Out'});
    });
    scene.cameras.main.shake(105,.0035);
    scene.cameras.main.zoomTo(1.065,150,'Cubic.easeOut');
    scene.time.delayedCall(175,()=>scene.cameras.main.zoomTo(1.03,260,'Sine.easeOut'));
  }

  const baseStop=NextGenScene.prototype.stopReel;
  NextGenScene.prototype.stopReel=function(i,onSettled){
    baseStop.call(this,i,onSettled);
    if(state.mode==='FULL') stopBurst(this,i);
  };

  const baseHit=NextGenScene.prototype.hitRelease;
  NextGenScene.prototype.hitRelease=function(){ baseHit.call(this); if(state.mode==='FULL') hitBurst(this); };

  const baseBonus=NextGenScene.prototype.bonus;
  NextGenScene.prototype.bonus=function(){
    baseBonus.call(this);
    const rig=buildRig(this);
    rig.halo.setPosition(195,151).setScale(.6).setAlpha(.7);
    this.tweens.add({targets:rig.halo,scale:5.2,alpha:0,duration:430,ease:'Sine.Out'});
    this.cameras.main.flash(80,218,241,255);
  };

  const baseReset=NextGenScene.prototype.resetRound;
  NextGenScene.prototype.resetRound=function(){
    baseReset.call(this);
    const rig=this.__baseline040;
    if(rig){
      this.tweens.killTweensOf([rig.horizon,rig.halo,...rig.streaks]);
      rig.horizon.setAlpha(0).setScale(1);
      rig.halo.setAlpha(0).setScale(1);
      rig.streaks.forEach(s=>s.setAlpha(0).setPosition(195,151).setScale(1));
    }
  };

  // v0.4 is a finished baseline, not a comparison UI. Keep v0.3 instrumentation loaded
  // underneath for regression data, but hide its research switches from the player.
  const researchControls=document.querySelector('#phaserResearchModes');
  if(researchControls){
    researchControls.hidden=true;
    researchControls.style.setProperty('display','none','important');
  }
  const basic=document.querySelector('#basicMode');
  const full=document.querySelector('#fullMode');
  if(basic) basic.hidden=true;
  if(full) full.hidden=true;
  const modeLabel=document.querySelector('#modeLabel');
  if(modeLabel) modeLabel.textContent='PHASER';
  const note=document.querySelector('.note');
  if(note) note.textContent='Phaser 4.2.1 基準機 v0.4.0 — Camera / Tween / ADD Blend / pooled effects / Web Audio を統合した1G完成基準。';
  document.querySelector('.lab-head small').textContent='PHASER BASELINE v0.4.0 · Integrated 1G';

  window.__PHASER_BASELINE_STATE__=()=>({
    ...baseline,
    phaser:Phaser.VERSION||'',
    renderer:state.scene?.game?.renderer?.type??null,
    fullMode:state.mode
  });
  logEvent('PATCH','PHASER_BASELINE_V0_4_0');
})();