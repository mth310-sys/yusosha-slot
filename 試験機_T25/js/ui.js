"use strict";

/* =========================================================
   UI更新
========================================================= */

function updateUi() {
  creditElement.textContent = String(credit);
  betElement.textContent = String(bet);
  payoutElement.textContent = String(payout);

  const anySpinning = spinning.includes(true);
  const busy = anySpinning || gameActive;

  startButton.disabled = bet !== 3 || busy;
  betButton.disabled = busy || bet >= 3 || credit <= 0;
  maxBetButton.disabled = busy || bet >= 3 || credit <= 0;

  stopButtons.forEach((button, index) => {
    button.disabled = !spinning[index] || stopPressed[index];
  });
}

function setMessage(text) {
  message.textContent = text;
}

/* =========================================================
   ボタン押下演出
========================================================= */

function pressVisual(element) {
  element.classList.add("pressed");
  setTimeout(() => {
    element.classList.remove("pressed");
  }, 130);
}
