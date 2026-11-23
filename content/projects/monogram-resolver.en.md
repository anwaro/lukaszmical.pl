# monogram-resolver (EN)

Treść do wklejenia w panelu: /admin/projects → pola w języku EN.

## Ustawienia (wspólne dla obu języków)

| Pole | Wartość |
| --- | --- |
| Url or slug | `monogram-resolver` |
| Type | `page` |
| Cover | — |
| Order | `2` |
| Published | `yes` |
| Featured on homepage | `yes` |
| Stack | `TypeScript, Vitest, canvas` |
| Year | `[ROK]` |
| Demo url | `/projects/monogram-resolver/app` |

## Pola tekstowe (EN)

### Name

monogram-resolver

### Description

A live nonogram solver — upload a board and watch it solve step by step.

### Lead

A nonogram solver that does not guess. The board goes through a pipeline of small rules, each of which can be read and tested on its own.

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Section title="how it works">
<Cards>
<Card label="01 · detector/" title="Board analysis">The detector reads rows, columns and their groups.</Card>
<Card label="02 · model/" title="Model">Cells and groups become objects the rules work on.</Card>
<Card label="03 · resolver/" title="Rule pipeline">Every resolver returns cells to fill in and cells to exclude.</Card>
</Cards>
</Section>

<Section title="one rule, one file">
<Big>

Instead of one big algorithm there is a set of small classes. Each one extends a shared model and implements a single method.

</Big>

<CodePanel file="resolver/legacy/basic/resolver-total-size.ts">

```ts
export class TotalSizeResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        // [a fragment of a real rule from the repository]
    }
}
```

</CodePanel>

<Chips>

- basic
- done
- double
- extend
- hole
- separated
- first-and-biggest

</Chips>
</Section>

<Section title="tests">
<Big>

Next to every rule sits its `*.spec.ts` file. A rule starts from a test: first an example row, then the code that solves it.

</Big>

[Add what this project taught you or what was the hardest part.]

</Section>
<!-- content:end -->
