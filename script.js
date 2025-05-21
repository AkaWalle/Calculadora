const buttons = document.querySelector(".buttons");
const value = document.getElementById("value");
const toggleBtn = document.querySelector(".toggleBtn");
const toggleMode = document.querySelector(".toggleMode");
const body = document.querySelector("body");
const calculator = document.querySelector(".calculator");
const standardMode = document.querySelector(".standard-mode");
const scientificMode = document.querySelector(".scientific-mode");
const history = document.getElementById("history");

let expression = "";
let historyEntries = [];
let openParentheses = 0;

function updateDisplay() {
  value.textContent = expression || "0";
}

function validateExpression(expr) {
  console.log("Antes da validação:", expr);
  // Remove múltiplos pontos decimais consecutivos
  expr = expr.replace(/\.{2,}/g, ".");
  // Remove operadores consecutivos (exceto após funções)
  expr = expr.replace(/([+\-*/]){2,}/g, "$1");
  console.log("Depois da validação:", expr);
  return expr;
}

function closeParentheses() {
  while (openParentheses > 0) {
    expression += ")";
    openParentheses--;
  }
}

function calculate() {
  try {
    closeParentheses();

    console.log("Expressão antes da substituição:", expression);
    let evalExpr = expression
      .replace(/π/g, "Math.PI")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/\^/g, "**");
    console.log("Expressão após substituição:", evalExpr);

    let result = eval(evalExpr);
    console.log("Resultado do eval:", result);
    if (!isFinite(result)) throw new Error("Resultado inválido");

    historyEntries.unshift(`${expression} = ${result}`);
    if (historyEntries.length > 10) historyEntries.pop();
    history.innerHTML = historyEntries
      .map((entry) => `<p>${entry}</p>`)
      .join("");

    value.style.border = "2px solid #2196f3";
    setTimeout(() => {
      value.style.border = "none";
    }, 500);

    expression = result.toString();
    updateDisplay();
  } catch (error) {
    console.error("Erro no cálculo:", error);
    value.textContent = "Erro";
    setTimeout(() => {
      expression = "";
      openParentheses = 0;
      updateDisplay();
    }, 1000);
  }
}

document.querySelectorAll(".number, .operator").forEach((button) => {
  button.addEventListener("click", function () {
    const val = this.getAttribute("data-value");

    switch (val) {
      case "sin":
      case "cos":
      case "tan":
      case "sqrt":
      case "log":
      case "exp":
        expression += `${val}(`;
        openParentheses++;
        break;
      case "pi":
        expression += "π";
        break;
      case "pow":
        expression += "^";
        break;
      default:
        expression += val;
    }
    expression = validateExpression(expression);
    updateDisplay();
  });
});

document.getElementById("equal").addEventListener("click", calculate);

document.getElementById("clear").addEventListener("click", () => {
  expression = "";
  openParentheses = 0;
  updateDisplay();
});

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  toggleBtn.textContent = body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
});

toggleMode.addEventListener("click", () => {
  scientificMode.classList.toggle("hidden");
  calculator.style.width = scientificMode.classList.contains("hidden")
    ? "340px"
    : "450px";
  history.style.width = calculator.style.width;
});

document.addEventListener("keydown", (e) => {
  const keyMap = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "+": "+",
    "-": "-",
    "*": "*",
    "/": "/",
    ".": ".",
    Enter: "equal",
    Escape: "clear",
  };

  if (keyMap[e.key]) {
    e.preventDefault();
    if (e.key === "Enter") {
      document.getElementById("equal").click();
    } else if (e.key === "Escape") {
      document.getElementById("clear").click();
    } else {
      expression += keyMap[e.key];
      expression = validateExpression(expression);
      updateDisplay();
    }
  } else if (e.key === "Backspace") {
    e.preventDefault();
    if (expression.endsWith("(")) {
      openParentheses--;
    }
    expression = expression.slice(0, -1);
    updateDisplay();
  }
});
