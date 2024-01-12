
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

equals.addEventListener('click', () => {
    displayContent = parse(displayContent);
    display.textContent = displayContent;
})

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

// Shunting Yard algorithm
// INPUT: space-separated infix expression
// OUTPUT: space-separated postfix/RPN expression
// **note: as written, doesn't handle parentheses or exponents**
function parse(str) {

    // split expression into tokens (numbers and operators)
    tokenArr = str.split(" ");
    let stack = [];
    let queue = [];

    for(let i = 0; i < tokenArr.length; i++){
        let token = tokenArr[i];

        // if token is a number
        if(!isNaN(token)){
            queue.push(token);
        }
        // if token is an operator
        else {
            // while the top of the operator stack has higher precedence
            while(stack.length > 0 && hasPrecedence(stack[stack.length-1], token)){
                queue.push(stack.pop());
            } 
            stack.push(token);  
        }
    }
    // push remaining operators to the queue
    for(let j = stack.length-1; j >= 0; j--){
        queue.push(stack.pop());
    }

    return queue.join(" ");
}

function hasPrecedence(a, b){
    if((a == "+" || a == "-") && (b == "x" || b == "/")){
        return false;
    }
    return true;
}

function solveRPN(arr){

}