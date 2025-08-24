const resultDisplay = document.querySelector("#result");
const expressionDisplay = document.querySelector("#expr");

const buttons = document.querySelectorAll(".key");

let expression = "";

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent.trim();
    console.log(value);
    if (value === "C") {
      expression = "";
      resultDisplay.innerText = "0";
      expressionDisplay.innerText = "";
    } 
    else if (value === "=") {
      try {
        const answer = eval(expression.replace("×", "*").replace("÷", "/"));
        resultDisplay.innerText = answer;
        expression = answer.toString();
        expressionDisplay.innerText = "";
      } catch {
        resultDisplay.innerText = "Error";
      }
    }
    
    else {
      expression += value;
      resultDisplay.innerText = expression;
    }
  });
});

