import {CtaBanner} from '../../site-parts';

export function Cta(props: {text: string; button: string; href: string}) {
    return <CtaBanner {...props} />;
}
