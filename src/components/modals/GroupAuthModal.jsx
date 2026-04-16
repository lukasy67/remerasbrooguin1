import React from "react";
import { Eye, EyeOff, ShieldAlert, X } from "lucide-react";

export default function GroupAuthModal({
  isOpen,
  darkMode,
  theme,
  groupPin,
  groupPinError,
  showGroupPassword,
  onPinChange,
  onTogglePassword,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
            <ShieldAlert className="w-5 h-5 text-red-500" /> Modo Supremo
          </h3>
          <button onClick={onClose} className={`${theme.muted} hover:text-slate-200`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type={showGroupPassword ? 'text' : 'password'}
            value={groupPin}
            onChange={(e) => onPinChange(e.target.value)}
            placeholder="Contraseña Maestra"
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none pr-12 ${theme.input}`}
          />
          <button type="button" onClick={onTogglePassword} className={`absolute inset-y-0 right-0 pr-4 flex items-center ${theme.muted}`}>
            {showGroupPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        {groupPinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
        <button onClick={onSubmit} className={`w-full text-white font-bold py-3 rounded-xl transition-all border-none ${darkMode ? 'bg-slate-950 hover:bg-black' : 'bg-neutral-900 hover:bg-black'}`}>
          Activar Modo Supremo
        </button>
      </div>
    </div>
  );
}
