import React from "react";
import { Link2, MessageCircle, QrCode, X } from "lucide-react";

export default function QrShareModal({
  isOpen,
  darkMode,
  theme,
  link,
  groupName,
  onClose,
}) {
  if (!isOpen) return null;

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      alert('¡Enlace copiado al portapapeles!');
    } catch (error) {
      console.error('No se pudo copiar el enlace', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in text-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
            <QrCode className="w-5 h-5 text-indigo-500" /> Compartir Grupo
          </h3>
          <button onClick={onClose} className={`${theme.muted} hover:text-slate-200`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className={`text-sm mb-4 ${theme.muted}`}>Comparte este código para que ingresen al grupo <strong>{groupName}</strong>.</p>
        <div className={`p-4 rounded-xl flex justify-center mb-4 border ${darkMode ? 'bg-slate-200 border-slate-400' : 'bg-neutral-100 border-neutral-200'}`}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}&margin=10`} alt="QR Code" className="rounded-lg shadow-sm" />
        </div>
        <div className="flex gap-2 mb-4">
          <a href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Haz tu pedido de indumentaria para el grupo *${groupName}* aquí:

${link}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold py-2 px-3 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
            <MessageCircle className="w-4 h-4" /> Enviar
          </a>
          <button onClick={copyLink} className={`flex-1 font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm border-none ${darkMode ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
            <Link2 className="w-4 h-4" /> Copiar
          </button>
        </div>
        <button onClick={onClose} className={`w-full font-bold py-2 rounded-xl transition-all text-sm border-none ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-neutral-800 text-white hover:bg-neutral-900'}`}>
          Cerrar Ventana
        </button>
      </div>
    </div>
  );
}
