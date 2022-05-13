import styled from 'styled-components';

export const Container = styled.div`
    overflow: hidden;
    color: white;
    display: flex;
    height: 100vh;
    width: 100%;
    flex-direction: column;
    justify-content: flex-end;
    padding: 25px 25px 60px;

    @media (min-width: 1200px) {
        overflow: unset;
        justify-content: center;
        width: 40%;
        align-self: end;
    }
`;

export const Word = styled.div`
    color: #8a8a8a;
`;

export const HoverWord = styled.div`
    position: absolute;
    opacity: 0;
    top: 0;
    left: 50%;
    transform: translateX(calc(-50% - 70px));
    white-space: nowrap;
    color: white;

    @media (min-width: 1200px) {
        left: 0;
        transform: translateX(-70px);
    }
`;

export const Item = styled.a<{hover: boolean}>`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    position: relative;
    font-weight: 900;
    text-decoration: none;
    justify-content: center;

    @media (min-width: 1200px) {
        justify-content: flex-start;
    }

    & > * {
        line-height: 1em;
        transition: all 0.5s ease;
        font-size: 20vw;
        @media (min-width: 1200px) {
            font-size: 15vh;
        }
    }

    &:hover,
    &.hover {
        ${Word} {
            transform: translateX(70px);
            opacity: 0;
        }

        ${HoverWord} {
            opacity: 1;
            transform: translateX(-50%);

            @media (min-width: 1200px) {
                transform: translateX(0);
            }
        }
    }
`;
