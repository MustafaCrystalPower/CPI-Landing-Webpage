// utils/currency.js
export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
  exchangeRates
) => {
  if (!exchangeRates || fromCurrency === toCurrency) return amount;
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount;

  const fromRate = exchangeRates[fromCurrency].rate;
  const toRate = exchangeRates[toCurrency].rate;

  // Convert to USD first (assuming rates are relative to USD)
  const usdAmount = amount / fromRate;
  // Then convert to target currency
  return usdAmount * toRate;
};

export const formatCurrency = (amount, currency, exchangeRates = null) => {
  // If no exchange rates provided or same currency, format directly
  if (!exchangeRates || !exchangeRates[currency] || currency === "EGP") {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Otherwise, use the exchange rate
  const rate = exchangeRates[currency].rate;
  const convertedAmount = amount * rate;
  const symbol = exchangeRates[currency].symbol || currency;

  return `${symbol} ${convertedAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
