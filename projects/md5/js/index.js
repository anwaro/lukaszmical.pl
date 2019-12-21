var showPass = document.querySelector('.show-pass');
var generate = document.querySelector('#generate');
var input = document.querySelector('#password');
var output = document.querySelector('#hash');
var box = showPass.parentNode;


showPass.addEventListener('click', function () {
    if (box.classList.contains('text-mode')) {
        input.type = 'password';
        box.classList.remove('text-mode');
    } else {
        input.type = 'text';
        box.classList.add('text-mode');
    }
});

generate.addEventListener('click', function () {
    console.log(input.value);
    output.value = window.md5(input.value);
});