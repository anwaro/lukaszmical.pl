// Arrow joining two <Step>s inside <Flow>.
export function Arrow({label}: {label?: string}) {
    return (
        <div
            aria-hidden="true"
            className="flex-none self-center font-term text-xs text-accent"
        >
            {label ? `${label} ->` : '->'}
        </div>
    );
}
