import React, { useState, useMemo, useEffect } from 'react';
import { Shirt, PlusCircle, ClipboardList, Trash2, User, Hash, Phone, Loader2, Layers, Lock, Unlock, X, Eye, EyeOff, Download, FileText, Info, RefreshCw, AlertCircle, Search, CheckCircle2, AlignLeft, Edit } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
// REEMPLAZA ESTO CON TUS DATOS REALES DE SUPABASE
const supabaseUrl = 'https://waoylkoopzluyhuuhbbc.supabase.co'; 
const supabaseKey = 'sb_publishable_JYC_sxawUbpXIYycV7HO3A_kiUiFyoy'; 

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.warn("Supabase no configurado aún o hay un error en las llaves.");
}
// ==========================================

const SIZES_FM = ['P', 'M', 'G'];
const SIZES_U = ['GG', '2XG', '3XG'];
const SIZES = [...SIZES_FM, ...SIZES_U];
const GENDERS = ['Femenino', 'Masculino', 'Unisex'];
const COSTO_REMERA = 95000;
const COSTO_MANGA_LARGA = 10000;

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Administrador
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Contraseña del administrador
  const ADMIN_SECRET = 'brooguin2025';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    size: 'M',
    gender: 'Femenino',
    quantity: 1,
    longSleeve: false,
    observations: ''
  });

  // Cargar pedidos al inicio
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    if (!supabase || supabaseUrl === 'https://TU_URL_AQUI.supabase.co') {
       console.warn("Configura tus llaves de Supabase");
       setLoading(false);
       return;
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error cargando pedidos:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    let sanitizedValue = inputValue;

    // Validaciones
    if (type !== 'checkbox') {
      if (name === 'name') {
        sanitizedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
      } else if (name === 'phone') {
        sanitizedValue = value.replace(/[^0-9]/g, '');
      }
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: sanitizedValue };
      if (name === 'size') {
        if (SIZES_U.includes(value)) {
          newData.gender = 'Unisex';
        } else if (newData.gender === 'Unisex') {
          newData.gender = 'Femenino';
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || formData.quantity < 1) return;

    if (!supabase || supabaseUrl === 'https://TU_URL_AQUI.supabase.co') {
        alert("Por favor, configura tus llaves de Supabase en el código primero.");
        return;
    }

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      size: formData.size,
      gender: formData.gender,
      quantity: parseInt(formData.quantity, 10),
      longSleeve: formData.longSleeve,
      observations: formData.observations
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('orders').update(orderData).eq('id', editingId);
        if (error) throw error;
        setSuccessMessage('¡Pedido Actualizado!');
        setEditingId(null);
      } else {
        const newOrder = {
          ...orderData,
          paymentStatus: 'Pendiente',
          deleted: false
        };
        const { error } = await supabase.from('orders').insert([newOrder]);
        if (error) throw error;
        setSuccessMessage('¡Pedido Registrado!');
      }
      
      fetchOrders(); 
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setFormData({ name: '', phone: '', size: 'M', gender: 'Femenino', quantity: 1, longSleeve: false, observations: '' });
    } catch (error) {
      console.error("Error guardando pedido:", error);
      alert("Hubo un error al procesar tu solicitud.");
    }
  };

  const handleEditClick = (order) => {
    setFormData({
      name: order.name,
      phone: order.phone || '',
      size: order.size,
      gender: order.gender,
      quantity: order.quantity,
      longSleeve: order.longSleeve || false,
      observations: order.observations || ''
    });
    setEditingId(order.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', size: 'M', gender: 'Femenino', quantity: 1, longSleeve: false, observations: '' });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    await supabase.from('orders').update({ deleted: true }).eq('id', id);
    fetchOrders();
  };

  const handleRestore = async (id) => {
    if (!isAdmin) return;
    await supabase.from('orders').update({ deleted: false }).eq('id', id);
    fetchOrders();
  };

  const handlePermanentDelete = async (id) => {
    if (!isAdmin) return;
    await supabase.from('orders').delete().eq('id', id);
    fetchOrders();
  };

  const handleUpdatePayment = async (id, newStatus) => {
    if (!isAdmin) return;
    await supabase.from('orders').update({ paymentStatus: newStatus }).eq('id', id);
    fetchOrders();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-PY', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleExportCSV = () => {
    const activeOrders = orders.filter(o => !o.deleted);
    let csv = "\uFEFF"; 
    csv += "RESUMEN PARA CONFECCION\n";
    csv += "Talle;Femenino;Masculino;Unisex;Total\n";
    summaryBySize.forEach(item => {
      if (item.type === 'FM') {
        csv += `${item.size};${item.fem};${item.masc};-;${item.total}\n`;
      } else {
        csv += `${item.size};-;-;${item.uni};${item.total}\n`;
      }
    });
    csv += `\nTOTAL GENERAL;;;; ${totalGarments} prendas\n`;
    csv += `TOTAL A RECAUDAR;;;; ${new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs\n\n`;

    csv += "LISTA DE PEDIDOS\n";
    csv += "Cliente;Telefono;Talle;Genero;Manga;Cantidad;Estado de Pago;Observaciones;Fecha y Hora\n";
    activeOrders.forEach(o => {
      csv += `"${o.name}";"${o.phone || '-'}";"${o.size}";"${o.gender}";"${o.longSleeve ? 'Larga' : 'Corta'}";${o.quantity};"${o.paymentStatus || 'Pendiente'}";"${o.observations || ''}";"${formatDate(o.created_at)}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Pedidos_Brooguin.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const activeOrders = orders.filter(o => !o.deleted);
    const printWindow = window.open('', '_blank');
    
    let html = `
      <html>
        <head>
          <title>Pedidos Brooguin - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #312e81; font-size: 24px; text-align: center; margin-bottom: 5px; }
            p.date { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
            h2 { color: #4338ca; font-size: 18px; margin-top: 30px; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; color: #374151; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .summary-total { background-color: #ecfdf5; font-weight: bold; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>BROOGUIN SPORT - Reporte de Pedidos</h1>
          <p class="date">Generado el: ${new Date().toLocaleString()}</p>
          
          <h2>Resumen para Confección</h2>
          <table>
            <thead>
              <tr>
                <th>Talle</th>
                <th class="text-center">Femenino</th>
                <th class="text-center">Masculino</th>
                <th class="text-center">Unisex</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    summaryBySize.forEach(item => {
      if (item.total > 0) {
        html += `<tr>
          <td class="font-bold">${item.size}</td>
          <td class="text-center">${item.type === 'FM' ? item.fem || '-' : '-'}</td>
          <td class="text-center">${item.type === 'FM' ? item.masc || '-' : '-'}</td>
          <td class="text-center">${item.type === 'U' ? item.uni || '-' : '-'}</td>
          <td class="text-right font-bold">${item.total}</td>
        </tr>`;
      }
    });

    html += `
            </tbody>
            <tfoot>
              <tr class="summary-total">
                <td colspan="4" class="text-right">Total General:</td>
                <td class="text-right">${totalGarments} prendas</td>
              </tr>
              <tr class="summary-total">
                <td colspan="4" class="text-right">De las cuales Manga Larga:</td>
                <td class="text-right">${totalLongSleeve} prendas</td>
              </tr>
              <tr class="summary-total">
                <td colspan="4" class="text-right">Total a Recaudar:</td>
                <td class="text-right">${new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs</td>
              </tr>
            </tfoot>
          </table>

          <h2>Lista de Pedidos Detallada</h2>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Talle</th>
                <th>Género</th>
                <th>Manga</th>
                <th>Cant.</th>
                <th>Estado</th>
                <th>Obs.</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
    `;

    activeOrders.forEach(o => {
      html += `
        <tr>
          <td>${o.name}</td>
          <td>${o.phone || '-'}</td>
          <td>${o.size}</td>
          <td>${o.gender}</td>
          <td>${o.longSleeve ? 'Larga' : 'Corta'}</td>
          <td>${o.quantity}</td>
          <td>${o.paymentStatus || 'Pendiente'}</td>
          <td>${o.observations || '-'}</td>
          <td>${formatDate(o.created_at)}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <script>
            window.onload = () => { window.print(); window.onafterprint = () => window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleExportCompactPDF = () => {
    const printWindow = window.open('', '_blank');
    let html = `
      <html>
        <head>
          <title>Resumen Compacto - Brooguin</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 400px; margin: auto; }
            h1 { color: #312e81; font-size: 18px; text-align: center; margin-bottom: 5px; }
            p.date { text-align: center; color: #666; margin-bottom: 20px; font-size: 12px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
            .badge { border: 1px solid #c7d2fe; border-radius: 6px; overflow: hidden; display: flex; font-size: 14px; text-align: center; }
            .badge-size { background-color: #e0e7ff; color: #3730a3; font-weight: bold; padding: 5px; width: 60%; }
            .badge-qty { color: #4f46e5; font-weight: bold; padding: 5px; width: 40%; }
            .footer-row { display: flex; justify-content: space-between; border-top: 1px solid #e0e7ff; padding-top: 10px; font-size: 14px; margin-top: 5px;}
            .total-row { font-size: 16px; font-weight: bold; margin-top: 10px;}
          </style>
        </head>
        <body>
          <h1>Resumen Compacto de Pedidos</h1>
          <p class="date">Generado el: ${new Date().toLocaleString()}</p>
          <div class="grid">
    `;
    compactSummaryItems.forEach(item => {
      const badgeSizeStyle = item.isLong ? "background-color: #f3e8ff; color: #6b21a8;" : "background-color: #e0e7ff; color: #3730a3;";
      const badgeQtyStyle = item.isLong ? "color: #7e22ce;" : "color: #4f46e5;";
      const borderStyle = item.isLong ? "border-color: #d8b4fe;" : "";
      let label = item.size;
      if (item.gender !== 'Uni') label += ` ${item.gender}`;
      if (item.isLong) label += ` (Larga)`;
      html += `
        <div class="badge" style="${borderStyle}">
          <div class="badge-size" style="${badgeSizeStyle}">${label}</div>
          <div class="badge-qty" style="${badgeQtyStyle}">${item.total}</div>
        </div>
      `;
    });
    html += `
          </div>
          <div class="footer-row">
            <span>Manga Larga:</span>
            <strong>${totalLongSleeve} prendas</strong>
          </div>
          <div class="footer-row total-row" style="color: #312e81;">
            <span>Total General:</span>
            <strong>${totalGarments} prendas</strong>
          </div>
          <script>
            window.onload = () => { window.print(); window.onafterprint = () => window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleAdminLogin = () => {
    if (adminPin === ADMIN_SECRET) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPinError(false);
      setAdminPin('');
      setShowPassword(false);
    } else {
      setPinError(true);
    }
  };

  const activeOrders = useMemo(() => orders.filter(o => !o.deleted), [orders]);
  const deletedOrders = useMemo(() => orders.filter(o => o.deleted), [orders]);

  const compactSummaryItems = useMemo(() => {
    const items = [];
    SIZES.forEach(size => {
      const sizeOrders = activeOrders.filter(o => o.size === size);
      if (SIZES_FM.includes(size)) {
        const femShort = sizeOrders.filter(o => o.gender === 'Femenino' && !o.longSleeve).reduce((sum, o) => sum + o.quantity, 0);
        const femLong = sizeOrders.filter(o => o.gender === 'Femenino' && o.longSleeve).reduce((sum, o) => sum + o.quantity, 0);
        if (femShort > 0) items.push({ size: size, gender: 'Fem', isLong: false, total: femShort });
        if (femLong > 0) items.push({ size: size, gender: 'Fem', isLong: true, total: femLong });

        const mascShort = sizeOrders.filter(o => o.gender === 'Masculino' && !o.longSleeve).reduce((sum, o) => sum + o.quantity, 0);
        const mascLong = sizeOrders.filter(o => o.gender === 'Masculino' && o.longSleeve).reduce((sum, o) => sum + o.quantity, 0);
        if (mascShort > 0) items.push({ size: size, gender: 'Masc', isLong: false, total: mascShort });
        if (mascLong > 0) items.push({ size: size, gender: 'Masc', isLong: true, total: mascLong });
      } else {
        const uniShort = sizeOrders.filter(o => !o.longSleeve).reduce((sum, o) => sum + o.quantity, 0);
        const uniLong = sizeOrders.filter(o => o.longSleeve).reduce((sum, o) => sum + o.quantity, 0);
        if (uniShort > 0) items.push({ size: size, gender: 'Uni', isLong: false, total: uniShort });
        if (uniLong > 0) items.push({ size: size, gender: 'Uni', isLong: true, total: uniLong });
      }
    });
    return items;
  }, [activeOrders]);

  const summaryBySize = useMemo(() => {
    return SIZES.map(size => {
      const sizeOrders = activeOrders.filter(order => order.size === size);
      if (SIZES_FM.includes(size)) {
        const fem = sizeOrders.filter(o => o.gender === 'Femenino').reduce((sum, o) => sum + o.quantity, 0);
        const masc = sizeOrders.filter(o => o.gender === 'Masculino').reduce((sum, o) => sum + o.quantity, 0);
        return { size, type: 'FM', fem, masc, total: fem + masc };
      } else {
        const uni = sizeOrders.reduce((sum, o) => sum + o.quantity, 0);
        return { size, type: 'U', uni, total: uni };
      }
    });
  }, [activeOrders]);

  const totalGarments = activeOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalLongSleeve = activeOrders.reduce((sum, order) => sum + (order.longSleeve ? order.quantity : 0), 0);
  const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.quantity * (COSTO_REMERA + (order.longSleeve ? COSTO_MANGA_LARGA : 0))), 0);
  const currentOrderTotal = (parseInt(formData.quantity) || 0) * (COSTO_REMERA + (formData.longSleeve ? COSTO_MANGA_LARGA : 0));

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 text-left">
          <div className="flex items-center gap-4">
            <Shirt className="w-12 h-12 text-indigo-300 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">BROOGUIN SPORT</h1>
              <p className="text-indigo-200 text-sm mt-1">San Estanislao - Pedidos Compartidos</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full md:w-auto md:justify-end">
            <div className="bg-indigo-800/60 p-3 rounded-xl border border-indigo-700 text-sm flex-1 max-w-sm shadow-inner">
              <h3 className="font-bold text-indigo-100 mb-1 border-b border-indigo-700/50 pb-1 text-xs uppercase tracking-wider">Ficha Técnica</h3>
              <ul className="text-indigo-200 space-y-1 mt-2 text-xs">
                <li><span className="font-semibold text-white">Material:</span> Tela Piqué Premium</li>
                <li><span className="font-semibold text-white">Composición:</span> 53% Poliéster / 47% Algodón</li>
                <li className="pt-1"><span className="font-bold text-emerald-400 text-sm">Costo: 95.000 Gs.</span></li>
              </ul>
            </div>

            <div className="bg-indigo-800/40 p-3 rounded-xl border border-indigo-700 max-w-xs flex-shrink-0 flex flex-col gap-2">
              <p className="text-xs text-indigo-100 flex items-start gap-1">
                <span className="font-bold text-white block">💡 Tip:</span> 
                Comparte el enlace en WhatsApp para que cada persona cargue su pedido.
              </p>
              <div className="bg-indigo-900/50 p-2 rounded-lg text-xs text-indigo-100 border border-indigo-700/50">
                <span className="font-bold text-white block mb-0.5">📞 ¿Dudas o consultas?</span>
                Lucas López - <a href="https://wa.link/uw5z9t" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-emerald-400/30 underline-offset-2">0984 948 834</a>
              </div>
            </div>
          </div>
        </header>

        {isAdmin && (
          <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-lg shadow-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Modo Administrador Activo</h3>
              <p className="text-xs mt-1">En este panel tienes permisos exclusivos para: <strong>Cambiar estados de pago</strong>, <strong>Eliminar pedidos</strong> y <strong>Exportar planillas</strong>.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`bg-white p-6 rounded-2xl shadow-sm border ${editingId ? 'border-amber-400 ring-4 ring-amber-50' : 'border-neutral-200'} transition-all`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {editingId ? <><Edit className="w-5 h-5 text-amber-500" /> Editar Pedido</> : <><PlusCircle className="w-5 h-5 text-indigo-600" /> Nuevo Pedido</>}
                </h2>
                <button onClick={() => setShowInfo(!showInfo)} className="text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-full" title="Información de los campos" type="button">
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {showInfo && (
                <div className="bg-blue-50 text-blue-800 text-xs p-4 rounded-lg mb-4 border border-blue-100 space-y-2 shadow-inner">
                  <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-2">¿Para qué sirve cada dato?</h4>
                  <p><strong>Nombre del Cliente:</strong> Identifica de quién es la prenda (Solo letras).</p>
                  <p><strong>Teléfono:</strong> Necesario para contactar en caso de dudas o avisar de la entrega.</p>
                  <p><strong>Talle:</strong> Define el tamaño (P, M y G se dividen por género; los demás son Unisex).</p>
                  <p><strong>Género:</strong> Determina el corte de la remera (entallado femenino o recto masculino).</p>
                  <p><strong>Manga Larga:</strong> Se le agregará un costo extra de 10.000 Gs. a tu pedido.</p>
                  <p><strong>Cantidad:</strong> Cuántas remeras de estas características se van a llevar.</p>
                  <p><strong>Observaciones:</strong> Detalles extra (Ej. "Retira mi hermano", "Pago por transferencia").</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del Cliente</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-neutral-400" /></div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Juan Pérez" className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-neutral-400" /></div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Ej. 0981123456" className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Talle</label>
                    <select name="size" value={formData.size} onChange={handleChange} className="block w-full pl-3 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {SIZES.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Género</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full pl-3 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {SIZES_FM.includes(formData.size) ? (
                        <><option value="Femenino">Femenino</option><option value="Masculino">Masculino</option></>
                      ) : (
                        <option value="Unisex">Unisex</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Cantidad</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className="h-4 w-4 text-neutral-400" /></div>
                    <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors">
                  <input type="checkbox" id="longSleeve" name="longSleeve" checked={formData.longSleeve} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500 cursor-pointer" />
                  <label htmlFor="longSleeve" className="text-sm font-medium text-indigo-900 cursor-pointer select-none flex-1 flex justify-between items-center">
                    <span>Manga Larga</span><span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">+10.000 Gs.</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Observaciones <span className="text-neutral-400 font-normal">(Opcional)</span></label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-0 pl-3 flex items-start pointer-events-none"><AlignLeft className="h-4 w-4 text-neutral-400" /></div>
                    <textarea name="observations" value={formData.observations} onChange={handleChange} rows="2" placeholder="Ej. Pago por transferencia..." className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm resize-none" />
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-indigo-900">Total de este pedido:</span>
                  <span className="text-lg font-black text-indigo-700">{new Intl.NumberFormat('es-PY').format(currentOrderTotal)} Gs.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="w-1/3 flex justify-center py-3 px-4 border border-neutral-300 rounded-xl shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors">Cancelar</button>
                  )}
                  <button type="submit" className={`${editingId ? 'w-2/3 bg-amber-500 hover:bg-amber-600' : 'w-full bg-indigo-600 hover:bg-indigo-700'} flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-colors`}>
                    {editingId ? 'Guardar Cambios' : 'Agregar Pedido'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Minimalist Summary */}
            <div className="bg-indigo-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" /> Resumen Compacto
                </h3>
                {isAdmin && (
                  <button onClick={handleExportCompactPDF} className="text-xs bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <FileText className="w-3.5 h-3.5" /> PDF Compacto
                  </button>
                )}
              </div>
              
              {totalGarments === 0 ? (
                <p className="text-xs text-indigo-400">Sin pedidos activos.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {compactSummaryItems.map((item) => (
                      <div key={`${item.size}-${item.gender}-${item.isLong}`} className={`flex items-center bg-white border ${item.isLong ? 'border-purple-200' : 'border-indigo-200'} rounded-md overflow-hidden text-xs shadow-sm`}>
                        <span className={`${item.isLong ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'} font-bold px-2 py-1 flex items-center gap-1`}>
                          {item.size} {item.gender !== 'Uni' && <span className="text-[10px] opacity-75">{item.gender}</span>} {item.isLong && <span className="text-[9px] bg-purple-200 px-1 rounded uppercase">Larga</span>}
                        </span>
                        <span className={`${item.isLong ? 'text-purple-700' : 'text-indigo-600'} font-semibold px-2 py-1`}>{item.total}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-indigo-200/60 flex flex-col gap-1">
                    {totalLongSleeve > 0 && (
                      <div className="flex justify-between items-center text-xs text-indigo-800 mb-1">
                        <span>Incluye Manga Larga:</span><span className="font-bold">{totalLongSleeve} prendas</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-indigo-900">Total General:</span>
                      <span className="text-sm font-black text-white bg-indigo-600 px-3 py-1 rounded-lg shadow-sm">{totalGarments} prendas</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Lists & Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><ClipboardList className="w-5 h-5 text-emerald-600" /> Resumen para Confección</h2>
                {isAdmin && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={handleExportCSV} className="flex-1 sm:flex-none text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                      <Download className="w-4 h-4" /> Excel
                    </button>
                    <button onClick={handleExportPDF} className="flex-1 sm:flex-none text-sm bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                      <FileText className="w-4 h-4" /> PDF
                    </button>
                  </div>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Talle</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Femenino</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Masculino</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Unisex</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {summaryBySize.map((item) => (
                      <tr key={item.size} className={item.total > 0 ? 'bg-emerald-50/30' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">{item.size}</td>
                        {item.type === 'FM' ? (
                          <>
                            <td className="px-6 py-4 text-center font-medium">{item.fem > 0 ? <span className="text-emerald-700">{item.fem}</span> : <span className="text-neutral-300">0</span>}</td>
                            <td className="px-6 py-4 text-center font-medium">{item.masc > 0 ? <span className="text-emerald-700">{item.masc}</span> : <span className="text-neutral-300">0</span>}</td>
                            <td className="px-6 py-4 text-center text-neutral-300">-</td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 text-center text-neutral-300">-</td>
                            <td className="px-6 py-4 text-center text-neutral-300">-</td>
                            <td className="px-6 py-4 text-center font-medium">{item.uni > 0 ? <span className="text-emerald-700">{item.uni}</span> : <span className="text-neutral-300">0</span>}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-right font-bold text-indigo-700">{item.total > 0 ? item.total : <span className="text-neutral-400">0</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm font-bold text-neutral-900 text-right">Total General:</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600 text-right">{totalGarments} prendas</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td colSpan={4} className="px-6 py-4 text-sm font-bold text-emerald-900 text-right border-t border-emerald-100">Total a Recaudar:</td>
                      <td className="px-6 py-4 text-sm font-black text-emerald-700 text-right border-t border-emerald-100">{new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">Lista de Pedidos ({activeOrders.length})</h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-neutral-400" /></div>
                  <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg sm:text-sm bg-neutral-50" />
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8 text-neutral-500 flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" /><p>Cargando datos...</p></div>
              ) : activeOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500"><Shirt className="w-12 h-12 mx-auto text-neutral-300 mb-3" /><p>Aún no hay pedidos registrados.</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Teléfono</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Talle</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Género</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Cant.</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Fecha</th>
                        {isAdmin && <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Acción</th>}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {activeOrders.filter(order => order.name.toLowerCase().includes(searchTerm.toLowerCase())).map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 text-sm text-neutral-900">
                            <div className="font-medium">{order.name}</div>
                            {order.observations && <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1 italic" title={order.observations}>📝 {order.observations}</div>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">{order.phone || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-neutral-700">{order.size}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                            {order.gender} {order.longSleeve && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">LARGA</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">{order.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {isAdmin ? (
                              <select value={order.paymentStatus || 'Pendiente'} onChange={(e) => handleUpdatePayment(order.id, e.target.value)} className={`text-xs font-medium border-0 rounded-md p-1 cursor-pointer ${(order.paymentStatus || 'Pendiente') === 'Pagado' ? 'bg-green-100 text-green-800' : (order.paymentStatus || 'Pendiente') === 'Señado' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Señado">Señado</option>
                                <option value="Pagado">Pagado</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${(order.paymentStatus || 'Pendiente') === 'Pagado' ? 'bg-green-100 text-green-800' : (order.paymentStatus || 'Pendiente') === 'Señado' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{order.paymentStatus || 'Pendiente'}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-400">{formatDate(order.created_at)}</td>
                          {isAdmin && (
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => handleEditClick(order)} className="text-amber-500 hover:bg-amber-50 p-1.5 rounded-md"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {isAdmin && deletedOrders.length > 0 && (
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 border-dashed mt-6">
                <h2 className="text-lg font-semibold mb-4 text-neutral-600 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Papelera de Pedidos ({deletedOrders.length})</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-100/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Talle / Género</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {deletedOrders.map((order) => (
                        <tr key={order.id} className="opacity-75 hover:opacity-100">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 line-through">{order.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">{order.size} - {order.gender}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">{order.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                            <button onClick={() => handleRestore(order.id)} className="text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs"><RefreshCw className="w-3 h-3" /> Restaurar</button>
                            <button onClick={() => handlePermanentDelete(order.id)} className="text-red-600 hover:bg-red-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs"><Trash2 className="w-3 h-3" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {showSuccess && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in z-50">
            <CheckCircle2 className="w-5 h-5" />
            <div className="flex flex-col"><span className="font-bold text-sm">{successMessage}</span><span className="text-xs text-emerald-100">Guardado exitosamente.</span></div>
          </div>
        )}

        <div className="mt-8 text-center pb-8">
          {!isAdmin ? (
            <button onClick={() => setShowAdminLogin(true)} className="text-neutral-400 hover:text-indigo-600 text-xs flex items-center justify-center mx-auto gap-1"><Lock className="w-3 h-3" /> Modo Administrador</button>
          ) : (
            <button onClick={() => setIsAdmin(false)} className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center justify-center mx-auto gap-1 font-medium"><Unlock className="w-3 h-3" /> Salir de Modo Administrador</button>
          )}
        </div>

        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2"><Lock className="w-5 h-5 text-indigo-600" /> Acceso Administrador</h3>
                <button onClick={() => {setShowAdminLogin(false); setPinError(false); setAdminPin(''); setShowPassword(false);}} className="text-neutral-500 hover:text-neutral-700"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-neutral-600 mb-4">Ingresa la contraseña para habilitar el borrado de pedidos.</p>
              <div className="relative mb-2">
                <input type={showPassword ? "text" : "password"} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="Contraseña" onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"><EyeOff className="w-4 h-4" /></button>
              </div>
              {pinError && <p className="text-xs text-red-500 mb-3">Contraseña incorrecta.</p>}
              <button onClick={handleAdminLogin} className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700">Ingresar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}