"use strict";

/* =========================================================
   config.js
   定数・配当・確率設定
========================================================= */

/* リールレイアウト */

const REEL_LAYOUTS = [
  ["RED7", "GRAPE", "BELL", "CHERRY", "STAR", "BAR", "REPLAY"],
  ["BELL", "RED7", "GRAPE", "CHERRY", "STAR", "BAR", "REPLAY"],
  ["GRAPE", "CHERRY", "BELL", "RED7", "STAR", "BAR", "REPLAY"]
];

/* リール設定 */

const SH = 80;
const N = 7;
const LOOP_LEN = N * SH;

const MAX_SPEED = 8;
const ACCEL = 0.5;

/* 初期位置 */

const INIT_DISPLAY_POS = [
  640,
  560,
  560
];

/* 配当 */

const PAYOUT = {
  RED7: 50,
  BAR: 20,
  STAR: 15,
  BELL: 10,
  GRAPE: 8,
  CHERRY: 2
};

/* 抽選確率 */

const LOTTERY = {
  RED7: 0.07,
  BAR: 0.13,
  STAR: 0.23,
  BELL: 0.36,
  GRAPE: 0.52,
  CHERRY: 0.70
};
