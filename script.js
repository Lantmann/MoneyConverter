let fromChoices, toChoices;

async function loadCurrencies() {
    try {
        const res = await fetch('https://api.frankfurter.app/currencies');
        const data = await res.json();

        const fromSelect = document.getElementById('from');
        const toSelect = document.getElementById('to');

        // Limpa selects
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        for (const [code, name] of Object.entries(data)) {
            const option = new Option(`${code} - ${name}`, code);
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        }

        // Inicializa Choices.js (evita duplicar)
        if (fromChoices) fromChoices.destroy();
        if (toChoices) toChoices.destroy();

        fromChoices = new Choices(fromSelect, {
        searchEnabled: true,
        itemSelectText: '',
        maxItemCount: 2,
        shouldSort: true,
        });

        toChoices = new Choices(toSelect, {
        searchEnabled: true,
        itemSelectText: '',
        maxItemCount: 2,
        shouldSort: true,
        });

        // Valores padrão
        fromChoices.setChoiceByValue('BRL');
        toChoices.setChoiceByValue('USD');

        convertCurrency();

    } catch (err) {
        console.error('Erro ao carregar moedas:', err);
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

async function changeCurrency() {
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');

    const fromValue = fromSelect.value;
    const toValue = toSelect.value;

    fromSelect.value = toValue;
    toSelect.value = fromValue;

    fromChoices.setChoiceByValue(toValue);
    toChoices.setChoiceByValue(fromValue);

    convertCurrency();
}