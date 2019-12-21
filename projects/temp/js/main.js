/**
 *
 * Symulacja jednowymiarowego klimatu
 *
 * Obliczenia wykonali:
 *    - Patryk Łakomiec
 *    - Łukasz Micał
 *
 * Realizacja programu:
 *    - Łukasz Micał
 *
 **/


var SET = SET || {};
var CANV = CANV || {};

/**
 *    Funkcja inicjalizująca ustawia wielkosc plutna na maksymalna wielkosc
 **/
CANV.set = function () {
    CANV.init();
    SET.y = CANV.canv.height = 600;
    CANV.all.style.height = CANV.cont.style.height = 600 + "px";
    SET.x = CANV.canv.width = 1000;
    CANV.all.style.width = CANV.canv.width + 251 + "px";
    SET.initSet();
    /**
     *
     *    Dodanie jednej warstwy i jej obserwowanie przez js
     *
     **/
    SET.addInputRangeStratum();
    SET.changeValueIrAndVis();
    setInterval(CANV.draw, 50)
};

CANV.set();




