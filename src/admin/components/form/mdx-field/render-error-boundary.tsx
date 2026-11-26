import React from 'react';

import {noticeDangerClassName} from '@/admin/components/notice-class-name';

// A block can still fail while its already-compiled output is rendered; that
// must not take the whole preview (or picker) down with it.
export class RenderErrorBoundary extends React.Component<PWC, {error?: string}> {
    state: {error?: string} = {};

    static getDerivedStateFromError(error: unknown) {
        return {error: error instanceof Error ? error.message : String(error)};
    }

    render() {
        if (this.state.error !== undefined) {
            return (
                <pre className={noticeDangerClassName()}>
                    Nie udało się wyrenderować podglądu: {this.state.error}
                </pre>
            );
        }
        return this.props.children;
    }
}
