'use client';

import React from 'react';

import {EventModel} from '@/services/projects/number-sums-resolver/model/model-event';

type Props = {
    events: EventModel[];
};

export function PageNumberSumsResolverLogs({events}: Props) {
    return (
        <div className="flex flex-col gap-2">
            {events.map((event, i) => (
                <div
                    key={event.id}
                    className={`flex items-center gap-2 ${!i ? 'mt-1 border-t border-dashed pt-2' : ''}`}
                >
                    <pre>{event.getName()}</pre>
                    {event.inProgress ? (
                        <svg
                            className="-ml-1 mr-3 size-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <pre className={'text-xs text-stone-500'}>
                            {event.getDuration()}
                        </pre>
                    )}
                </div>
            ))}
        </div>
    );
}
