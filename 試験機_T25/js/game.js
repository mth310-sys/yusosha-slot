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
function startSpin() {
  if (bet !== 3 || spinning.includes(true) || gameActive) return;

  stoppedCount   = 0;
  physicalCount  = 0;
  payout         = 0;
  gameActive     = true;
  currentSymbols = ["", "", ""];
  stopPressed    = [false, false, false];

  targetResult = chooseResult();

  reelElements.forEach(reel => reel.classList.remove("hot", "stop-flash"));

  if (targetResult === "RED7" || targetResult === "BAR") {
    lamp.classList.add("on");
    setMessage("ペカッ！");
    sparkBurst(38);
  } else {
    lamp.classList.remove("on");
    setMessage("リール回転中");
  }

  for (let i = 0; i < 3; i++) {
    spinning[i]           = true;
    reelStates[i].speed   = 0;
    reelStates[i].state   = "accelerating";
    reelStates[i].bouncePhase = -1;
    // rawPos はそのまま（前回停止位置から継続して回転）
  }

  updateUi();
}

/* =========================================================
   停止
========================================================= */

function stopReel(index) {
  if (!spinning[index] || stopPressed[index]) return;

  const rs = reelStates[index];
  if (rs.state !== "accelerating" && rs.state !== "spinning") return;

  /* --- 停止図柄の決定 --- */
  let finalSymbol;

  if (["RED7", "BAR", "STAR", "BELL", "GRAPE"].includes(targetResult)) {
    finalSymbol = targetResult;

  } else if (targetResult === "CHERRY") {
    if (index === 0) {
      finalSymbol = "CHERRY";
    } else {
      const nonCherry = REEL_LAYOUTS[index].filter(k => k !== "CHERRY");
      finalSymbol = nonCherry[Math.floor(Math.random() * nonCherry.length)];
    }

  } else {
    // MISS: ランダム停止
    finalSymbol = REEL_LAYOUTS[index][Math.floor(Math.random() * N)];

    // 3番目のSTOP時に3枚揃いになる場合は回避
    if (stoppedCount === 2) {
      const others = [0, 1, 2].filter(j => j !== index);
      const s0 = currentSymbols[others[0]];
      const s1 = currentSymbols[others[1]];
      if (s0 !== "" && s0 === s1 && finalSymbol === s0) {
        const diff = REEL_LAYOUTS[index].filter(k => k !== s0);
        finalSymbol = diff[Math.floor(Math.random() * diff.length)];
      }
    }
  }

  currentSymbols[index] = finalSymbol;
  stopPressed[index]    = true;
  stoppedCount++;

  /* --- 減速目標を設定 --- */
  const { targetPos, decelA } = getStopTarget(index, finalSymbol, rs.rawPos, rs.speed);
  rs.targetPos = targetPos;
  rs.decelA    = decelA;
  rs.state     = "decelerating";

  pressVisual(stopButtons[index]);
  updateUi();
}

/* =========================================================
   判定
========================================================= */

function judgeResult() {
  gameActive = false;

  const [left, center, right] = currentSymbols;

  if      (left === "RED7"  && center === "RED7"  && right === "RED7")  { win(50, "BIG BONUS！！"); }
  else if (left === "BAR"   && center === "BAR"   && right === "BAR")   { win(20, "雷BONUS！！"); }
  else if (left === "STAR"  && center === "STAR"  && right === "STAR")  { win(15, "STAR 15枚"); }
  else if (left === "BELL"  && center === "BELL"  && right === "BELL")  { win(10, "ベル 10枚"); }
  else if (left === "GRAPE" && center === "GRAPE" && right === "GRAPE") { win(8,  "ブドウ 8枚"); }
  else if (currentSymbols.includes("CHERRY"))                           { win(2,  "チェリー 2枚"); }
  else {
    payout = 0;
    setMessage("ハズレ");
    window.setTimeout(() => {
      reelElements.forEach(reel => reel.classList.remove("hot"));
    }, 650);
  }

  bet = 0;
  updateUi();
}

function win(amount, text) {
  payout  = amount;
  credit += amount;

  setMessage(text);

  payEffect.textContent = `+${amount}`;
  payEffect.classList.remove("show");
  void payEffect.offsetWidth;
  payEffect.classList.add("show");

  document.body.classList.remove("flash", "shake");
  void document.body.offsetWidth;
  document.body.classList.add("flash", "shake");

  sparkBurst(85);

  window.setTimeout(() => {
    document.body.classList.remove("flash", "shake");
  }, 900);
}
