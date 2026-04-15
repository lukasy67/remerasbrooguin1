import React from "react";
import { formatCurrency } from "../utils/formatters";

const CHIP_STYLES = {
  Premium: "bg-amber-100 text-amber-800 border-amber-300",
  "Semi-Premium": "bg-sky-100 text-sky-800 border-sky-300",
  Estandard: "bg-slate-100 text-slate-700 border-slate-300",
};

function QualityChip({ label }) {
  const style = CHIP_STYLES[label] || CHIP_STYLES.Estandard;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-black ${style}`}>
      {label}
    </span>
  );
}

export default function PricingTable({
  title,
  data,
  columns,
  darkMode = false,
  note = "",
}) {
  const shell = darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white";
  const head = darkMode ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700";
  const row = darkMode ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700";
  const thead = darkMode ? "bg-slate-800/60 text-slate-300" : "bg-slate-50 text-slate-600";
  const caption = darkMode ? "text-slate-300" : "text-neutral-800";
  const noteStyle = darkMode ? "text-slate-400" : "text-neutral-500";

  return (
    <div className="mb-8">
      <h3 className={`mb-4 text-lg font-black ${caption}`}>{title}</h3>

      {Object.entries(data).map(([segment, qualities]) => (
        <div key={segment} className={`mb-5 overflow-hidden rounded-2xl border ${shell}`}>
          <div className={`px-4 py-3 text-center text-xs font-black uppercase tracking-wide ${head}`}>
            {segment}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className={thead}>
                  <th className="p-3 text-left">Calidad</th>
                  {columns.map((column) => (
                    <th key={column.key} className="p-3 text-left">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(qualities).map(([quality, priceMap]) => (
                  <tr key={quality} className={`border-t ${row}`}>
                    <td className="p-3">
                      <QualityChip label={quality} />
                    </td>
                    {columns.map((column) => (
                      <td key={column.key} className="p-3 font-semibold">
                        {formatCurrency(priceMap?.[column.key] ?? 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {note ? <p className={`mt-2 text-xs ${noteStyle}`}>{note}</p> : null}
    </div>
  );
}
