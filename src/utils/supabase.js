import { supabaseUrl, supabaseKey } from './constants';

export const supabaseRequest = async (path, method = 'GET', body = null) => {
  if (!supabaseUrl || supabaseUrl.includes('TU_URL_AQUI')) {
    return { data: null, error: 'Configuración pendiente.' };
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = response.status !== 204 ? await response.json() : null;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
