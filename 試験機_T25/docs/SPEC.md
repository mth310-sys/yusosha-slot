# 遊創舎 試験機 Ver.T25 公式仕様書

## フォルダ構成

```text
試験機_T25
│
├── index.html
│
├── css
│   ├── base.css
│   ├── cabinet.css
│   ├── reels.css
│   ├── controls.css
│   ├── effects.css
│   └── responsive.css
│
├── js
│   ├── config.js
│   ├── state.js
│   ├── ui.js
│   ├── reels.js
│   ├── effects.js
│   ├── game.js
│   └── main.js
│
├── assets
│   ├── images
│   │   ├── symbols
│   │   ├── cabinet
│   │   ├── backgrounds
│   │   └── ui
│   │
│   ├── sounds
│   │   ├── se
│   │   └── bgm
│   │
│   └── fonts
│
└── docs
    ├── SPEC.md
    ├── CHANGELOG.md
    └── TODO.md
```

## 各フォルダの役割

### index.html
アプリの起動入口。各CSS・JavaScriptを読み込む。

### css
画面デザインを管理する。

- base.css：共通設定・基本スタイル
- cabinet.css：筐体デザイン
- reels.css：リール表示
- controls.css：操作卓・ボタン
- effects.css：演出・アニメーション
- responsive.css：スマホ・画面サイズ対応

### js
ゲーム処理を管理する。

- config.js：定数・配当・確率設定
- state.js：ゲーム状態の管理
- ui.js：画面表示更新
- reels.js：リール制御
- effects.js：LED・Canvas演出
- game.js：BET・抽選・判定
- main.js：初期化・イベント登録

### assets
素材を管理する。

images/
- symbols：リール絵柄
- cabinet：筐体画像
- backgrounds：背景
- ui：ボタン・UI画像

sounds/
- se：効果音
- bgm：BGM

fonts/
- フォント

### docs
開発資料。

- SPEC.md：仕様書
- CHANGELOG.md：変更履歴
- TODO.md：今後の作業予定
