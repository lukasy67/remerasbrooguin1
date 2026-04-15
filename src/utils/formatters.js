const numberFormatter = new Intl.NumberFormat('es-PY');

export const formatNumber = (value) => numberFormatter.format(Number(value || 0));
export const formatCurrency = (value, suffix = '₲') => `${formatNumber(value)} ${suffix}`.trim();

export const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const extractDetails = (obs) => {
  if (!obs) return { details: '', rest: '', loc: '' };
  let details = '';
  let rest = obs;
  let loc = '';
  const locMatch = rest.match(/\[Loc:\s*(.*?)\]/);
  if (locMatch) {
    loc = locMatch[1];
    rest = rest.replace(locMatch[0], '').trim();
  }
  const bracketRegex = /^(\[.*?\]\s*)+/;
  const match = rest.match(bracketRegex);
  if (match) {
    details = match[0].trim();
    rest = rest.replace(bracketRegex, '').trim();
  }
  if (rest.startsWith('Obs:')) rest = rest.substring(4).trim();
  return { details, rest, loc };
};
