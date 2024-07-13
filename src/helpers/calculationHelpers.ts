export function sum(array?: number[]) {
  if (!array) return 0;
  if (array.length == 0) return 0;
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

// TOTAL PRICE
export function calculateNetPrice(
  quantity: number,
  price: number,
  discount: number,
  tax: number
) {
  const priceTotal = quantity * price;
  const discountTotal = priceTotal * (discount / 100);
  const taxTotal = priceTotal * (tax / 100);

  const result = priceTotal - discountTotal + taxTotal;
  return result;
}
