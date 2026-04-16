import React from "react";
import { Receipt, X } from "lucide-react";
import { formatNumber } from "../../utils/formatters";

export default function PaymentModal({
  isOpen,
  order,
  amount,
  isSaved,
  darkMode,
  theme,
  totalAmount,
  onAmountChange,
  onSave,
  onClose,
  receiptLink,
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
            <span className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">₲</span>
            Registrar Pago
          </h3>
          <button onClick={onClose} className={`${theme.muted} hover:text-slate-200`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`p-3 rounded-lg mb-4 text-sm text-center ${darkMode ? 'bg-slate-700' : 'bg-neutral-50'}`}>
          <p className={`mb-1 ${theme.muted}`}>Total de {order.name}</p>
          <p className={`text-xl font-black ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{formatNumber(totalAmount)} Gs.</p>
        </div>
        <label className={`block text-xs font-bold mb-1 ${theme.muted}`}>Monto entregado (Gs):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg text-center mb-4 ${theme.input}`}
        />
        <div className="space-y-2">
          <button onClick={onSave} className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-md border-none">
            Guardar Pago
          </button>
          {isSaved && receiptLink && (
            <a href={receiptLink} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-all shadow-md flex items-center justify-center gap-2">
              <Receipt className="w-4 h-4" /> Enviar Recibo WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
