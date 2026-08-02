"use strict";

/* =========================================================
   game.js
   BET・抽選・START・STOP・判定
========================================================= */

function betOne() {
  if (spinning.includes(true) || gameActive) return;
  if (credit <= 0 || bet >= 3) return;

  credit--;
  bet++;
  payout = 0;

  lamp.classList.remove("on");
  setMessage(bet === 3 ? "STARTできます" : "BET中");
  updateUi();
}

function maxBet() {
  if (spinning.includes(true) || gameActive) return;

  while (bet < 3 && credit > 0) {
    credit--;
    bet++;
  }

  payout = 0;

  lamp.classList.remove("on");
  setMessage(bet === 3 ? "STARTできます" : "クレジット不足");

  updateUi();
}

function chooseResult() {

  const r = Math.random();

  if (r < 0.07) return "RED7";
  if (r < 0.13) return "BAR";
  if (r < 0.23) return "STAR";
  if (r < 0.36) return "BELL";
  if (r < 0.52) return "GRAPE";
  if (r < 0.70) return "CHERRY";

  return "MISS";
}
