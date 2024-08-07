$mask = {
    USREDNIAJACY: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    KWADRATOWY: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    KOLOWY: [
        0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
    ],
    LP1: [1, 1, 1, 1, 2, 1, 1, 1, 1],
    LP2: [1, 1, 1, 1, 4, 1, 1, 1, 1],
    LP3: [1, 1, 1, 1, 12, 1, 1, 1, 1],
    PIRAMIDALNY: [
        1, 2, 3, 2, 1, 2, 4, 6, 4, 2, 3, 6, 9, 6, 3, 2, 4, 6, 4, 2, 1, 2, 3, 2, 1,
    ],
    STOZKOWY: [
        0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 1, 2, 5, 2, 1, 0, 2, 2, 2, 0, 0, 0, 1, 0, 0,
    ],
    GAUSS1: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    GAUSS2: [
        1, 1, 2, 1, 1, 1, 2, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 2, 1, 1, 1, 2, 1, 1,
    ],
    GAUSS3: [
        0, 1, 2, 1, 0, 1, 4, 8, 4, 1, 2, 8, 16, 8, 2, 1, 4, 8, 4, 1, 0, 1, 2, 1, 0,
    ],
    GAUSS4: [
        1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 26, 16, 26, 4, 1, 4, 7,
        4, 1,
    ],
    GAUSS5: [
        1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 4, 2, 2, 1, 2, 2, 4, 8, 4, 2, 2, 2, 4, 8, 16,
        8, 4, 2, 2, 2, 4, 8, 4, 2, 2, 1, 2, 2, 4, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1,
    ],
    USUN_SREDNIA: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
    HP1: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    HP2: [1, -2, 1, -2, 5, -2, 1, -2, 1],
    HP3: [0, -1, 0, -1, 20, -1, 0, -1, 0],
    POZIOMY: [0, 0, 0, -1, 1, 0, 0, 0, 0],
    PIONOWY: [0, -1, 0, 0, 1, 0, 0, 0, 0],
    UKOSNY1: [-1, 0, 0, 0, 1, 0, 0, 0, 0],
    UKOSNY2: [0, 0, -1, 0, 1, 0, 0, 0, 0],
    GRADIENT_E: [-1, 1, 1, -1, -2, 1, -1, 1, 1],
    GRADIENT_SE: [-1, -1, 1, -1, -2, 1, 1, 1, 1],
    GRADIENT_S: [-1, -1, -1, 1, -2, 1, 1, 1, 1],
    GRADIENT_SW: [1, -1, -1, 1, -2, -1, 1, 1, 1],
    GRADIENT_W: [1, 1, -1, 1, -2, -1, 1, 1, -1],
    GRADIENT_NW: [1, 1, 1, 1, -2, -1, 1, -1, -1],
    GRADIENT_N: [1, 1, 1, 1, -2, 1, -1, -1, -1],
    GRADIENT_NE: [1, 1, 1, -1, -2, 1, -1, -1, 1],
    UWYPUKLAJACY_E: [-1, 0, 1, -1, 1, 1, -1, 0, 1],
    UWYPUKLAJACY_SE: [-1, -1, 0, -1, 1, 1, 0, 1, 1],
    UWYPUKLAJACY_S: [-1, -1, -1, 0, 1, 0, 1, 1, 1],
    UWYPUKLAJACY_SW: [0, -1, -1, 1, 1, -1, 1, 1, 0],
    UWYPUKLAJACY_W: [1, 0, -1, 1, 1, -1, 1, 0, -1],
    UWYPUKLAJACY_NW: [1, 1, 0, 1, 1, -1, 0, -1, -1],
    UWYPUKLAJACY_N: [1, 1, 1, 0, 1, 0, -1, -1, -1],
    UWYPUKLAJACY_NE: [0, 1, 1, -1, 1, 1, -1, -1, 0],
    LAPL1: [0, -1, 0, -1, 4, -1, 0, -1, 0],
    LAPL2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    LAPL3: [1, -2, 1, -2, 4, -2, 1, -2, 1],
    LAPL_SKOSNY: [-1, 0, -1, 0, 4, 0, -1, 0, -1],
    LAPL_PIONOWY: [0, -1, 0, 0, 2, 0, 0, -1, 0],
    LAPL_POZIOMY: [0, 0, 0, -1, 2, -1, 0, 0, 0],
    SOBEL_POZIOMY: [1, 2, 1, 0, 0, 0, -1, -2, -1],
    SOBEL_PIONOWY: [1, 0, -1, 2, 0, -2, 1, 0, -1],
    PREWITT_POZIOMY: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
    PREWITT_PIONOWY: [1, 0, -1, 1, 0, -1, 1, 0, -1],
};

function randomMask() {
    var keys = Object.keys($mask);
    return $mask[keys[(keys.length * Math.random()) << 0]];
}
