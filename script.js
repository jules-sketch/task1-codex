const ROMAN_PATTERN = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

const numerals = [
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' }
];

const firstInput = document.getElementById('firstNumeral');
const secondInput = document.getElementById('secondNumeral');
const resultValue = document.getElementById('resultValue');
const resultNote = document.getElementById('resultNote');
const clearButton = document.getElementById('clear');

function romanToInt(roman) {
  const input = roman.toUpperCase();
  if (!input || !ROMAN_PATTERN.test(input)) {
    return null;
  }

  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let i = 0;

  while (i < input.length) {
    const current = values[input[i]];
    const next = values[input[i + 1]];
    if (next && next > current) {
      total += next - current;
      i += 2;
    } else {
      total += current;
      i += 1;
    }
  }

  return total;
}

function intToRoman(num) {
  if (num < 1 || num > 3999) return null;
  let value = num;
  let result = '';

  numerals.forEach(({ value: numeralValue, symbol }) => {
    while (value >= numeralValue) {
      result += symbol;
      value -= numeralValue;
    }
  });

  return result;
}

function showMessage(message, note = '') {
  resultValue.textContent = message;
  resultNote.textContent = note;
}

function parseInputs() {
  const first = romanToInt(firstInput.value.trim());
  const second = romanToInt(secondInput.value.trim());

  if (first === null) {
    showMessage('Invalid first numeral', 'Use standard Roman numerals between I and MMMCMXCIX.');
    return null;
  }

  if (second === null) {
    showMessage('Invalid second numeral', 'Use standard Roman numerals between I and MMMCMXCIX.');
    return null;
  }

  return { first, second };
}

function handleOperation(op) {
  const parsed = parseInputs();
  if (!parsed) return;

  const { first, second } = parsed;
  let result;
  let note = '';

  switch (op) {
    case 'add':
      result = first + second;
      note = `${first} + ${second}`;
      break;
    case 'subtract':
      result = first - second;
      if (result <= 0) {
        showMessage('Result is not positive', 'Roman numerals do not support zero or negatives.');
        return;
      }
      note = `${first} - ${second}`;
      break;
    case 'multiply':
      result = first * second;
      note = `${first} × ${second}`;
      break;
    case 'divide':
      if (second === 0) {
        showMessage('Cannot divide by zero');
        return;
      }
      if (first % second !== 0) {
        showMessage('Fractional result not allowed', 'Division must yield a whole-number answer.');
        return;
      }
      result = first / second;
      note = `${first} ÷ ${second}`;
      break;
    default:
      return;
  }

  const roman = intToRoman(result);
  if (!roman) {
    showMessage('Result out of range', 'Buddie works between 1 and 3999.');
    return;
  }

  showMessage(roman, `(${note} = ${result})`);
}

function clearInputs() {
  firstInput.value = '';
  secondInput.value = '';
  showMessage('Awaiting input', 'Enter numerals and choose an operation.');
  firstInput.focus();
}

function wireButtons() {
  document.querySelectorAll('[data-op]').forEach((button) => {
    button.addEventListener('click', () => handleOperation(button.dataset.op));
  });
  clearButton.addEventListener('click', clearInputs);
}

wireButtons();
clearInputs();
