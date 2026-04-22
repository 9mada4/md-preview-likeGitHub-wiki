import sampleMarkdown from "./sample.md?raw";
import { mountGitHubWikiPreview } from "./lib";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Failed to find #app");
}

app.innerHTML = `
  <main class="app-shell">
    <header class="app-header">
      <h1 class="app-title">GitHub Wiki Like Markdown Preview</h1>
      <p class="app-subtitle">左に Markdown、右に GitHub Wiki 風プレビュー</p>
    </header>

    <section class="pane-wrap">
      <article class="panel">
        <h2 class="panel-head">Markdown Editor</h2>
        <textarea id="editor" class="editor" spellcheck="false"></textarea>
      </article>

      <article class="panel">
        <h2 class="panel-head">Preview</h2>
        <div class="preview-wrap">
          <div id="preview"></div>
        </div>
      </article>
    </section>

    <p class="status-row" id="status"></p>
  </main>
`;

const editor = app.querySelector<HTMLTextAreaElement>("#editor");
const preview = app.querySelector<HTMLDivElement>("#preview");
const status = app.querySelector<HTMLParagraphElement>("#status");

if (!editor || !preview || !status) {
  throw new Error("Failed to initialize app elements");
}

let latestRenderId = 0;

const render = async (markdown: string) => {
  const renderId = ++latestRenderId;
  status.textContent = "Rendering...";

  await mountGitHubWikiPreview(preview, markdown, {
    sanitize: true,
    addHeadingIds: true,
    linkTarget: "_blank"
  });

  if (renderId !== latestRenderId) {
    return;
  }

  status.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
};

editor.value = sampleMarkdown;
void render(sampleMarkdown);

editor.addEventListener("input", () => {
  void render(editor.value);
});
