import { createFileRoute } from "@tanstack/react-router";
import { MachineCabinet } from "@/components/cabinet/MachineCabinet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "パチスロ筐体モックアップ | CSS/TS 立体筐体テスト" },
      {
        name: "description",
        content:
          "画像を使わずHTML/CSS/TypeScriptだけで構成した390×600の正面視点パチスロ風筐体モックアップ。LED状態の切替に対応。",
      },
      { property: "og:title", content: "パチスロ筐体モックアップ" },
      {
        property: "og:description",
        content: "CSSレイヤーで組んだ正面視点の筐体表現。サイドLED開閉・下部レインボー演出を切替可能。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen w-full bg-[#0c0d10] flex flex-col items-center justify-center py-6">
      <h1 className="sr-only">パチスロ風 筐体モックアップ（正面視点）</h1>
      <MachineCabinet />
    </main>
  );
}