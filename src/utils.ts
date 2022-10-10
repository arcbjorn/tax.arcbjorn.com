export interface IMainState {
  date: Date;
  rate: string;
  amountInUSD: number | null;
}

export const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export const getDefaultDate = (defaultTransactionDay: number = 27): Date => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const invoiceMonth =
    currentDate.getDate() >= defaultTransactionDay
      ? currentMonth
      : currentMonth - 1;

  return new Date(
    currentDate.getFullYear(),
    invoiceMonth,
    defaultTransactionDay
  );
};

export const getCurrencyRate = async (date: Date): Promise<string> => {
  const formattedDate = formatDate(date);

  const res = await fetch(
    `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/?currencies=USD&date=${formattedDate}`
  );
  const data = await res.json();
  const rateFormeted = data[0].currencies[0].rateFormated;

  return rateFormeted;
};

export const getAmountInLari = (state: IMainState): number => {
  if (!state.amountInUSD || !state.rate) {
    return 0;
  }

  const decimalsNumber = state.rate.split('.').slice(1)[0].length;
  const multiplier = Math.pow(10, decimalsNumber);

  const rateInFloat = Number.parseFloat(state.rate);
  const multipliedRateInteger = rateInFloat * multiplier;

  const amountInLari = (multipliedRateInteger * state.amountInUSD) / multiplier;
  return amountInLari;
};
