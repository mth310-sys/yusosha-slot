# 研究資産の非破壊統合（2026-09-13）

## 内容

- `yusosha-design-lab` main `55783e55166579e2d8e3a4f0baa22fcd82897ba5` の95ファイルを `design-lab/` にコピー。
- `yusosha-usage-test` main `6b406797adef141d5dbc0d92a8370f2b2a73cb6a` の561ファイルを `usage-test/` にコピー。
- 既存 `yusosha-slot` main `b512c6243aedeb1e29582b06a201a5cdd27935a1` の57ファイルは変更なし。
- 全コピーのSHA-256一覧は `integration-sources.json`。元リポジトリのmain、履歴、公開ページを維持する。
- Chappy5 と slot-pachiro-godot は作業対象外。取得・編集・コミット・設定変更なし。

## 公開ページ

- 研究入口: `https://mth310-sys.github.io/yusosha-slot/research.html`
- Design Lab: `https://mth310-sys.github.io/yusosha-slot/design-lab/`
- Usage Test: `https://mth310-sys.github.io/yusosha-slot/usage-test/`
- 既存ゲームのパスとトップページは維持。
- HTML、CSS、JS、画像参照をディレクトリ構成ごと保存。Phaser CDN参照も維持。

## テスト・依存関係

- Design Lab は CommonJS、Playwright 1.52.0 と WebKit/iPhone 12 を使用。
- Usage Test は独立した `package.json` の ES Modules、Playwright ^1.55.0 と Chromium を使用。ルートへpackage.jsonを移動しない。
- 元の `.github` は資料として各ディレクトリ内に保持。実行用ワークフローをルート `.github/workflows/` に追加し、各プロジェクトの作業ディレクトリとDesign Lab成果物パスを指定。
- 各テスト用サーバーはそれぞれのプロジェクトをルートに配信するため、テスト内の `/research/` や `/test_lupin_*` はそのまま使用。
- GitHub Pages の下位パスでの配信は、別途全HTMLページの移設前後ブラウザ比較で検証。

## 検証

- 全656コピーと既存57ファイルを元の作業コピーとバイト単位で照合済み。
- Chromiumで全49 HTMLページを移設前後それぞれ開き、HTTPステータス、タイトル、読み込み失敗、JavaScriptエラーを比較。49/49一致、新規差分なし。
- Usage Test: 統合後310件中289成功、21失敗。元版との全件比較およびGitHub Actions結果は最終報告に記載。
- Windows WebKitによるDesign Labテストは2件失敗。元版との比較および元と同じLinux/Playwright 1.52.0のGitHub Actionsで検証する。

## 統合前から存在する問題

- P太郎: `ptaro_kyoran_lower.png` が元リポジトリに存在せず404。
- Lupin BODY/ZERO: `null` に対する `add` / `showModeHud` 呼び出しエラー。元の最新ActionsでもBODY統合テストが失敗し、ZEROテストがスキップされている。
- Phaser Showcase `advanced27.html`: `Unexpected end of input`。
- 今回は資産移設に限定し、これらゲーム本体の既存不具合は変更していない。

## Godotへの再利用

候補は `yusosha-design-lab`。移設検証後、旧mainとPagesを保持したまま `godot-ready` ブランチにGodot用構成を準備する。`yusosha-godot` へのリポジトリ名変更やデフォルトブランチ切替は、旧Pages URLへの影響があるため別途ユーザー確認後に実施する。元リポジトリの削除・アーカイブは実施しない。
