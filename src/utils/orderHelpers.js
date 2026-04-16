export const getUnitPrice = (order) => {
  const match = order.observations?.match(/\[Precio:\s*(\d+)\]/);
  if (match) return parseInt(match[1], 10);

  const isDeportiva =
    order.observations?.includes('Combo:') ||
    order.observations?.includes('Short:') ||
    order.observations?.includes('[#');

  const mangaLargaCost = isDeportiva ? 15000 : 10000;
  return 85000 + (order.longSleeve ? mangaLargaCost : 0);
};

export const getOrderFinancials = (order) => {
  const total = getUnitPrice(order) * order.quantity;
  const paid = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);

  return {
    total,
    paid,
    balance: total - paid,
  };
};
