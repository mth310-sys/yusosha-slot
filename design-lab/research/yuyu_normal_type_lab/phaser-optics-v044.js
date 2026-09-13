/* YUYU v0.4.4 — Phaser 4 unified-filter optics experiment.
   Purpose: test whether restrained GPU filters improve physical depth without turning the reel window into an LCD-like effect.
   The proven reel motion / lock core is untouched. */
(()=>{
  const attach=()=>{
    if(!state?.scene||state.version!=='0.4.3'){requestAnimationFrame(attach);return}
    const sc=state.scene;
    const errors=[];
    const filters={cameraVignette:false,reelEdgeGlow:0,api:'PHASER_4_UNIFIED_FILTERS',dynamic:false};

    try{
      const cam=sc.cameras.main;
      // Static optical falloff only. No animated glass sweep / screen effect.
      const vig=cam.filters?.external?.addVignette?.(.5,.5,.72,.16,0x120c0b,Phaser.BlendModes.MULTIPLY);
      if(vig){filters.cameraVignette=true;sc.yuyuVignette=vig;}
    }catch(e){errors.push(`VIGNETTE:${String(e?.message||e)}`)}

    sc.reels.forEach(r=>{
      [r.rollEdgeL,r.rollEdgeR].forEach(edge=>{
        try{
          edge.enableFilters();
          const glow=edge.filters?.internal?.addGlow?.(0xf1d3a0,.75,0,.75,false,8,3);
          if(glow){filters.reelEdgeGlow++;}
        }catch(e){errors.push(`EDGE_GLOW_R${r.index+1}:${String(e?.message||e)}`)}
      });
      // Fixed warm internal reflection, deliberately extremely faint.
      r.coreReflection=sc.add.rectangle(r.x,88,18,160,0xffefd3,.012).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
    });

    state.version='0.4.4';
    state.fx.gpuOptics='V4_FILTER_OPTICS';
    state.fx.gpuFilterErrors=errors;
    state.fx.cameraVignette=filters.cameraVignette;
    state.fx.reelEdgeGlow=filters.reelEdgeGlow;
    state.fx.opticsDynamic=false;
    state.fx.referenceTarget='HANAHANA_CLASS_NORMAL_TYPE';

    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.4',phaser:{...x.phaser,gpuOptics:'V4_FILTER_OPTICS',gpuFilterErrors:[...errors],cameraVignette:filters.cameraVignette,reelEdgeGlow:filters.reelEdgeGlow,opticsDynamic:false,referenceTarget:'HANAHANA_CLASS_NORMAL_TYPE'},optics:{...filters,errors:[...errors],goal:'PHYSICAL_DEPTH_NOT_SCREEN_EFFECT'}};
    };

    log('PHASER_FILTERS','V4_UNIFIED_FILTERS');
    log('GPU_OPTICS',filters.cameraVignette&&filters.reelEdgeGlow===6?'ACTIVE':'DEGRADED');
    log('REFERENCE_TARGET','HANAHANA_CLASS_NORMAL_TYPE');
    if(errors.length)log('GPU_FILTER_ERROR',errors.join('|'));
    log('PATCH','PHASER_OPTICS_V0_4_4');
  };
  attach();
})();