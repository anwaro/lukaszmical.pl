import styled from 'styled-components';

const PersonBackground = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;

    background: url('/assets/image/bg/bg.jpg') no-repeat center top;
    background-size: contain;
    @media (min-width: 1200px) {
        background-position: left center;
    }
`;

export default PersonBackground;
