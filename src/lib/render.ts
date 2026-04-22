import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

export interface RenderGitHubWikiMarkdownOptions {
  sanitize?: boolean;
  addHeadingIds?: boolean;
  linkTarget?: LinkTarget;
}

function withExternalLinkTarget(linkTarget: LinkTarget) {
  return (tree: unknown) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "a") {
        return;
      }

      const href = node.properties?.href;
      if (typeof href !== "string") {
        return;
      }

      if (href.startsWith("#") || href.startsWith("/")) {
        return;
      }

      node.properties = {
        ...node.properties,
        target: linkTarget,
        rel: "noreferrer noopener"
      };
    });
  };
}

const sanitizeSchema: any = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "details",
    "summary",
    "kbd",
    "sub",
    "sup"
  ],
  attributes: {
    ...(defaultSchema.attributes || {}),
    a: [...(defaultSchema.attributes?.a || []), "className", "target", "rel"],
    code: [...(defaultSchema.attributes?.code || []), "className"],
    div: [...(defaultSchema.attributes?.div || []), "className"],
    h1: [...(defaultSchema.attributes?.h1 || []), "id"],
    h2: [...(defaultSchema.attributes?.h2 || []), "id"],
    h3: [...(defaultSchema.attributes?.h3 || []), "id"],
    h4: [...(defaultSchema.attributes?.h4 || []), "id"],
    h5: [...(defaultSchema.attributes?.h5 || []), "id"],
    h6: [...(defaultSchema.attributes?.h6 || []), "id"],
    img: [...(defaultSchema.attributes?.img || []), "loading", "decoding"],
    input: [
      ...(defaultSchema.attributes?.input || []),
      "className",
      "type",
      "checked",
      "disabled"
    ],
    li: [...(defaultSchema.attributes?.li || []), "className"],
    pre: [...(defaultSchema.attributes?.pre || []), "className"],
    span: [...(defaultSchema.attributes?.span || []), "className"],
    table: [...(defaultSchema.attributes?.table || []), "className"],
    td: [...(defaultSchema.attributes?.td || []), "className", "align"],
    th: [...(defaultSchema.attributes?.th || []), "className", "align"],
    ul: [...(defaultSchema.attributes?.ul || []), "className"]
  }
};

export async function renderGitHubWikiMarkdown(
  markdown: string,
  options: RenderGitHubWikiMarkdownOptions = {}
): Promise<string> {
  const {
    sanitize = true,
    addHeadingIds = true,
    linkTarget = "_blank"
  } = options;

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw);

  if (sanitize) {
    processor.use(rehypeSanitize, sanitizeSchema);
  }

  if (addHeadingIds) {
    processor.use(rehypeSlug);
  }

  processor.use(withExternalLinkTarget, linkTarget).use(rehypeStringify);

  const output = await processor.process(markdown);
  return String(output);
}

export async function mountGitHubWikiPreview(
  element: HTMLElement,
  markdown: string,
  options: RenderGitHubWikiMarkdownOptions = {}
): Promise<void> {
  element.classList.add("markdown-body", "gh-wiki-body");
  element.innerHTML = await renderGitHubWikiMarkdown(markdown, options);
}

