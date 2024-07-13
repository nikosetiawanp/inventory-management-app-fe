export function formatIDR(number: number) {
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return currencyFormatter.format(number);
}
