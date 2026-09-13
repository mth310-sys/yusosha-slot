/* F9 SIDE mechanism LOCKED baseline — 2026-08-18
   Source snapshot before exterior quality refinement.
   Critical behavior: preview SIDE OPEN/CLOSE toggles .open directly without redraw.
*/

(function(){
  window.F9_LOCKED_BASELINE={
    date:'2026-08-18',
    rule:'Do not replace the live DOM during SIDE OPEN/CLOSE. Toggle .open on .f9-side-mech only.',
    transition:'5s verification speed',
    protected:['F9PreviewToggleSide','f9-side-mech','f9-mech-prism','cover face','leds face']
  };
})();
