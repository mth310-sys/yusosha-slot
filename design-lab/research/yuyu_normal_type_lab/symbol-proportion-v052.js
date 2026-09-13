/* YUYU v0.5.2 — symbol proportion tune.
   Keeps the corrected 36px pitch / 30px visible face / 6px nominal vertical gap from v0.5.1,
   while restoring horizontal presence only. Reel motion, lock lattice, atlas and audio remain untouched. */
(()=>{
 const attach=()=>{
  if(!state?.scene||state.version!=='0.5.1'){requestAnimationFrame(attach);return}
  const sc=state.scene,errors=[];
  const telemetry={
   mode:'WIDE_PRINT_SYMBOL_PROPORTION',enabled:true,
   reelPitchPx:36,visibleSymbolHeightPx:30,nominalVerticalGapPx:6,
   baseMeshWidthPx:56,centerScaleX:1.24,centerScaleY:1.0,
   visibleSymbolWidthPx:69.44,widthGainVs051Pct:7.83,
   preservesVerticalSpacing:true,preservesLockLattice:true,preservesCoreMotion:true,
   reelCellWidthPx:102,minimumSideClearancePx:16.28,errors
  };
  try{
   const priorPaint=sc.paint.bind(sc);
   sc.paint=(r)=>{
    priorPaint(r);
    const travel=Number.isFinite(r.travel)?r.travel:0;
    r.cells.forEach((c,k)=>{
     const m=c.printMesh;if(!m)return;
     const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2;
     const y=88+local,n=Math.min(1,Math.abs(y-88)/82);
     // Horizontal presence is restored without changing the 30px face height.
     const sx=1-.045*n*n,sy=1-.18*n*n;
     m.setScale(1.24*sx,1.0*sy);
    });
   };
   sc.reels.forEach(r=>sc.paint(r));
   state.version='0.5.2';
   state.fx.symbolProportion='WIDE_69_44X30_KEEP_6_GAP';
   const prior=window.__YUYU_STATE__;
   window.__YUYU_STATE__=()=>{
    const x=prior();
    return {...x,version:'0.5.2',phaser:{...x.phaser,symbolProportion:'WIDE_69_44X30_KEEP_6_GAP'},symbolProportion:{...telemetry}};
   };
   log('SYMBOL_PROPORTION','WIDE_69_44X30_KEEP_6_GAP');
   log('SYMBOL_WIDTH','69.44');
   log('SYMBOL_HEIGHT','30');
   log('SYMBOL_VERTICAL_GAP','6');
   log('PATCH','SYMBOL_PROPORTION_V0_5_2');
  }catch(e){errors.push(String(e?.message||e));log('SYMBOL_PROPORTION_ERROR',String(e?.message||e));}
 };
 attach();
})();