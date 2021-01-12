/**
 *
 *    Skrypt zawierający zdarzenia js
 *
 **/

var SET = SET || {};

SET.initSet = function () {
    /**
     *
     *    Zmiana rodzaju albedo wartosc <--> rodzaj podloza
     *
     **/

    var albedo1 = document.getElementById("albedo1");
    var albedo2 = document.getElementById("albedo2");

    albedo1.addEventListener("change", SET.checkAlbedo1);
    albedo2.addEventListener("change", SET.checkAlbedo2);

    /**
     *
     *    Zmiana typu podloza (albedo)
     *
     **/

    var albedoSelect = document.getElementById("albedo_select");

    albedoSelect.addEventListener("change", SET.checkAlbedo1);

    /**
     *
     *    Zmiana typu podloza (albedo)
     *
     **/

    var albedoRang = document.getElementById("albedo_val");

    albedoRang.addEventListener("change", SET.checkAlbedo2);

    /**
     *
     *    Zmiana ilosci warstw atmosfery
     *
     **/

    var nemberOfStratum = document.getElementById("atmo");

    nemberOfStratum.addEventListener("change", SET.changeNemberOfStratum);

    /**
     *
     *    Zmiana wartosci stalej slonecznej
     *
     **/

    var valueSunConst = document.getElementById("sun_const");

    valueSunConst.addEventListener("change", SET.changeSunConst);

};

















