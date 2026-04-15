export const formatCurrency = (n) =>
  `₲ ${new Intl.NumberFormat("es-PY").format(n || 0)}`;

export const formatNumber = (n) =>
  new Intl.NumberFormat("es-PY").format(n || 0);

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-PY");
};

export const extractDetails = (text = "") => {
  return {
    price: text.match(/\[Precio: (\d+)\]/)?.[1] || null,
  };
};