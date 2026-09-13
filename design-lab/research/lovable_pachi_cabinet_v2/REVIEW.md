# Lovable Pachi Cabinet v2 — 精査メモ

Source project: Pachi Cabinet Mock
Lovable project id: 3e3ebb85-3b85-43b9-9270-1f320e6290f0
Source commit: a565ef0ab55d9e7fb990c86dbfb9bb2bb16e8992
Design Lab target: mth310-sys/yusosha-design-lab / main

## 保存対象
- MachineCabinet.tsx
- SideMechanism.tsx
- TopUnit.tsx
- MainDisplay.tsx
- ControlDeck.tsx
- LowerPanel.tsx
- BaseUnit.tsx
- parts.ts
- cabinet.css
- route-index.tsx

このフォルダはLovable生成コードの研究用スナップショット。現行Design LabのF1〜F8とは分離し、直接読み込まない。

## 精査結果

### 1. 最も価値が高い部分
SideMechanismの3D回転構造。

- normal: cover面が正面
- open: prismをrotateYして丸LED面へ切替
- 左右で回転方向を反転
- LED色はTOP_LED_COLORS / MID_LED_COLORSに分離
- React stateはMachineCabinet側に集約

この構造はF9以降に移植価値が高い。

### 2. 下パネルLED
LowerPanelは機械開閉を持たず、normal/rainbowだけを切替する。実機解析方針と合致。

### 3. 状態管理
MachineCabinetに sideMode / lowerMode / ledsOn がまとまっているため、Design Lab側ではvanilla JS stateへ変換しやすい。

### 4. 390x600基準
parts.tsのCABINETは390x600固定。Design Labの基準キャンバスと一致。

### 5. 造形面の弱点
外装はDOM + gradient + clip-path中心で、実機特有のクローム部品の複雑な厚み・重なり・反射・金色装飾密度は不足。F9ではこの部分をそのまま流用せず、Design Lab側で再設計する。

### 6. CSS上の明確な不整合
Lovable最新版 cabinet.css には次の壊れた断片が存在する。

```css
.cab-flank {
  position: absolute;
  top: 0;
  width: 62px;
  z-index: 2;
  pointer-events: none;
}
  bottom: 66px;
}
```

`bottom: 66px;` がルール外に出て余分な `}` がある。ブラウザは不正部分を無視して表示しているが、移植時は修正必須。

### 7. React依存
現行Design LabはReact/TanStackではなくvanilla HTML/CSS/JS。TSXをそのままF9として読み込むことはできない。

したがってF9は以下の変換方針とする。

- TSX構造 -> buildHtml() またはDOM生成関数
- useState -> Design Lab state / click handler
- CSSはF9名前空間へ変更
- SideMechanismの3D transformロジックは維持
- LowerPanelのrainbowロジックは維持
- TopUnit/MainDisplay/ControlDeck/BaseUnitは構造参考として使用し、外装造形は再設計

### 8. 次の実装優先順位
1. F9を独立追加しF1〜F8を壊さない
2. SideMechanism NORMAL/OPENを先に移植
3. Lower LED NORMAL/RAINBOWを移植
4. 3 STOPボタン反応を移植
5. 実機画像比率に合わせて外装をDesign Lab側で再設計
6. 最後に上部円形ユニット・リール・液晶周辺の質感を詰める

## 結論
Lovableコードは完成外装として使うより、機構エンジンとして利用価値が高い。特にSideMechanismは今回の研究成果として残す価値がある。F9では機構を保持しつつ、外装クオリティをDesign Lab側で作り直すのが最も効率的。
