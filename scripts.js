const historyEl = document.getElementById('history');
const currentEl = document.getElementById('current');

const state = {
  current: 'N',
  accumulator: null,
  operator: null,
};

const romanMap = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

function romanToInt(roman) {
  if (roman === 'N') return 0;
  let total = 0;
  let prev = 0;
  for (let i = roman.length - 1; i >= 0; i -= 1) {
    const value = romanMap[roman[i]];
    if (!value) return null;
    if (value < prev) {
      total -= value;
    } else {
      total += value;
      prev = value;
    }
  }
  return total;
}

function intToRoman(num) {
  if (num === 0) return 'N';
  const sign = num < 0 ? '-' : '';
  const value = Math.abs(num);
  if (value > 3999) return null;
  const romanPairs = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];
  let remaining = value;
  let output = '';
  romanPairs.forEach(([symbol, amount]) => {
    while (remaining >= amount) {
      output += symbol;
      remaining -= amount;
    }
  });
  return `${sign}${output}`;
}

function updateDisplay() {
  currentEl.textContent = state.current;
}

function clearAll() {
  state.current = 'N';
  state.accumulator = null;
  state.operator = null;
  historyEl.textContent = '';
  updateDisplay();
}

function appendRoman(letter) {
  if (letter === 'N') {
    state.current = 'N';
    updateDisplay();
    return;
  }
  if (state.current === 'N') {
    state.current = letter;
  } else {
    state.current += letter;
  }
  updateDisplay();
}

function backspace() {
  if (state.current.length === 1) {
    state.current = 'N';
  } else {
    state.current = state.current.slice(0, -1);
  }
  updateDisplay();
}

function toggleSign() {
  if (state.current === 'N') return;
  if (state.current.startsWith('-')) {
    state.current = state.current.slice(1);
  } else {
    state.current = `-${state.current}`;
  }
  updateDisplay();
}

function normalizeCurrent() {
  const numeric = parseCurrent();
  if (numeric === null) {
    currentEl.textContent = 'Invalid numeral';
    return;
  }
  const normalized = intToRoman(numeric);
  if (!normalized) {
    currentEl.textContent = 'Range error';
    return;
  }
  state.current = normalized;
  updateDisplay();
}

function parseCurrent() {
  const value = state.current.startsWith('-') ? state.current.slice(1) : state.current;
  const numeric = romanToInt(value);
  if (numeric === null) return null;
  return state.current.startsWith('-') ? -numeric : numeric;
}

function applyOperator(nextOperator) {
  const numeric = parseCurrent();
  if (numeric === null) {
    currentEl.textContent = 'Invalid numeral';
    return;
  }
  if (state.accumulator === null) {
    state.accumulator = numeric;
  } else if (state.operator) {
    const result = evaluate(state.accumulator, numeric, state.operator);
    if (result === null) return;
    state.accumulator = result;
  }
  state.operator = nextOperator;
  historyEl.textContent = `${intToRoman(state.accumulator)} ${symbolForOperator(nextOperator)}`;
  state.current = 'N';
  updateDisplay();
}

function evaluate(a, b, operator) {
  let result;
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      result = a / b;
      if (!Number.isInteger(result)) {
        currentEl.textContent = 'Whole numbers only';
        return null;
      }
      break;
    default:
      return null;
  }
  const roman = intToRoman(result);
  if (!roman) {
    currentEl.textContent = 'Range error';
    return null;
  }
  return result;
}

function symbolForOperator(op) {
  return {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷',
  }[op];
}

function finalizeCalculation() {
  if (!state.operator) return;
  const numeric = parseCurrent();
  if (numeric === null) {
    currentEl.textContent = 'Invalid numeral';
    return;
  }
  const result = evaluate(state.accumulator ?? 0, numeric, state.operator);
  if (result === null) return;
  const romanResult = intToRoman(result);
  historyEl.textContent = `${intToRoman(state.accumulator ?? 0)} ${symbolForOperator(state.operator)} ${intToRoman(numeric)} =`;
  state.current = romanResult;
  state.accumulator = null;
  state.operator = null;
  updateDisplay();
}

function handleButtonClick(event) {
  const { target } = event;
  if (!(target instanceof HTMLButtonElement)) return;
  const roman = target.dataset.roman;
  const operator = target.dataset.operator;
  const action = target.dataset.action;

  if (roman) {
    appendRoman(roman);
    return;
  }
  if (operator) {
    applyOperator(operator);
    return;
  }
  if (action) {
    if (action === 'clear') clearAll();
    if (action === 'backspace') backspace();
    if (action === 'swap') toggleSign();
    if (action === 'convert') normalizeCurrent();
    if (action === 'evaluate') finalizeCalculation();
  }
}

document.querySelector('.controls__grid').addEventListener('click', handleButtonClick);
clearAll();
