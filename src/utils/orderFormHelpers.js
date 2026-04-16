import { AGE_RANGES, PRECIOS_BASE, PRECIOS_CAMISILLA, SIZES_UNIVERSAL } from './constants';
import { extractDetails } from './formatters';

export const buildDefaultFormData = (displayEstilo = 'Deportiva') => ({
  name: '',
  phone: '',
  edad: 'Adultos',
  ageRange: AGE_RANGES[1],
  size: SIZES_UNIVERSAL[1],
  gender: 'Femenino',
  quantity: 1,
  longSleeve: false,
  observations: '',
  playerName: '',
  playerNumber: '',
  isGoalkeeper: false,
  combo: displayEstilo === 'Camisilla' ? 'Solo Camisilla' : 'Solo Remera',
  tela: 'Premium',
  shortSize: SIZES_UNIVERSAL[1],
  femaleShortType: 'Standard',
  originalGroup: '',
  group_name: '',
});

export const calculateCurrentTotalForForm = ({
  displayEstilo,
  formData,
  allowLongSleeve,
  costoMangaLarga,
}) => {
  let unitPrice = 0;

  if (displayEstilo === 'Deportiva') {
    unitPrice = PRECIOS_BASE[formData.edad]?.[formData.tela]?.[formData.combo] || 85000;
  } else if (displayEstilo === 'Camisilla') {
    unitPrice = PRECIOS_CAMISILLA[formData.edad]?.[formData.tela]?.[formData.combo] || 80000;
  } else {
    unitPrice = 95000;
  }

  if (formData.longSleeve && allowLongSleeve) unitPrice += costoMangaLarga;
  if (['XXL', 'XXXL'].includes(formData.size)) unitPrice += 10000;

  return unitPrice * (parseInt(formData.quantity, 10) || 1);
};

export const populateFormFromOrder = (order, currentFormData = {}) => {
  let pName = '';
  let pNum = '';
  let combo = 'Solo Remera';
  let tela = 'Premium';
  let eDad = 'Adultos';
  let aRange = AGE_RANGES[1];
  let sSize = SIZES_UNIVERSAL[1];
  let fShort = 'Standard';
  let isGk = false;

  const obs = order.observations || '';

  if (obs.includes('Combo: Equipo Completo') || obs.includes('Combo: Remera + Short + Medias')) combo = 'Equipo Completo';
  else if (obs.includes('Combo: Remera + Short') || (obs.includes('Short: ') && !obs.includes('Short: NO'))) combo = 'Remera + Short';
  else if (obs.includes('Combo: Camisilla + Short')) combo = 'Camisilla + Short';
  else if (obs.includes('Combo: Solo Camisilla')) combo = 'Solo Camisilla';

  if (obs.includes('Tela: Estandard') || obs.includes('Calidad: Estandard')) tela = 'Estandard';
  else if (obs.includes('Tela: Semi-Premium')) tela = 'Semi-Premium';

  if (obs.includes('Arquero: SI')) isGk = true;
  if (obs.includes('Infantil')) {
    eDad = 'Infantil';
    const matchAge = obs.match(/Infantil \((.*?)\)/);
    if (matchAge) aRange = matchAge[1];
  }

  const matchNum = obs.match(/#([0-9]+)/);
  if (matchNum) pNum = matchNum[1];

  const matchName = obs.match(/\|\s*#.*?\|\s*([^|]+)\s*\|/);
  if (matchName) pName = matchName[1].trim() === 'SIN NOMBRE' ? '' : matchName[1].trim();

  const matchShort = obs.match(/Short:\s*([^|\]]+)/);
  if (matchShort && matchShort[1].trim() !== 'NO') {
    const sData = matchShort[1].trim();
    if (sData.includes('(Corte Femenino)')) fShort = 'Femenino';
    sSize = sData.replace(/\s*\(.*?\)/, '').trim();
  }

  const { rest } = extractDetails(obs);

  return {
    ...currentFormData,
    name: order.name,
    phone: order.phone === '-' ? '' : (order.phone || ''),
    size: order.size,
    gender: order.gender,
    quantity: order.quantity,
    longSleeve: order.longSleeve || false,
    observations: rest,
    originalGroup: order.group_name,
    group_name: order.group_name,
    playerName: pName,
    playerNumber: pNum,
    combo,
    tela,
    edad: eDad,
    ageRange: aRange,
    shortSize: sSize || SIZES_UNIVERSAL[1],
    femaleShortType: fShort,
    isGoalkeeper: isGk,
  };
};
