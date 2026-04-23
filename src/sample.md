# GitHub Wiki Style Preview

このプレビューは **GitHub Wiki 風の見た目** で Markdown を表示します。

## GFM サポート例

- [x] タスクリスト
- [ ] テーブル
- [ ] 打ち消し線

> [!NOTE]
> 画像のようなGitHubアラート表現を再現します。

| Feature | Status |
| --- | --- |
| Table | Works |
| Task list | Works |
| Strikethrough | ~~Works~~ |

### Code Block

```ts
type User = {
  id: number;
  name: string;
};

const user: User = { id: 1, name: "octocat" };
console.log(user);
```

### Blockquote

> GitHub Wiki の雰囲気に近い余白とタイポグラフィを再現しています。

### Link

- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
