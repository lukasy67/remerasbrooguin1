import React from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";

export default function AdminLoginModal({
  isOpen,
  darkMode,
  theme,
  adminPin,
  pinError,
  showPassword,
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
            <Lock className="w-5 h-5" /> Iniciar Sesión
          </h3>
          <button onClick={onClose} className={`${theme.muted} hover:text-slate-200`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative mb-4">
          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.muted}`}>Contraseña de Acceso</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={adminPin}
            onChange={(e) => onPinChange(e.target.value)}
            placeholder="Contraseña..."
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12 ${theme.input}`}
          />
          <button type="button" onClick={onTogglePassword} className={`absolute bottom-3 right-0 pr-4 flex items-center ${theme.muted}`}>
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        {pinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
        <button onClick={onSubmit} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all mb-4 border-none">
          Ingresar
        </button>
      </div>
    </div>
  );
}
