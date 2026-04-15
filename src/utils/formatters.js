export function formatNumber(value) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat("es-PY").format(Number.isFinite(numeric) ? numeric : 0);
}

export function formatCurrency(value, suffix = "Gs.") {
  return `${formatNumber(value)} ${suffix}`.trim();
}

export function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function extractDetails(obs) {
  if (!obs) return { details: "", rest: "", loc: "", price: null, isManualPrice: false };
  let details = "";
  let rest = obs;
  let loc = "";
  let price = null;
  let isManualPrice = false;

  const locMatch = rest.match(/\[Loc:\s*(.*?)\]/);
  if (locMatch) {
    loc = locMatch[1];
    rest = rest.replace(locMatch[0], "").trim();
  }

  const priceMatch = rest.match(/\[Precio:\s*(\d+)\]/);
  if (priceMatch) price = Number(priceMatch[1]);

  if (/\[PrecioManual:SI\]/.test(rest)) isManualPrice = true;

  const bracketRegex = /^(\[.*?\]\s*)+/;
  const match = rest.match(bracketRegex);
  if (match) {
    details = match[0].trim();
    rest = rest.replace(bracketRegex, "").trim();
  }

  if (rest.startsWith("Obs:")) rest = rest.substring(4).trim();
  return { details, rest, loc, price, isManualPrice };
}
