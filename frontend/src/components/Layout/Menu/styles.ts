import styled from 'styled-components';
import {background, highlight} from '../../../consts/colors';
import {containerPadding, maxWidth} from '../../../consts/sizes';

export const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: ${background};
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const Container = styled.div`
    ${containerPadding('16px')};
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    max-width: ${maxWidth};
    width: 100%;
`;

export const Item = styled.a`
    margin-right: 40px;
    font-size: 12pt;
    cursor: pointer;
    transition: color 0.5s;
    text-transform: uppercase;
    text-decoration: none;
    color: #ffffff;

    &:hover {
        color: ${highlight};
    }
`;
