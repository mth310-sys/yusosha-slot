/* YuSosha Phaser Research v0.3.0
   Controlled comparison of Phaser Camera / Tween / Blend on the same 1G hit beat.
   Loaded after reel/audio patches. No external assets. */
(() => {
  const research = {
    mode: 'COMBO',
    triggerCount: 0,
    lastTrigger: '',
    cameraEvents: 0,
    tweenEvents: 0,
    blendEvents: 0
  };

  function canChange(){
    return !state.spinning && !state.bet;
  }

  function injectControls(){
    const tools = document.querySelector('.tools');
    if(!tools || document.querySelector('#phaserResearchModes')) return;

    const box = document.createElement('div');
    box.id = 'phaserResearchModes';
    box.className = 'mode-switch';
    box.setAttribute('role','group');
    box.setAttribute('aria-label','Phaser表現研究モード');
    box.style.flexWrap = 'wrap';
    box.style.gap = '4px';
    box.innerHTML = `
      <button data-research="BASE">P:BASE</button>
      <button data-research="CAMERA">P:CAM</button>
      <button data-research="BLEND">P:BLEND</button>
      <button data-research="COMBO" class="active">P:COMBO</button>`;
    tools.appendChild(box);

    box.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if(!canChange()) return;
        research.mode = btn.dataset.research;
        box.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
        logEvent('PHASER_LAB', research.mode);
      });
    });
  }

  function ensureRig(scene){
    if(scene.__researchRig) return scene.__researchRig;

    const flashRing = scene.add.circle(195, 151, 34, 0x8fdcff, 0)
      .setStrokeStyle(4, 0xbfeaff, .7)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(70);

    const core = scene.add.circle(195, 151, 10, 0xc9f2ff, 0)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(71);

    const sparks = [];
    for(let i=0;i<18;i++){
      const s = scene.add.rectangle(195,151,2+(i%3),7+(i%4),0xbfe8ff,0)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(72);
      sparks.push(s);
    }

    scene.__researchRig = { flashRing, core, sparks };
    return scene.__researchRig;
  }

  function cameraBeat(scene){
    const cam = scene.cameras.main;
    research.cameraEvents += 1;
    cam.shake(105,.0032);
    cam.zoomTo(1.055,145,'Cubic.easeOut');
    scene.time.delayedCall(170,()=>cam.zoomTo(1.025,210,'Sine.easeOut'));
  }

  function tweenBeat(scene, rig){
    research.tweenEvents += 1;
    rig.flashRing.setAlpha(.72).setScale(.55);
    rig.core.setAlpha(.5).setScale(.7);
    scene.tweens.add({targets:rig.flashRing,scale:3.1,alpha:0,duration:360,ease:'Cubic.Out'});
    scene.tweens.add({targets:rig.core,scale:4.2,alpha:0,duration:250,ease:'Quad.Out'});
  }

  function blendBeat(scene, rig){
    research.blendEvents += 1;
    const cx=195, cy=151;
    rig.sparks.forEach((s,i)=>{
      const a=(Math.PI*2*i)/rig.sparks.length + (i%2)*.12;
      const dist=58+(i%6)*10;
      s.setPosition(cx,cy).setRotation(a).setAlpha(.65).setScale(1);
      scene.tweens.add({
        targets:s,
        x:cx+Math.cos(a)*dist,
        y:cy+Math.sin(a)*dist*.72,
        alpha:0,
        scaleY:.35,
        duration:220+(i%5)*24,
        delay:(i%3)*9,
        ease:'Cubic.Out'
      });
    });
  }

  function runBeat(scene, label){
    research.triggerCount += 1;
    research.lastTrigger = label;
    const rig=ensureRig(scene);
    if(research.mode==='BASE') return;
    if(research.mode==='CAMERA') cameraBeat(scene);
    if(research.mode==='BLEND') { tweenBeat(scene,rig); blendBeat(scene,rig); }
    if(research.mode==='COMBO') { cameraBeat(scene); tweenBeat(scene,rig); blendBeat(scene,rig); }
    logEvent('PHASER_FX',`${research.mode}:${label}`);
  }

  const baseHitRelease=NextGenScene.prototype.hitRelease;
  NextGenScene.prototype.hitRelease=function(){
    baseHitRelease.call(this);
    runBeat(this,'HIT_RELEASE');
  };

  const baseBonus=NextGenScene.prototype.bonus;
  NextGenScene.prototype.bonus=function(){
    baseBonus.call(this);
    const rig=ensureRig(this);
    if(research.mode==='CAMERA'||research.mode==='COMBO'){
      research.cameraEvents += 1;
      this.cameras.main.flash(70,210,242,255);
    }
    if(research.mode==='BLEND'||research.mode==='COMBO'){
      research.blendEvents += 1;
      rig.core.setAlpha(.22).setScale(1);
      this.tweens.add({targets:rig.core,scale:7,alpha:0,duration:430,ease:'Sine.Out'});
    }
    logEvent('PHASER_FX',`${research.mode}:BONUS`);
  };

  const baseReset=NextGenScene.prototype.resetRound;
  NextGenScene.prototype.resetRound=function(){
    baseReset.call(this);
    const rig=this.__researchRig;
    if(rig){
      this.tweens.killTweensOf([rig.flashRing,rig.core,...rig.sparks]);
      rig.flashRing.setAlpha(0).setScale(1);
      rig.core.setAlpha(0).setScale(1);
      rig.sparks.forEach(s=>s.setAlpha(0).setPosition(195,151).setScale(1));
    }
  };

  window.__PHASER_RESEARCH_STATE__=()=>({
    ...research,
    blendModeAdd: Phaser.BlendModes.ADD,
    renderer: state.scene?.game?.renderer?.type ?? null,
    version: Phaser.VERSION || ''
  });

  injectControls();
  document.querySelector('.lab-head small').textContent='Integrated 1G Expression Prototype · PHASER LAB v0.3.0';
  logEvent('PATCH','PHASER_CAMERA_TWEEN_BLEND_V0_3_0');
})();