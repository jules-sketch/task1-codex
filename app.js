const display = document.getElementById("display");
const history = document.getElementById("history");
const keypadButtons = document.querySelectorAll(".key");
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const equalsButton = document.getElementById("equals");

let currentExpression = "";

const romanMap = new Map([
  ["I", 1],
  ["V", 5],
  ["X", 10],
  ["L", 50],
  ["C", 100],
  ["D", 500],
  ["M", 1000],
]);

function romanToInt(roman) {
  if (!roman) return null;
  let total = 0;
  let previous = 0;
  for (let i = roman.length - 1; i >= 0; i -= 1) {
    const value = romanMap.get(roman[i]);
    if (!value) return null;
    if (value < previous) {
      total -= value;
    } else {
      total += value;
      previous = value;
    }
  }
  return total;
}

function intToRoman(num) {
  if (num <= 0 || num >= 4000) return null;
  const numerals = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let value = num;
  for (const [amount, symbol] of numerals) {
    while (value >= amount) {
      result += symbol;
      value -= amount;
    }
  }
  return result;
}

function updateDisplay() {
  display.textContent = currentExpression || "—";
}

keypadButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentExpression += btn.dataset.value;
    updateDisplay();
  });
});

clearButton.addEventListener("click", () => {
  currentExpression = "";
  display.textContent = "—";
  history.textContent = "";
});

deleteButton.addEventListener("click", () => {
  currentExpression = currentExpression.trimEnd();
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
});

function evaluateExpression() {
  if (!currentExpression.trim()) return;
  const expression = currentExpression.trim();
  const tokens = expression
    .split(/\s+/)
    .map((token) => token.replace(/[.,]/g, ""))
    .filter(Boolean);

  if (tokens.length < 3) {
    history.textContent = "Need a numeral, operator, numeral.";
    return;
  }

  let accumulator = romanToInt(tokens[0]);
  if (accumulator == null) {
    history.textContent = "Invalid numeral.";
    return;
  }

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextNumeral = romanToInt(tokens[i + 1]);
    if (nextNumeral == null) {
      history.textContent = "Invalid numeral.";
      return;
    }
    switch (operator) {
      case "+":
        accumulator += nextNumeral;
        break;
      case "-":
      case "−":
        accumulator -= nextNumeral;
        break;
      case "×":
      case "x":
        accumulator *= nextNumeral;
        break;
      case "÷":
      case "/":
        if (nextNumeral === 0) {
          history.textContent = "Cannot divide by zero.";
          return;
        }
        accumulator = Math.floor(accumulator / nextNumeral);
        break;
      default:
        history.textContent = "Unknown operator.";
        return;
    }
  }

  const romanResult = intToRoman(accumulator);
  if (!romanResult) {
    history.textContent = "Result outside I-MMMM.";
    return;
  }

  history.textContent = `${expression} =`;
  display.textContent = romanResult;
  currentExpression = romanResult;
}

equalsButton.addEventListener("click", evaluateExpression);

document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (romanMap.has(key)) {
    currentExpression += key;
    updateDisplay();
    return;
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    const operatorMap = { "*": " × ", "/": " ÷ ", "+": " + ", "-": " - " };
    currentExpression += operatorMap[event.key];
    updateDisplay();
    event.preventDefault();
    return;
  }

  if (event.key === "Enter") {
    evaluateExpression();
  }

  if (event.key === "Backspace") {
    deleteButton.click();
    event.preventDefault();
  }
});
