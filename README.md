# md-preview-likeGitHub-wiki

GitHub Wiki 風の見た目で Markdown を表示する Web アプリです。  
再利用しやすいように、レンダラー部分は `src/lib` に分離してあります。

## 先に結論

- **はい、既存実装はあります。**
- 見た目だけなら [`github-markdown-css`](https://github.com/sindresorhus/github-markdown-css) が定番です。
- GitHub に近い構文解釈は `remark-gfm` か `cmark-gfm` 系で実現できます。
- **GitHub本番と同等の最終HTML** が必要なら、GitHub REST API の [`POST /markdown`](https://docs.github.com/en/rest/markdown/markdown) を使う方法があります。

## GitHub の Markdown 表示方式（調査メモ）

1. GitHubのMarkdown方言は **GFM (GitHub Flavored Markdown)**。  
   公式仕様: <https://github.github.com/gfm/>
2. GFM仕様ページには、HTML化後に追加の **post-processing / sanitization** が入る旨が明記されています。
3. GitHub公式の `github/markup` は「最初の変換ステップ」を扱うライブラリで、READMEには sanitization は別パイプライン側で行うとあります。  
   <https://github.com/github/markup>
4. GitHub API の `POST /markdown` では `mode=gfm` が使えます。  
   一方で `POST /markdown/raw` は GFM 非対応（ドキュメント記載）。  
   <https://docs.github.com/en/rest/markdown/markdown>

## このリポジトリで作ったもの

- `Vite + TypeScript` の Markdown プレビューアプリ
- 左にエディタ、右に GitHub Wiki 風プレビュー
- `rehype-sanitize` によるサニタイズ（XSS対策）
- `github-markdown-css` による見た目再現
- GitHub Alerts 記法（`[!NOTE]` など5種類）対応  
  参考: [GitHubでQiitaの:::noteみたいな強調をする - Qiita](https://qiita.com/lobmto/items/d02532134782f34c0e2f)
- 他アプリに組み込みやすい再利用 API:
  - `renderGitHubWikiMarkdown(markdown, options)`
  - `mountGitHubWikiPreview(element, markdown, options)`

主要実装:

- [`src/lib/render.ts`](./src/lib/render.ts)
- [`src/lib/index.ts`](./src/lib/index.ts)
- [`src/styles/github-wiki.css`](./src/styles/github-wiki.css)
- [`src/main.ts`](./src/main.ts)

## 使い方（開発）

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

出力:

- アプリ: `dist/app`
- 再利用ライブラリ: `dist/lib`

## 他Webアプリへ導入する例

`dist/lib/index.es.js` と `dist/lib/style.css` を配布物として使えます。

```ts
import "md-preview-like-github-wiki/style.css";
import { mountGitHubWikiPreview } from "md-preview-like-github-wiki";

const target = document.getElementById("preview");
if (target) {
  await mountGitHubWikiPreview(target, "# Hello GFM", {
    sanitize: true,
    addHeadingIds: true,
    linkTarget: "_blank"
  });
}
```

## 既存候補の比較（短縮版）

- [`github-markdown-css`](https://github.com/sindresorhus/github-markdown-css)
  - 長所: 軽量。見た目をすぐ寄せられる。
  - 注意: パーサは別途必要。
- [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
  - 長所: ブラウザ内完結しやすい。
  - 注意: GitHub本番の最終HTMLと100%一致は保証しない。
- [`cmark-gfm`](https://github.com/github/cmark-gfm)
  - 長所: GFM拡張の実装として近い。
  - 注意: フロント導入はやや重い（バインディング/ビルド考慮）。
- [`POST /markdown` API](https://docs.github.com/en/rest/markdown/markdown)
  - 長所: GitHub側レンダリングを利用できる。
  - 注意: API制約・認証・ネットワーク依存。
