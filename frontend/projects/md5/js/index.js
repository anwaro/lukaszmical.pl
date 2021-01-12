const showPass = document.querySelector('.show-pass');
const generate = document.querySelector('#generate');
const input = document.querySelector('#password');
const output = document.querySelector('#hash');
const box = showPass.parentNode;


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
