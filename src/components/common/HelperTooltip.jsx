import React, { useState } from 'react';
import { Info } from 'lucide-react';

const HelperTooltip = React.memo(function HelperTooltip({ text, darkMode }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center align-middle z-30">
      <button
        type="button"
        onClick={() => setShow(!show)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        className={`rounded-full p-0.5 transition-colors focus:outline-none ${darkMode ? 'text-indigo-400 hover:bg-slate-700' : 'text-indigo-500 hover:bg-indigo-100'}`}
        title="Más información"
      >
        <Info className="w-4 h-4" />
      </button>

      {show && (
        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 text-xs leading-snug rounded-xl shadow-2xl pointer-events-none font-medium text-center z-50 ${darkMode ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900 text-indigo-50 border border-indigo-800'}`}>
          {text}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${darkMode ? 'border-t-slate-700' : 'border-t-indigo-900'}`}></div>
        </div>
      )}
    </div>
  );
});

export default HelperTooltip;
