
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
        } else {  // if last of display is number, checks for/sorts operators
            sortOperations(equation); 
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
        console.log("supposedly division");
        return aNum / bNum; 
    }
}

function sortOperations(displayText) {
    if (checkForOperators(displayText)) {  
        return; // returns if no operators are found
    }
    let t = "   " + displayText + "   ";  
    let temp = " "; 
    let num; 
    for (let i = 0; i < displayText.length + 6; i++) {
        if (t[i] == "*" || t[i] == "÷") {
            num = doMath(t[i-1], t[i], t[i+1])
            temp += " " + t.slice(0, i-1) + num + t.slice(i+2);
        }
        if (i > displayText.length + 6) {
            break; 
        }
    }
    document.getElementById("displayText").innerHTML = temp.replace(/\s/g, '');
}

// runs through on "=" key to make sure operators are in display before doing math
function checkForOperators(displayText) {
    let opCheck = false; 
    for (let i = 0; i < displayText.length; i++) {
        if (isNaN(displayText.charAt(i))) {
            opCheck = true; 
        }
    }
    if (opCheck == false) {
        return false; 
    }
}

// initializes all listeners
addListeners();