let displayContent = "";
let decimalPoint = false;
let trailingOperator = true;
let negative = false;


const display = document.querySelector('#display');
const numbers = document.querySelectorAll('.num');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');
const decimal = document.querySelector('.point');
const del = document.querySelector('.delete'); // can't use delete as a var name lmao

// keyboard input ---------------------------------------------------
document.addEventListener('keydown', (e) => {
    let char = e.key;
    console.log(char);

    if(!isNaN(char)){
        displayContent += char;
        trailingOperator = false;
    }
    if(char == "+" || char == "-" || char == "x" || char == "/"){
        if(trailingOperator && !negative && !decimalPoint && char == "-"){
            displayContent += "-";
            negative = true;
        }
        if(!trailingOperator){
            displayContent += " " + char + " ";
            decimalPoint = false;
            trailingOperator = true;
            negative = false;
        }
    }
    if(char == "=" || char == "Enter"){
        if(!trailingOperator) {
            displayContent = solveRPN(parse(displayContent));
            decimalPoint = false;
        }
    }
    if(char == "."){
        if(!decimalPoint){
            displayContent += ".";
            decimalPoint = true;
        }
    }
    display.textContent = displayContent;

})

// click input ----------------------------------------------------
numbers.forEach((btn) => {
    btn.addEventListener('click', () => {
        displayContent += btn.textContent;
        trailingOperator = false;
        display.textContent = displayContent;
    });
});
operators.forEach((operator) => {
    operator.addEventListener('click', () => {
        if(trailingOperator && !negative && !decimalPoint && operator.textContent == "-"){
            displayContent += "-";
            negative = true;
        }
        if(!trailingOperator){
            displayContent += " " + operator.textContent + " ";
            decimalPoint = false;
            trailingOperator = true;
            negative = false;
        }  
        display.textContent = displayContent;
    })
});
decimal.addEventListener('click', () => {
    if(!decimalPoint){
        displayContent += ".";
        display.textContent = displayContent;
        decimalPoint = true;
    }
});
equals.addEventListener('click', () => {
    if(!trailingOperator) {
        displayContent = solveRPN(parse(displayContent));
        display.textContent = displayContent;
        decimalPoint = false;
    }
});
clear.addEventListener('click', () => {
    displayContent = "";
    display.textContent = displayContent;
    decimalPoint = false;
    trailingOperator = true;
    negative = false;
});
del.addEventListener('click', () => {
    const len = displayContent.length;
    const char = displayContent.charAt(len-1);

    // i.e. the last token is an operator
    if(char == " "){
        delOperator(len);
    }
    else if(char == "-"){
        delNegative(len);
    }
    else if(char == "."){
        delDecimal(len);
    }
    else if(!isNaN(char)){
        delNumber(len);
    }
    display.textContent = displayContent;
});



function delOperator(len){
    let arr = displayContent.split(" ");
        // if the previous operand has a decimal
        if(arr[arr.length - 3].indexOf(".") >= 0){
            decimalPoint = true;
        }
        displayContent = displayContent.slice(0, len-3)
        trailingOperator = false;
}
function delDecimal(len){
    decimalPoint = false;
    displayContent = displayContent.slice(0, len-1)
}
function delNumber(len){
        // if the number is the first digit of a number
        if(displayContent.charAt(len-2) == " "
           || (displayContent.charAt(len-2) == "." &&
                displayContent.charAt(len-3) == " "
                || displayContent.charAt(len-3) == "-"))
        {
            trailingOperator = true;
        }
        displayContent = displayContent.slice(0, len-1)
}
function delNegative(len){
    negative = false;
    displayContent = displayContent.slice(0, len-1)
}



function add(a, b) {return +a + +b;}
function subtract(a, b) {return a - b;}
function multiply(a, b) {return a * b;}
function divide(a, b) {
    if(b == 0) {return "ERROR: divide by 0";}    
    return a / b;
}

// Shunting Yard algorithm
// INPUT: string space-separated infix expression
// OUTPUT: array postfix expression
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
    return queue;
}

function hasPrecedence(a, b){
    if((a == "+" || a == "-") && (b == "x" || b == "/")){
        return false;
    }
    return true;
}

// INPUT: array postfix expression
// OUTPUT: evaluated string expression
function solveRPN(arr){
    let answer = [];
    for(let i = 0; i < arr.length; i++){
        if(!isNaN(arr[i])){
            answer.push(arr[i]);
        } else {
            operand2 = answer.pop();
            operand1 = answer.pop();

            let func;
            switch(arr[i]){
                case "+":
                    func = add;
                    break;
                case "-":
                    func = subtract;
                    break;
                case "x":
                    func = multiply;
                    break;
                case "/":
                    if(operand2 == 0){return "ERROR: divide by 0 >:(";}
                    func = divide;
                    break;
            }
            answer.push(func(operand1, operand2));
        }
    }
    return answer[0].toString();
}