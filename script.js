// a check to reset numbers if a calculation was just completed
let equalsPressed = false; 

function addListeners() {
    const btns = Array.from(document.querySelectorAll(".buttons"));
    btns.forEach(btn => btn.addEventListener('click', clickKey));

    document.onkeydown = function(e) {
        setKey(e.keyCode); // gets keycode of key pressed which matches element id
    };
}

function clickKey(e) {
    setKey(e.target.id); // gets id of clicked event and passes to setKey
}

function setKey(e) {
    if (document.getElementById(e) == null || document.getElementById("displayText").innerHTML.length > 19) {
        return; // stops errors from non-calculator keyboard presses or the display being too long
    }
    let key = document.getElementById(e).innerHTML;
    if (key == "=") { // if = begins check for valid equation, then moves to math 
        let equation = document.getElementById("displayText").innerHTML;
        if (equation[equation.length - 1] == " ") {
            return; // if last of display is an operator, does nothing
        } else {  // if last of display is number, checks for operators
            checkForOperators(equation); 
        }
    } else { // sends key to be updated on display
         updateDisplay(key); 
    }
}

// runs through on "=" key to make sure operators are in display before sortOperations
function checkForOperators(equation) {
    if (equation.includes("÷") || equation.includes("*") ||
        equation.includes("+") || equation.includes("-")) {
        sortOperations(equation.split(" ")); 
    }
}

function updateDisplay(key) {
    let equation = document.getElementById("displayText").innerHTML;
    if (clearOrDeleteDisplay(key, equation)) {
        return;
    } else if (equation === "0" && !isNaN(key) && key != ".") { 
        // if key is number, replaces 0 w/ key or adds decimal behind 0
        document.getElementById("displayText").innerHTML = key; 
    } else if (isNaN(key) && key != ".") {
        if (equation[equation.length-1] == " ") {
            equation = equation.slice(0, -3); // if last is operator, deletes it and spaces
                                              // to replace with new operator
        }
        // adds operator to display and w/ spacing
        document.getElementById("displayText").innerHTML = equation + " " + key + " "; 
        equalsPressed = false;  
    } else if (key == "."){
        checkDecimal(key, equation);   
    } else {   // adds number to end of display 
        if (equalsPressed == true) {
            document.getElementById("displayText").innerHTML = key; 
            equalsPressed = false;  
        } else {
            document.getElementById("displayText").innerHTML = equation + key;  
        }
    }
}

// if key was clear or del, resets display to 0 or
// checks if last char in display is number or operator then removes it w/ del
function clearOrDeleteDisplay(key, equation) {
    if (key == "Clear") {
        document.getElementById("displayText").innerHTML = 0; 
        return true; 
    } else if (key == "Del") {	
        if (equation.length == 1 || equation == "Cannot divide by 0" || equation == "Infinity") {
            equation = 0; // if display is 1 number or error, then sets to 0
        } else if (equation[equation.length-1] == " "){
            // if last of display is operator and removes it and spaces
            equation = equation.slice(0, -3);
        } else {
            // removes a single digit/decimal from end
            equation = equation.slice(0, -1); 
        }
        document.getElementById("displayText").innerHTML = equation; 
        return true; 
    } 
}

// checks for decimals between end of equation and the last operator input
function checkDecimal(key, equation) {
    let sliced = ""; 

    if (equation.includes(" ")) {                       // if there is an operator, checks for
        for (i = equation.length - 1; i >= 0; i--) {    // decimal from last operator to
            if (equation[i] == " ") {                   // end of string and then extracts
                sliced = equation.slice(i);             // that portion
                break; 
            }
        }
        if (sliced.includes(".")) { // returns if decimal is in sliced portion
            return;
        }
    } else if (equation.includes(".")) { // only triggers if equation did not have an operator
        return; 
    }

    // checks for recent calc and clears old result instead of adding decimal to end of it
    if (equalsPressed == true) {  
        document.getElementById("displayText").innerHTML = "0" + key;  
        equalsPressed = false;  
    } else {
        if (equation[equation.length -1] == " ") { // if decimal after operator, also adds 0
            document.getElementById("displayText").innerHTML = equation + "0" + key;
        } else {
            document.getElementById("displayText").innerHTML = equation + key; 
        }
    }
}

function sortOperations(equation) {
    let temp = []; 
    let next = []; 
    let num;  

    // iterates through each in array checking for * or ÷
    // if it finds one, it passes nums next to operator to do math
    // then pushes new number to array in place of first number and skips over that
    // operator and other digit. if no * or ÷ is found, pushes everything to temp
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "*" || equation[i] == "÷") {
            num = doMath(equation[i-1], equation[i], equation[i+1]);
            temp[i-1] = num; 
            if (equation.length > 3) {
                for (let j = i + 2; j < equation.length; j++) {
                temp.push(equation[j]); 
                }
            }
            break; 
        }
        temp.push(equation[i]); 
    }

    // after all * and ÷ have been calculated, looks for + and -. 
    // takes array temp from previous loop and pushes to array next
    if (!temp.includes("÷") && !temp.includes("*")){
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] == "+" || temp[i] == "-") {
                num = doMath(temp[i-1], temp[i], temp[i+1]); 
                next[i-1] = num; 
                if (temp.length > 3) {
                    for (let j = i + 2; j < temp.length; j++) {
                    next.push(temp[j]); 
                    }
                }
                break; 
            }
            next.push(temp[i]); 
        }
    }

    // if next = 1, moves straight to pushing to display, otherwise
    // calls sortOperations again depending on what array was left off 
    if (temp.length > 1 && next.length != 1) {
        if (next.length > 1) {
            sortOperations(next); 
        } else {
            sortOperations(temp);
        }
    } else if (temp.length == 1 || next.length == 1) {
        if (next.length == 1) {
            equalsPressed = true; 
            document.getElementById("displayText").innerHTML = parseFloat(next[0].toFixed(5));
        } else {
            document.getElementById("displayText").innerHTML = parseFloat(temp[0].toFixed(5));
            equalsPressed = true; 
        }
    }
}

function doMath(aNum, operator, bNum) {
    if (operator == "+") {
        return +aNum + +bNum; 
    } else if (operator == "-") {
        return aNum - bNum; 
    } else if (operator == "*") {
        return aNum * bNum; 
    } else {
        if (aNum == 0) {
            return "Cannot divide by 0"; 
        } else {
            return aNum / bNum; 
        }
    }
}

addListeners(); // initialized events for click/keydown