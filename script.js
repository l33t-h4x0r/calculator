
let displayContent = "";


const display = document.querySelector('#display');
const buttons = document.querySelectorAll('.num, .operator, .point');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');

buttons.forEach((btn) => {
    btn.addEventListener('click', () => {

        // adds spaces around operators for easier parsing
        if(btn.getAttribute('class') == 'operator'){
            displayContent += " " + btn.textContent + " ";
        } else {
            displayContent += btn.textContent;
        }
        display.textContent = displayContent;
    });
});

clear.addEventListener('click', () => {
    displayContent = "";
    display.textContent = displayContent;
})

function add(a, b) {return a + b;}
function subtract(a, b) {return a - b;}
function multiply(a, b) {return a * b;}
function divide(a, b) {
    if(b == 0) {return "ERROR: divide by 0";}    
    return a / b;
}

// Shunting yard algorithm
function parse(str) {

    // split expression into tokens (numbers and operators)
    arr = str.split(" ");
    let stack = [];
    let queue = [];

    for(let i = 0; i < arr.length; i++){
        let token = arr[i];
        // if token is a number
        if(!isNaN(token)){
            queue.push(token);
        // if token is an operator
        } else {
            
        }
    }
}
