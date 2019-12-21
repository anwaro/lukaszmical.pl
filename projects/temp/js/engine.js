/* global SET */

/**
 *
 *    Skrypt obliczający przechodzace promieniowanie
 *    temperature koncowa
 *
 *    Łukasz Micał
 *
 **/

ENGINE = {};


ENGINE.cal = function () {
    var D = 100,
        przech = 100,
        przechPrev = 100,
        odbija = 0,
        albedo = 0;

    for (var i = SET.nemStratum - 1; i > -1; i--) {
        przech = przechPrev * SET.stratumVal[i].ir;
        odbija = przechPrev - przech;
        albedo = odbija / przechPrev;

        SET.IR[i].przech = przech.toFixed(2);
        SET.IR[i].odbi = odbija.toFixed(2);
        SET.IR[i].albedo = albedo.toFixed(2);

        przechPrev = przech;
    }

    SET.tauIR = przech / D;

    przechPrev = 100;
    for (var i = 0; i < SET.nemStratum; i++) {
        przech = przechPrev * SET.stratumVal[i].vis;
        odbija = przechPrev - przech;
        albedo = odbija / przechPrev;

        SET.Vis[i].przech = przech.toFixed(2);
        SET.Vis[i].odbi = odbija.toFixed(2);
        SET.Vis[i].albedo = albedo.toFixed(2);

        przechPrev = przech;
    }

    SET.tauVis = przech / D;

    SET.temp = Math.pow(((SET.sun * (1 - SET.wAlbedo) * (1 + SET.tauVis)) / (SET.boltz * (1 + SET.tauIR))), 1 / 4) - 273;
    document.getElementById("tmperature").innerHTML = SET.temp.toFixed(2) + '&deg;C';
    document.getElementById("tmperature").style.color = ENGINE.setTempColor(SET.temp);
};


ENGINE.setTempColor = function (t) {
    if (t < 0) {
        t = t < -20 ? -20 : t;
        var k = parseInt(Math.abs(t / 20) * 254 * 0.5);
        return "rgb( 0," + (255 - 2 * k) + ", " + (255 - k) + ")";
    } else {
        t = t > 30 ? -30 : t;
        var k = parseInt(Math.abs(t / 30) * 254 * 0.5);
        return "rgb( " + (126 + k) + " ,0,0)";
    }
};

