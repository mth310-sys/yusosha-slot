/* YUYU v0.5.3 — static cabinet physicality telemetry.
   Visual materials are CSS-only; reel motion, symbol spacing, lock lattice and audio are untouched. */
(()=>{
 const attach=()=>{
  if(!state?.scene||state.version!=='0.5.2'){requestAnimationFrame(attach);return}
  const telemetry={
   mode:'STATIC_CABINET_PHYSICALITY_PASS',enabled:true,
   movingGlass:false,reelGeometryChanged:false,symbolGeometryChanged:false,
   cabinetSideRails:true,lampLensHousing:true,reelBezelHardware:true,
   smokedMeter:true,moldedControlDeck:true,mechanicalButtonRings:true,
   lowerPanelDepth:true,staticMaterialLighting:true,errors:[]
  };
  try{
   state.version='0.5.3';
   state.fx.cabinetPhysicality='STATIC_MATERIAL_DEPTH_V053';
   const prior=window.__YUYU_STATE__;
   window.__YUYU_STATE__=()=>{
    const x=prior();
    return {...x,version:'0.5.3',phaser:{...x.phaser,cabinetPhysicality:'STATIC_MATERIAL_DEPTH_V053'},cabinetPhysical:{...telemetry}};
   };
   document.documentElement.dataset.yuyuCabinetPhysical='v053';
   log('CABINET_PHYSICAL','STATIC_MATERIAL_DEPTH_V053');
   log('CABINET_MOVING_GLASS','FALSE');
   log('PATCH','CABINET_PHYSICAL_V0_5_3');
  }catch(e){telemetry.errors.push(String(e?.message||e));log('CABINET_PHYSICAL_ERROR',String(e?.message||e));}
 };
 attach();
})();