
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
    displayContent = solveRPN(parse(displayContent));
    display.textContent = displayContent;
})

clear.addEventListener('click', () => {
    displayContent = "";
    display.textContent = displayContent;
})

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
// OUTPUT: evaluated expression
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
    return answer[0];
}