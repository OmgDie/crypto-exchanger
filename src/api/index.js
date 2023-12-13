import axios from 'axios';

const exmpl = axios.create({
  baseURL: 'https://api.changenow.io/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAvailableCurrencies = async () => {
  return await exmpl.get('currencies', {
    params: {
      active: true,
      fixedRate: true,
    },
  });
};
const getMinimalAmount = data => {
  return exmpl.get(`min-amount/${data.fromCurrency}_${data.toCurrency}`);
};
const getEstimatedAmount = data => {
  return exmpl.get(
    `exchange-amount/${data.amount}/${data.fromCurrency}_${data.toCurrency}?api_key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd`,
  );
};

export { getAvailableCurrencies, getMinimalAmount, getEstimatedAmount };
