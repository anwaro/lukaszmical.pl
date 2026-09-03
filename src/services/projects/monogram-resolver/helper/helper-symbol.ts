import {Page, Symbol} from 'tesseract.js';

/**
 * tesseract.js v6+ removed the flat `symbols`/`words`/`lines` arrays from the
 * recognize result. Symbols now live nested under
 * `page.blocks -> paragraphs -> lines -> words -> symbols`.
 */
export class SymbolHelper {
    static fromPage(page: Page): Symbol[] {
        return (page.blocks ?? []).flatMap((block) =>
            block.paragraphs.flatMap((paragraph) =>
                paragraph.lines.flatMap((line) =>
                    line.words.flatMap((word) => word.symbols),
                ),
            ),
        );
    }
}
