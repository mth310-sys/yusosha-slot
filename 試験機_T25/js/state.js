"use strict";

/* =========================================================
   state.js
   ゲーム状態
========================================================= */

let credit = 50;
let bet = 0;
let payout = 0;

let spinning = [false, false, false];
let stopPressed = [false, false, false];

let stoppedCount = 0;
let physicalCount = 0;
let gameActive = false;

let currentSymbols = ["", "", ""];
let targetResult = "MISS";

/* リール状態 */

const reelStates = [0,1,2].map(() => ({
    rawPos: LOOP_LEN,
    speed: 0,
    state: "idle",
    targetPos: 0,
    decelA: 0,
    bouncePhase: -1
}));
