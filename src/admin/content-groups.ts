import {ContentField, ContentGroup} from '@/admin/components/form/forms/content/content-form';
import {FlatMessages} from '@/services/content/content-messages';

const message = (
    namespace: string,
    key: string,
    label: string,
    options: {multiline?: boolean; help?: string} = {},
): ContentField => ({kind: 'message', namespace, key, label, ...options});

const setting = (key: string, label: string, help?: string): ContentField => ({
    kind: 'setting',
    key,
    label,
    help,
});

// The homepage editor: one group per section of the page, top to bottom.
export const homepageGroups: ContentGroup[] = [
    {
        title: 'Hero',
        fields: [
            message('homepage', 'hero.command', 'Command line', {
                help: 'Shown after the “$” prompt',
            }),
            message('homepage', 'hero.titleLine1', 'Title, line 1'),
            message('homepage', 'hero.titleLine2', 'Title, line 2'),
            message('homepage', 'hero.lead', 'Lead', {multiline: true}),
            message('homepage', 'hero.ctaPrimary', 'Primary button'),
            message('homepage', 'hero.ctaSecondary', 'Secondary button'),
        ],
    },
    {
        title: 'Solver panel',
        fields: [
            message('homepage', 'solver.label', 'Label'),
            message('homepage', 'solver.status', 'Status'),
            message('homepage', 'solver.caption', 'Caption'),
            message('homepage', 'solver.alt', 'Alternative text'),
        ],
    },
    {
        title: 'Case studies',
        fields: [
            message('homepage', 'caseStudies.command', 'Command line', {
                help: 'Cards come from published case studies, in their order',
            }),
            message('homepage', 'caseStudies.problem', 'Label: problem'),
            message('homepage', 'caseStudies.approach', 'Label: approach'),
            message('homepage', 'caseStudies.result', 'Label: result'),
            message('homepage', 'caseStudies.more', 'Link text'),
        ],
    },
    {
        title: 'Projects',
        fields: [
            message('homepage', 'projects.command', 'Command line', {
                help: 'Rows come from projects marked “Featured on homepage”',
            }),
        ],
    },
    {
        title: 'About',
        fields: [
            message('homepage', 'about.command', 'Command line'),
            message('homepage', 'about.text', 'Text', {multiline: true}),
            message('homepage', 'about.stackLabel', 'Stack variable name'),
            setting('stack', 'Stack', 'Comma-separated list'),
        ],
    },
    {
        title: 'Contact',
        fields: [
            message('homepage', 'contact.command', 'Command line'),
            setting('email', 'E-mail'),
            message('homepage', 'contact.emailPlaceholder', 'Placeholder', {
                help: 'Shown while the e-mail is empty',
            }),
            message('homepage', 'contact.text', 'Text', {multiline: true}),
        ],
    },
    {
        title: 'Footer links',
        fields: [
            setting('githubUrl', 'GitHub url', 'An empty link is hidden'),
            setting('linkedinUrl', 'LinkedIn url'),
            setting('cvUrl', 'CV url'),
        ],
    },
    {
        title: 'SEO',
        fields: [
            message('homepage', 'title', 'Page title'),
            message('homepage', 'description', 'Meta description', {multiline: true}),
        ],
    },
];

const namespaceTitles: Record<string, string> = {
    common: 'Common — navigation and footer',
    homepage: 'Homepage',
    caseStudies: 'Case studies',
    projects: 'Projects',
};

const LONG_TEXT = 60;

// The translations editor: every message key, grouped by namespace.
export function translationGroups(messages: FlatMessages[]): ContentGroup[] {
    const groups = new Map<string, ContentField[]>();
    const ids = [...new Set(messages.flatMap((flat) => Object.keys(flat)))].sort();

    for (const id of ids) {
        const [namespace, ...rest] = id.split('.');
        const key = rest.join('.');
        const fields = groups.get(namespace) ?? [];
        fields.push(
            message(namespace, key, key, {
                multiline: messages.some((flat) => (flat[id] ?? '').length > LONG_TEXT),
            }),
        );
        groups.set(namespace, fields);
    }

    return [...groups].map(([namespace, fields]) => ({
        title: namespaceTitles[namespace] ?? namespace,
        fields,
    }));
}
