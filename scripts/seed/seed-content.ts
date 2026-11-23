// Seeds the content of the redesigned site: three case studies and the
// projects shown in the design. Entries whose slug already exists are left
// untouched, so it is safe to run against a database that has content.
//
// Usage:
//   pnpm db:seed:content
//
// Requires DATABASE_URL in .env.local (loaded via `tsx --env-file`).

import {eq} from 'drizzle-orm';

import {db} from '@/services/drizzle/drizzle-client';
import {
    ProjectInsert,
    ProjectStringInsert,
    projects,
    projectsStrings,
} from '@/services/drizzle/schema';

type Locale = 'pl' | 'en';
type Strings = Partial<Record<ProjectStringInsert['type'], string>>;

type Entry = {
    row: ProjectInsert;
    strings: Record<Locale, Strings>;
};

// --- case studies -----------------------------------------------------------

type Step = {title: string; text: string; highlight?: boolean; arrow?: string | false};

type CaseStudyCopy = {
    name: string;
    description: string;
    headline: string;
    lead: string;
    role: string;
    problem: string;
    approach: string;
    result: string;
    meta?: string;
    heroShot: string;
    problemBig: string;
    problemText: string;
    flowTitle: string;
    steps: Step[];
    flowNote: string;
    decisions: [string, string][];
    featuresTitle: string;
    features: string[];
    shots: [string, string];
    stats: string[];
    resultNote: string;
};

const sectionTitles: Record<Locale, {problem: string; decisions: string; result: string}> = {
    pl: {problem: 'problem', decisions: 'kluczowe decyzje', result: 'rezultat'},
    en: {problem: 'problem', decisions: 'key decisions', result: 'result'},
};

function caseStudyContent(locale: Locale, copy: CaseStudyCopy): string {
    const titles = sectionTitles[locale];

    const flow = copy.steps
        .map((step, index) => {
            const arrow =
                index === 0 || step.arrow === false
                    ? ''
                    : step.arrow
                      ? `<Arrow label="${step.arrow}" />\n`
                      : '<Arrow />\n';
            return `${arrow}<Step title="${step.title}"${step.highlight ? ' highlight' : ''}>${step.text}</Step>`;
        })
        .join('\n');

    return `<Shot>${copy.heroShot}</Shot>

<Section title="${titles.problem}">
<Big>

${copy.problemBig}

</Big>

${copy.problemText}

</Section>

<Section title="${copy.flowTitle}">
<Flow>
${flow}
</Flow>

${copy.flowNote}

</Section>

<Section title="${titles.decisions}">
<Decisions>
${copy.decisions.map(([title, text]) => `<Decision title="${title}">${text}</Decision>`).join('\n')}
</Decisions>
</Section>

<Section title="${copy.featuresTitle}">
<Chips>

${copy.features.map((feature) => `- ${feature}`).join('\n')}

</Chips>
</Section>

<Shots>
<Shot ratio="4 / 3">${copy.shots[0]}</Shot>
<Shot ratio="4 / 3">${copy.shots[1]}</Shot>
</Shots>

<Section title="${titles.result}">
<Stats>
${copy.stats.map((label) => `<Stat value="[X]">${label}</Stat>`).join('\n')}
</Stats>

${copy.resultNote}

</Section>
`;
}

function caseStudy(
    row: Pick<ProjectInsert, 'url' | 'order' | 'cover' | 'stack' | 'siteUrl'>,
    copy: Record<Locale, CaseStudyCopy>,
): Entry {
    const strings = (locale: Locale): Strings => {
        const item = copy[locale];
        return {
            name: item.name,
            description: item.description,
            headline: item.headline,
            lead: item.lead,
            role: item.role,
            problem: item.problem,
            approach: item.approach,
            result: item.result,
            meta: item.meta ?? '',
            content: caseStudyContent(locale, item),
        };
    };

    return {
        row: {...row, type: 'case-study', published: true},
        strings: {pl: strings('pl'), en: strings('en')},
    };
}

const itmbw = caseStudy(
    {
        url: 'itmbw-pl',
        order: 1,
        cover: '/case-studies/itmbw-pl.png',
        stack: ['Preact', 'TypeScript', 'Tailwind', 'WordPress', 'Laravel'],
        siteUrl: 'https://itmbw.pl',
    },
    {
        pl: {
            name: 'itmbw.pl',
            description:
                'Serwis biegowy z aplikacją dla biegaczy: wyniki, rankingi, kalendarz i konta w jednym miejscu.',
            headline: 'itmbw.pl — serwis biegowy z aplikacją dla biegaczy',
            lead: 'Serwis biegowy, w którym treści redakcyjne o biegach spotykają się z wynikami, rankingami i kontami biegaczy ITMBWieczorem.',
            role: '[TWOJA ROLA]',
            problem:
                'Jeden serwis łączy treści redakcyjne o biegach z wynikami, rankingami i kontami biegaczy ITMBWieczorem.',
            approach:
                'Motyw WordPressa na Tailwindzie, a w nim SPA w Preact i TypeScripcie: wyniki, kalendarz, konto, generator numerów startowych. Dane z osobnego API w Laravelu z własnym CMS-em i wspólnym czyszczeniem cache.',
            result: '[Efekt — np. szybkość stron, liczba biegaczy i wyników w serwisie.]',
            heroShot: '[ZRZUT EKRANU: strona główna itmbw.pl]',
            problemBig:
                'Stowarzyszenie prowadzi serwis redakcyjny i organizuje biegi. Biegacze chcą w tym samym miejscu sprawdzić wyniki, rankingi i własne konto.',
            problemText:
                'Strony redakcyjne dobrze obsługuje WordPress, ale część dla biegaczy to aplikacja: listy z sortowaniem, wyszukiwarka, logowanie, generowanie plików. [Dopisz, co było punktem wyjścia i ograniczeniem.]',
            flowTitle: 'architektura',
            steps: [
                {
                    title: 'WordPress',
                    text: 'Motyw PHP na Tailwindzie: strona główna, artykuły, partnerzy, strony biegów.',
                },
                {
                    title: 'SPA w Preact',
                    text: 'Wszystkie strony dla biegaczy, osadzone we wpisach shortcodem. Vite, TypeScript, własny router.',
                    highlight: true,
                },
                {
                    title: 'API w Laravelu',
                    text: 'app.itmbw.pl: publiczne JSON API i wewnętrzny CMS w React do zarządzania danymi.',
                },
            ],
            flowNote:
                'Strona biegacza to zwykły wpis WordPressa. Router aplikacji wybiera widok po adresie, a logowanie działa przez sesję współdzieloną między domeną i subdomeną API.',
            decisions: [
                [
                    'Aplikacja wewnątrz WordPressa, nie obok',
                    'Redakcja zostaje przy znanym edytorze, a biegacz nie opuszcza serwisu. Adresy aplikacji pokrywają się z adresami wpisów.',
                ],
                [
                    'API jako kontrakt',
                    'Dokumentacja OpenAPI powstaje z kodu, a test pilnuje, żeby żadna trasa nie została bez opisu.',
                ],
                [
                    'Cache z natychmiastowym czyszczeniem',
                    'Odpowiedzi API i gotowe strony są cache’owane, a każda edycja w CMS-ie od razu unieważnia oba poziomy.',
                ],
                [
                    'Dane wydarzeń w rękach redakcji',
                    'Dane strukturalne biegów (SportsEvent) uzupełnia się w edytorze strony — nowa edycja nie wymaga wdrożenia.',
                ],
            ],
            featuresTitle: 'co potrafi aplikacja',
            features: [
                'hall of fame',
                'lista i profile biegaczy',
                'wyniki biegów',
                'kluby',
                'kalendarz',
                'rejestracja i logowanie',
                'konto: profil, adres, awatar',
                'generator numerów startowych (PDF)',
            ],
            shots: ['[ZRZUT: wyniki biegu]', '[ZRZUT: profil biegacza na telefonie]'],
            stats: ['[biegaczy w bazie]', '[wyników biegów]', '[np. czas ładowania strony]'],
            resultNote:
                '[Dwa zdania o efekcie: co zmieniło się dla biegaczy i dla redakcji.]',
        },
        en: {
            name: 'itmbw.pl',
            description:
                'A running portal with an app for runners: results, rankings, a calendar and accounts in one place.',
            headline: 'itmbw.pl — a running portal with an app for runners',
            lead: 'A running portal where editorial content about races meets the results, rankings and runner accounts of ITMBWieczorem.',
            role: '[YOUR ROLE]',
            problem:
                'One site combines editorial content about races with the results, rankings and runner accounts of ITMBWieczorem.',
            approach:
                'A WordPress theme on Tailwind with a Preact and TypeScript SPA inside it: results, calendar, account, bib number generator. Data comes from a separate Laravel API with its own CMS and shared cache purging.',
            result: '[Outcome — e.g. page speed, number of runners and results on the site.]',
            heroShot: '[SCREENSHOT: itmbw.pl homepage]',
            problemBig:
                'The association runs an editorial site and organises races. Runners want to check results, rankings and their own account in the same place.',
            problemText:
                'WordPress handles editorial pages well, but the part for runners is an application: sortable lists, search, sign-in, file generation. [Add what the starting point and the constraints were.]',
            flowTitle: 'architecture',
            steps: [
                {
                    title: 'WordPress',
                    text: 'A PHP theme on Tailwind: homepage, articles, partners, race pages.',
                },
                {
                    title: 'Preact SPA',
                    text: 'All pages for runners, embedded in posts with a shortcode. Vite, TypeScript, a custom router.',
                    highlight: true,
                },
                {
                    title: 'Laravel API',
                    text: 'app.itmbw.pl: a public JSON API and an internal React CMS for managing data.',
                },
            ],
            flowNote:
                'A runner page is a regular WordPress post. The app router picks the view by address, and sign-in works through a session shared between the domain and the API subdomain.',
            decisions: [
                [
                    'The app inside WordPress, not next to it',
                    'Editors keep the editor they know and runners never leave the site. App addresses match post addresses.',
                ],
                [
                    'The API as a contract',
                    'OpenAPI documentation is generated from code, and a test makes sure no route is left undocumented.',
                ],
                [
                    'Cache with instant purging',
                    'API responses and rendered pages are cached, and every edit in the CMS invalidates both levels right away.',
                ],
                [
                    'Event data in the hands of editors',
                    'Structured data for races (SportsEvent) is filled in the page editor — a new edition needs no deployment.',
                ],
            ],
            featuresTitle: 'what the app does',
            features: [
                'hall of fame',
                'runner list and profiles',
                'race results',
                'clubs',
                'calendar',
                'sign-up and sign-in',
                'account: profile, address, avatar',
                'bib number generator (PDF)',
            ],
            shots: ['[SCREENSHOT: race results]', '[SCREENSHOT: runner profile on a phone]'],
            stats: ['[runners in the database]', '[race results]', '[e.g. page load time]'],
            resultNote:
                '[Two sentences about the outcome: what changed for runners and for the editors.]',
        },
    },
);

const gdzieTransmisja = caseStudy(
    {
        url: 'gdzie-transmisja',
        order: 2,
        cover: '/case-studies/gdzie-transmisja.png',
        stack: ['Next.js', 'NestJS', 'Drizzle', 'PostgreSQL', 'Turborepo'],
        siteUrl: '',
    },
    {
        pl: {
            name: 'Gdzie Transmisja',
            description:
                'Wyszukiwarka transmisji sportowych, miejscówek i lig — z danych zbieranych z zewnętrznych źródeł.',
            headline: 'Gdzie Transmisja — wyszukiwarka transmisji sportowych',
            lead: 'Wyszukiwarka transmisji sportowych: mecze, kanały, ligi i miejscówki, w których można je obejrzeć.',
            role: '[TWOJA ROLA]',
            problem:
                'Transmisje, miejscówki i ligi w jednym miejscu — z danych zbieranych z zewnętrznych źródeł.',
            approach:
                'Monorepo na Turborepo: Next.js, API w NestJS z Drizzle i Postgresem, panel admina, scrapery oraz typy generowane z OpenAPI, wspólne dla wszystkich aplikacji.',
            result: '[Efekt — np. liczba transmisji w bazie, ruch, czas dodania nowej ligi.]',
            heroShot: '[ZRZUT EKRANU: wyszukiwarka transmisji]',
            problemBig:
                'Informacje o tym, gdzie obejrzeć mecz, są rozrzucone po wielu źródłach. Kibic chce jednej odpowiedzi: kanał, godzina, miejsce.',
            problemText:
                'Po stronie kodu to kilka aplikacji naraz — strona dla kibiców, panel redakcji, API i import danych — które muszą posługiwać się tymi samymi typami. [Dopisz, skąd wziął się pomysł i kto za nim stoi.]',
            flowTitle: 'architektura',
            steps: [
                {
                    title: '@gt/data',
                    text: 'Scrapery i import transmisji z zewnętrznych źródeł.',
                },
                {
                    title: '@gt/api',
                    text: 'NestJS, Drizzle, Zod i PostgreSQL. Autoryzacja JWT, pliki, zadania cron.',
                },
                {
                    title: '@gt/web',
                    text: 'Publiczna strona w Next.js: transmisje, miejscówki, ligi.',
                    highlight: true,
                },
                {
                    title: '@gt/admin',
                    text: 'Panel redakcji na react-admin i Vite.',
                    arrow: false,
                },
            ],
            flowNote:
                'Całość spina pakiet `@gt/shared`: typy, enumy i narzędzia używane przez wszystkie aplikacje. Monorepo działa na pnpm workspaces i Turborepo.',
            decisions: [
                [
                    'Typy z jednego źródła',
                    'Schemat bazy w Drizzle daje schematy Zod, te dają OpenAPI, a z niego generują się typy i enum tras dla frontendów.',
                ],
                [
                    'Adresy strony jako typ',
                    'Typy ścieżek powstają ze struktury katalogów Next.js, razem z tłumaczeniami tras na polski i angielski.',
                ],
                [
                    'Komponent to sam widok',
                    'Plik komponentu zawiera tylko JSX. Logika trafia do jednego hooka obok, a strona tylko pobiera dane i renderuje.',
                ],
                [
                    'Jedno repo, osobne wdrożenia',
                    'Strona i panel wdrażają się na Vercelu, API na Railway. Migracje bazy API uruchamia samo przy starcie.',
                ],
            ],
            featuresTitle: 'co potrafi produkt',
            features: [
                'wyszukiwarka transmisji',
                'miejscówki',
                'ligi i drużyny',
                'kanały',
                'artykuły',
                'panel administracyjny',
                'automatyczny import danych',
            ],
            shots: ['[ZRZUT: strona transmisji]', '[ZRZUT: panel admina]'],
            stats: ['[transmisji w bazie]', '[lig i kanałów]', '[np. użytkowników miesięcznie]'],
            resultNote:
                '[Dwa zdania o efekcie: na jakim etapie jest produkt i co działa najlepiej.]',
        },
        en: {
            name: 'Gdzie Transmisja',
            description:
                'A search engine for sports broadcasts, venues and leagues — built on data collected from external sources.',
            headline: 'Gdzie Transmisja — a sports broadcast search engine',
            lead: 'A search engine for sports broadcasts: matches, channels, leagues and the venues where you can watch them.',
            role: '[YOUR ROLE]',
            problem:
                'Broadcasts, venues and leagues in one place — built on data collected from external sources.',
            approach:
                'A Turborepo monorepo: Next.js, a NestJS API with Drizzle and Postgres, an admin panel, scrapers and types generated from OpenAPI, shared by every app.',
            result: '[Outcome — e.g. number of broadcasts in the database, traffic, time to add a new league.]',
            heroShot: '[SCREENSHOT: broadcast search]',
            problemBig:
                'Information about where to watch a match is scattered across many sources. A fan wants one answer: channel, time, place.',
            problemText:
                'On the code side it is several applications at once — a site for fans, an editorial panel, an API and data import — that have to speak the same types. [Add where the idea came from and who is behind it.]',
            flowTitle: 'architecture',
            steps: [
                {
                    title: '@gt/data',
                    text: 'Scrapers and broadcast import from external sources.',
                },
                {
                    title: '@gt/api',
                    text: 'NestJS, Drizzle, Zod and PostgreSQL. JWT auth, files, cron jobs.',
                },
                {
                    title: '@gt/web',
                    text: 'The public Next.js site: broadcasts, venues, leagues.',
                    highlight: true,
                },
                {
                    title: '@gt/admin',
                    text: 'The editorial panel on react-admin and Vite.',
                    arrow: false,
                },
            ],
            flowNote:
                'Everything is tied together by the `@gt/shared` package: types, enums and tools used by every app. The monorepo runs on pnpm workspaces and Turborepo.',
            decisions: [
                [
                    'Types from a single source',
                    'The Drizzle database schema yields Zod schemas, those yield OpenAPI, and from it the types and the route enum for the frontends are generated.',
                ],
                [
                    'Site addresses as a type',
                    'Path types are derived from the Next.js directory structure, together with route translations into Polish and English.',
                ],
                [
                    'A component is just the view',
                    'A component file holds only JSX. Logic goes into a single hook next to it, and the page only fetches data and renders.',
                ],
                [
                    'One repo, separate deployments',
                    'The site and the panel deploy to Vercel, the API to Railway. The API runs its database migrations on start.',
                ],
            ],
            featuresTitle: 'what the product does',
            features: [
                'broadcast search',
                'venues',
                'leagues and teams',
                'channels',
                'articles',
                'admin panel',
                'automatic data import',
            ],
            shots: ['[SCREENSHOT: broadcast page]', '[SCREENSHOT: admin panel]'],
            stats: ['[broadcasts in the database]', '[leagues and channels]', '[e.g. monthly users]'],
            resultNote:
                '[Two sentences about the outcome: what stage the product is at and what works best.]',
        },
    },
);

const magnoliowa = caseStudy(
    {
        url: 'magnoliowa-twin',
        order: 3,
        cover: '/case-studies/magnoliowa-twin.png',
        stack: ['SwiftUI', 'Kotlin Compose', 'FastAPI', 'ESP32', 'Next.js', 'Astro'],
        siteUrl: '',
    },
    {
        pl: {
            name: 'Magnoliowa Twin',
            description:
                'Brama otwierana z telefonu: aplikacje iOS i Android, serwer na Raspberry Pi i opcjonalny przycisk BLE.',
            headline: 'Magnoliowa Twin — brama otwierana z telefonu',
            lead: 'System, który otwiera bramę jednym dotknięciem: z aplikacji, z widżetu albo fizycznym przyciskiem Bluetooth.',
            role: '[TWOJA ROLA]',
            problem: 'Bramę dało się otworzyć wyłącznie jej fizycznym pilotem.',
            approach:
                'Aplikacje iOS (SwiftUI) i Android (Compose), API w FastAPI na Raspberry Pi sterujące przekaźnikiem, opcjonalny przycisk BLE na ESP32 i panel admina w Next.js.',
            result: '[Efekt — np. liczba użytkowników i otwarć dziennie.]',
            meta: 'platformy: iOS · Android · Raspberry Pi',
            heroShot: '[ZDJĘCIE LUB ZRZUT: aplikacja na telefonie przy bramie]',
            problemBig:
                'Bramę otwierał tylko jej własny pilot radiowy. Celem było otwieranie z telefonu — bez ingerencji w napęd bramy.',
            problemText:
                'To projekt, w którym oprogramowanie kończy się na fizycznym przekaźniku: aplikacje mobilne, serwer, firmware i panel muszą razem zadziałać w ciągu sekundy. [Dopisz, dla kogo powstał system i ilu ma użytkowników.]',
            flowTitle: 'jak to działa',
            steps: [
                {
                    title: 'Telefon',
                    text: 'Dotknięcie w aplikacji, widżecie lub kafelku szybkich ustawień.',
                    highlight: true,
                },
                {
                    title: 'Serwer bramy',
                    text: 'FastAPI na Raspberry Pi sprawdza token i załącza przekaźnik.',
                    arrow: 'HTTPS',
                },
                {
                    title: 'Pilot bramy',
                    text: 'Przekaźnik „naciska” przycisk oryginalnego pilota.',
                    arrow: 'GPIO',
                },
                {
                    title: 'Napęd',
                    text: 'Brama otwiera się tak, jakby ktoś użył pilota.',
                    arrow: 'RF',
                },
            ],
            flowNote:
                'Opcjonalny przycisk na ESP32-C3 wysyła sygnał przez Bluetooth do telefonu. Aplikacja działająca w tle przekazuje go do serwera i odsyła wynik, a przycisk potwierdza go diodą.',
            decisions: [
                [
                    'Nie ruszać napędu',
                    'Przekaźnik jest wpięty w istniejący pilot, nie w silnik. Brama działa dalej po staremu, a system da się odłączyć bez śladu.',
                ],
                [
                    'Telefon główną ścieżką, Bluetooth dodatkiem',
                    'Podstawą jest uwierzytelnione żądanie z aplikacji. Przycisk BLE jest dla tych, którzy nie chcą odblokowywać telefonu.',
                ],
                [
                    'Dwie natywne aplikacje o tym samym zakresie',
                    'SwiftUI na iOS i Jetpack Compose na Androidzie. Dzięki temu działa widżet Control Center i kafelek szybkich ustawień.',
                ],
                [
                    'Jedno API dla wszystkich klientów',
                    'Z tego samego API korzystają obie aplikacje, firmware i panel admina w Next.js. Kontrakt jest opisany w jednym miejscu.',
                ],
            ],
            featuresTitle: 'z czego się składa',
            features: [
                'aplikacja iOS',
                'aplikacja Android',
                'widżet Control Center',
                'kafelek Quick Settings',
                'powiadomienia push',
                'historia otwarć',
                'przycisk BLE na ESP32',
                'czujnik stanu bramy',
                'panel admina',
                'strona publiczna w Astro',
            ],
            shots: ['[ZRZUT: ekran główny aplikacji]', '[ZDJĘCIE: przycisk BLE i Raspberry Pi]'],
            stats: ['[użytkowników]', '[otwarć dziennie]', '[np. czas od dotknięcia do otwarcia]'],
            resultNote: '[Dwa zdania o efekcie: jak system sprawdza się na co dzień.]',
        },
        en: {
            name: 'Magnoliowa Twin',
            description:
                'A gate opened from a phone: iOS and Android apps, a server on a Raspberry Pi and an optional BLE button.',
            headline: 'Magnoliowa Twin — a gate opened from a phone',
            lead: 'A system that opens a gate with one tap: from the app, from a widget or with a physical Bluetooth button.',
            role: '[YOUR ROLE]',
            problem: 'The gate could only be opened with its physical remote.',
            approach:
                'iOS (SwiftUI) and Android (Compose) apps, a FastAPI service on a Raspberry Pi driving a relay, an optional BLE button on an ESP32 and an admin panel in Next.js.',
            result: '[Outcome — e.g. number of users and openings per day.]',
            meta: 'platforms: iOS · Android · Raspberry Pi',
            heroShot: '[PHOTO OR SCREENSHOT: the app on a phone at the gate]',
            problemBig:
                'Only the gate’s own radio remote could open it. The goal was to open it from a phone — without touching the gate drive.',
            problemText:
                'This is a project where software ends at a physical relay: mobile apps, a server, firmware and a panel have to work together within a second. [Add who the system was built for and how many users it has.]',
            flowTitle: 'how it works',
            steps: [
                {
                    title: 'Phone',
                    text: 'A tap in the app, a widget or a quick settings tile.',
                    highlight: true,
                },
                {
                    title: 'Gate server',
                    text: 'FastAPI on a Raspberry Pi checks the token and switches the relay.',
                    arrow: 'HTTPS',
                },
                {
                    title: 'Gate remote',
                    text: 'The relay “presses” the button of the original remote.',
                    arrow: 'GPIO',
                },
                {
                    title: 'Drive',
                    text: 'The gate opens as if someone had used the remote.',
                    arrow: 'RF',
                },
            ],
            flowNote:
                'An optional ESP32-C3 button sends a signal to the phone over Bluetooth. The app running in the background passes it to the server and returns the result, which the button confirms with an LED.',
            decisions: [
                [
                    'Leave the drive alone',
                    'The relay is wired into the existing remote, not the motor. The gate keeps working as before and the system can be removed without a trace.',
                ],
                [
                    'Phone as the main path, Bluetooth as an extra',
                    'The basis is an authenticated request from the app. The BLE button is for those who do not want to unlock their phone.',
                ],
                [
                    'Two native apps with the same scope',
                    'SwiftUI on iOS and Jetpack Compose on Android. That is what makes the Control Center widget and the quick settings tile possible.',
                ],
                [
                    'One API for every client',
                    'Both apps, the firmware and the Next.js admin panel use the same API. The contract is described in one place.',
                ],
            ],
            featuresTitle: 'what it consists of',
            features: [
                'iOS app',
                'Android app',
                'Control Center widget',
                'Quick Settings tile',
                'push notifications',
                'opening history',
                'BLE button on an ESP32',
                'gate state sensor',
                'admin panel',
                'public site in Astro',
            ],
            shots: ['[SCREENSHOT: app home screen]', '[PHOTO: BLE button and Raspberry Pi]'],
            stats: ['[users]', '[openings per day]', '[e.g. time from tap to opening]'],
            resultNote: '[Two sentences about the outcome: how the system holds up day to day.]',
        },
    },
);

// --- projects ---------------------------------------------------------------

const monogramContent: Record<Locale, string> = {
    pl: `<Section title="jak to działa">
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

<CodePanel file="resolver/legacy/basic/resolver-total-size.ts">

\`\`\`ts
export class TotalSizeResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        // [fragment prawdziwej reguły z repozytorium]
    }
}
\`\`\`

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

Obok każdej reguły leży jej plik \`*.spec.ts\`. Reguła powstaje od testu: najpierw przykład wiersza, potem kod, który go rozwiązuje.

</Big>

[Dopisz, czego nauczył Cię ten projekt albo co było najtrudniejsze.]

</Section>
`,
    en: `<Section title="how it works">
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

\`\`\`ts
export class TotalSizeResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        // [a fragment of a real rule from the repository]
    }
}
\`\`\`

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

Next to every rule sits its \`*.spec.ts\` file. A rule starts from a test: first an example row, then the code that solves it.

</Big>

[Add what this project taught you or what was the hardest part.]

</Section>
`,
};

const projectEntries: Entry[] = [
    {
        row: {
            // An app served by this site rather than a page with a write-up.
            url: '/projects/number-sums-resolver/app',
            type: 'external',
            order: 1,
            published: true,
            featured: true,
            stack: ['TypeScript', 'canvas'],
        },
        strings: {
            pl: {
                name: 'number-sums-resolver',
                description: 'Interaktywny solver łamigłówki liczbowej.',
            },
            en: {
                name: 'number-sums-resolver',
                description: 'An interactive solver for a number puzzle.',
            },
        },
    },
    {
        row: {
            url: 'monogram-resolver',
            type: 'page',
            order: 2,
            published: true,
            featured: true,
            stack: ['TypeScript', 'Vitest', 'canvas'],
            period: '[ROK]',
            siteUrl: '/projects/monogram-resolver/app',
        },
        strings: {
            pl: {
                name: 'monogram-resolver',
                description:
                    'Solver nonogramów na żywo — wgraj planszę i patrz na kolejne kroki.',
                lead: 'Solver nonogramów, który nie zgaduje. Plansza przechodzi przez pipeline małych reguł, a każdą z nich da się przeczytać i przetestować osobno.',
                content: monogramContent.pl,
            },
            en: {
                name: 'monogram-resolver',
                description:
                    'A live nonogram solver — upload a board and watch it solve step by step.',
                lead: 'A nonogram solver that does not guess. The board goes through a pipeline of small rules, each of which can be read and tested on its own.',
                content: monogramContent.en,
            },
        },
    },
    {
        row: {
            url: 'lukaszmical-pl',
            type: 'page',
            order: 3,
            published: true,
            featured: true,
            stack: ['Next.js', 'Drizzle', 'next-intl'],
        },
        strings: {
            pl: {
                name: 'lukaszmical.pl',
                description: 'Ta strona: dwujęzyczny serwis z własnym panelem admina.',
                lead: 'Ta strona: dwujęzyczny serwis z własnym panelem admina i SEO od podstaw.',
                content: '',
            },
            en: {
                name: 'lukaszmical.pl',
                description: 'This site: a bilingual website with its own admin panel.',
                lead: 'This site: a bilingual website with its own admin panel and SEO built from the ground up.',
                content: '',
            },
        },
    },
];

const stringTypes = projectsStrings.type.enumValues;

async function seed() {
    const entries = [itmbw, gdzieTransmisja, magnoliowa, ...projectEntries];
    let created = 0;

    for (const entry of entries) {
        const [existing] = await db
            .select({id: projects.id})
            .from(projects)
            .where(eq(projects.url, entry.row.url))
            .limit(1);

        if (existing) {
            console.log(`skip   ${entry.row.url} (already exists)`);
            continue;
        }

        await db.transaction(async (tx) => {
            const [project] = await tx.insert(projects).values(entry.row).returning();
            await tx.insert(projectsStrings).values(
                stringTypes.flatMap((type) =>
                    (['pl', 'en'] as const).map((locale) => ({
                        projectId: project.id,
                        type,
                        locale,
                        value: entry.strings[locale][type] ?? '',
                    })),
                ),
            );
        });

        created++;
        console.log(`create ${entry.row.url}`);
    }

    console.log(`Seeded ${created} of ${entries.length} entries`);
}

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
