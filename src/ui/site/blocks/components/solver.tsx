import {SolverPanel} from '../../solver-panel';

export function Solver(props: {
    label: string;
    status: string;
    alt: string;
    caption?: string;
}) {
    return <SolverPanel {...props} />;
}
