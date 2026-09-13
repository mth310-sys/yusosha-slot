/* Next-Gen Pachislot Expression Lab v0.2.2
   Robust reel-window front occlusion for iPhone/WebKit.
   Loaded after reel-v021.js. Geometry masks remain as a first line of defence,
   but visual correctness no longer depends on them. */
(() => {
  const REEL_Y = 342;
  const WINDOW_HALF = 58;

  const baseBuildReels = NextGenScene.prototype.buildReels;
  NextGenScene.prototype.buildReels = function(){
    baseBuildReels.call(this);

    // Physical cabinet occlusion: these sit in front of every symbol object
    // and behind separators/frame/glass. They make the reel aperture real even
    // when WebKit's GeometryMask compositing behaves unexpectedly.
    this.reelHoodTop = this.add.rectangle(195, 275, 334, 22, 0x05070a, 1)
      .setStrokeStyle(1, 0x1f242b, .9).setDepth(38);
    this.reelHoodBottom = this.add.rectangle(195, 409, 334, 22, 0x05070a, 1)
      .setStrokeStyle(1, 0x1f242b, .9).setDepth(38);

    this.reelHoodTopBevel = this.add.rectangle(195, 285, 326, 4, 0x66717e, .34)
      .setDepth(39);
    this.reelHoodBottomBevel = this.add.rectangle(195, 399, 326, 4, 0x66717e, .30)
      .setDepth(39);

    // Small side cheeks complete the physical aperture without adding shaders.
    this.reelCheekL = this.add.rectangle(30, REEL_Y, 12, 126, 0x05070a, 1).setDepth(39);
    this.reelCheekR = this.add.rectangle(360, REEL_Y, 12, 126, 0x05070a, 1).setDepth(39);
  };

  const basePaint = NextGenScene.prototype.paintReelV02;
  NextGenScene.prototype.paintReelV02 = function(r){
    basePaint.call(this, r);

    r.cells.forEach(cell => {
      const local = cell.plate.y - r.y;
      const abs = Math.abs(local);
      const inApertureBand = abs <= WINDOW_HALF;

      // WebKit safety guard. Far recycled cells must never be rendered outside
      // the physical reel aperture even if a GeometryMask is ignored.
      cell.plate.setVisible(inApertureBand);
      cell.label.setVisible(inApertureBand);

      if(inApertureBand && abs > 44){
        const edge = Phaser.Math.Clamp((WINDOW_HALF - abs) / 14, 0, 1);
        cell.plate.setAlpha(cell.plate.alpha * (.30 + edge * .70));
        cell.label.setAlpha(cell.label.alpha * (.30 + edge * .70));
      }
    });
  };

  const baseApplyMode = NextGenScene.prototype.applyMode;
  NextGenScene.prototype.applyMode = function(mode){
    baseApplyMode.call(this, mode);
    const full = mode === 'FULL';
    this.reelHoodTopBevel?.setAlpha(full ? .34 : .22);
    this.reelHoodBottomBevel?.setAlpha(full ? .30 : .20);
  };

  document.querySelector('.lab-head small').textContent='Integrated 1G Expression Prototype · REEL v0.2.2';
  logEvent('PATCH','REEL_FRONT_OCCLUSION_V0_2_2');
})();