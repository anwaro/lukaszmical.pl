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
| Year | `2024` |
| Demo url | `/projects/monogram-resolver/app` |
| Repository url | `https://github.com/anwaro/lukaszmical.pl/tree/master/src/services/projects/monogram-resolver` |

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

<CodePanel file="resolver/legacy/basic/resolver-value-overlap.ts">

```ts
export class ValueOverlapResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        return result;
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

</Section>
<!-- content:end -->
