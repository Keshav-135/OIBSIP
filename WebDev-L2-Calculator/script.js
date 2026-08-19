// State Management
const state = {
  expression: '',
  result: '0',
  mode: 'basic',
  theme: 'smartphone',
  color: 'blue',
  darkMode: false,
  angleUnit: 'DEG'
};

const DOM = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  handleIntroScreen();
  loadLocalStorage();
  setupEventListeners();
  updateClock();
  setInterval(updateClock, 1000);
  render();
});

// Handle website opening intro screen fade out
function handleIntroScreen() {
  const introScreen = document.getElementById('intro-screen');
  if (introScreen) {
    setTimeout(() => {
      introScreen.classList.add('fade-out');
    }, 1800);
  }
}

function initDOM() {
  DOM.calcWrapper = document.getElementById('calc-wrapper');
  DOM.mainDisplay = document.getElementById('main-calc-display');
  DOM.expression = document.getElementById('expression-display');
  DOM.result = document.getElementById('result-display');
  DOM.basicKeypad = document.getElementById('basic-keypad');
  DOM.sciKeypad = document.getElementById('scientific-keypad');
  DOM.currencyPanel = document.getElementById('currency-panel');
  DOM.navBasic = document.getElementById('nav-basic');
  DOM.navSci = document.getElementById('nav-scientific');
  DOM.navCurrency = document.getElementById('nav-currency');
  DOM.navPhysical = document.getElementById('nav-physical');
  DOM.darkModeToggle = document.getElementById('dark-mode-toggle');
  DOM.colorPickerToggle = document.getElementById('color-picker-toggle');
  DOM.colorPalette = document.getElementById('color-palette');
  DOM.hamburger = document.getElementById('hamburger');
  DOM.navMenu = document.getElementById('nav-menu');
  DOM.angleBadge = document.getElementById('angle-mode-badge');
  DOM.angleToggle = document.getElementById('angle-toggle');
  DOM.clock = document.getElementById('current-time');

  DOM.currencyAmount = document.getElementById('currency-amount');
  DOM.currencyFrom = document.getElementById('currency-from');
  DOM.currencyTo = document.getElementById('currency-to');
  DOM.convertBtn = document.getElementById('convert-currency-btn');
  DOM.swapBtn = document.getElementById('swap-currency');
  DOM.exchangeRateInfo = document.getElementById('exchange-rate-info');
  DOM.convertedResultValue = document.getElementById('converted-result-value');
}

function loadLocalStorage() {
  const savedState = localStorage.getItem('digitculations_state');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    state.mode = parsed.mode || 'basic';
    state.theme = parsed.theme || 'smartphone';
    state.color = parsed.color || 'blue';
    state.darkMode = parsed.darkMode || false;
    state.angleUnit = parsed.angleUnit || 'DEG';
  }
  applySettings();
}

function saveLocalStorage() {
  localStorage.setItem('digitculations_state', JSON.stringify({
    mode: state.mode,
    theme: state.theme,
    color: state.color,
    darkMode: state.darkMode,
    angleUnit: state.angleUnit
  }));
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  if (DOM.clock) DOM.clock.textContent = `${hours}:${minutes}`;
}

function closeMobileMenu() {
  if (DOM.navMenu && DOM.navMenu.classList.contains('show')) {
    DOM.navMenu.classList.remove('show');
  }
}

function setupEventListeners() {
  if (DOM.navBasic) {
    DOM.navBasic.addEventListener('click', () => {
      switchCalcMode('basic');
      closeMobileMenu();
    });
  }
  if (DOM.navSci) {
    DOM.navSci.addEventListener('click', () => {
      switchCalcMode('scientific');
      closeMobileMenu();
    });
  }
  if (DOM.navCurrency) {
    DOM.navCurrency.addEventListener('click', () => {
      switchCalcMode('currency');
      closeMobileMenu();
    });
  }
  if (DOM.navPhysical) {
    DOM.navPhysical.addEventListener('click', () => {
      togglePhysicalTheme();
      closeMobileMenu();
    });
  }

  if (DOM.darkModeToggle) {
    DOM.darkModeToggle.addEventListener('click', () => {
      state.darkMode = !state.darkMode;
      applySettings();
      saveLocalStorage();
      closeMobileMenu();
    });
  }

  if (DOM.colorPickerToggle) {
    DOM.colorPickerToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (DOM.colorPalette) DOM.colorPalette.classList.toggle('show');
    });
  }

  document.addEventListener('click', () => {
    if (DOM.colorPalette) DOM.colorPalette.classList.remove('show');
  });

  document.querySelectorAll('.color-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      state.color = e.target.getAttribute('data-color');
      applySettings();
      saveLocalStorage();
      closeMobileMenu();
    });
  });

  if (DOM.hamburger) {
    DOM.hamburger.addEventListener('click', () => {
      if (DOM.navMenu) DOM.navMenu.classList.toggle('show');
    });
  }

  if (DOM.angleToggle) {
    DOM.angleToggle.addEventListener('click', () => {
      state.angleUnit = state.angleUnit === 'DEG' ? 'RAD' : 'DEG';
      DOM.angleToggle.textContent = state.angleUnit;
      if (DOM.angleBadge) DOM.angleBadge.textContent = state.angleUnit;
      saveLocalStorage();
    });
  }

  if (DOM.convertBtn) {
    DOM.convertBtn.addEventListener('click', fetchExchangeRate);
  }

  if (DOM.swapBtn) {
    DOM.swapBtn.addEventListener('click', () => {
      const temp = DOM.currencyFrom.value;
      DOM.currencyFrom.value = DOM.currencyTo.value;
      DOM.currencyTo.value = temp;
      fetchExchangeRate();
    });
  }

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => handleInput(btn));
  });

  window.addEventListener('keydown', handleKeyboardInput);
}

function applySettings() {
  if (state.darkMode) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }

  document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
  document.body.classList.add(`theme-${state.color}`);

  if (state.theme === 'physical' && state.mode !== 'currency') {
    DOM.calcWrapper.classList.add('physical-mode');
    DOM.calcWrapper.classList.remove('phone-mode');
    if (DOM.navPhysical) DOM.navPhysical.classList.add('active');
  } else {
    DOM.calcWrapper.classList.add('phone-mode');
    DOM.calcWrapper.classList.remove('physical-mode');
    if (state.theme === 'physical' && DOM.navPhysical) {
      DOM.navPhysical.classList.add('active');
    } else if (DOM.navPhysical) {
      DOM.navPhysical.classList.remove('active');
    }
  }

  if (DOM.navBasic) DOM.navBasic.classList.remove('active');
  if (DOM.navSci) DOM.navSci.classList.remove('active');
  if (DOM.navCurrency) DOM.navCurrency.classList.remove('active');

  if (DOM.basicKeypad) DOM.basicKeypad.style.display = 'none';
  if (DOM.sciKeypad) DOM.sciKeypad.style.display = 'none';
  if (DOM.currencyPanel) DOM.currencyPanel.style.display = 'none';
  if (DOM.mainDisplay) DOM.mainDisplay.style.display = 'none';
  if (DOM.angleBadge) DOM.angleBadge.style.display = 'none';

  if (state.mode === 'scientific') {
    if (DOM.sciKeypad) DOM.sciKeypad.style.display = 'grid';
    if (DOM.mainDisplay) DOM.mainDisplay.style.display = 'flex';
    if (DOM.navSci) DOM.navSci.classList.add('active');
    if (DOM.angleBadge) DOM.angleBadge.style.display = 'inline-block';
  } else if (state.mode === 'currency') {
    if (DOM.currencyPanel) DOM.currencyPanel.style.display = 'flex';
    if (DOM.navCurrency) DOM.navCurrency.classList.add('active');
    fetchExchangeRate();
  } else {
    if (DOM.basicKeypad) DOM.basicKeypad.style.display = 'grid';
    if (DOM.mainDisplay) DOM.mainDisplay.style.display = 'flex';
    if (DOM.navBasic) DOM.navBasic.classList.add('active');
  }
}

function switchCalcMode(mode) {
  state.mode = mode;
  applySettings();
  saveLocalStorage();
}

function togglePhysicalTheme() {
  state.theme = state.theme === 'smartphone' ? 'physical' : 'smartphone';
  applySettings();
  saveLocalStorage();
}

async function fetchExchangeRate() {
  if (!DOM.currencyAmount || !DOM.currencyFrom || !DOM.currencyTo || !DOM.convertedResultValue) return;

  const amount = parseFloat(DOM.currencyAmount.value) || 0;
  const from = DOM.currencyFrom.value;
  const to = DOM.currencyTo.value;

  if (amount <= 0) {
    DOM.convertedResultValue.textContent = `0.00 ${to}`;
    return;
  }

  DOM.convertedResultValue.textContent = 'Converting...';

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (data && data.rates && data.rates[to]) {
      const rate = data.rates[to];
      const converted = (amount * rate).toFixed(2);

      if (DOM.exchangeRateInfo) {
        DOM.exchangeRateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
      }
      DOM.convertedResultValue.textContent = `${converted} ${to}`;
    } else {
      DOM.convertedResultValue.textContent = 'Rate Error';
    }
  } catch (err) {
    DOM.convertedResultValue.textContent = 'Offline / Error';
  }
}

// Calculator Logic
function handleInput(btn) {
  const action = btn.getAttribute('data-action');
  const value = btn.getAttribute('data-value') || btn.textContent;

  if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteLast();
  } else if (action === 'equals') {
    calculate();
  } else if (action === 'pm') {
    togglePlusMinus();
  } else if (action === 'percent') {
    applyPercent();
  } else if (action === 'sci') {
    appendScientificFunction(value);
  } else if (action === 'angle-toggle') {
    return;
  } else {
    appendValue(value);
  }

  render();
}

function appendValue(val) {
  if (val === '.') {
    const parts = state.expression.split(/[\+\-\*\/\^\(\)]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
  }

  if (state.expression === '0' && val !== '.') {
    state.expression = val;
  } else {
    state.expression += val;
  }
}

function appendScientificFunction(func) {
  if (func === 'fact') {
    state.expression += '!';
  } else {
    state.expression += `${func}(`;
  }
}

function clearAll() {
  state.expression = '';
  state.result = '0';
}

function deleteLast() {
  state.expression = state.expression.slice(0, -1);
}

function togglePlusMinus() {
  if (!state.expression) return;
  if (state.expression.startsWith('-')) {
    state.expression = state.expression.slice(1);
  } else {
    state.expression = '-' + state.expression;
  }
}

function applyPercent() {
  if (!state.expression) return;
  try {
    const val = parseFloat(state.expression);
    state.expression = (val / 100).toString();
  } catch (e) {
    state.result = 'Error';
  }
}

function calculate() {
  if (!state.expression) return;

  try {
    let parseExpr = state.expression;

    parseExpr = parseExpr.replace(/π/g, 'Math.PI');
    parseExpr = parseExpr.replace(/e/g, 'Math.E');
    parseExpr = parseExpr.replace(/\^/g, '**');

    const isDeg = state.angleUnit === 'DEG';
    const toRad = (val) => isDeg ? (val * Math.PI) / 180 : val;
    const toDeg = (val) => isDeg ? (val * 180) / Math.PI : val;

    parseExpr = parseExpr.replace(/sin\(([^)]+)\)/g, (_, m) => `Math.sin(${toRad(eval(m))})`);
    parseExpr = parseExpr.replace(/cos\(([^)]+)\)/g, (_, m) => `Math.cos(${toRad(eval(m))})`);
    parseExpr = parseExpr.replace(/tan\(([^)]+)\)/g, (_, m) => `Math.tan(${toRad(eval(m))})`);

    parseExpr = parseExpr.replace(/asin\(([^)]+)\)/g, (_, m) => `${toDeg(Math.asin(eval(m)))}`);
    parseExpr = parseExpr.replace(/acos\(([^)]+)\)/g, (_, m) => `${toDeg(Math.acos(eval(m)))}`);
    parseExpr = parseExpr.replace(/atan\(([^)]+)\)/g, (_, m) => `${toDeg(Math.atan(eval(m)))}`);

    parseExpr = parseExpr.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
    parseExpr = parseExpr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
    parseExpr = parseExpr.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');

    parseExpr = parseExpr.replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)));

    if (/\/0(?!\d)/.test(parseExpr)) {
      state.result = 'Cannot divide by 0';
      return;
    }

    const evalResult = Function(`'use strict'; return (${parseExpr})`)();

    if (isNaN(evalResult) || !isFinite(evalResult)) {
      state.result = 'Error';
    } else {
      state.result = Number.isInteger(evalResult)
        ? evalResult.toString()
        : parseFloat(evalResult.toFixed(8)).toString();
    }
  } catch (err) {
    state.result = 'Invalid Expression';
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function render() {
  if (DOM.expression) DOM.expression.textContent = state.expression;
  if (DOM.result) DOM.result.textContent = state.result;
}

function handleKeyboardInput(e) {
  if (state.mode === 'currency') return;

  const key = e.key;

  if (key >= '0' && key <= '9') appendValue(key);
  else if (key === '.') appendValue('.');
  else if (key === '+') appendValue('+');
  else if (key === '-') appendValue('-');
  else if (key === '*') appendValue('*');
  else if (key === '/') appendValue('/');
  else if (key === '(' || key === ')') appendValue(key);
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Backspace') deleteLast();
  else if (key === 'Escape') clearAll();

  render();
}