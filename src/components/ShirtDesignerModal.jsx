import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Download, ImagePlus, Palette, RotateCcw, Shirt, X } from "lucide-react";

const DEFAULTS = {
  garmentType: "deportiva",
  torsoColor: "#1d4ed8",
  trimColor: "#0f172a",
  textColor: "#ffffff",
  institutionName: "INSTITUCIÓN",
  playerName: "BROOGUIN",
  playerNumber: "10",
  logoDataUrl: "",
  logoScale: 1,
  logoX: 392,
  logoY: 145,
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function renderDefs() {
  return `
    <defs>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.18"/>
      </filter>
      <linearGradient id="shineFront" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
        <stop offset="55%" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.10" />
      </linearGradient>
      <linearGradient id="shineBack" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.10" />
      </linearGradient>
    </defs>
  `;
}

function renderLogo(cfg) {
  if (!cfg.logoDataUrl) return "";
  const size = 64 * cfg.logoScale;
  return `<image href="${cfg.logoDataUrl}" x="${cfg.logoX}" y="${cfg.logoY}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
}

function buildPiqueFront(cfg) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 820">
  ${renderDefs()}
  <rect width="700" height="820" fill="#f8fafc"/>
  <g filter="url(#softShadow)">
    <path d="M218 145 L278 86 L422 86 L482 145 L562 234 L506 344 L486 696 L214 696 L194 344 L138 234 Z"
      fill="${cfg.torsoColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M278 86 L350 175 L422 86" fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M302 117 L350 177 L398 117" fill="#ffffff" opacity="0.9"/>
    <path d="M138 234 L78 360 L206 398 L238 273 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M562 234 L622 360 L494 398 L462 273 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M236 220 C300 188 400 188 464 220 L470 624 C417 646 283 646 230 624 Z"
      fill="url(#shineFront)" opacity="0.65"/>
    <path d="M235 282 C305 254 395 254 465 282" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="6" stroke-linecap="round"/>
    <path d="M238 355 C302 330 398 330 462 355" fill="none" stroke="#000000" stroke-opacity="0.12" stroke-width="5" stroke-linecap="round"/>
  </g>
  ${renderLogo(cfg)}
  <text x="350" y="128" text-anchor="middle" font-size="26" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.institutionName}</text>
  <text x="350" y="775" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista frontal ilustrativa - no es el diseño final</text>
</svg>`;
}

function buildPiqueBack(cfg) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 820">
  ${renderDefs()}
  <rect width="700" height="820" fill="#f8fafc"/>
  <g filter="url(#softShadow)">
    <path d="M218 145 L278 86 L422 86 L482 145 L562 234 L506 344 L486 696 L214 696 L194 344 L138 234 Z"
      fill="${cfg.torsoColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M138 234 L78 360 L206 398 L238 273 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M562 234 L622 360 L494 398 L462 273 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M236 220 C300 188 400 188 464 220 L470 624 C417 646 283 646 230 624 Z"
      fill="url(#shineBack)" opacity="0.6"/>
    <path d="M256 164 C305 212 395 212 444 164" fill="none" stroke="#000000" stroke-opacity="0.14" stroke-width="8" stroke-linecap="round"/>
  </g>
  <text x="350" y="280" text-anchor="middle" font-size="38" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerName}</text>
  <text x="350" y="500" text-anchor="middle" font-size="170" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerNumber}</text>
  <text x="350" y="775" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista trasera ilustrativa - no es el diseño final</text>
</svg>`;
}

function buildDeportivaFront(cfg) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 820">
  ${renderDefs()}
  <rect width="700" height="820" fill="#f8fafc"/>
  <g filter="url(#softShadow)">
    <path d="M224 146 L286 95 L414 95 L476 146 L556 236 L500 334 L486 694 L214 694 L200 334 L144 236 Z"
      fill="${cfg.torsoColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M144 236 L86 348 L206 390 L242 276 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M556 236 L614 348 L494 390 L458 276 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M288 95 Q350 150 412 95 L440 132 Q350 205 260 132 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="8" stroke-linejoin="round"/>
    <path d="M226 235 C305 208 395 208 474 235 L470 616 C414 642 286 642 230 616 Z"
      fill="url(#shineFront)" opacity="0.7"/>
    <path d="M223 275 L477 275" stroke="#ffffff" stroke-opacity="0.16" stroke-width="5"/>
    <path d="M238 366 C296 332 404 332 462 366" fill="none" stroke="#000000" stroke-opacity="0.12" stroke-width="5" stroke-linecap="round"/>
  </g>
  ${renderLogo(cfg)}
  <text x="350" y="150" text-anchor="middle" font-size="26" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.institutionName}</text>
  <text x="350" y="775" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista frontal ilustrativa - no es el diseño final</text>
</svg>`;
}

function buildDeportivaBack(cfg) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 820">
  ${renderDefs()}
  <rect width="700" height="820" fill="#f8fafc"/>
  <g filter="url(#softShadow)">
    <path d="M224 146 L286 95 L414 95 L476 146 L556 236 L500 334 L486 694 L214 694 L200 334 L144 236 Z"
      fill="${cfg.torsoColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M144 236 L86 348 L206 390 L242 276 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M556 236 L614 348 L494 390 L458 276 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M226 235 C305 208 395 208 474 235 L470 616 C414 642 286 642 230 616 Z"
      fill="url(#shineBack)" opacity="0.65"/>
  </g>
  <text x="350" y="285" text-anchor="middle" font-size="40" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerName}</text>
  <text x="350" y="505" text-anchor="middle" font-size="175" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerNumber}</text>
  <text x="350" y="775" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista trasera ilustrativa - no es el diseño final</text>
</svg>`;
}

function buildCamisillaFront(cfg) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 820">
  ${renderDefs()}
  <rect width="700" height="820" fill="#f8fafc"/>
  <g filter="url(#softShadow)">
    <path d="M236 152 L286 98 L414 98 L464 152 L520 250 L478 694 L222 694 L180 250 Z"
      fill="${cfg.torsoColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M236 152 C240 220 183 241 180 250 L228 280 C244 242 265 218 286 205" fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="8" stroke-linejoin="round"/>
    <path d="M464 152 C460 220 517 241 520 250 L472 280 C456 242 435 218 414 205" fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="8" stroke-linejoin="round"/>
    <path d="M286 98 Q350 155 414 98 L438 127 Q350 192 262 127 Z"
      fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="8" stroke-linejoin="round"/>
    <path d="M230 248 C302 222 398 222 470 248 L468 618 C412 642 288 642 232 618 Z"
      fill="url(#shineFront)" opacity="0.68"/>
  </g>
  ${renderLogo(cfg)}
  <text x="350" y="145" text-anchor="middle" font-size="26" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.institutionName}</text>
  <text x="350" y="775" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista frontal ilustrativa - no es el diseño final</text>
</svg>`;
}

function buildCamisillaBack(cfg) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 820">
  ${renderDefs()}
  <rect width="700" height="820" fill="#f8fafc"/>
  <g filter="url(#softShadow)">
    <path d="M236 152 L286 98 L414 98 L464 152 L520 250 L478 694 L222 694 L180 250 Z"
      fill="${cfg.torsoColor}" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M236 152 C240 220 183 241 180 250 L228 280 C244 242 265 218 286 205" fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="8" stroke-linejoin="round"/>
    <path d="M464 152 C460 220 517 241 520 250 L472 280 C456 242 435 218 414 205" fill="${cfg.trimColor}" stroke="#0f172a" stroke-width="8" stroke-linejoin="round"/>
    <path d="M230 248 C302 222 398 222 470 248 L468 618 C412 642 288 642 232 618 Z"
      fill="url(#shineBack)" opacity="0.62"/>
  </g>
  <text x="350" y="290" text-anchor="middle" font-size="40" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerName}</text>
  <text x="350" y="505" text-anchor="middle" font-size="175" font-weight="900" fill="${cfg.textColor}" font-family="Arial">${cfg.playerNumber}</text>
  <text x="350" y="775" text-anchor="middle" font-size="18" font-weight="700" fill="#475569" font-family="Arial">Vista trasera ilustrativa - no es el diseño final</text>
</svg>`;
}

function buildSvg(cfg, side) {
  if (cfg.garmentType === "pique") return side === "front" ? buildPiqueFront(cfg) : buildPiqueBack(cfg);
  if (cfg.garmentType === "camisilla") return side === "front" ? buildCamisillaFront(cfg) : buildCamisillaBack(cfg);
  return side === "front" ? buildDeportivaFront(cfg) : buildDeportivaBack(cfg);
}

async function svgToPngDataUrl(svgText) {
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = svgToDataUri(svgText);
  });
  const canvas = document.createElement("canvas");
  canvas.width = 700;
  canvas.height = 820;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 700, 820);
  return canvas.toDataURL("image/png");
}

async function buildCombinedImage(frontSvg, backSvg) {
  const [frontPng, backPng] = await Promise.all([svgToPngDataUrl(frontSvg), svgToPngDataUrl(backSvg)]);
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
  canvas.width = 1500;
  canvas.height = 940;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "700 34px Arial";
  ctx.fillStyle = "#0f172a";
  ctx.fillText("Diseño ilustrativo de remera", 46, 52);
  ctx.font = "500 19px Arial";
  ctx.fillStyle = "#475569";
  ctx.fillText("Referencia visual preliminar - no corresponde al diseño final de producción", 46, 82);

  ctx.drawImage(frontImg, 45, 100, 650, 760);
  ctx.drawImage(backImg, 805, 100, 650, 760);

  ctx.font = "700 20px Arial";
  ctx.fillStyle = "#1e293b";
  ctx.fillText("Vista frontal", 290, 905);
  ctx.fillText("Vista trasera", 1055, 905);

  return canvas.toDataURL("image/png");
}

function downloadUri(uri, filename) {
  const a = document.createElement("a");
  a.href = uri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function ShirtDesignerModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(DEFAULTS);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfig(DEFAULTS);
      setConfirmClose(false);
    }
  }, [isOpen]);

  const frontSvg = useMemo(() => buildSvg(config, "front"), [config]);
  const backSvg = useMemo(() => buildSvg(config, "back"), [config]);

  const isDirty = useMemo(() => JSON.stringify(config) !== JSON.stringify(DEFAULTS), [config]);

  async function handleDownload() {
    const dataUrl = await buildCombinedImage(frontSvg, backSvg);
    downloadUri(dataUrl, `brooguin-${config.garmentType}-ilustrativo.png`);
  }

  async function handleWhatsApp() {
    const dataUrl = await buildCombinedImage(frontSvg, backSvg);
    downloadUri(dataUrl, `brooguin-${config.garmentType}-ilustrativo.png`);
    const text =
      `Hola, quiero esta remera.%0A` +
      `Tipo: ${config.garmentType}%0A` +
      `Institución: ${encodeURIComponent(config.institutionName)}%0A` +
      `Nombre: ${encodeURIComponent(config.playerName)}%0A` +
      `Número: ${encodeURIComponent(config.playerNumber)}%0A` +
      `Acabo de descargar el diseño ilustrativo para enviarlo.`;
    window.open(`https://wa.me/595984948834?text=${text}`, "_blank");
  }

  async function handleUploadLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Sube un logo PNG, JPG o WEBP.");
      event.target.value = "";
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setConfig((prev) => ({ ...prev, logoDataUrl: dataUrl }));
    event.target.value = "";
  }

  function requestClose() {
    if (isDirty) {
      setConfirmClose(true);
      return;
    }
    onClose?.();
  }

  function forceClose() {
    setConfig(DEFAULTS);
    setConfirmClose(false);
    onClose?.();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="mx-auto flex h-full max-w-7xl flex-col p-3 sm:p-5">
        <div className="flex items-center justify-between rounded-t-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
          <div>
            <h2 className="text-lg font-black">Diseñador PRO de remeras</h2>
            <p className="text-xs text-slate-300">
              Ilustración orientativa. El diseño final puede variar en producción.
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-full bg-slate-800 p-2 text-slate-200 transition hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-hidden rounded-b-2xl border-x border-b border-slate-700 bg-slate-950 p-3 lg:grid-cols-[360px,1fr]">
          <aside className="overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 text-white">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-indigo-300">
              <Shirt className="h-4 w-4" />
              Editor ilustrativo
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

              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-300">
                  <Palette className="h-4 w-4" /> Colores
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Color torso</span>
                    <input
                      type="color"
                      value={config.torsoColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, torsoColor: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-slate-600 bg-transparent"
                    />
                  </label>
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Color mangas / cuello</span>
                    <input
                      type="color"
                      value={config.trimColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, trimColor: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-slate-600 bg-transparent"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Institución</label>
                  <input
                    value={config.institutionName}
                    onChange={(e) => setConfig((prev) => ({ ...prev, institutionName: e.target.value.slice(0, 18).toUpperCase() }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Texto</label>
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                    className="h-[42px] w-full rounded-xl border border-slate-700 bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Nombre espalda</label>
                  <input
                    value={config.playerName}
                    onChange={(e) => setConfig((prev) => ({ ...prev, playerName: e.target.value.slice(0, 14).toUpperCase() }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-300">Dorsal</label>
                  <input
                    value={config.playerNumber}
                    onChange={(e) => setConfig((prev) => ({ ...prev, playerNumber: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-300">
                  <ImagePlus className="h-4 w-4" /> Logo PNG / JPG / WEBP
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUploadLogo}
                  className="mb-3 block w-full text-xs text-slate-300"
                />
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <label>
                    <span className="mb-1 block text-slate-300">Tamaño logo</span>
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.1"
                      value={config.logoScale}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoScale: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </label>
                  <label>
                    <span className="mb-1 block text-slate-300">Posición horizontal</span>
                    <input
                      type="range"
                      min="350"
                      max="450"
                      step="1"
                      value={config.logoX}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoX: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </label>
                  <label>
                    <span className="mb-1 block text-slate-300">Posición vertical</span>
                    <input
                      type="range"
                      min="110"
                      max="210"
                      step="1"
                      value={config.logoY}
                      onChange={(e) => setConfig((prev) => ({ ...prev, logoY: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  El logo se usa solo temporalmente en tu navegador y se pierde al cerrar.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button type="button" onClick={handleWhatsApp} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700">
                  Quiero esta remera
                </button>
                <button type="button" onClick={handleDownload} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700">
                  Compartir diseño
                </button>
                <button type="button" onClick={() => setConfig(DEFAULTS)} className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-700">
                  <span className="inline-flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Reiniciar</span>
                </button>
                <button type="button" onClick={handleDownload} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                  <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Descargar PNG</span>
                </button>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                <div className="mb-1 flex items-center gap-2 font-black uppercase">
                  <AlertTriangle className="h-4 w-4" /> Aviso
                </div>
                El diseñador es ilustrativo. Solo se muestran dos colores principales, proporciones aproximadas y ubicación orientativa del logo.
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between text-white">
              <div>
                <h3 className="text-base font-black">{garmentTitle(config.garmentType)}</h3>
                <p className="text-xs text-slate-400">Adelante y atrás con silueta mejorada</p>
              </div>
            </div>

            <div className="grid h-full gap-4 lg:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-950 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <span className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">Adelante</span>
                <img alt="Vista frontal" src={svgToDataUri(frontSvg)} className="mx-auto h-full max-h-[560px] w-full object-contain" />
              </div>
              <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-950 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <span className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">Atrás</span>
                <img alt="Vista trasera" src={svgToDataUri(backSvg)} className="mx-auto h-full max-h-[560px] w-full object-contain" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {confirmClose && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/85 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
            <h3 className="text-lg font-black">¿Cerrar el diseñador?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Si sales ahora, se perderá todo el diseño y el logo temporal cargado.
            </p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => setConfirmClose(false)} className="flex-1 rounded-xl bg-slate-800 px-4 py-3 font-bold text-slate-200 hover:bg-slate-700">
                Seguir editando
              </button>
              <button type="button" onClick={() => { setConfig(DEFAULTS); setConfirmClose(false); onClose?.(); }} className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white hover:bg-rose-700">
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function garmentTitle(type) {
  if (type === "pique") return "Piqué con cuello";
  if (type === "camisilla") return "Camisilla";
  return "Remera deportiva";
}
