(function () {
    myCodeMirror = CodeMirror($$('#js_graph1'), {'lineNumbers': true, 'readOnly': true});

    var val = 'var data = [\n\t["Pon",2],\n\t["Wt",5],\n\t["Śro", 1],\n\t["Czw", 7],\n\t["Pią", 4],\n\t["Sob", 3],\n\t["Nied", 3]\n];\n\n'
    val += 'document.getElementById("graph1").graph(data,{\n\t"canvasHeight":300\n\t"canvasWidth":500\n});';
    myCodeMirror.setValue(val);

    var data = [["Pon", 2], ["Wt", 5], ["Śro", 1], ["Czw", 7], ["Pią", 4], ["Sob", 3], ["Nied", 3]];
    $$("#graph1").graph(data, {"canvasHeight": 300, "canvasWidth": 500});


    codeMirrorJsOwn = CodeMirror($$('#js-graph-own'), {'lineNumbers': true, 'readOnly': true});
    codeMirrorHtmlOwn = CodeMirror($$('#html-graph-own'), {'lineNumbers': true, 'readOnly': true, mode: "text/html"});
    val = '<html>\n\t<head>\n\t\t.\n\t\t.\n\t\t';
    val += '<script src="http://lukaszmical.pl/js/projects/graph.js"></script> \n\t\t.\n\t\t.\n\t';
    val += '</head>\n\t<body>\n\t\t.\n\t\t.\n\t\t';
    val += '<canvas id="graph-own" height="300" width="500"></canvas>\n\t\t.\n\t\t.\n\t</body>\n</html>';
    codeMirrorHtmlOwn.setValue(val);

    setProp();
})();


function setProp() {
    var setting = _graph.getSettings();
    var div = document.getElementsByClassName("graph-setting")[0];
    for (var prop in setting) {
        var inputCheck = document.createElement("input");
        inputCheck.classList.add("graph-check");
        inputCheck.type = "checkbox";

        if (/true|false/i.test(setting[prop])) {
            var inputVal = document.createElement("button");
            inputVal.classList.add("switcher");
            inputVal.classList.add(setting[prop]);
            inputVal.addEventListener("click", function () {
                switcher(this);
            });

        } else {
            var inputVal = document.createElement("input");
            if (/color/i.test(prop)) {
                inputVal.type = "color";
            }
        }
        inputVal.value = setting[prop];
        inputVal.classList.add("graph-val");

        var span = document.createElement("span");
        span.classList.add("graph-prop");
        span.innerHTML = prop;

        var divProp = document.createElement("div");
        divProp.classList.add("graph-props");
        divProp.appendChild(inputCheck);
        divProp.appendChild(span);
        divProp.appendChild(inputVal);
        div.appendChild(divProp);
    }
}


function switcher(el) {
    if (el.value === "true") {
        el.value = "false";
        el.classList.remove("true");
        el.classList.add("false");
    } else {
        el.value = "true";
        el.classList.remove("false");
        el.classList.add("true");
    }
}

function addData() {
    var div = document.createElement("div"),
        label = document.createElement("input"),
        val = document.createElement("input"),
        del = document.createElement("div");
    div.classList.add("graph-values");
    label.classList.add("graph-label");
    val.classList.add("graph-val");
    del.classList.add("graph-del");
    del.addEventListener("click", function () {
        delData(this);
    });
    div.appendChild(label);
    div.appendChild(val);
    div.appendChild(del);
    document.getElementsByClassName("graph-data")[0].appendChild(div);

}

function delData(el) {
    var div = el.parentElement;
    div.parentNode.removeChild(div);
}

function drawGraph() {
    var data = [],
        mirrorData = "var data = [",
        settings = {};

    var datainput = document.getElementsByClassName("graph-values");
    for (var i in datainput) {
        var div = datainput[i];
        if (typeof div === "object") {
            data.push([div.children[0].value, parseFloat(div.children[1].value)]);
            mirrorData += ('\n\t\t["' + div.children[0].value + '", ' + div.children[1].value + "],");
        }
    }
    mirrorData = mirrorData.substring(0, mirrorData.length - 1);
    mirrorData += "\n\t];\nvar settings = {";

    var settinsinput = document.getElementsByClassName("graph-props");
    var set = false;
    for (var i in settinsinput) {
        var div = settinsinput[i];
        if (typeof div === "object" && div.children[0].checked) {
            set = true;
            settings[div.children[1].textContent] = isBool(div.children[2].value);
            mirrorData += ("\n\t\t" + div.children[1].textContent + ' : "' + div.children[2].value + '",');
        }

    }
    if (set) {
        mirrorData = mirrorData.substring(0, mirrorData.length - 1);
    }
    mirrorData += "\n\t};\n";
    mirrorData += "document.getElementById('graph-own').graph(data, settings);";

    codeMirrorJsOwn.setValue(mirrorData);
    var canvas = document.getElementById("graph-own");
    canvas.graph(data, settings);
    canvas.scrollIntoView({block: "start", behavior: "smooth"});
    //console.log(mirrorData, data, settings);
}

function isBool(val) {
    if (val === "false")
        return false;
    else if (val === "true")
        return true;
    else if (/^[\-\+]?[0-9]*(\.[0-9]+)?$/.test(val))
        return parseFloat(val);

    return val;
}
