const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

async function loadCurrencies(){
    const rs = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await rs.json();
    const currencies = Object.keys(data.rates);

    currencies.forEach(currency =>{
        let option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = currency;
        fromCurrency.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = currency;
        toCurrency.appendChild(option2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
}

async function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amountValue = amount.value;

    if (!amountValue){
        result.textContent = "Please, enter amount";
        return;
    }

    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();
    const rate = data.rates[to];
    const converted = (amountValue * rate).toFixed(2);

    result.textContent = `${amountValue} ${from} = ${converted} ${to}`;
}

convertBtn.addEventListener("click", convertCurrency);
loadCurrencies();