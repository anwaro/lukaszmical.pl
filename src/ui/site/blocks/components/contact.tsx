import {clsx} from 'clsx';

import {encodeEmail} from '@/utils/email-obfuscate';

import {ObfuscatedEmail} from '../../obfuscated-email';
import {Prompt as PromptLine} from '../../site-parts';

const emailClass =
    'inline-block font-term text-[clamp(26px,4.6vw,60px)] leading-[1.1] font-bold tracking-[-0.03em] wrap-anywhere';

// Contact panel. The address is obfuscated in the HTML and decoded in the
// browser; `placeholder` stands in while `email` is empty.
export function Contact({
    id,
    command,
    email,
    placeholder,
    children,
}: PWC<{id?: string; command?: string; email?: string; placeholder?: string}>) {
    return (
        <section
            id={id}
            className="rounded-[10px] border border-line bg-panel px-[clamp(20px,4vw,56px)] py-[clamp(40px,6vw,80px)]"
        >
            {command && <PromptLine className="mb-4">{command}</PromptLine>}
            {email ? (
                <ObfuscatedEmail
                    encoded={encodeEmail(email)}
                    className={clsx(emailClass, 'hover:text-accent')}
                />
            ) : (
                <span className={emailClass}>{placeholder}</span>
            )}
            <div className="mt-5 max-w-130 text-soft">{children}</div>
        </section>
    );
}
