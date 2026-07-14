const expressionElement = document.getElementById('expression');
const displayElement = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';
let lastResult = '0';

function sanitizeExpression(input) {
  return input.replace(/×/g, '*').replace(/÷/g, '/');
}

function evaluateExpression(input) {
  const sanitized = sanitizeExpression(input);

  if (!sanitized) return '0';
  if (!/^[\d.+\-*/]+$/.test(sanitized)) return 'Error';

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!Number.isFinite(result)) return 'Error';
    return Number.isInteger(result) ? String(result) : result.toFixed(10).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  } catch {
    return 'Error';
  }
}

function updateDisplay() {
  const preview = expression || '0';
  expressionElement.textContent = preview;

  if (expression) {
    const result = evaluateExpression(expression);
    displayElement.textContent = result === 'Error' ? 'Error' : result;
  } else {
    displayElement.textContent = '0';
  }
}

function appendValue(value) {
  if (value === '.' && /\.\d*$/.test(expression)) {
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    if (!expression) {
      if (value === '-') {
        expression = '-';
      }
      updateDisplay();
      return;
    }

    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      expression = expression.slice(0, -1) + value;
      updateDisplay();
      return;
    }
  }

  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = '';
  lastResult = '0';
  expressionElement.textContent = '0';
  displayElement.textContent = '0';
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function evaluate() {
  const result = evaluateExpression(expression);

  if (result === 'Error') {
    expression = '';
    lastResult = 'Error';
    expressionElement.textContent = '0';
    displayElement.textContent = 'Error';
    return;
  }

  lastResult = result;
  expression = result;
  expressionElement.textContent = result;
  displayElement.textContent = result;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'backspace') {
      backspace();
      return;
    }

    if (action === 'equals') {
      evaluate();
      return;
    }

    appendValue(value);
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    appendValue(key);
    event.preventDefault();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    appendValue(key === 'x' ? '*' : key);
    event.preventDefault();
    return;
  }

  if (key === 'Enter') {
    evaluate();
    event.preventDefault();
    return;
  }

  if (key === 'Backspace') {
    backspace();
    event.preventDefault();
    return;
  }

  if (key === 'Escape' || key === 'Delete') {
    clearAll();
    event.preventDefault();
  }
});

updateDisplay();
