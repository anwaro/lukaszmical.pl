window.mathcode = function(inputElement, outputElement){

    var input = inputElement;
    var output = outputElement;
    prepareElements();

    var classes = ["br", "op", "va", "nu", "co", "fu"];

    var regexp = [/\(|\)/, /\/|\*|\-|\+|\.|\^/, /x/, /\d/, /e|E|pi|Pi|PI/, /\w/];

    keyup();

    function keyup(event) {
        var val = input.value;
        var len = val.length;
        var pos = getCursorPosition();
        output.innerHTML = '';

        if (event && val.slice(pos - 1, pos) === '(' && event.which === 57) {
            val = val.slice(0, pos) + ')' + val.slice(pos, len);
            event.target.value = val;
            len++;
            setCursorPosition(pos);
        }
        if (event && val.slice(pos - 1, pos) === ')' && event.which === 48 && val.slice(pos, pos + 1) === ')') {
            val = val.slice(0, pos - 1) + val.slice(pos, len);
            event.target.value = val;
            len--;
            setCursorPosition(pos);
        }

        output.appendChild(createElement('', pos === 0 ? 'cursor' : 'empty'));

        for (var i = 0; i < len; i++) {
            let char = val[i];
            if (i + 1 < len && /pi/i.test(char + val[i + 1])) {
                char += val[i + 1];
            } else if (i > 1 && /pi/i.test(val[i - 1] + char)) {
                char = val[i - 1] + char;
            }
            var className = findFit(char);
            var element = createElement(val[i], className);
            if (pos === i + 1) {
                element = addClass(element, 'cursor');
            }


            output.appendChild(element);
        }
        focus();

    }

    function prepareElements() {
        addClass(output, 'mathcode');
        input.style.width = "1px";
        input.style.position = "absolute";
        input.style.left = "-99999px";
        output.parentNode.appendChild(input);

    }

    function getCursorPosition() {
        var CaretPos = 0;
        if (document.selection) {
            input.focus();
            var Sel = document.selection.createRange();

            Sel.moveStart('character', -input.value.length);

            CaretPos = Sel.text.length;
        } else if (input.selectionStart || input.selectionStart == '0')
            CaretPos = input.selectionStart;

        return (CaretPos);
    }

    function setCursorPosition(pos) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(pos, pos);
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    function findFit(val) {
        for (var i = 0; i < regexp.length; i++) {
            if (regexp[i].test(val)) {
                return classes[i];
            }
        }
    }

    function addClass(element, className) {
        element.classList.add(className);
        return element;

    }

    function createElement(val, className) {
        var element = document.createElement("div");
        element.innerHTML = val;
        element.classList.add("mb");
        element.classList.add(className);
        element.addEventListener('click', boxFocus);
        return element;
    }

    function focus() {
        input.focus();
    }

    function active() {
        output.classList.remove('inactive');
        addClass(output, 'active');
    }

    function inactive() {
        output.classList.remove('active');
        addClass(output, 'inactive');

    }

    function boxFocus(event) {
        var element = event.target;
        var currentCursor = document.getElementsByClassName('cursor')[0];
        currentCursor && currentCursor.classList.remove('cursor');
        addClass(element, 'cursor');
        var index = [].indexOf.call(element.parentNode.children, element);
        setCursorPosition(index);
        focus();
    }

    output.addEventListener("mouseup", focus);
    input.addEventListener("keyup", keyup);
    input.addEventListener("focus", active);
    input.addEventListener("focusout", inactive);

};
