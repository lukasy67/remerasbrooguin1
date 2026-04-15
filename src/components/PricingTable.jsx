import React from 'react';
import { formatCurrency } from '../utils/formatters';

const CHIP_STYLES = {
  Premium: 'bg-amber-100 text-amber-800 border-amber-300',
  'Semi-Premium': 'bg-sky-100 text-sky-800 border-sky-300',
  Estandard: 'bg-slate-100 text-slate-700 border-slate-300',
};

export default function PricingTable({ ageGroupTitle, dataObject, isCamisillaCat, darkMode }) {
  const qualities = ['Premium', 'Semi-Premium', 'Estandard'];

  return (
    <div className={`mb-6 overflow-x-auto rounded-xl border shadow-sm ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className={`p-2 font-black text-center uppercase tracking-wider text-xs border-b ${darkMode ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        Precios para {ageGroupTitle}
      </div>
      <table className="w-full text-xs text-left min-w-[460px]">
        <thead className={`${darkMode ? 'bg-slate-800/70 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200'} border-b`}>
          <tr>
            <th className="p-3">Calidad</th>
            <th className="p-3">{isCamisillaCat ? 'Solo Camisilla' : 'Solo Remera'}</th>
            <th className="p-3">{isCamisillaCat ? 'Camisilla + Short' : 'Remera + Short'}</th>
            {!isCamisillaCat && <th className="p-3 text-indigo-600">Equipo Completo</th>}
          </tr>
        </thead>
        <tbody className={`${darkMode ? 'divide-slate-700' : 'divide-slate-200'} divide-y`}>
          {qualities.map((cal) => (
            <tr key={cal} className={darkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}>
              <td className="p-3 font-bold text-slate-700">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-black ${CHIP_STYLES[cal]}`}>
                  {cal}
                </span>
              </td>
              <td className={`p-3 font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{formatCurrency(dataObject[cal][isCamisillaCat ? 'Solo Camisilla' : 'Solo Remera'])}</td>
              <td className={`p-3 font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{formatCurrency(dataObject[cal][isCamisillaCat ? 'Camisilla + Short' : 'Remera + Short'])}</td>
              {!isCamisillaCat && <td className="p-3 font-black text-indigo-600">{formatCurrency(dataObject[cal]['Equipo Completo'])}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
