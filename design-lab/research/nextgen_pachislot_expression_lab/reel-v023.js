/* Next-Gen Pachislot Expression Lab v0.2.3
   Reel stop alignment + three horizontal payline presentation.
   Loaded after reel-v022.js. */
(() => {
  const SPACING = 36;
  const REEL_Y = 342;
  const LINE_OFFSETS = [-SPACING, 0, SPACING];
  const LINE_YS = LINE_OFFSETS.map(v => REEL_Y + v);

  const baseBuild = NextGenScene.prototype.buildReels;
  NextGenScene.prototype.buildReels = function(){
    baseBuild.call(this);

    // Three equal horizontal paylines. Keep all three visually equivalent so the
    // center row no longer reads as the only active line.
    this.reelPaylines = LINE_YS.map((y, i) => ({
      rail: this.add.rectangle(195, y, 318, 2, 0x90b7d6, .075).setDepth(23.5),
      left: this.add.rectangle(34, y, 12, 3, 0xb7d8ee, .42).setDepth(37),
      right: this.add.rectangle(356, y, 12, 3, 0xb7d8ee, .42).setDepth(37),
      index: i + 1
    }));

    // v0.2.1 had a center-only highlight. Reduce it so all three rows read as
    // equal reel lines rather than one center payline plus two passive rows.
    this.reels.forEach(r => r.centerLight?.setAlpha(.012));
  };

  // Hard-snap the mathematical reel offset before lock. The easing animation can
  // overshoot visually, but a locked reel must finish on an exact 36px lattice.
  const baseLock = NextGenScene.prototype.lockReelV02;
  NextGenScene.prototype.lockReelV02 = function(r){
    const snapped = Math.round(r.offset / SPACING) * SPACING;
    r.offset = snapped;
    this.paintReelV02(r);
    baseLock.call(this, r);
    // Re-assert after inherited lock effects so floating tween residue can never
    // leave a stopped reel between rows.
    r.offset = snapped;
    this.paintReelV02(r);
    logEvent('REEL_ALIGN', `R${this.reels.indexOf(r)+1} ${snapped.toFixed(2)}`);
  };

  const baseApply = NextGenScene.prototype.applyMode;
  NextGenScene.prototype.applyMode = function(mode){
    baseApply.call(this, mode);
    const full = mode === 'FULL';
    this.reelPaylines?.forEach(line => {
      line.rail.setAlpha(full ? .075 : .045);
      line.left.setAlpha(full ? .42 : .28);
      line.right.setAlpha(full ? .42 : .28);
    });
    this.reels?.forEach(r => r.centerLight?.setAlpha(full ? .012 : .008));
  };

  function closestCellError(r, targetY){
    const visible = r.cells.filter(c => c.plate.visible);
    if(!visible.length) return null;
    return Math.min(...visible.map(c => Math.abs(c.plate.y - targetY)));
  }

  window.__REEL_LINE_STATE__ = () => ({
    version: '0.2.3',
    lineCount: 3,
    lineYs: [...LINE_YS],
    reels: state.scene?.reels?.map((r, i) => ({
      index: i + 1,
      mode: r.mode,
      offset: r.offset,
      latticeError: Math.abs(r.offset - Math.round(r.offset / SPACING) * SPACING),
      lineErrors: LINE_YS.map(y => closestCellError(r, y))
    })) || []
  });

  const note = document.querySelector('.note');
  if(note) note.textContent = 'Phaser 4.2.1 基準機 v0.4.0 — リール停止位置を格子固定し、上・中・下の3ライン構成へ更新。';
  logEvent('PATCH','REEL_ALIGN_3LINE_V0_2_3');
})();