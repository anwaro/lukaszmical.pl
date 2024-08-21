import type {ColorButtonKey} from '../../interfaces';

import {ReactNode} from 'react';

import {mdiClose} from '@mdi/js';

import {Button} from '../button/button';
import ButtonsGroup from '../button/buttons-group';
import CardBoxComponentTitle from './Component/Title';
import OverlayLayer from '../OverlayLayer';

import CardBox from '.';

type Props = {
    title: string;
    buttonColor: ColorButtonKey;
    buttonLabel: string;
    isActive: boolean;
    children: ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
};

const CardBoxModal = ({
    title,
    buttonColor,
    buttonLabel,
    isActive,
    children,
    onConfirm,
    onCancel,
}: Props) => {
    if (!isActive) {
        return null;
    }

    const footer = (
        <ButtonsGroup>
            <Button label={buttonLabel} color={buttonColor} onClick={onConfirm} />
            {!!onCancel && (
                <Button
                    label="Cancel"
                    color={buttonColor}
                    outline
                    onClick={onCancel}
                />
            )}
        </ButtonsGroup>
    );

    return (
        <OverlayLayer
            onClick={onCancel}
            className={onCancel ? 'cursor-pointer' : ''}
        >
            <CardBox
                className={`z-50 max-h-modal w-11/12 shadow-lg transition-transform md:w-3/5 lg:w-2/5 xl:w-4/12`}
                isModal
                footer={footer}
            >
                <CardBoxComponentTitle title={title}>
                    {!!onCancel && (
                        <Button
                            icon={mdiClose}
                            color="whiteDark"
                            onClick={onCancel}
                            small
                            roundedFull
                        />
                    )}
                </CardBoxComponentTitle>

                <div className="space-y-3">{children}</div>
            </CardBox>
        </OverlayLayer>
    );
};

export default CardBoxModal;
