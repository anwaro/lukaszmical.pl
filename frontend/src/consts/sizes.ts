import {css} from 'styled-components';

export const maxWidth = '1260px';
export const paddingLarge = '30px';
export const paddingSmall = '15px';
export const breakLarge = '900px';

export const containerPadding = (vertical: string) => css`
  padding: ${vertical} ${paddingSmall};
  @media (min-width: ${breakLarge}) {
    padding: ${vertical} ${paddingLarge};
  }
}
`;
