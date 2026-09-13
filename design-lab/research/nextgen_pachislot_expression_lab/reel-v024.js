/* Next-Gen Pachislot Expression Lab v0.2.4
   Three-line illumination correction.
   Removes the inherited top/bottom curvature shadows so all three visible rows
   have equal readability. Physical aperture hoods remain for clipping only. */
(() => {
  const baseBuild = NextGenScene.prototype.buildReels;
  NextGenScene.prototype.buildReels = function(){
    baseBuild.call(this);
    this.reels?.forEach(r => {
      r.topCurve?.setAlpha(0).setVisible(false);
      r.bottomCurve?.setAlpha(0).setVisible(false);
      r.centerLight?.setAlpha(0).setVisible(false);
    });
    if(this.reelShade) this.reelShade.setAlpha(.018);
    if(this.reelLamp) this.reelLamp.setAlpha(.12);
  };

  const baseApply = NextGenScene.prototype.applyMode;
  NextGenScene.prototype.applyMode = function(mode){
    baseApply.call(this, mode);
    this.reels?.forEach(r => {
      r.topCurve?.setAlpha(0).setVisible(false);
      r.bottomCurve?.setAlpha(0).setVisible(false);
      r.centerLight?.setAlpha(0).setVisible(false);
    });
    if(this.reelShade) this.reelShade.setAlpha(mode === 'FULL' ? .018 : .012);
    if(this.reelLamp) this.reelLamp.setAlpha(mode === 'FULL' ? .12 : .10);
  };

  window.__REEL_LIGHT_STATE__ = () => ({
    version:'0.2.4',
    topCurveAlpha: state.scene?.reels?.map(r => r.topCurve?.alpha ?? null) || [],
    bottomCurveAlpha: state.scene?.reels?.map(r => r.bottomCurve?.alpha ?? null) || [],
    centerLightAlpha: state.scene?.reels?.map(r => r.centerLight?.alpha ?? null) || [],
    reelShadeAlpha: state.scene?.reelShade?.alpha ?? null,
    reelLampAlpha: state.scene?.reelLamp?.alpha ?? null
  });

  const note=document.querySelector('.note');
  if(note) note.textContent='Phaser 4.2.1 基準機 — 3ライン均等照明 v0.2.4。上段・中段・下段を同等の明るさで表示。';
  logEvent('PATCH','REEL_EQUAL_LIGHT_V0_2_4');
})();