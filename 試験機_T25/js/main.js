"use strict";

/* =========================================================
   main.js
   初期化・イベント登録
========================================================= */

/* ---------- DOM ---------- */

const machine       = document.getElementById("machine");
const lamp          = document.getElementById("lamp");
const message       = document.getElementById("message");

const creditElement = document.getElementById("credit");
const betElement    = document.getElementById("bet");
const payoutElement = document.getElementById("payout");

const startButton   = document.getElementById("startButton");
const betButton     = document.getElementById("betButton");
const maxBetButton  = document.getElementById("maxBetButton");

const stopButtons = [
    document.getElementById("stop0"),
    document.getElementById("stop1"),
    document.getElementById("stop2")
];

const reelElements = [
    document.getElementById("reel0"),
    document.getElementById("reel1"),
    document.getElementById("reel2")
];

const reelStrips = reelElements.map(r =>
    r.querySelector(".reel-strip")
);

const payEffect = document.getElementById("payEffect");

/* ---------- イベント ---------- */

betButton.addEventListener("click", () => {
    pressVisual(betButton);
    betOne();
});

maxBetButton.addEventListener("click", () => {
    pressVisual(maxBetButton);
    maxBet();
});

startButton.addEventListener("click", () => {
    pressVisual(startButton);
    startSpin();
});

stopButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        stopReel(index);
    });
});

window.addEventListener("resize", resizeCanvas);

/* ---------- 初期化 ---------- */

reelStates.forEach((rs, i) => {
    rs.rawPos = INIT_DISPLAY_POS[i];
    applyStripPos(i);
});

resizeCanvas();
animateParticles();
updateUi();
