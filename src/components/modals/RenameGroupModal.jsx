import React from "react";
import { Edit, Loader2, X } from "lucide-react";

export default function RenameGroupModal({
  isOpen,
  darkMode,
  theme,
  oldName,
  newName,
  loading,
  onNewNameChange,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
            <Edit className="w-5 h-5 text-amber-500" /> Renombrar Grupo
          </h3>
          <button onClick={onClose} className={`${theme.muted} hover:text-slate-200`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 mb-4">
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.muted}`}>Nombre Actual</label>
            <input type="text" value={oldName} disabled className={`w-full px-4 py-2 border rounded-xl text-sm cursor-not-allowed ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`} />
          </div>
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.muted}`}>Nuevo Nombre (Sin Espacios)</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => onNewNameChange(e.target.value)}
              placeholder="Ej. ColegioNacional"
              className={`w-full px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold ${theme.input} ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className={`flex-1 font-bold py-2 rounded-xl transition-all text-sm border-none ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
            Cancelar
          </button>
          <button onClick={onSubmit} disabled={loading} className="flex-1 bg-amber-500 text-white font-bold py-2 rounded-xl hover:bg-amber-600 transition-all text-sm flex items-center justify-center gap-2 border-none">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Cambio'}
          </button>
        </div>
      </div>
    </div>
  );
}
