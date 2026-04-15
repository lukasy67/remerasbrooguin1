import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, ImagePlus, Palette, RotateCcw, Shirt, Share2, X } from "lucide-react";

const DEFAULTS = {
  garmentType: "deportiva",
  view: "front",
  torsoPrimary: "#1d4ed8",
  torsoSecondary: "#60a5fa",
  sleeveColor: "#0f172a",
  collarColor: "#0f172a",
  textColor: "#ffffff",
  playerName: "BROOGUIN",
  playerNumber: "10",
  institutionName: "Institución",
  logoDataUrl: "",
  logoScale: 1,
  logoX: 242,
  logoY: 124,
  logoWidth: 58,
  logoHeight: 58,
};

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function encodeSvg(svgText) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
}

function PiqueFront({ cfg }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="#f8fafc"/>
    <path d="M170 110 L220 55 L380 55 L430 110 L500 180 L452 250 L452 620 L148 620 L148 250 L100 180 Z" fill="${cfg.torsoPrimary}" stroke="#0f172a" stroke-width="8"/>
    <path d="M220 55 L300 150 L380 55" fill="${cfg.collarColor}" stroke="#0f172a" stroke-width="8"/>
    <path d="M235 95 L300 168 L365 95" fill="#ffffff" opacity="0.9"/>
    <path d="M100 180 L50 290 L145 325 L180 230 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/>
    <path d="M500 180 L550 290 L455 325 L420 230 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/>
    <rect x="180" y="205" width="240" height="350" rx="20" fill="${cfg.torsoSecondary}" opacity="0.18"/>
    <text x="300" y="95" text-anchor="middle" font-size="28" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.institutionName}</text>
    ${
      cfg.logoDataUrl
        ? `<image href="${cfg.logoDataUrl}" x="${cfg.logoX}" y="${cfg.logoY}" width="${cfg.logoWidth * cfg.logoScale}" height="${cfg.logoHeight * cfg.logoScale}" preserveAspectRatio="xMidYMid meet"/>`
        : ""
    }
    <text x="300" y="660" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista frontal orientativa - no es el diseño final</text>
  </svg>`;
}

function PiqueBack({ cfg }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="#f8fafc"/>
    <path d="M170 110 L220 55 L380 55 L430 110 L500 180 L452 250 L452 620 L148 620 L148 250 L100 180 Z" fill="${cfg.torsoPrimary}" stroke="#0f172a" stroke-width="8"/>
    <path d="M100 180 L50 290 L145 325 L180 230 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/>
    <path d="M500 180 L550 290 L455 325 L420 230 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/>
    <rect x="180" y="205" width="240" height="350" rx="20" fill="${cfg.torsoSecondary}" opacity="0.18"/>
    <text x="300" y="250" text-anchor="middle" font-size="42" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerName || "NOMBRE"}</text>
    <text x="300" y="430" text-anchor="middle" font-size="150" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerNumber || "10"}</text>
    <text x="300" y="660" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista trasera orientativa - no es el diseño final</text>
  </svg>`;
}

function SportsFront({ cfg, sleeveless = false }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="#f8fafc"/>
    <path d="M180 95 L230 60 L370 60 L420 95 L490 185 L448 620 L152 620 L110 185 Z" fill="${cfg.torsoPrimary}" stroke="#0f172a" stroke-width="8"/>
    ${sleeveless
      ? `<path d="M180 95 L120 215 L175 245 L208 132 Z" fill="${cfg.sleeveColor}" opacity="0.15"/><path d="M420 95 L480 215 L425 245 L392 132 Z" fill="${cfg.sleeveColor}" opacity="0.15"/>`
      : `<path d="M110 185 L55 300 L160 335 L195 220 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/><path d="M490 185 L545 300 L440 335 L405 220 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/>`
    }
    <path d="M230 60 Q300 120 370 60" fill="${cfg.collarColor}" stroke="#0f172a" stroke-width="8"/>
    <path d="M180 230 C240 190, 360 190, 420 230" fill="${cfg.torsoSecondary}" opacity="0.28"/>
    <path d="M170 340 C250 300, 350 300, 430 340" fill="${cfg.torsoSecondary}" opacity="0.16"/>
    ${
      cfg.logoDataUrl
        ? `<image href="${cfg.logoDataUrl}" x="${cfg.logoX}" y="${cfg.logoY}" width="${cfg.logoWidth * cfg.logoScale}" height="${cfg.logoHeight * cfg.logoScale}" preserveAspectRatio="xMidYMid meet"/>`
        : ""
    }
    <text x="300" y="100" text-anchor="middle" font-size="28" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.institutionName}</text>
    <text x="300" y="660" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista frontal orientativa - no es el diseño final</text>
  </svg>`;
}

function SportsBack({ cfg, sleeveless = false }) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="#f8fafc"/>
    <path d="M180 95 L230 60 L370 60 L420 95 L490 185 L448 620 L152 620 L110 185 Z" fill="${cfg.torsoPrimary}" stroke="#0f172a" stroke-width="8"/>
    ${!sleeveless
      ? `<path d="M110 185 L55 300 L160 335 L195 220 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/><path d="M490 185 L545 300 L440 335 L405 220 Z" fill="${cfg.sleeveColor}" stroke="#0f172a" stroke-width="8"/>`
      : ""
    }
    <path d="M180 230 C240 190, 360 190, 420 230" fill="${cfg.torsoSecondary}" opacity="0.28"/>
    <path d="M170 340 C250 300, 350 300, 430 340" fill="${cfg.torsoSecondary}" opacity="0.16"/>
    <text x="300" y="230" text-anchor="middle" font-size="42" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerName || "NOMBRE"}</text>
    <text x="300" y="430" text-anchor="middle" font-size="150" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerNumber || "10"}</text>
    <text x="300" y="660" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista trasera orientativa - no es el diseño final</text>
  </svg>`;
}

function buildSvg(config) {
  if (config.garmentType === "pique") {
    return config.view === "front" ? PiqueFront({ cfg: config }) : PiqueBack({ cfg: config });
  }
  if (config.garmentType === "camisilla") {
    return config.view === "front"
      ? SportsFront({ cfg: config, sleeveless: true })
      : SportsBack({ cfg: config, sleeveless: true });
  }
  return config.view === "front"
    ? SportsFront({ cfg: config, sleeveless: false })
    : SportsBack({ cfg: config, sleeveless: false });
}

function downloadUri(uri, filename) {
  const a = document.createElement("a");
  a.href = uri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function svgToImageDataUrl(svgText) {
  const url = encodeSvg(svgText);
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 600, 700);
  return canvas.toDataURL("image/png");
}

async function buildCombinedDesign(frontSvg, backSvg) {
  const [frontPng, backPng] = await Promise.all([svgToImageDataUrl(frontSvg), svgToImageDataUrl(backSvg)]);
  const [frontImg, backImg] = await Promise.all(
    [frontPng, backPng].map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        })
    )
  );

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 760;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "700 30px Arial";
  ctx.fillStyle = "#0f172a";
  ctx.fillText("Diseño orientativo de remera", 40, 48);
  ctx.font = "500 18px Arial";
  ctx.fillStyle = "#475569";
  ctx.fillText("Idea visual preliminar - no corresponde al diseño final de producción", 40, 78);

  ctx.drawImage(frontImg, 40, 100, 560, 650);
  ctx.drawImage(backImg, 680, 100, 560, 650);
  ctx.font = "700 20px Arial";
  ctx.fillStyle = "#1e293b";
  ctx.fillText("Vista frontal", 250, 730);
  ctx.fillText("Vista trasera", 895, 730);

  return canvas.toDataURL("image/png");
}

export default function ShirtDesignerModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(DEFAULTS);
  const [closeWarning, setCloseWarning] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setConfig(DEFAULTS);
      setCloseWarning(false);
    }
  }, [isOpen]);

  const frontConfig = useMemo(() => ({ ...config, view: "front" }), [config]);
  const backConfig = useMemo(() => ({ ...config, view: "back" }), [config]);

  const frontSvg = useMemo(() => buildSvg(frontConfig), [frontConfig]);
  const backSvg = useMemo(() => buildSvg(backConfig), [backConfig]);
  const currentSvg = useMemo(() => buildSvg(config), [config]);

  const dirty = useMemo(() => JSON.stringify(config) !== JSON.stringify(DEFAULTS), [config]);

  const requestClose = () => {
    if (dirty) {
      setCloseWarning(true);
      return;
    }
    onClose?.();
  };

  const forceClose = () => {
    setConfig(DEFAULTS);
    setCloseWarning(false);
    onClose?.();
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await toDataUrl(file);
    setConfig((prev) => ({ ...prev, logoDataUrl: dataUrl }));
    event.target.value = "";
  };

  const resetDesigner = () => {
    setConfig(DEFAULTS);
  };

  const downloadDesign = async () => {
    const dataUrl = await buildCombinedDesign(frontSvg, backSvg);
    downloadUri(dataUrl, `brooguin-diseno-${config.garmentType}.png`);
  };

  const handleWhatsApp = async () => {
    const whatsappText =
      `Hola, quiero esta remera.%0A` +
      `Tipo: ${config.garmentType}%0A` +
      `Nombre: ${encodeURIComponent(config.playerName || "Sin nombre")}%0A` +
      `Número: ${encodeURIComponent(config.playerNumber || "Sin número")}%0A` +
      `*Adjunto visual orientativo descargado por el cliente.*`;
    const dataUrl = await buildCombinedDesign(frontSvg, backSvg);
    downloadUri(dataUrl, `brooguin-diseno-${config.garmentType}.png`);
    window.open(`https://wa.me/595984948834?text=${whatsappText}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl flex-col p-3 sm:p-6">
        <div className="flex items-center justify-between rounded-t-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
          <div>
            <h2 className="text-lg font-black">Creador de remeras</h2>
            <p className="text-xs text-slate-300">
              Herramienta orientativa. El resultado no representa el diseño final de producción.
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-full bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-hidden rounded-b-2xl border-x border-b border-slate-700 bg-slate-950 p-3 lg:grid-cols-[370px,1fr]">
          <aside className="overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 text-white">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-indigo-300">
              <Shirt className="h-4 w-4" />
              Diseñador interactivo
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Tipo de prenda</label>
                <select
                  value={config.garmentType}
                  onChange={(e) => setConfig((prev) => ({ ...prev, garmentType: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value="pique">Piqué con cuello</option>
                  <option value="deportiva">Remera deportiva</option>
                  <option value="camisilla">Camisilla</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Vista</label>
                <div className="grid grid-cols-2 gap-2">
                  {["front", "back"].map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, view: side }))}
                      className={`rounded-xl px-3 py-2 text-sm font-bold ${
                        config.view === side ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      {side === "front" ? "Adelante" : "Atrás"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Nombre institución</label>
                <input
                  value={config.institutionName}
                  onChange={(e) => setConfig((prev) => ({ ...prev, institutionName: e.target.value.slice(0, 18) }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Nombre jugador</label>
                  <input
                    value={config.playerName}
                    onChange={(e) => setConfig((prev) => ({ ...prev, playerName: e.target.value.slice(0, 14) }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Número</label>
                  <input
                    value={config.playerNumber}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, playerNumber: e.target.value.replace(/\D/g, "").slice(0, 2) }))
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-300">
                  <Palette className="h-4 w-4" /> Colores
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Torso principal</span>
                    <input type="color" value={config.torsoPrimary} onChange={(e) => setConfig((prev) => ({ ...prev, torsoPrimary: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-600 bg-transparent" />
                  </label>
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Torso secundario</span>
                    <input type="color" value={config.torsoSecondary} onChange={(e) => setConfig((prev) => ({ ...prev, torsoSecondary: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-600 bg-transparent" />
                  </label>
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Mangas</span>
                    <input type="color" value={config.sleeveColor} onChange={(e) => setConfig((prev) => ({ ...prev, sleeveColor: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-600 bg-transparent" />
                  </label>
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Cuello</span>
                    <input type="color" value={config.collarColor} onChange={(e) => setConfig((prev) => ({ ...prev, collarColor: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-600 bg-transparent" />
                  </label>
                  <label className="col-span-2 text-xs">
                    <span className="mb-1 block text-slate-300">Texto</span>
                    <input type="color" value={config.textColor} onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-600 bg-transparent" />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-300">
                  <ImagePlus className="h-4 w-4" /> Logo temporal
                </div>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} className="mb-3 block w-full text-xs text-slate-300" />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label>
                    <span className="mb-1 block text-slate-300">Escala</span>
                    <input type="range" min="0.5" max="2" step="0.1" value={config.logoScale} onChange={(e) => setConfig((prev) => ({ ...prev, logoScale: Number(e.target.value) }))} className="w-full" />
                  </label>
                  <label>
                    <span className="mb-1 block text-slate-300">Posición X</span>
                    <input type="range" min="180" max="300" step="1" value={config.logoX} onChange={(e) => setConfig((prev) => ({ ...prev, logoX: Number(e.target.value) }))} className="w-full" />
                  </label>
                  <label className="col-span-2">
                    <span className="mb-1 block text-slate-300">Posición Y</span>
                    <input type="range" min="90" max="180" step="1" value={config.logoY} onChange={(e) => setConfig((prev) => ({ ...prev, logoY: Number(e.target.value) }))} className="w-full" />
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  El logo se usa solo temporalmente en tu navegador. Al cerrar este panel se pierde el diseño.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button type="button" onClick={handleWhatsApp} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">
                  Quiero esta remera
                </button>
                <button type="button" onClick={downloadDesign} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-700">
                  Compartir diseño
                </button>
                <button type="button" onClick={resetDesigner} className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700">
                  <span className="inline-flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Reiniciar</span>
                </button>
                <button type="button" onClick={downloadDesign} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800">
                  <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Descargar PNG</span>
                </button>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                <div className="mb-1 flex items-center gap-2 font-black uppercase">
                  <AlertTriangle className="h-4 w-4" /> Aviso importante
                </div>
                Esta herramienta muestra una idea aproximada. Los colores, proporciones, cortes y terminaciones pueden variar en el diseño final.
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between text-white">
              <div>
                <h3 className="text-base font-black">Vista previa</h3>
                <p className="text-xs text-slate-400">Adelante y atrás del diseño orientativo</p>
              </div>
            </div>
            <div className="grid h-full gap-4 lg:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-950 p-3">
                <span className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">Adelante</span>
                <img alt="Vista frontal" src={encodeSvg(frontSvg)} className="mx-auto h-full max-h-[560px] w-full object-contain" />
              </div>
              <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-950 p-3">
                <span className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">Atrás</span>
                <img alt="Vista trasera" src={encodeSvg(backSvg)} className="mx-auto h-full max-h-[560px] w-full object-contain" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {closeWarning && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/85 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
            <h3 className="text-lg font-black">¿Cerrar el creador?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Si sales ahora, se perderá todo el diseño, incluyendo el logo temporal cargado.
            </p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => setCloseWarning(false)} className="flex-1 rounded-xl bg-slate-800 px-4 py-3 font-bold text-slate-200 hover:bg-slate-700">
                Seguir editando
              </button>
              <button type="button" onClick={forceClose} className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white hover:bg-rose-700">
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
