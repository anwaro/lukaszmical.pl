import React from 'react';
import {animated} from 'react-spring';

import useAnimatedWord from '~components/Pages/Homepage/Menu/useAnimatedWord';

import s from './styles.module.scss';

export type LetterProps = {
    color: string;
    letter: string;
    letterOnHover: string;
    isHover: boolean;
};

const Letter: React.FC<LetterProps> = ({color, letter, letterOnHover, isHover}) => {
    const {
        letterRef,
        letterStyle,
        hoverLetterStyle,
        hoverLetterRef,
        width,
    } = useAnimatedWord(isHover);

    return (
        <animated.div className={s.letter} style={{width}}>
            <animated.div ref={letterRef} style={letterStyle}>
                {letter}
            </animated.div>
            <animated.div ref={hoverLetterRef} style={hoverLetterStyle}>
                {letterOnHover}
            </animated.div>
        </animated.div>
    );
};

export default Letter;
