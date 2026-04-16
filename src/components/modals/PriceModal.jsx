import React from "react";
import { X } from "lucide-react";

export default function PriceModal({
  isOpen,
  order,
  newTotal,
  darkMode,
  theme,
  onTotalChange,
  onSave,
  onClose,
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
            <span className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center font-bold text-sm">₲</span>
            Ajustar Precio Total
          </h3>
          <button onClick={onClose} className={`${theme.muted} hover:text-slate-200`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className={`text-xs mb-4 ${theme.muted}`}>Modifica el precio final de este pedido para agregar costos extra (ej. nombres, dorsales o diseño especial).</p>
        <div className={`p-3 rounded-lg mb-4 text-sm text-center ${darkMode ? 'bg-slate-700' : 'bg-neutral-50'}`}>
          <p className={`mb-1 font-bold ${darkMode ? 'text-slate-200' : 'text-neutral-800'}`}>Cliente: {order.name}</p>
          <p className={`text-xs ${theme.muted}`}>{order.quantity} Prenda(s)</p>
        </div>
        <label className={`block text-xs font-bold mb-1 ${theme.muted}`}>Nuevo Precio Total (Gs):</label>
        <input
          type="number"
          value={newTotal}
          onChange={(e) => onTotalChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-lg text-center mb-4 ${theme.input}`}
        />
        <button onClick={onSave} className="w-full bg-amber-500 text-white font-black py-3 rounded-xl hover:bg-amber-400 transition-all shadow-md border-none">
          Guardar Nuevo Precio
        </button>
      </div>
    </div>
  );
}
