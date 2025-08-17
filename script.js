const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

// Simple flag mapping (emoji). Fallback to 🏳️ if unknown.
const currencyFlag = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CNY: "🇨🇳",
  AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", NZD: "🇳🇿", SEK: "🇸🇪",
  NOK: "🇳🇴", DKK: "🇩🇰", PLN: "🇵🇱", HUF: "🇭🇺", CZK: "🇨🇿",
  BRL: "🇧🇷", ARS: "🇦🇷", CLP: "🇨🇱", MXN: "🇲🇽", COP: "🇨🇴",
  ZAR: "🇿🇦", INR: "🇮🇳", IDR: "🇮🇩", KRW: "🇰🇷", TRY: "🇹🇷",
  ILS: "🇮🇱", AED: "🇦🇪", SAR: "🇸🇦", RUB: "🇷🇺", HKD: "🇭🇰",
  SGD: "🇸🇬", MYR: "🇲🇾", THB: "🇹🇭", PHP: "🇵🇭", RON: "🇷🇴"
};

const ratesCache = new Map();

// API base (gratuita) para taxas de câmbio
const API = (base) => `https://api.exchangerate-api.com/v4/latest/${encodeURIComponent(base)}`; 

function currencyLabel(code){
    const flag = currencyFlag[code] || "🏳️";
    return `${flag} ${code}`;
}

async function fetchRates(base) {
    if (ratesCache.has(base)) return ratesCache.get(base);
    const res = await fetch(API(base));

    if (!res.ok) throw new Error("Failed to fetch rates");
    const data = await res.json();
    ratesCache.Cache.set(base, data);
    return data;
}

async function loadCurrencies(){
  // Load a know base first to extract the available currency list
  const data = await fetchRates("USD");
  const currencies = Object.keys(data.rates).sort();

  [fromCurrency, toCurrency].forEach(sel =>{
    sel.innerHTML = "";
    currencies.forEach(code => {
      const opt = document.getElement("option");
      opt.value = code;
      opt.textContent = currencyLabel(code);
      sel.appendChild(opt);
    });
  });

  fromCurrency.value = "USD";
  toCurrency.value = "EUR";
}

function formatMoney(value, currency){
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency}).format(value);
  } catch{
    return `${value.toFixed(2)} $currency`;
  }
}

async function cnvertCurrency(){
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amountValue = parseFloat(amount.value);

  if (isNaN(amountValue) || amountValue <= 0){
    result.textContent = "Enter a valid amount.";
    rareInfo.textContent = "";
    return;
  }

  try {
    const data = await fetchRates(from);
    const rate = data.rates[to];
    if (!rate) {
      result.textContent = `No rate available from ${from} to ${to}.`;
      rateInfo.textContent = "";
      return;
    }

    const converted = amountValue * rate;
    result.textContent = `${formatMoney(amountValue, from)} = ${formatMoney(converted, to)}`;
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} • Updated: ${data.time_last_update_utc || data.date || ""}`;
  } catch (err) {
    result.textContent = "Error fetching rates. Try again later.";
    rateInfo.textContent = "";
    console.error(err);
  }
}

  function swapCurrencies(){
    const from = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = from;
    convertCurrency();
  }

  function setupAutoConvert(){
    //Convert on button click
    convertBtn.addEventListener("click", convertCurrency);
    //Auto convert on change
    [fromCurrency, toCurrency].forEach(sel => sel.addEventListener("change", convertCurrency));
    amount.addEventListener("input", convertCurrency);
    swapBtn.addEventListener("click", swapCurrencies);
  }

  (async function init(){
    await loadCurrencies();
    setupAutoConvert();
    amount.value = "100";
    convertCurrency();
  })();
