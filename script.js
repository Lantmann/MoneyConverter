let fromChoices, toChoices;

async function loadCurrencies() {
    try {
        const res = await fetch('https://api.frankfurter.app/currencies');
        const data = await res.json();

        const fromSelect = document.getElementById('from');
        const toSelect = document.getElementById('to');

        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        for (const [code, name] of Object.entries(data)) {
            const option = new Option(`${code} - ${name}`, code);
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        }

        // Initialize Choices.js (avoid duplicates)
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

        // Default values
        fromChoices.setChoiceByValue('BRL');
        toChoices.setChoiceByValue('USD');

        convertCurrency();

    } catch (err) {
        console.error('Error loading currencies:', err);
    }
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const result = document.getElementById("result");
    const updateTime = document.getElementById("update-time");
    const apiUpdateInfo = document.getElementById("api-update-info");

    if (!amount || amount <= 0) {
        result.innerHTML = `<span class='error'>Enter a valid amount.</span>`;
        updateTime.innerText = "";
        if (apiUpdateInfo) apiUpdateInfo.innerText = "";
        return;
    }

    if (from === to) {
        result.innerHTML = `<span class='equal'>${amount} ${from} = ${amount} ${to}</span>`;
        updateTime.innerText = "";
        if (apiUpdateInfo) apiUpdateInfo.innerText = "";
        return;
    }

    try {
        const resp = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
        const data = await resp.json();
        const convertedAmount = (amount * data.rates[to]).toFixed(2);
        result.innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        console.error("Error converting currency:", error);
        result.innerHTML = `<span class='error'>Error converting currency. Please try again later.</span>`;
        updateTime.innerText = "";
        if (apiUpdateInfo) apiUpdateInfo.innerText = "";
    }
}

// Load currencies when the page loads
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