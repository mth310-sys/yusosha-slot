/* Next-Gen Pachislot Expression Lab v0.2.1
   iPhone Safari audio resilience + diagnostics patch.
   Loaded after app.js / reel patches. Does not change game outcomes. */
(() => {
  const originalUnlock = audio.unlock.bind(audio);

  audio.ensureRunning = async function(reason = 'GESTURE') {
    try {
      await originalUnlock();
      logEvent('AUDIO_CTX', `${reason}:${this.ctx?.state || 'unavailable'}`);
      return this.ctx?.state === 'running';
    } catch (err) {
      logEvent('AUDIO_CTX', `${reason}:ERROR:${err?.name || 'unknown'}`);
      return false;
    }
  };

  // iPhone Safari can suspend AudioContext after interruptions/backgrounding.
  // Resume on every physical user gesture before the later click handler emits sound.
  const resumeFromGesture = () => {
    if (!state.audioEnabled) return;
    audio.ensureRunning('USER_GESTURE');
  };
  document.addEventListener('pointerdown', resumeFromGesture, { capture: true, passive: true });
  document.addEventListener('touchstart', resumeFromGesture, { capture: true, passive: true });

  // Keep the first BET behavior, but expose a read-only diagnostic hook for Playwright.
  window.__NEXTGEN_AUDIO_STATE__ = () => ({
    enabled: state.audioEnabled,
    hasContext: !!audio.ctx,
    contextState: audio.ctx?.state || 'none',
    hasMaster: !!audio.master,
    motorActive: !!audio.motorOsc
  });

  if (audio.ctx) {
    audio.ctx.onstatechange = () => logEvent('AUDIO_CTX', `STATE:${audio.ctx.state}`);
  }

  // If the context is created after this patch loads, attach state diagnostics after unlock.
  audio.unlock = async function() {
    await originalUnlock();
    if (this.ctx && !this.ctx.__nextgenStateHook) {
      this.ctx.__nextgenStateHook = true;
      this.ctx.onstatechange = () => logEvent('AUDIO_CTX', `STATE:${this.ctx.state}`);
    }
  };

  logEvent('PATCH', 'AUDIO_SAFARI_RESILIENCE_V0_2_1');
})();