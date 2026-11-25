import {Prompt as PromptLine} from '../../site-parts';

export function Prompt({symbol, children}: PWC<{symbol?: string}>) {
    return <PromptLine symbol={symbol}>{children}</PromptLine>;
}
