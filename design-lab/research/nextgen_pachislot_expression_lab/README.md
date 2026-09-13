# Next-Gen Pachislot Expression Lab

Design Lab independent technical proof-of-concept for evaluating browser-based pachislot realism on iPhone Safari.

## Isolation

- Path: `research/nextgen_pachislot_expression_lab/`
- Existing Design Lab editor is not imported or modified.
- Existing `research/phaser4_pachislot_demo/` is preserved as the earlier comparison baseline.
- No Chappy5 dependency and no Scheduled Development integration.

## Core objective

Evaluate one complete, intentionally short 1G presentation instead of an effect gallery:

`BET -> START -> reel acceleration -> reel cruise -> STOP1 -> STOP2 -> STOP3 -> all reels mechanically settle -> silence/dark beat -> character/mechanism response -> light/particle release -> BONUS`

The result is deterministic in this research build. Probability, payout and production game logic are intentionally out of scope.

## Architecture

A single JavaScript `TIMELINE` owns the important game events. Visual, reel, cabinet LED and audio responses are called from those events. They are not separate animations started independently by unrelated timers.

The judgement sequence starts only after the third reel has completed its mechanical settle/lock callback.

## Selected technology

- Phaser 4.2.1 (CDN): WebGL/Canvas renderer, Scene, Camera, Tween, display layers, masks
- Procedural Phaser graphics: no image asset dependency in the current build
- Lightweight pooled particle objects
- CSS cabinet rendering: material depth, glass/bezel, physical controls, cabinet light spill
- Native Web Audio API: BET / START / reel motor / STOP press / reel lock / omen / silence beat / BONUS synthesis
- requestAnimationFrame FPS display for quick iPhone observation
- in-page Game Event / Reel Event / Audio Event log for human QA

## Deferred until justified

Not added merely to increase the technology count:

- Tone.js / Howler.js: native Web Audio remains sufficient for the synchronization experiment
- custom Shader / PostFX: reel geometry and light interaction are being validated first
- FFmpeg: no generated media pipeline yet
- Playwright / GitHub Actions: browser QA is still to be added after this visual patch is confirmed stable

## BASIC vs FULL

Both modes use the same interaction and deterministic hit result.

BASIC intentionally uses faster, simpler acceleration/braking and reduced glass/light depth.

FULL adds staged acceleration, continuous reel-strip motion, braking, settle overshoot, mechanical lock, camera reaction, character motion, ambient particles, cabinet spill, a silence beat, virtual mechanism movement and synchronized hit release.

## v0.2 — reel realism focus

v0.1 represented each reel with only three text objects whose Y positions oscillated while spinning. That was visually readable but still looked like three flat panels.

v0.2 keeps the existing main app intact and adds two isolated patch files:

- `reel-v02.js`
- `reel-v02.css`

The patch changes the reel presentation to:

- seven recyclable symbol cells per reel, masked by a physical reel window
- continuous symbol-strip motion with upper/lower symbols entering and leaving the visible window
- upper/lower darkness and left/right shading to imply a cylindrical reel behind the window
- center-biased symbol scale/opacity to suggest surface curvature without a heavy shader
- dedicated reel-window glass highlight above the reel plane
- physical-looking separators between left/center/right reels
- reel back cavity and reel lamp as separate depth layers
- FULL acceleration -> cruise -> brake -> settle -> small overshoot -> lock states
- STOP button press sound separated from the later mechanical reel-lock sound
- low-level synthesized reel motor whose level drops as each reel stops
- STOP3 judgement delayed until the third reel has actually locked
- reel-area light reacts to spin / judgement / hit states
- cabinet-wide CSS light spill changes adjacent bezel/glass/control-deck appearance instead of only drawing brighter LED lines

## Real-machine research basis

Observed structural facts used for v0.2:

- Manufacturer educational material describes pachislot reels as vertical rotating bodies operated by the start lever and individual stop buttons.
- Published pachislot structural documents/patents describe three physical reels arranged side-by-side inside the cabinet.
- Those documents describe each reel as a cylindrical reel body with a strip/sheet carrying multiple symbols around its circumference.
- A transparent display window is positioned in front of the reels, and three consecutive symbols per reel are visible as upper / middle / lower positions.

Reference material consulted:

- SANKYO Online Museum: pachislot reel / machine-part explanations
- JP2018047388A and related pachislot structural descriptions
- JP5855705B2 pachislot cabinet/reel/display-window structural description

These are used as structural references, not as source code or proprietary art references.

## Estimated/tuned values — not real-machine specifications

The following v0.2 values are visual tuning hypotheses and MUST NOT be treated as measured pachislot specifications:

- FULL acceleration duration: approximately 190 ms
- FULL brake phase: approximately 175 ms
- settle overshoot: approximately 8 Phaser pixels
- BASIC acceleration/brake durations
- synthesized motor frequencies and amplitudes
- camera shake magnitudes

They exist only to support human A/B evaluation on iPhone and should be retuned after visual observation.

## Character scope

The original character remains procedural and split into multiple parts (coat, torso, head, hair, eye, arm, weapon, aura). Idle breathing, blinking and hair movement remain intentionally lightweight because reel realism is the current priority.

## Audio note for iPhone Safari

AudioContext is unlocked by the first BET user gesture. v0.2 keeps native Web Audio and adds a light reel-motor layer plus separate STOP press and reel-lock transients.

## Human evaluation points

1. Do the reels now look physically behind a window rather than printed on three flat cards?
2. Can upper/middle/lower symbols and incoming/outgoing symbols be perceived naturally?
3. Does START feel like acceleration into a stable rotation rather than an instant animation toggle?
4. Does each STOP feel like brake -> settle -> mechanical lock?
5. Does the lock sound occur at the physical stop rather than merely at finger-down?
6. Does STOP1 -> STOP2 -> STOP3 preserve responsive touch control despite the extra settle motion?
7. Does the silent/dark judgement beat begin only after all three reels have stopped?
8. Does light appear to spill into surrounding material rather than only brighten an LED line?
9. Does FULL remain materially better than BASIC without becoming excessively flashy?
10. Is iPhone Safari responsiveness/FPS/heat still acceptable during repeated rounds?

## Verification status

- Source-level JavaScript syntax check for the v0.2 patch: PASS before commit
- Existing Design Lab editor files: not modified
- Existing `app.js`: not modified by v0.2
- GitHub Pages / real-browser visual quality: VISUAL_UNVERIFIED until browser QA and iPhone human evaluation
- iPhone thermal/long-session behavior: UNVERIFIED

## Status

`NEXTGEN_EXPRESSION_POC_V0_2_REEL_REALISM / VISUAL_UNVERIFIED`
