# monogram-resolver (PL)

Treść do wklejenia w panelu: /admin/projects → pola w języku PL.

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

## Pola tekstowe (PL)

### Name

monogram-resolver

### Description

Solver nonogramów na żywo — wgraj planszę i patrz na kolejne kroki.

### Lead

Solver nonogramów, który nie zgaduje. Plansza przechodzi przez pipeline małych reguł, a każdą z nich da się przeczytać i przetestować osobno.

## Content (MDX)

Wklej do pola „Content” wszystko spomiędzy znaczników.

<!-- content:start -->
<Section title="jak to działa">
<Cards>
<Card label="01 · detector/" title="Analiza planszy">Detektor odczytuje wiersze, kolumny i ich grupy.</Card>
<Card label="02 · model/" title="Model">Komórki i grupy stają się obiektami, na których pracują reguły.</Card>
<Card label="03 · resolver/" title="Pipeline reguł">Każdy resolver zwraca pola do zamalowania i do wykluczenia.</Card>
</Cards>
</Section>

<Section title="jedna reguła, jeden plik">
<Big>

Zamiast jednego dużego algorytmu jest zestaw małych klas. Każda dziedziczy po wspólnym modelu i implementuje jedną metodę.

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

<Section title="testy">
<Big>

Obok każdej reguły leży jej plik `*.spec.ts`. Reguła powstaje od testu: najpierw przykład wiersza, potem kod, który go rozwiązuje.

</Big>

</Section>
<!-- content:end -->
