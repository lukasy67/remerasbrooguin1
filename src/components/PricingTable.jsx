import React from "react";
import { formatCurrency } from "../utils/formatters";

const getColor = (calidad) => {
  if (calidad === "Premium") return "bg-yellow-400 text-black";
  if (calidad === "Semi-Premium") return "bg-blue-500 text-white";
  return "bg-gray-400 text-white";
};

export default function PricingTable({ title, data, columns, darkMode }) {
  return (
    <div className="mb-6">
      <h3 className="font-black mb-3">{title}</h3>

      {Object.entries(data).map(([categoria, calidades]) => (
        <div key={categoria} className="mb-4">
          <h4 className="font-bold mb-2">{categoria}</h4>

          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th>Calidad</th>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.entries(calidades).map(([calidad, precios]) => (
                <tr key={calidad}>
                  <td>
                    <span className={`px-2 py-1 rounded ${getColor(calidad)}`}>
                      {calidad}
                    </span>
                  </td>

                  {columns.map((col) => (
                    <td key={col}>{formatCurrency(precios[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <p className="text-xs mt-3 opacity-70">
        Extras: Manga larga +10.000Gs | XXL/XXXL +10.000Gs | Arquero +15.000Gs
      </p>
    </div>
  );
}