import { formatCurrency, formatDate, extractDetails } from './formatters';

export const exportOrdersExcel = ({
  activeOrders,
  summaryBySize,
  totalGarments,
  totalRevenue,
  isGroupAdmin,
  adminGroupFilter,
  displayGroup,
  getOrderFinancials,
}) => {
  const xmlEscape = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const sheetRows = (rows) =>
    rows
      .map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${xmlEscape(cell)}</Data></Cell>`).join('')}</Row>`)
      .join('');

  const pedidosRows = [
    ['Grupo', 'Cliente', 'Telefono', 'Talle', 'Genero', 'Cantidad', 'Estado', 'Pagado', 'Saldo', 'Observaciones', 'Fecha'],
    ...activeOrders.map((o) => {
      const fins = getOrderFinancials(o);
      const { details, rest } = extractDetails(o.observations);
      return [
        o.group_name || 'General',
        o.name,
        o.phone || '-',
        o.size,
        o.gender,
        String(o.quantity),
        o.paymentStatus || 'Pendiente',
        formatCurrency(fins.paid),
        formatCurrency(fins.balance),
        `${details} ${rest}`.trim(),
        formatDate(o.created_at),
      ];
    }),
  ];

  const tallerRows = [
    ['Talle', 'Femenino', 'Masculino', 'Unisex', 'Total'],
    ...summaryBySize.map((item) => [item.size, String(item.fem || 0), String(item.masc || 0), String(item.uni || 0), String(item.total || 0)]),
    [],
    ['Total Remeras', '', '', '', String(totalGarments)],
    ['Total Recaudacion', '', '', '', formatCurrency(totalRevenue)],
  ];

  const finanzasRows = [
    ['Grupo', 'Cliente', 'Total', 'Pagado', 'Saldo'],
    ...activeOrders.map((o) => {
      const fins = getOrderFinancials(o);
      return [o.group_name || 'General', o.name, formatCurrency(fins.total), formatCurrency(fins.paid), formatCurrency(fins.balance)];
    }),
  ];

  const workbook = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Pedidos"><Table>${sheetRows(pedidosRows)}</Table></Worksheet>
  <Worksheet ss:Name="Taller"><Table>${sheetRows(tallerRows)}</Table></Worksheet>
  <Worksheet ss:Name="Finanzas"><Table>${sheetRows(finanzasRows)}</Table></Worksheet>
</Workbook>`;

  const blob = new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Brooguin_Reporte_${isGroupAdmin ? adminGroupFilter : displayGroup}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportOrdersPdf = ({
  activeOrders,
  totalRevenue,
  totalCollected,
  totalGarments,
  isGroupAdmin,
  adminGroupFilter,
  displayGroup,
  getOrderFinancials,
}) => {
  const printWindow = window.open('', '_blank');
  const totalSaldo = totalRevenue - totalCollected;

  const lineRows = activeOrders
    .map((o) => {
      const fins = getOrderFinancials(o);
      const { details, rest } = extractDetails(o.observations);
      const desc = `${details} ${rest}`.trim();
      return `
        <tr>
          <td>${o.group_name || 'General'}</td>
          <td>${o.name}<br/><small>${o.phone || ''}</small></td>
          <td>${o.quantity}</td>
          <td>${o.size}</td>
          <td>${o.paymentStatus || 'Pendiente'}</td>
          <td style="text-align:right">${formatCurrency(fins.total)}</td>
          <td style="text-align:right">${formatCurrency(fins.paid)}</td>
          <td style="text-align:right">${formatCurrency(fins.balance)}</td>
          <td><small>${desc}</small></td>
        </tr>`;
    })
    .join('');

  const html = `
    <html>
      <head>
        <title>Factura / Reporte - ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
          .header { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; border-bottom:3px solid #312e81; padding-bottom:16px; margin-bottom:20px; }
          .brand h1 { margin:0; color:#312e81; font-size:28px; }
          .brand p { margin:4px 0 0; color:#4b5563; }
          .meta { text-align:right; font-size:13px; color:#4b5563; }
          .cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:18px 0 22px; }
          .card { border:1px solid #d1d5db; border-radius:12px; padding:12px; background:#f9fafb; }
          .card .label { font-size:11px; text-transform:uppercase; color:#6b7280; font-weight:bold; }
          .card .value { margin-top:6px; font-size:18px; font-weight:800; color:#111827; }
          table { width:100%; border-collapse: collapse; font-size:12px; }
          th, td { border:1px solid #e5e7eb; padding:8px; vertical-align:top; }
          th { background:#eef2ff; color:#312e81; text-align:left; }
          .totals { margin-top:18px; width:320px; margin-left:auto; border-collapse:collapse; }
          .totals td { border:1px solid #d1d5db; padding:8px; }
          .totals .strong { font-weight:800; background:#eef2ff; }
          .footer { margin-top:22px; font-size:11px; color:#6b7280; border-top:1px dashed #d1d5db; padding-top:12px; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <h1>BROOGUIN SPORT</h1>
            <p>Reporte financiero y comprobante de pedidos</p>
            <p><strong>Vista:</strong> ${isGroupAdmin ? adminGroupFilter : displayGroup}</p>
          </div>
          <div class="meta">
            <div><strong>Fecha:</strong> ${new Date().toLocaleString('es-PY')}</div>
            <div><strong>Documento:</strong> REP-${Date.now()}</div>
          </div>
        </div>

        <div class="cards">
          <div class="card"><div class="label">Total esperado</div><div class="value">${formatCurrency(totalRevenue)}</div></div>
          <div class="card"><div class="label">Total cobrado</div><div class="value">${formatCurrency(totalCollected)}</div></div>
          <div class="card"><div class="label">Saldo pendiente</div><div class="value">${formatCurrency(totalSaldo)}</div></div>
          <div class="card"><div class="label">Prendas</div><div class="value">${totalGarments}</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Cliente</th>
              <th>Cant.</th>
              <th>Talle</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Pagado</th>
              <th>Saldo</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>${lineRows}</tbody>
        </table>

        <table class="totals">
          <tr><td>Total esperado</td><td style="text-align:right">${formatCurrency(totalRevenue)}</td></tr>
          <tr><td>Total cobrado</td><td style="text-align:right">${formatCurrency(totalCollected)}</td></tr>
          <tr><td class="strong">Saldo pendiente</td><td class="strong" style="text-align:right">${formatCurrency(totalSaldo)}</td></tr>
        </table>

        <div class="footer">
          Documento generado automáticamente por la plataforma de Brooguin Sport.
        </div>
        <script>
          window.onload = () => { window.print(); window.onafterprint = () => window.close(); }
        </script>
      </body>
    </html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportCutSheet = ({
  activeOrders,
  isGroupAdmin,
  adminGroupFilter,
  displayGroup,
  displayEstilo,
  totalSocks,
}) => {
  const printWindow = window.open('', '_blank');
  const cortesRemera = {};

  activeOrders.forEach((o) => {
    const tipoManga = o.longSleeve ? 'MANGA LARGA' : 'Manga Corta';
    const key = `Talle ${o.size} - ${o.gender} - ${tipoManga}`;
    cortesRemera[key] = (cortesRemera[key] || 0) + o.quantity;
  });

  const cortesShort = {};
  activeOrders.forEach((o) => {
    if (o.observations?.includes('Short:') && !o.observations?.includes('Short: NO')) {
      const match = o.observations.match(/Short:\s*([^|\]]+)/);
      if (match) cortesShort[match[1].trim()] = (cortesShort[match[1].trim()] || 0) + o.quantity;
    }
  });

  let html = `
    <html><head><title>Hoja de Corte - ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</title><style>body { font-family: Arial, sans-serif; padding: 20px; color: #000; } h1 { font-size: 26px; text-align: center; margin-bottom: 5px; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 10px; } h2 { font-size: 20px; margin-top: 30px; background-color: #e5e5e5; padding: 8px; border-left: 5px solid #000; } .meta { font-size: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; } table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 16px; } th, td { border: 1px solid #000; padding: 12px; text-align: left; } th { background-color: #f2f2f2; font-weight: bold; } .qty { font-size: 22px; font-weight: 900; text-align: center; width: 100px; } .item-desc { font-weight: bold; text-transform: uppercase; } @media print { button { display: none; } body { padding: 0; } }</style></head>
    <body><h1>HOJA DE CORTE DE TALLER: ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</h1><div class="meta"><span><strong>Fecha de impresión:</strong> ${new Date().toLocaleDateString()}</span><span><strong>Estilo:</strong> ${displayEstilo}</span></div>
    <h2>1. CONFECCIÓN DE REMERAS</h2><table><thead><tr><th>Especificación de Corte (Talle - Género - Manga)</th><th class="qty">Cant.</th></tr></thead><tbody>${Object.entries(cortesRemera).sort().map(([desc, cant]) => `<tr><td class="item-desc">${desc}</td><td class="qty">${cant}</td></tr>`).join('')}</tbody></table>
  `;

  if (Object.keys(cortesShort).length > 0) {
    html += `<h2>2. CONFECCIÓN DE SHORTS</h2><table><thead><tr><th>Especificación de Corte (Talle y Diseño)</th><th class="qty">Cant.</th></tr></thead><tbody>${Object.entries(cortesShort).sort().map(([desc, cant]) => `<tr><td class="item-desc">Short Talle ${desc}</td><td class="qty">${cant}</td></tr>`).join('')}</tbody></table>`;
  }

  if (totalSocks > 0) {
    html += `<h2>3. MEDIAS</h2><table><tbody><tr><td class="item-desc">Total de Pares de Medias a preparar</td><td class="qty">${totalSocks}</td></tr></tbody></table>`;
  }

  html += `<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script></body></html>`;
  printWindow.document.write(html);
  printWindow.document.close();
};
