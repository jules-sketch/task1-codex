const operationMap = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero is not allowed.');
    return Math.floor(a / b);
  }
};

const numeralMap = new Map([
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
  ['I', 1]
]);

function romanToInt(roman) {
  if (!roman) {
    throw new Error('Roman numeral is required.');
  }
  const sanitized = roman.toUpperCase().trim();
  if (!/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(sanitized)) {
    throw new Error('Invalid Roman numeral.');
  }
  let i = 0;
  let total = 0;
  while (i < sanitized.length) {
    const two = sanitized.slice(i, i + 2);
    if (numeralMap.has(two)) {
      total += numeralMap.get(two);
      i += 2;
    } else {
      total += numeralMap.get(sanitized[i]);
      i += 1;
    }
  }
  return total;
}

function intToRoman(value) {
  if (value < 1 || value > 3999) {
    throw new Error('Result is outside supported range (1-3999).');
  }
  let remaining = value;
  let result = '';
  for (const [symbol, val] of numeralMap.entries()) {
    while (remaining >= val) {
      result += symbol;
      remaining -= val;
    }
  }
  return result;
}

function getValues() {
  const firstInput = document.getElementById('first');
  const secondInput = document.getElementById('second');
  const operation = document.getElementById('operation').value;
  return {
    a: romanToInt(firstInput.value),
    b: romanToInt(secondInput.value),
    operation
  };
}

function displayResult(message, isError = false) {
  const resultEl = document.getElementById('result');
  resultEl.textContent = message;
  resultEl.classList.toggle('error', isError);
}

document.getElementById('calculate').addEventListener('click', () => {
  try {
    const { a, b, operation } = getValues();
    const calculate = operationMap[operation];
    const numericResult = calculate(a, b);
    if (numericResult <= 0) {
      throw new Error('Roman numerals must be positive numbers.');
    }
    const romanResult = intToRoman(numericResult);
    displayResult(`${romanResult} (=${numericResult})`);
  } catch (error) {
    displayResult(error.message, true);
  }
});
