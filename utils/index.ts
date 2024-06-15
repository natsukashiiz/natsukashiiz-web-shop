const currencyFormat = (amount: number) => {
  return new Intl.NumberFormat().format(amount);
};

export { currencyFormat };
