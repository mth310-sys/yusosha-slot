"use strict";

/* =========================================================
   reels.js
   リール位置計算・回転・減速・停止制御
========================================================= */

/* 正の余りを返す */
function positiveMod(value, mod) {
  return ((value % mod) + mod) % mod;
}

/*
 * rawPosを表示用の位置へ変換する。
 * 戻り値は LOOP_LEN ～ 2 * LOOP_LEN の範囲。
 */
function getDisplayPos(rawPos) {
  return LOOP_LEN + positiveMod(rawPos - LOOP_LEN, LOOP_LEN);
}

/* リールストリップの表示位置を更新 */
function applyStripPos(index) {
  const reelState = reelStates[index];
  const displayPos = getDisplayPos(reelState.rawPos);

  let bounceY = 0;

  if (reelState.bouncePhase >= 0) {
    const BOUNCE = [
      5, 4, 2, -1, -2, -1,
      0, 1, 0, 0, 0, 0
    ];

    bounceY =
      reelState.bouncePhase < BOUNCE.length
        ? BOUNCE[reelState.bouncePhase]
        : 0;
  }

  reelStrips[index].style.transform =
    `translateY(${-displayPos + bounceY}px)`;
}

/*
 * 指定した図柄を中央ラインへ停止させるための
 * 目標位置と減速度を計算する。
 */
function getStopTarget(reelIndex, symbolKey, rawPos, speed) {
  const symbolIndex =
    REEL_LAYOUTS[reelIndex].indexOf(symbolKey);

  const targetResidual =
    ((symbolIndex - 1 + N) % N) * SH;

  const currentResidual =
    positiveMod(rawPos - LOOP_LEN, LOOP_LEN);

  let gap =
    positiveMod(currentResidual - targetResidual, LOOP_LEN);

  if (gap === 0) {
    gap = LOOP_LEN;
  }

  /* 最低2図柄分の減速距離を確保 */
  while (gap < SH * 2) {
    gap += LOOP_LEN;
  }

  const targetPos = rawPos - gap;

  /*
   * v² = 2aD
   * a = v² ÷ 2D
   */
  const decelA = Math.max(
    (speed * speed) / (2 * gap),
    0.005
  );

  return {
    targetPos,
    decelA
  };
}

/* 全リールを1フレーム進める */
function tickAllReels() {
  for (let index = 0; index < 3; index += 1) {
    const reelState = reelStates[index];

    if (reelState.state === "idle") {
      continue;
    }

    if (reelState.state === "accelerating") {
      reelState.speed = Math.min(
        reelState.speed + ACCEL,
        MAX_SPEED
      );

      if (reelState.speed >= MAX_SPEED) {
        reelState.state = "spinning";
      }

      reelState.rawPos -= reelState.speed;

    } else if (reelState.state === "spinning") {
      reelState.rawPos -= reelState.speed;

    } else if (reelState.state === "decelerating") {
      reelState.speed = Math.max(
        0,
        reelState.speed - reelState.decelA
      );

      const reachesTarget =
        reelState.speed === 0 ||
        reelState.rawPos - reelState.speed <=
          reelState.targetPos;

      if (reachesTarget) {
        reelState.rawPos = reelState.targetPos;
        reelState.speed = 0;
        reelState.state = "bouncing";
        reelState.bouncePhase = 0;

        onReelPhysicallyStopped(index);

      } else {
        reelState.rawPos -= reelState.speed;
      }

    } else if (reelState.state === "bouncing") {
      reelState.bouncePhase += 1;

      if (reelState.bouncePhase >= 12) {
        reelState.state = "idle";
        reelState.bouncePhase = -1;

        /* 次回転に備えて位置を正規化 */
        reelState.rawPos =
          getDisplayPos(reelState.rawPos);
      }
    }

    applyStripPos(index);
  }
}

/* リールが物理的に停止したときの処理 */
function onReelPhysicallyStopped(index) {
  spinning[index] = false;
  physicalCount += 1;

  reelElements[index].classList.remove("stop-flash");

  void reelElements[index].offsetWidth;

  reelElements[index].classList.add("stop-flash");

  if (
    targetResult === "RED7" ||
    targetResult === "BAR"
  ) {
    reelElements[index].classList.add("hot");
  }

  updateUi();

  if (physicalCount === 3) {
    window.setTimeout(() => {
      judgeResult();
    }, 300);
  }
}
