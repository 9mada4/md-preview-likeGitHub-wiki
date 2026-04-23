# GitHub Wiki Style Preview

このプレビューは **GitHub Wiki 風の見た目** で Markdown を表示します。

## GFM サポート例

- [x] タスクリスト
- [ ] テーブル
- [ ] 打ち消し線

> [!NOTE]
> NOTE: ユーザーが軽く読めば十分な補足情報です。

> [!TIP]
> TIP: 実装や運用で役立つコツを示します。

> [!IMPORTANT]
> IMPORTANT: 見落とすと困る重要事項です。

> [!WARNING]
> WARNING: 想定外の動作につながる可能性があります。

> [!CAUTION]
> CAUTION: 破壊的変更やデータ損失リスクに注意してください。

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
