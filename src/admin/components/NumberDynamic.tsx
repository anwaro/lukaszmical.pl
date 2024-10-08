import React, {useEffect, useState} from 'react';

type Props = {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
};

const NumberDynamic = ({prefix = '', suffix = '', value, duration = 500}: Props) => {
    const [newValue, setNewValue] = useState(0);

    const stepDurationMs = 25;

    const timeoutIds: number[] = [];

    const grow = (growIncrement: number) => {
        const incrementedStep = Math.ceil(newValue + growIncrement);

        if (incrementedStep > value) {
            setNewValue(value);
            return false;
        }

        setNewValue(incrementedStep);

        timeoutIds.push(
            window.setTimeout(() => {
                grow(growIncrement);
            }, stepDurationMs),
        );
    };

    useEffect(() => {
        grow(value / (duration / stepDurationMs));

        return () => {
            timeoutIds.forEach((tid) => {
                clearTimeout(tid);
            });
        };
    });

    return (
        <div>
            {prefix}
            {newValue}
            {suffix}
        </div>
    );
};

export default NumberDynamic;
