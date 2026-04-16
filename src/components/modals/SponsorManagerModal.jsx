import React from "react";
import { X } from "lucide-react";

export default function SponsorManagerModal({
  isOpen,
  darkMode,
  theme,
  sponsors,
  sponsorForm,
  editingSponsorId,
  canManageSponsors,
  onClose,
  onFormChange,
  onSubmit,
  onReset,
  onEdit,
  onToggleActive,
  onDelete,
}) {
  if (!isOpen || !canManageSponsors) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-5xl rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-neutral-200'}`}>
        <div className={`p-5 border-b flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-neutral-200'}`}>
          <div>
            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-neutral-900'}`}>Panel de Sponsors</h3>
            <p className={`text-sm ${theme.muted}`}>Administra sponsors visibles, orden, enlaces y logos.</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-neutral-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className={`p-5 border-r ${darkMode ? 'border-slate-800' : 'border-neutral-200'}`}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs uppercase font-bold mb-1 ${theme.muted}`}>Nombre</label>
                <input name="name" value={sponsorForm.name} onChange={onFormChange} className={`w-full px-3 py-2 rounded-xl ${theme.input}`} placeholder="Nombre del sponsor" />
              </div>
              <div>
                <label className={`block text-xs uppercase font-bold mb-1 ${theme.muted}`}>Subtítulo</label>
                <input name="subtitle" value={sponsorForm.subtitle} onChange={onFormChange} className={`w-full px-3 py-2 rounded-xl ${theme.input}`} placeholder="Texto corto descriptivo" />
              </div>
              <div>
                <label className={`block text-xs uppercase font-bold mb-1 ${theme.muted}`}>Logo URL</label>
                <input name="logo_url" value={sponsorForm.logo_url} onChange={onFormChange} className={`w-full px-3 py-2 rounded-xl ${theme.input}`} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs uppercase font-bold mb-1 ${theme.muted}`}>Link destino</label>
                  <input name="target_url" value={sponsorForm.target_url} onChange={onFormChange} className={`w-full px-3 py-2 rounded-xl ${theme.input}`} placeholder="https://..." />
                </div>
                <div>
                  <label className={`block text-xs uppercase font-bold mb-1 ${theme.muted}`}>WhatsApp</label>
                  <input name="whatsapp_number" value={sponsorForm.whatsapp_number} onChange={onFormChange} className={`w-full px-3 py-2 rounded-xl ${theme.input}`} placeholder="595..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className={`block text-xs uppercase font-bold mb-1 ${theme.muted}`}>Orden</label>
                  <input type="number" name="display_order" value={sponsorForm.display_order} onChange={onFormChange} className={`w-full px-3 py-2 rounded-xl ${theme.input}`} />
                </div>
                <label className={`flex items-center gap-2 text-sm font-bold mt-6 ${darkMode ? 'text-slate-300' : 'text-neutral-700'}`}>
                  <input type="checkbox" name="is_active" checked={sponsorForm.is_active} onChange={onFormChange} />
                  Sponsor activo
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">{editingSponsorId ? 'Guardar cambios' : 'Crear sponsor'}</button>
                <button type="button" onClick={onReset} className={`px-4 py-2 rounded-xl font-bold ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-neutral-100 text-neutral-800'}`}>Limpiar</button>
              </div>
            </form>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-black ${darkMode ? 'text-white' : 'text-neutral-900'}`}>Sponsors registrados</h4>
              <span className={`text-xs font-bold ${theme.muted}`}>{sponsors.length} total</span>
            </div>
            <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
              {sponsors.length === 0 ? (
                <div className={`p-4 rounded-xl border border-dashed text-sm ${theme.muted}`}>Aún no hay sponsors cargados.</div>
              ) : sponsors.map((sponsor) => (
                <div key={sponsor.id} className={`rounded-xl border p-3 ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-neutral-200 bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-neutral-50 border-neutral-200'}`}>
                      {sponsor.logo_url ? <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-full object-contain" /> : <span className="text-[10px] font-black text-indigo-500">SP</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className={`font-black truncate ${darkMode ? 'text-white' : 'text-neutral-900'}`}>{sponsor.name}</p>
                          <p className={`text-xs truncate ${theme.muted}`}>{sponsor.subtitle || 'Sin subtítulo'}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${sponsor.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'}`}>
                          {sponsor.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className={`text-[11px] mt-2 ${theme.muted}`}>Orden: {sponsor.display_order ?? 0} · Clics: {sponsor.click_count ?? 0}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => onEdit(sponsor)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-neutral-100 text-neutral-800'}`}>Editar</button>
                        <button onClick={() => onToggleActive(sponsor)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${sponsor.is_active ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{sponsor.is_active ? 'Desactivar' : 'Activar'}</button>
                        <button onClick={() => onDelete(sponsor.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700">Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
