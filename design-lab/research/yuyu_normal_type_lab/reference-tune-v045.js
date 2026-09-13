/* YUYU v0.4.5 — reference-driven reel readability pass.
   Based on visual comparison against HANA HANA-class normal-type cabinets: larger crisp symbols,
   cleaner reel seams, brighter printed film, deeper black cavity. Motion/lock/audio core unchanged. */
(()=>{
  const attach=()=>{
    if(!state?.scene||state.version!=='0.4.4'){requestAnimationFrame(attach);return}
    const sc=state.scene;
    const tuning={reference:'HANAHANA_CLASS_NORMAL_TYPE',symbolScale:1.14,seamCleanup:true,filmBrightness:'HIGH_CLEAN_WHITE',subLabels:false,comparisonPass:'REEL_READABILITY_AND_DENSITY'};

    // Clean the excessive vertical banding found in v0.4.4 visual inspection.
    sc.children.list.forEach(o=>{
      if(!o||typeof o.depth!=='number')return;
      if(o.type==='Rectangle'&&o.depth===8&&o.width>=9&&o.width<=11)o.setAlpha(.34);
      if(o.type==='Rectangle'&&o.depth===21&&o.width<=3)o.setAlpha(.34);
    });
    sc.reels.forEach(r=>{
      r.filmBack?.setFillStyle(0xfffdf7,1);
      r.printWarm?.setAlpha(.28);
      r.rollEdgeL?.setAlpha(.62);
      r.rollEdgeR?.setAlpha(.62);
      r.inkLineTop?.setAlpha(.55);
      r.inkLineBottom?.setAlpha(.45);
      r.cells.forEach(c=>c.sub.setVisible(false).setAlpha(0));
    });

    const priorPaint=sc.paint.bind(sc);
    sc.paint=(r)=>{
      priorPaint(r);
      r.cells.forEach(c=>{
        if(c.icon?.visible)c.icon.setScale(c.icon.scaleX*tuning.symbolScale,c.icon.scaleY*tuning.symbolScale);
        c.sub?.setVisible(false).setAlpha(0);
      });
    };
    sc.reels.forEach(r=>sc.paint(r));

    state.version='0.4.5';
    state.fx.referenceTune='REEL_READABILITY_AND_DENSITY';
    state.fx.symbolScale=tuning.symbolScale;
    state.fx.seamCleanup=true;
    state.fx.subLabels=false;

    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.5',phaser:{...x.phaser,referenceTune:'REEL_READABILITY_AND_DENSITY',symbolScale:tuning.symbolScale,seamCleanup:true,subLabels:false},reference:{...tuning,observedGapsV044:['SYMBOLS_TOO_SMALL','VERTICAL_BANDING_TOO_STRONG','REEL_FILM_TOO_GRAY','CABINET_STILL_STYLIZED']}};
    };
    log('REFERENCE_COMPARE','HANAHANA_CLASS_NORMAL_TYPE');
    log('REFERENCE_TUNE','REEL_READABILITY_AND_DENSITY');
    log('SYMBOL_SCALE',String(tuning.symbolScale));
    log('SEAM_CLEANUP','ACTIVE');
    log('PATCH','REFERENCE_TUNE_V0_4_5');
  };
  attach();
})();