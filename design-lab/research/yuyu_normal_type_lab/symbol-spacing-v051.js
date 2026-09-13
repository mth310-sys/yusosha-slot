/* YUYU v0.5.1 — symbol spacing correction.
   The reel pitch remains the proven 36px lattice. Only the visible printed symbol face is reduced
   so adjacent symbols no longer visually crowd each other. Motion/lock/audio remain untouched. */
(()=>{
 const attach=()=>{
  if(!state?.scene||state.version!=='0.5.0'){requestAnimationFrame(attach);return}
  const sc=state.scene,errors=[];
  const telemetry={
   mode:'PRINT_SYMBOL_PITCH_CORRECTION',enabled:true,
   reelPitchPx:36,visibleSymbolHeightPx:30,nominalGapPx:6,
   visibleSymbolWidthPx:64.4,meshRows:5,meshCols:7,
   centerScaleX:1.15,centerScaleY:1.0,
   preservesLockLattice:true,preservesCoreMotion:true,errors
  };
  try{
   const rowY=[-15,-7.5,0,7.5,15];
   sc.reels.forEach(r=>r.cells.forEach(c=>{
    const m=c.printMesh;if(!m)return;
    for(let ry=0;ry<5;ry++)for(let cx=0;cx<7;cx++){
     const vi=(ry*7+cx)*4;
     m.vertices[vi+1]=rowY[ry];
    }
   }));
   const priorPaint=sc.paint.bind(sc);
   sc.paint=(r)=>{
    priorPaint(r);
    const travel=Number.isFinite(r.travel)?r.travel:0;
    r.cells.forEach((c,k)=>{
     const m=c.printMesh;if(!m)return;
     const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2;
     const y=88+local,n=Math.min(1,Math.abs(y-88)/82);
     const sx=1-.045*n*n,sy=1-.18*n*n;
     m.setScale(1.15*sx,1.0*sy);
    });
   };
   sc.reels.forEach(r=>sc.paint(r));
   state.version='0.5.1';
   state.fx.symbolSpacing='36_PITCH_30_FACE_6_GAP';
   const prior=window.__YUYU_STATE__;
   window.__YUYU_STATE__=()=>{
    const x=prior();
    return {...x,version:'0.5.1',phaser:{...x.phaser,symbolSpacing:'36_PITCH_30_FACE_6_GAP'},symbolSpacing:{...telemetry}};
   };
   log('SYMBOL_SPACING','36_PITCH_30_FACE_6_GAP');
   log('SYMBOL_FACE_HEIGHT','30');
   log('SYMBOL_NOMINAL_GAP','6');
   log('PATCH','SYMBOL_SPACING_V0_5_1');
  }catch(e){errors.push(String(e?.message||e));log('SYMBOL_SPACING_ERROR',String(e?.message||e));}
 };
 attach();
})();