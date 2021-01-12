var SET = SET || {};

SET = {
    boltz: 5.67e-8,
    sun: 1374 / 4,
    wAlbedo: 0.3,
    tauIR: 0.3,
    tauVis: 0.5,
    nemStratum: 1,
    stratumVal: [{ir: 0.2, vis: 0.8}, {ir: 0.2, vis: 0.8}, {ir: 0.2, vis: 0.8}, {ir: 0.2, vis: 0.8}, {
        ir: 0.2,
        vis: 0.8
    }],
    all_IR: 0.5,
    IR: [{przech: 0.5, odbi: 0.5, albedo: 0.5}, {przech: 0.5, odbi: 0.5, albedo: 0.5}, {
        przech: 0.5,
        odbi: 0.5,
        albedo: 0.5
    }, {przech: 0.5, odbi: 0.5, albedo: 0.5}, {przech: 0.5, odbi: 0.5, albedo: 0.5}],
    all_Vis: 0.5,
    Vis: [{przech: 0.5, odbi: 0.5, albedo: 0.5}, {przech: 0.5, odbi: 0.5, albedo: 0.5}, {
        przech: 0.5,
        odbi: 0.5,
        albedo: 0.5
    }, {przech: 0.5, odbi: 0.5, albedo: 0.5}, {przech: 0.5, odbi: 0.5, albedo: 0.5}],
    x: 300,
    y: 300,
    ran: [],
    temp: 10
};


SET.nam = [
    "/asset/temp/image/crops.png",	// 0
    "/asset/temp/image/desert.png",	// 1
    "/asset/temp/image/forest.png",	// 2
    "/asset/temp/image/ice.png",		// 3
    "/asset/temp/image/meadow.png",	// 4
    "/asset/temp/image/snow.png",		// 5
    "/asset/temp/image/soil.png",		// 6
    "/asset/temp/image/sun.png",		// 7
    "/asset/temp/image/water.png"		// 8
];

SET.img = [];

for (i in SET.nam) {
    var img = new Image();
    img.src = SET.nam[i];

    SET.img.push(img);

}

SET.ground = 6;

for (var k = 0; k < 3e4; k++) {
    SET.ran.push(Math.random());
}

/**
 *
 *    Ustawia wartosc na wybrany typ podloza
 *
 **/

SET.checkAlbedo1 = function () {
    if (document.getElementById('albedo1').checked) {
        SET.wAlbedo = parseFloat(document.querySelector("select#albedo_select option:selected").value);
        SET.ground = parseInt(document.querySelector("select#albedo_select option:selected").dataset.gr);
    }
};

/**
 *
 *    Ustawia vartosc albedo
 *
 **/

SET.checkAlbedo2 = function () {
    if (document.getElementById('albedo2').checked) {
        SET.wAlbedo = parseFloat(document.querySelector("input#albedo_val").value);
        document.querySelector("#albedo_val_view").innerText = SET.wAlbedo;
        SET.ground = 6;
    }
};

/**
 *
 *    Ustawia ilosc warstw atmosfery
 *
 **/

SET.changeNemberOfStratum = function () {
    SET.nemStratum = parseFloat(document.querySelector("input#atmo").value);
    document.querySelector("#atmo_val").innerText = SET.nemStratum;
    SET.addInputRangeStratum();
    SET.changeValueIrAndVis();
    for (let i in SET.stratumVal) {
        SET.stratumVal[i].ir = 0.2;
        SET.stratumVal[i].vis = 0.8;
    }
};

/**
 *
 *    Zmienia wartosc stalej slonecznej
 *
 **/

SET.changeSunConst = function () {
    SET.sun = parseInt(document.querySelector("input#sun_const").value) / 4;
    document.querySelector("#sun_const_val").text(parseInt(document.querySelector("input#sun_const").value));

};

/**
 *
 *    Dodaje lub kasuje inputy związane z alebedo kazdej warstwy
 *
 **/

SET.addInputRangeStratum = function () {
    var myDiv = document.getElementById("eachStratum"),
        table = document.createElement("table"),
        tbody = document.createElement("tbody");


    for (var i = 0; i < SET.nemStratum; i++) {

        // tytuł
        var row = document.createElement("tr");					//new row
        var cell = document.createElement("td");				//new cell
        var cellText = document.createTextNode((i + 1) + " WARSTWA"); //create text
        cell.setAttribute('colSpan', '3');						// add atribute
        cell.appendChild(cellText);
        cell.style.textAlign = "center";
        row.appendChild(cell);
        tbody.appendChild(row);

        // pierwszy inpuut

        row = document.createElement("tr");
        ////////////////////////////////////////////////////////////////
        cell = document.createElement("td");
        cellText = document.createTextNode('IR');
        cell.appendChild(cellText);
        row.appendChild(cell);
        /////////////////////////////////////////////////////////////////
        cell = document.createElement("td");

        var inp = document.createElement("input");
        inp.setAttribute("type", "range");
        inp.setAttribute("min", "0");
        inp.setAttribute("max", "1");
        inp.setAttribute("step", "0.01");
        inp.setAttribute("value", "0.2");
        inp.setAttribute("data-tau", "IR");
        inp.setAttribute("data-index", i);
        inp.setAttribute("id", "t_IR_" + i);

        cell.appendChild(inp);
        row.appendChild(cell);
        ///////////////////////////////////////////////////////////////
        cell = document.createElement("td");
        cellText = document.createTextNode('0.2');
        cell.setAttribute('id', 'tau_IR_val_' + i);
        cell.appendChild(cellText);
        row.appendChild(cell);
        tbody.appendChild(row);

        // drugi inpuut

        row = document.createElement("tr");
        cell = document.createElement("td");
        cellText = document.createTextNode('Vis');
        cell.appendChild(cellText);
        row.appendChild(cell);
        /////////////////////////////////////////////////////////////
        cell = document.createElement("td");
        inp = document.createElement("input");
        inp.setAttribute("type", "range");
        inp.setAttribute("min", "0");
        inp.setAttribute("max", "1");
        inp.setAttribute("step", "0.01");
        inp.setAttribute("value", "0.8");
        inp.setAttribute("data-tau", "Vis");
        inp.setAttribute("data-index", i);
        inp.setAttribute("id", "t_Vis_" + i);

        cell.appendChild(inp);
        row.appendChild(cell);
        /////////////////////////////////////////////////////////////
        cell = document.createElement("td");
        cellText = document.createTextNode('0.8');
        cell.setAttribute('id', 'tau_Vis_val_' + i);
        cell.appendChild(cellText);
        row.appendChild(cell);
        tbody.appendChild(row);

    }
    table.appendChild(tbody);
    myDiv.innerHTML = "";
    myDiv.appendChild(table);

};

/**
 *
 *    Ustawia pochłanianie krodko i dlugofalowe poszczegolnych warstw atmosfery
 *
 **/

SET.changeValueIrAndVis = function () {
    [...document.querySelectorAll("#eachStratum input")].forEach((element) => {
        element.addEventListener('input', () => {
            if (element.dataset.tau === "IR") {
                SET.stratumVal[parseInt(element.dataset.index)].ir = element.value;
                document.querySelector('#tau_IR_val_' + element.dataset.index).innerText = element.value;
            } else {
                SET.stratumVal[parseInt(element.dataset.index)].vis = element.value;
                document.querySelector('#tau_Vis_val_' + element.dataset.index).innerText = element.value;
            }
        });
    });
};


