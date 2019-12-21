let activeBox = [];
let inputBox = [];

const period = {
    h: null,
    min: null,
    sec: null
};

const distance = {
    km: null,
    m: null
};

const speed = {
    km_h: null,
    m_s: null
};

const pace = {
    min: null,
    sec: null
};

const table = {
    renderPeriod: 0,
    timeout: 500,
    body: null,
    header: {
        top: null,
        side: null
    },
    style: null,
    activeRow: -1,
    activeCol: -1
};

label = {
    'period': 'Czas',
    'speed': 'Prędkość',
    'pace': 'Tempo',
    'distance': 'Dystans'
};

/**
 * Init App
 */
function init() {
    addTableStyle();
    inputEvent();
    setInput();
    initTable();
    initDefault();
}

/**
 * Set inputs elements
 */
function setInput() {
    period.h = document.getElementById('run-period-h');
    period.min = document.getElementById('run-period-m');
    period.sec = document.getElementById('run-period-s');

    distance.km = document.getElementById('run-distance-km');
    distance.m = document.getElementById('run-distance-m');

    pace.min = document.getElementById('run-pace-m');
    pace.sec = document.getElementById('run-pace-s');

    speed.km_h = document.getElementById('run-speed-km-h');
    speed.m_s = document.getElementById('run-speed-m-s');

    inputBox = document.querySelectorAll('.input-area');
}

/**
 * set table elements
 */
function initTable() {
    table.body = document.getElementById('run-table-body');
    table.header.top = document.getElementById('run-table-header-top');
    table.header.side = document.getElementById('run-table-header-side');
    const td = document.querySelectorAll('td');
    for (let i = 0; i < td.length; i++) {
        td[i].addEventListener('mouseover', activeCell);
    }
    table.body.addEventListener('mouseleave', loseActive);
    table.body.addEventListener('mousemove', activeCell);
}


/**
 * set table elements
 */
function initDefault() {
    distance.km.value = 10;
    period.min.value = 45;

    active(distance.km);
    active(period.min);

    valid(period.min, 0);
}

/**
 *
 */
function addTableStyle() {
    table.style = document.createElement('style');
    document.head.appendChild(table.style);
}


function activeCell(e) {
    const el = e.target;
    if (el.tagName.toLowerCase() === 'td') {
        const col = el.cellIndex + 1;
        const row = el.parentNode.rowIndex + 1;
        if ((col !== table.activeCol || row !== table.activeRow) && row > 1 && col > 1) {
            table.style.innerHTML =
                ".table-body .table-main table tr:nth-child(" + row + ") {" +
                "background-color: rgba(255, 255, 255, 0.7);" +
                "color: black;" +
                "font-weight: bold;" +
                "}" +
                ".table-body .table-main table tr td:nth-child(" + col + ") {" +
                "background-color: rgba(255, 255, 255, 0.7);" +
                "color: black;" +
                "font-weight: bold;" +
                "}"
            ;
        }
    }
}


/**
 *
 */
function loseActive() {
    table.activeRow = -1;
    table.activeCol = -1;
    table.style.innerHTML = '';
}

/**
 * Calculate all type of speed
 * @param {String} base
 */
function recalculateSpeed(base) {
    let val;
    if (base === 's_km') {
        setSpeed(skm_to_ms(getPace()))
    } else if (base === 'km_h') {
        val = kmh_to_ms(getSpeed('km_h'));
        setSpeed(val, 'm_s');
        setPace(ms_to_skm(val))
    } else if (base === 'm_s') {
        val = getSpeed('m_s');
        setSpeed(ms_to_kmh(val), 'km_h');
        setPace(ms_to_skm(val))
    }
}

/**
 * Calculate period, distance or speed(pace)
 */
function recalculate() {
    if (activeBox.length === 2) {
        table.renderPeriod = timestamp(table.timeout);
        let _top, _side, _calc;
        const active = [activeBox[0].dataset.type, activeBox[1].dataset.type];
        const _speed = getSpeed();
        const _pace = getPace();
        const _period = getPeriod();
        const _distance = getDistance();

        if (inArrayValues('period', 'distance', active)) {
            if (!validValue(_period, _distance)) {
                return false;
            }
            _calc = 'pace';
            _top = 'distance';
            _side = 'period';
            setPace(calculateVal(_calc, _distance, _top, _period, _side));
            setSpeed(_distance / _period);
        } else if (inArrayValues('period', 'pace', active)) {
            if (!validValue(_period, _pace)) {
                return false;
            }
            _calc = 'distance';
            _top = 'period';
            _side = 'pace';
            setDistance(calculateVal(_calc, _period, _top, _pace, _side));
        } else if (inArrayValues('period', 'speed', active)) {
            if (!validValue(_period, _speed)) {
                return false;
            }
            _calc = 'distance';
            _top = 'period';
            _side = 'speed';
            setDistance(calculateVal(_calc, _period, _top, _speed, _side));
        } else if (inArrayValues('distance', 'pace', active)) {
            if (!validValue(_distance, _pace)) {
                return false;
            }
            _calc = 'period';
            _top = 'distance';
            _side = 'pace';
            setPeriod(calculateVal(_calc, _distance, _top, _pace, _side));
        } else if (inArrayValues('distance', 'speed', active)) {
            if (!validValue(_distance, _speed)) {
                return false;
            }
            _calc = 'period';
            _top = 'distance';
            _side = 'speed';
            setPeriod(calculateVal(_calc, _distance, _top, _speed, _side));
        } else {
            return false;
        }
        setTimeout(function () {
            renderTable(_top, _side, _calc)
        }, table.timeout + 200);
    }
}

/**
 *
 * @param val1
 * @param val2
 * @returns {Boolean}
 */
function validValue(val1, val2) {
    return val1 > 0 && val2 > 0;
}

/**
 *
 * @param type
 * @param val1
 * @param type1
 * @param val2
 * @param type2
 * @returns {Number}
 */
function calculateVal(type, val1, type1, val2, type2) {
    if (val1 === 0 || val2 === 0) {
        return 0;
    }
    if (type === 'pace' && type1 === 'distance' && type2 === 'period') {
        // val1 [m] val2 [s]  ---> [s/km]
        return ms_to_skm(val1 / val2);
    }
    if (type === 'distance' && type1 === 'period' && type2 === 'pace') {
        // val1 [s] val2 [s/km] ---> [m]
        return val1 / val2 * 1000;
    }
    if (type === 'distance' && type1 === 'period' && type2 === 'speed') {
        // val1 [s] val2 [m/s] ---> [m]
        return val1 * val2;
    }
    if (type === 'period' && type1 === 'distance' && type2 === 'pace') {
        // val1 [m] val2 [s/km] ---> [s]
        return val1 * val2 / 1000;
    }
    if (type === 'period' && type1 === 'distance' && type2 === 'speed') {
        // val1 [m] val2 [m/s] ---> [s]
        return val1 / val2;
    }
}

/**
 *
 * @param {String} type
 * @param {Number} val
 * @returns {String}
 */
function formatVal(type, val) {
    if (type === 'period') {
        const _period = parsePeriod(val);
        return (_period.h !== 0 ? _period.h + ":" : "") + twoChar(_period.min) + ":" + twoChar(_period.sec)
    }
    if (type === 'distance') {
        const _distance = parseDistance(val);
        return _distance.km + "km " + (_distance.m !== 0 ? _distance.m + "m" : "");
    }
    if (type === 'speed') {
        return fixNumber(ms_to_kmh(val), 3) + "km/h";
    }
    if (type === 'pace') {
        const _pace = parsePace(val);
        return twoChar(_pace.min) + "':" + twoChar(_pace.sec) + '"'
    }
}

/**
 *
 * @param {String|Number} val
 * @returns {String|Number}
 */
function twoChar(val) {
    if (val < 10) val = "0" + val;
    return val;
}

/**
 * Set run period
 * @param {Number} sec
 */
function setPeriod(sec) {
    const _period = parsePeriod(sec);
    period.h.value = _period.h;
    period.min.value = _period.min;
    period.sec.value = _period.sec;
}

/**
 * Set speed and pace
 * @param {Number} _speed
 * @param {String} [type=false]
 */
function setSpeed(_speed, type) {
    type = type || false;
    if (!type) {
        speed.m_s.value = speedFormat(_speed);
        speed.km_h.value = speedFormat(ms_to_kmh(_speed));
    } else if (type === 'm_s') {
        speed.m_s.value = speedFormat(_speed);
    } else if (type === 'km_h') {
        speed.km_h.value = speedFormat(_speed);
    }
}

/**
 * Set speed and Pace
 * @param {Number} s_km - pace [s/km]
 */
function setPace(s_km) {
    const _pace = parsePace(s_km);
    pace.min.value = _pace.min;
    pace.sec.value = _pace.sec;
}

/**
 * Set distance input
 * @param {Number} m - distance [m]
 */
function setDistance(m) {
    const _distance = parseDistance(m);
    distance.km.value = _distance.km;
    distance.m.value = _distance.m;
}

/**
 * Parse distance (meters) to array with kilometers and meters
 * @param {Number} m
 * @returns {{km: Number, m: Number}}
 */
function parseDistance(m) {
    let km = floor(m / 1000);
    m -= km * 1000;
    m = round(m);
    if (m === 1000) {
        m = 0;
        km++;
    }
    return {km: km, m: m};
}

/**
 * Parse period (seconds) to array with hours, minutes and seconds
 * @param {Number} sec
 * @returns {{h : Number, min : Number, sec : Number}}
 */
function parsePeriod(sec) {
    const h = floor(sec / 3600);
    sec -= h * 3600;
    const min = floor(sec / 60);
    sec -= min * 60;
    return fixPeriod({h: h, min: min, sec: sec});
}


/**
 * Parse pace (seconds/kilometers) to pace array with minutes and seconds
 * @param {Number} sec - pace [s/km]
 * @returns {{min : Number, sec : Number}}
 */
function parsePace(sec) {
    const min = floor(sec / 60);
    sec -= min * 60;
    return fixPeriod({h: 0, min: min, sec: sec});
}

/**
 *
 * @param {Object} period
 * @returns {Object}
 */
function fixPeriod(period) {
    period.sec = round(period.sec);
    if (period.sec === 60) {
        period.sec = 0;
        period.min++
    }
    if (period.min === 60) {
        period.min = 0;
        period.h++
    }
    return period;
}


/**
 * Retrieve distance from input in meters
 * @returns {Number}
 */
function getDistance() {
    return value(distance.km) * 1000 + value(distance.m);
}

/**
 * Retrieve speed in m/s
 * @returns {Number}
 */
function getSpeed(type) {
    type = type || 'm_s';
    return type === 'm_s' ? value(speed.m_s) : value(speed.km_h);
}

/**
 * Retrieve return period in seconds
 * @returns {Number}
 */
function getPeriod() {
    return value(period.h) * 3600 + value(period.min) * 60 + value(period.sec);
}

/**
 * Retrieve pace period in seconds/km
 * @returns {Number}
 */
function getPace() {
    return value(pace.min) * 60 + value(pace.sec);
}

/**
 * Retrieve parsed value from DOM Element
 * @param {Object} el
 * @returns {Number}
 */
function value(el) {
    const val = float(el.value);
    return isNaN(val) ? 0 : val;
}

/**
 * Set events on all inputs
 */
function inputEvent() {
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'text') {
            inputs[i].addEventListener('keydown', validNumber);
            inputs[i].addEventListener('focus', active);
        } else if (inputs[i].type === 'button') {
            inputs[i].addEventListener('click', selectDistance);
        }
    }
}

/**
 *
 * @param {Array} array
 * @param {Integer} index
 * @param {String} val
 * @returns {Boolean}
 */
function isEqual(array, index, val) {
    return array[index] && array[index].dataset.type === val;
}

/**
 *
 */
function selectDistance() {
    const type = this.dataset.type;
    let el;
    if (type === "distance") {
        distance.km.value = this.dataset.km;
        distance.m.value = this.dataset.m;
        el = distance.km;
    } else if (type === "pace") {
        pace.min.value = this.dataset.min;
        pace.sec.value = this.dataset.sec;
        el = pace.min;
    } else if (type === "period") {
        period.h.value = this.dataset.h;
        period.min.value = this.dataset.min;
        period.sec.value = this.dataset.sec;
        el = period.h;
    } else if (type === "speed") {
        speed.km_h.value = this.dataset.km_h;
        speed.m_s.value = this.dataset.m_s;
        el = speed.km_h;
    }
    active(el);
    valid(el, 0);
}

/**
 * Set active box
 */
function active(el) {
    el = el.target ? el.target : el;
    const parent = getParent(el, 'input-area');
    const type = parent.dataset.type;
    //Remove speed from active before adding pace and conversely
    const double = type === 'pace' ? 'speed' : type === 'speed' ? 'pace' : false;
    if (double) {
        if (isEqual(activeBox, 1, double)) {
            activeBox.splice(1, 1);
        }
        if (isEqual(activeBox, 0, double)) {
            activeBox.splice(0, 1);
        }
    }

    if (!parent.classList.contains('active')) {
        parent.classList.add('active');
        activeBox.push(parent);
    }

    const toRemove = activeBox.length - 2;
    if (toRemove > 0) {
        activeBox.splice(0, toRemove);
    }

    if (parent.dataset.type === activeBox[0].dataset.type) {
        activeBox = activeBox.reverse();
    }
    setActiveBoxes();
}

/**
 * Remove active class from all boxes and add only to current active
 */
function setActiveBoxes() {
    for (let i = 0; i < inputBox.length; i++) {
        inputBox[i].classList.remove('active');
    }
    for (let j = 0; j < activeBox.length; j++) {
        activeBox[j].classList.add('active');
    }
}


/**
 * Valid pressed key
 * @param {Object} e
 * @returns {Boolean}
 */
function validNumber(e) {
    const key = e.keyCode || e.charCode;
    const el = this;
    if (key === 38) valid(el, 1);
    else if (key === 40) valid(el, -1);
    else if (inArray(key, [46, 8, 9, 27, 13, 110, 188, 190])) {
        setTimeout(function () {
            valid(el, 0)
        }, 100);
        return true;
    } else {
        setTimeout(function () {
            valid(el, 0)
        }, 100);
        return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
    }
}

/**
 *
 * @param {Object} el
 * @param {Number} add
 */
function valid(el, add) {
    let val = el.value.replace(',', '.');
    if (val.slice(-1) !== ".") {
        val = float(val) + add;
        const max = int(el.dataset.max);
        if (val <= 0) {
            val = 0
        }
        if (val >= max) {
            val = max
        }
    }
    el.value = val;
    if (el.dataset && el.dataset.hasOwnProperty('type')) {
        recalculateSpeed(el.dataset.type);
    }
    recalculate();
}

/**
 * Parse to float number
 * @param {*} num
 * @returns {Number}
 */
function float(num) {
    return fixNan(parseFloat(+num));
}

/**
 *
 * @param {Number|NaN} val
 * @return {Number}
 */
function fixNan(val) {
    return isNaN(val) ? 0 : val;
}

/**
 * Retrieve speed in user friendly format
 * @param {Number} num
 * @returns {number|string}
 */
function speedFormat(num) {
    if (abs(int(num) - float(num).toFixed(1)) < 0.1) {
        return int(num);
    }
    return float(num).toFixed(1);
}

/**
 * Parse to int
 * @param {*} num
 * @returns {Integer}
 */
function int(num) {
    return fixNan(parseInt(+num));
}

/**
 * @param {Number} num
 * @returns {Number}
 */
function floor(num) {
    return Math.floor(num);
}

/**
 * @param {Number} num
 * @returns {Number}
 */
function round(num) {
    return Math.round(num);
}

/**
 *
 * @param {Number} num
 * @returns {Number}
 */
function abs(num) {
    return Math.abs(num);
}

/**
 *
 * @param {*} val
 * @param {Array} array
 * @returns {Boolean}
 */
function inArray(val, array) {
    return array.indexOf(val) !== -1;
}

/**
 *
 * @param {*} val1
 * @param {*} val2
 * @param {Array} array
 * @returns {Boolean}
 */
function inArrayValues(val1, val2, array) {
    return inArray(val1, array) && inArray(val2, array);
}

/**
 *
 * @param {Array} array
 * @returns {Number}
 */
function maxArray(array) {
    return Math.max.apply(null, array);
}

/**
 *
 * @param {Array} array
 * @returns {Number}
 */
function minArray(array) {
    return Math.min.apply(null, array);
}

/**
 *
 * @param {Array} array
 * @returns {Array}
 */
function sortArray(array) {
    return array.sort(function (a, b) {
        return a - b
    });
}

/**
 * Convert speed m/s to km/h
 * @param {Number} speed
 * @returns {Number}
 */
function ms_to_kmh(speed) {
    return speed * 3.6;
}

/**
 * Convert speed km/h to m/s
 * @param {Number} speed
 * @returns {Number}
 */
function kmh_to_ms(speed) {
    return speed / 3.6;
}

/**
 * Convert speed (m/s) to pace (sec/km)
 * @param {Number} speed
 * @returns {Number}
 */
function ms_to_skm(speed) {
    return speed === 0 ? 0 : 1000 / speed;
}

/**
 * Convert pace (sec/km) to speed (m/s)
 * @param {Number} pace
 * @returns {Number}
 */
function skm_to_ms(pace) {
    return pace === 0 ? 0 : 1000 / pace;
}

/**
 * Retrieve current timestamp enlarged by first param
 * @param {Number} [add=0]
 * @returns {Number}
 */
function timestamp(add) {
    add = add || 0;
    return (new Date()).getTime() + add;
}

/**
 * Retrieve parent which has class
 * @param {Object} el
 * @param {String} parentClass
 * @returns {Object|null}
 */
function getParent(el, parentClass) {
    const parent = el.parentNode;
    if (parent) {
        if (parent.classList.contains(parentClass)) {
            return parent;
        }
        return getParent(parent, parentClass);
    }
    return null;
}

/**
 *
 * @param {String} top
 * @param {String} side
 * @param {String} calc
 */
function renderTable(top, side, calc) {
    if (timestamp() > table.renderPeriod) {
        const rangeTop = getRangeByName(top, getColumnCount());
        const rangeSide = getRangeByName(side, 20);
        renderTableBody(calc, rangeTop, top, rangeSide, side);
        setTableTitle(top, side);
    }
}

/**
 *
 * @param {String} name
 * @param {Number} count
 * @returns {Array.<Number>}
 */
function getRangeByName(name, count) {
    if (name === 'period') {
        return getPeriodRange(getPeriod(), count)
    }
    if (name === 'pace') {
        return getPaceRange(getPace(), count)
    }
    if (name === 'speed') {
        return getSpeedRange(getSpeed('km_h'), count)
    }
    if (name === 'distance') {
        return getDistanceRange(getDistance(), count)
    }
}

/**
 *
 * @param {Number} val
 * @param {Number} count
 * @returns {Array.<Number>}
 */
function getPaceRange(val, count) {
    return getRange(val, count / 2, count, 120, 600);
}

/**
 *
 * @param {Number} val
 * @param {Number} count
 * @returns {Array.<Number>}
 */
function getDistanceRange(val, count) {
    const dist = [21097, 42195];
    const parsedVal = round(val / 1000) * 1000;
    const range = getRange(parsedVal, 500 * count, count, 1e3, 2e5);
    if (minArray(range) < dist[0] && dist[0] < maxArray(range)) {
        range.push(dist[0])
    }
    if (minArray(range) < dist[1] && dist[1] < maxArray(range)) {
        range.push(dist[1])
    }
    if (!inArray(val, range)) {
        range.push(val)
    }
    return sortArray(range);
}

/**
 *
 * @param {Number} val
 * @param {Number} count
 * @returns {Array.<Number>}
 */
function getSpeedRange(val, count) {
    let range = getRange(val, count / 4, count, 1, 30);
    range = range.map(function (km_h) {
        return kmh_to_ms(km_h);
    });
    if (!inArray(kmh_to_ms(val), range)) {
        range.push(kmh_to_ms(val))
    }
    return sortArray(range);
}

/**
 *
 * @param {Number} val
 * @param {Number} count
 * @returns {Array.<Number>}
 */
function getPeriodRange(val, count) {
    const parsedVal = round(val / 60) * 60;
    const range = getRange(parsedVal, 30 * count, count, 10, 2e6);
    if (!inArray(val, range)) {
        range.push(val)
    }
    return sortArray(range);
}

/**
 *
 * @param {String} type
 * @param {Array} rangeTop
 * @param {String} top
 * @param {Array} rangeSide
 * @param {String} side
 */
function renderTableBody(type, rangeTop, top, rangeSide, side) {
    let _tr, val, html = renderTopHeader(rangeTop, top);
    for (let sid = 0; sid < rangeSide.length; sid++) {
        _tr = td(formatVal(side, rangeSide[sid]));
        for (let to = 0; to < rangeTop.length; to++) {
            val = calculateVal(type, rangeTop[to], top, rangeSide[sid], side);
            _tr += td(formatVal(type, val));
        }
        html += tr(_tr);
    }
    table.body.innerHTML = html;
}

/**
 *
 * @param {Array} data
 * @param {String} type
 * @returns {String}
 */
function renderTopHeader(data, type) {
    let html = td('');
    for (let i = 0; i < data.length; i++) {
        html += td(formatVal(type, data[i]));
    }
    return tr(html);
}

/**
 *
 * @param {String} val
 * @returns {String}
 */
function tr(val) {
    return "<tr>" + val + "</tr>"
}

/**
 *
 * @param {String} val
 * @returns {String}
 */
function td(val) {
    return "<td>" + val + "</td>"
}

/**
 *
 * @param {String} top
 * @param {String} side
 */
function setTableTitle(top, side) {
    table.header.top.innerHTML = label[top];
    table.header.side.innerHTML = label[side];
}

/**
 *
 * @returns {Number}
 */
function getColumnCount() {
    const x = round(table.body.offsetWidth / 60 - 11 / 6) - 1;
    return Math.min(10, Math.max(3, x));
}

/**
 *
 * @param {Number} val
 * @param {Number} epsilon
 * @param {Number} count
 * @param {Number} min
 * @param {Number} max
 * @returns {Array<Number>}
 */
function getRange(val, epsilon, count, min, max) {
    if (val < min) val = min;
    if (val > max) val = max;
    val = fixNumber(val);
    let start = Math.max(val - epsilon, min);
    let end = Math.min(val + epsilon, max);
    const range = end - start;
    const dX = fixNumber(range / count);
    start = val - int((val - start) / dX) * dX;
    end = val + int((end - val) / dX) * dX;
    const point = [];
    for (let i = start; i <= end; i += dX) {
        point.push(fixNumber(i, 5));
    }
    return point;
}

/**
 *
 * @param {Number} val
 * @param {Number} [dec=1]
 * @returns {Number}
 */
function fixNumber(val, dec) {
    dec = dec - 1 || 1;
    val = float(val);
    let count = 0;
    while (val < Math.pow(10, dec)) {
        val *= 10;
        count++;
    }
    return Math.round(val) / Math.pow(10, count);
}


init();