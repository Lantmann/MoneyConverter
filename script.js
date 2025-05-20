// script.js

async function loadCurrencies() {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies');
    const data = await res.json();

    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    for (const [code, name] of Object.entries(data)) {
      const optionFrom = document.createElement('option');
      optionFrom.value = code;
      optionFrom.textContent = `${code} - ${name}`;
      fromSelect.appendChild(optionFrom);

      const optionTo = document.createElement('option');
      optionTo.value = code;
      optionTo.textContent = `${code} - ${name}`;
      toSelect.appendChild(optionTo);
    }

    // Define seleções padrão
    fromSelect.value = 'BRL';
    toSelect.value = 'USD';
  } catch (error) {
    console.error('Erro ao carregar moedas:', error);
  }
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const result = document.getElementById("result");

  if (!amount || amount <= 0) {
    result.innerText = "Insira um valor válido.";
    return;
  }

  if (from === to) {
    result.innerText = `${amount} ${from} = ${amount} ${to}`;
    return;
  }

  try {
    const resp = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
    const data = await resp.json();
    const convertedAmount = (amount * data.rates[to]).toFixed(2);
    result.innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
  } catch (error) {
    console.error("Erro ao converter moeda:", error);
    result.innerText = "Erro ao converter moeda. Tente novamente mais tarde.";
  }
}

// Carrega as moedas quando a página for carregada
window.addEventListener('DOMContentLoaded', loadCurrencies);
