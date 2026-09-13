/* YUYU v0.4.1 — static clear acrylic front plate.
   Removes animated glass-like sweep and keeps only subtle fixed edge/refraction cues. */
(()=>{
  const attach=()=>{
    if(!state?.scene){requestAnimationFrame(attach);return}
    const s=state.scene;
    state.version='0.4.1';
    state.fx.glassSweep=false;
    state.fx.frontPlate='STATIC_CLEAR_ACRYLIC';
    state.fx.frontPlateDynamic=false;
    state.fx.frontPlateOpacity=0.008;
    if(s.glassGlow){s.glassGlow.destroy();s.glassGlow=null}
    if(s.edgeL)s.edgeL.setAlpha(.018);
    if(s.edgeR)s.edgeR.setAlpha(.018);
    // Physical acrylic cues: barely visible face, thin edge catches, no moving reflection.
    s.acrylicFace=s.add.rectangle(171,88,330,164,0xffffff,.008).setDepth(34);
    s.acrylicTop=s.add.rectangle(171,7,328,1,0xffffff,.16).setDepth(35);
    s.acrylicBottom=s.add.rectangle(171,169,328,1,0x8f8290,.10).setDepth(35);
    s.acrylicLeft=s.add.rectangle(7,88,1,162,0xffffff,.12).setDepth(35);
    s.acrylicRight=s.add.rectangle(335,88,1,162,0x8f8290,.08).setDepth(35);
    log('FRONT_PLATE','STATIC_CLEAR_ACRYLIC');
    log('GLASS_SWEEP','DISABLED');
    log('PATCH','STATIC_ACRYLIC_V0_4_1');
    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.1',phaser:{...x.phaser,glassSweep:false,frontPlate:'STATIC_CLEAR_ACRYLIC',frontPlateDynamic:false,frontPlateOpacity:.008},acrylic:{dynamic:false,sweep:false,faceObjectAlpha:s.acrylicFace?.alpha??null,faceFillAlpha:s.acrylicFace?.fillAlpha??null,edgeFillAlpha:[s.acrylicTop?.fillAlpha??null,s.acrylicBottom?.fillAlpha??null,s.acrylicLeft?.fillAlpha??null,s.acrylicRight?.fillAlpha??null]}};
    };
  };
  attach();
})();