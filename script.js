// if key was clear or del, resets display to 0 or
// checks if last char in display is number or operator then removes it w/ del
function clearOrDeleteDisplay(key, equation) {
    if (key == "Clear") {
        document.getElementById("displayText").innerHTML = 0; 
        return true; 
    } else if (key == "Del") {	
        if (equation.length == 1) {
            equation = 0; // checks if display is 1 number, then sets to 0
        } else if (isNaN(equation[equation.length-1]) || equation[equation.length-1] == " "){
            // checks if last of display is operator and removes it and spaces
            equation = equation.slice(0, -3);
        } else {
            // removes a single digit from end
            equation = equation.slice(0, -1); 
        }
        document.getElementById("displayText").innerHTML = equation; 
        return true; 
    } 
}

function updateDisplay(key) {
    let equation = document.getElementById("displayText").innerHTML
    if (clearOrDeleteDisplay(key, equation)) {
        return;
    } else if (equation == 0 && !isNaN(key)) { // makes display number for first char
        document.getElementById("displayText").innerHTML = key; 
    } else if (isNaN(key)) { // adds operator to display
        if (isNaN(equation[equation.length-1]) || equation[equation.length-1] == " ") {
            equation = equation.slice(0, -3); // if last is operator, 
                                              // deletes it to make room for new operator
        }
        document.getElementById("displayText").innerHTML = equation + " " + key + " "; 
    } else {   // adds number to end of display
        document.getElementById("displayText").innerHTML = equation + key;  
    }
}

function setKey(e) {
    let key = e.target.innerHTML;  
    if (key == "=") { // if =, checks for valid equation, then moves to math 
        let equation = document.getElementById("displayText").innerHTML.replace(/\s/g, '')
        if (isNaN(equation[equation.length - 1])) {
            return; // if last of display is an operator, does nothing
        } else {  // if last of display is number, checks for operators
            checkForOperators(equation); 
        }
    } else { // sends key to be updated on display
         updateDisplay(key); 
    }
}

function addListeners() {
    const btns = Array.from(document.querySelectorAll(".buttons"));
    btns.forEach(btn => btn.addEventListener('click', setKey));
    btns.forEach(btn => btn.addEventListener('keydown', setKey));
}

function doMath(aNum, operator, bNum) {
    if (operator == "+") {
        return +aNum + +bNum; 
    } else if (operator == "-") {
        return aNum - bNum; 
    } else if (operator == "*") {
        return aNum * bNum; 
    } else {
        return aNum / bNum; 
    }
}
let counter = 0; 
function sortOperations(text) {
    let temp = []; 
    let next = []; 
    let num;  

    // iterates through each in array checking for * or ÷
    // if it finds one, it passes nums next to operator to do math
    // then pushes new number to array in place of first number and skips over pushing 
    // operator and other digit. if no * or ÷ is found, pushes everything to temp
    for (let i = 0; i < text.length; i++) {
        if (text[i] == "*" || text[i] == "÷") {
            num = doMath(text[i-1], text[i], text[i+1]);
            temp[i-1] = num; 
            if (text.length > 3) {
                for (let j = i + 2; j < text.length; j++) {
                temp.push(text[j]); 
                }
            }
            break; 
        }
        temp.push(text[i]); 
    }
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

    if (temp.length > 1 && next.length != 1) {
        if (next.length > 1) {
            sortOperations(next); 
        } else {
            sortOperations(temp);
        }
    } else if (temp.length == 1 || next.length == 1) {
        if (next.length == 1) {
            document.getElementById("displayText").innerHTML = next;
        } else {
            document.getElementById("displayText").innerHTML = temp;
        }
    }
}

// runs through on "=" key to make sure operators are in display before sortOperations
function checkForOperators(equation) {
    let opCheck = false; 
    for (let i = 0; i < equation.length; i++) {
        if (isNaN(equation.charAt(i))) {
            opCheck = true; 
            break; 
        }
    }
    if (opCheck == false) {
        return; 
    }
    sortOperations(document.getElementById("displayText").innerHTML.split(" ")); 
}

// initializes all listeners
addListeners();