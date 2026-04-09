import React, { useState, useMemo, useEffect } from 'react';
import { Shirt, PlusCircle, ClipboardList, Trash2, User, Hash, Phone, Loader2, Layers, Lock, Unlock, X, Eye, EyeOff, Download, FileText, Info, RefreshCw, AlertCircle, Search, CheckCircle2, AlignLeft, Edit, Filter, Link2, Plus } from 'lucide-react';

// ==========================================
// CONFIGURACIÓN DE SUPABASE (CONEXIÓN DIRECTA API REST)
// ==========================================
// TUS DATOS REALES YA ESTÁN CONFIGURADOS AQUÍ
const supabaseUrl = 'https://waoylkoopzluyhuuhbbc.supabase.co'; 
const supabaseKey = 'sb_publishable_JYC_sxawUbpXIYycV7HO3A_kiUiFyoy'; 

const supabaseRequest = async (path, method = 'GET', body = null) => {
  if (!supabaseUrl || supabaseUrl.includes('TU_URL_AQUI')) {
    return { data: null, error: 'Configuración de Supabase pendiente.' };
  }
  
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }
    
    const data = response.status !== 204 ? await response.json() : null;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
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
  
  // SISTEMA DE GRUPOS (Enlaces Mágicos)
  const urlParams = new URLSearchParams(window.location.search);
  const initialGroup = urlParams.get('grupo') || 'General';
  const [activeGroup, setActiveGroup] = useState(initialGroup);
  const [adminGroupFilter, setAdminGroupFilter] = useState('Todos');
  
  // Estados para el Administrador Global
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const ADMIN_SECRET = 'brooguin2025';
  const GROUP_SECRET = 'remeras'; // Contraseña para crear grupos

  // Estados para el Administrador de Grupos
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [showGroupAuth, setShowGroupAuth] = useState(false);
  const [groupPin, setGroupPin] = useState('');
  const [groupPinError, setGroupPinError] = useState(false);
  const [showGroupPassword, setShowGroupPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    size: 'M',
    gender: 'Femenino',
    quantity: 1,
    longSleeve: false,
    observations: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabaseRequest('orders?select=*&order=created_at.desc');
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
    
    if (!formData.name.trim() || !formData.phone.trim() || formData.quantity < 1) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      size: formData.size,
      gender: formData.gender,
      quantity: parseInt(formData.quantity, 10),
      longSleeve: formData.longSleeve,
      observations: formData.observations,
      group_name: activeGroup 
    };

    try {
      if (editingId) {
        const { error } = await supabaseRequest(`orders?id=eq.${editingId}`, 'PATCH', orderData);
        if (error) throw new Error(error);
        setSuccessMessage('¡Pedido Actualizado!');
        setEditingId(null);
      } else {
        const newOrder = {
          ...orderData,
          paymentStatus: 'Pendiente',
          deleted: false
        };
        const { error } = await supabaseRequest('orders', 'POST', newOrder);
        if (error) throw new Error(error);
        setSuccessMessage('¡Pedido Registrado!');
      }
      
      await fetchOrders(); 
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({ name: '', phone: '', size: 'M', gender: 'Femenino', quantity: 1, longSleeve: false, observations: '' });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al procesar tu solicitud. Intenta nuevamente.");
    }
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Error al copiar', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const cleanName = newGroupName.trim().replace(/\s+/g, '');
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?grupo=${cleanName}`;
    copyToClipboard(link);
    setNewGroupName('');
    alert(`Grupo "${cleanName}" creado. Enlace copiado al portapapeles.`);
  };

  const handleGroupManagerClick = () => {
    if (isGroupAdmin) {
      setShowGroupManager(!showGroupManager);
    } else {
      setShowGroupAuth(true);
    }
  };

  const handleGroupAuth = () => {
    if (groupPin === GROUP_SECRET) {
      setIsGroupAdmin(true);
      setShowGroupAuth(false);
      setShowGroupManager(true);
      setGroupPin('');
      setGroupPinError(false);
      setShowGroupPassword(false);
    } else {
      setGroupPinError(true);
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
    await supabaseRequest(`orders?id=eq.${id}`, 'PATCH', { deleted: true });
    fetchOrders();
  };

  const handleRestore = async (id) => {
    if (!isAdmin) return;
    await supabaseRequest(`orders?id=eq.${id}`, 'PATCH', { deleted: false });
    fetchOrders();
  };

  const handlePermanentDelete = async (id) => {
    if (!isAdmin) return;
    if(!confirm("¿Estás seguro de eliminar esto permanentemente?")) return;
    await supabaseRequest(`orders?id=eq.${id}`, 'DELETE');
    fetchOrders();
  };

  const handleUpdatePayment = async (id, newStatus) => {
    if (!isAdmin) return;
    await supabaseRequest(`orders?id=eq.${id}`, 'PATCH', { paymentStatus: newStatus });
    fetchOrders();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-PY', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
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

  const availableGroups = useMemo(() => {
    const groups = orders.filter(o => !o.deleted).map(o => o.group_name || 'General');
    return ['Todos', ...new Set(groups)];
  }, [orders]);

  const activeOrders = useMemo(() => {
    let filtered = orders.filter(o => !o.deleted);
    if (!isAdmin) {
      filtered = filtered.filter(o => (o.group_name || 'General') === activeGroup);
    } else {
      if (adminGroupFilter !== 'Todos') {
        filtered = filtered.filter(o => (o.group_name || 'General') === adminGroupFilter);
      }
    }
    return filtered;
  }, [orders, isAdmin, activeGroup, adminGroupFilter]);

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

  // --- EXPORTACIÓN ---
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    let html = `
      <html>
        <head>
          <title>Pedidos - ${isAdmin ? adminGroupFilter : activeGroup}</title>
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
          </style>
        </head>
        <body>
          <h1>BROOGUIN SPORT - Reporte</h1>
          <p class="date">Grupo: ${isAdmin ? adminGroupFilter : activeGroup} | ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${isAdmin && adminGroupFilter === 'Todos' ? '<th>Grupo</th>' : ''}
                <th>Cliente</th>
                <th>Talle</th>
                <th>Género</th>
                <th>Manga</th>
                <th>Cant.</th>
                <th>Estado</th>
                <th>Obs.</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
    `;

    activeOrders.forEach(o => {
      html += `
        <tr>
          ${isAdmin && adminGroupFilter === 'Todos' ? `<td>${o.group_name || 'General'}</td>` : ''}
          <td>${o.name} <br><small>${o.phone || ''}</small></td>
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
          <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Premium */}
        <header className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 z-10">
            <Shirt className="w-12 h-12 text-indigo-300 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">BROOGUIN SPORT</h1>
              <p className="text-indigo-200 text-sm mt-1">San Estanislao - Gestión Profesional</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full md:w-auto md:justify-end z-10">
            <div className="bg-indigo-800/60 p-3 rounded-xl border border-indigo-700 max-w-xs flex-shrink-0 shadow-inner flex items-center justify-between min-w-[150px]">
               <div>
                 <span className="block text-[10px] uppercase tracking-widest font-bold text-indigo-300 mb-0.5">Grupo Activo</span>
                 <span className="text-lg font-black text-white truncate max-w-[150px] block">{activeGroup}</span>
               </div>
               <div className="bg-indigo-700 p-2 rounded-lg ml-2">
                 <Link2 className="w-5 h-5 text-indigo-300" />
               </div>
            </div>

            <div className="bg-indigo-800/40 p-3 rounded-xl border border-indigo-700 text-sm flex-1 max-w-sm shadow-inner">
              <h3 className="font-bold text-indigo-100 mb-1 border-b border-indigo-700/50 pb-1 text-xs uppercase tracking-wider">Ficha Técnica</h3>
              <ul className="text-indigo-200 space-y-1 mt-2 text-xs">
                <li><span className="font-semibold text-white">Tela:</span> Piqué Premium</li>
                <li className="pt-1"><span className="font-bold text-emerald-400 text-sm">Costo: 95.000 Gs.</span></li>
              </ul>
            </div>
          </div>
        </header>

        {/* Panel de Administrador Supremo */}
        {isAdmin && (
          <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-indigo-900">Modo Administrador Supremo</h3>
                  <p className="text-xs text-neutral-600">Control total de pedidos y creación de grupos.</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleGroupManagerClick} 
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Gestor de Grupos
                </button>
                <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  <select 
                    value={adminGroupFilter} 
                    onChange={(e) => setAdminGroupFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-bold text-indigo-900 outline-none cursor-pointer"
                  >
                    {availableGroups.map(g => (
                      <option key={g} value={g}>{g === 'Todos' ? 'Todos los Grupos' : `Grupo: ${g}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Interfaz de Creación de Grupos (Protegida) */}
            {showGroupManager && isGroupAdmin && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2"><Link2 className="w-4 h-4" /> Crear Nuevo Enlace de Grupo</h4>
                <form onSubmit={handleCreateGroup} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={newGroupName} 
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nombre del Grupo (ej: ColegioNacional)" 
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                    Generar y Copiar Link
                  </button>
                </form>
                <p className="text-[10px] text-neutral-500 mt-2 italic">Esto generará un enlace que podrás pasar por WhatsApp para que ese grupo cargue sus pedidos por separado.</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Formulario */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`bg-white p-6 rounded-2xl shadow-sm border ${editingId ? 'border-amber-400 ring-4 ring-amber-50' : 'border-neutral-200'} transition-all`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {editingId ? <><Edit className="w-5 h-5 text-amber-500" /> Editar Pedido</> : <><PlusCircle className="w-5 h-5 text-indigo-600" /> Nuevo Pedido</>}
                </h2>
                <button onClick={() => setShowInfo(!showInfo)} className="text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-full" type="button">
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {showInfo && (
                <div className="bg-blue-50 text-blue-800 text-[10px] p-4 rounded-lg mb-4 border border-blue-100 space-y-1 shadow-inner">
                  <p>Estás cargando un pedido para el grupo: <strong>{activeGroup}</strong>.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del Cliente</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-neutral-400" /></div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Juan Pérez" className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors sm:text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-neutral-400" /></div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0981..." className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors sm:text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Talle</label>
                    <select name="size" value={formData.size} onChange={handleChange} className="block w-full px-3 py-2 border border-neutral-300 rounded-lg sm:text-sm bg-white">
                      {SIZES.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Género</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full px-3 py-2 border border-neutral-300 rounded-lg sm:text-sm bg-white">
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
                    <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors sm:text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <input type="checkbox" id="longSleeve" name="longSleeve" checked={formData.longSleeve} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                  <label htmlFor="longSleeve" className="text-sm font-medium text-indigo-900 cursor-pointer flex-1 flex justify-between">
                    <span>Manga Larga</span><span className="text-xs bg-indigo-100 px-2 py-0.5 rounded font-bold">+10.000 Gs.</span>
                  </label>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-indigo-900">Total:</span>
                  <span className="text-lg font-black text-indigo-700">{new Intl.NumberFormat('es-PY').format(currentOrderTotal)} Gs.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="w-1/3 flex justify-center py-3 px-4 border border-neutral-300 rounded-xl shadow-sm text-sm font-medium text-neutral-700 bg-white">Cancelar</button>
                  )}
                  <button type="submit" className={`${editingId ? 'w-2/3 bg-amber-500 hover:bg-amber-600' : 'w-full bg-indigo-600 hover:bg-indigo-700'} flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white transition-all`}>
                    {editingId ? 'Guardar Cambios' : 'Agregar Pedido'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Resumen Compacto */}
            <div className="bg-indigo-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-indigo-600" /> Resumen {activeGroup}
              </h3>
              <div className="flex flex-wrap gap-2">
                {compactSummaryItems.map((item) => (
                  <div key={`${item.size}-${item.gender}-${item.isLong}`} className="flex items-center bg-white border border-indigo-200 rounded text-[10px] overflow-hidden">
                    <span className="bg-indigo-100 px-2 py-1 font-bold">{item.size}{item.gender[0]}{item.isLong ? 'L' : ''}</span>
                    <span className="px-2 py-1 font-black">{item.total}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200 flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-900">Total Global:</span>
                <span className="text-sm font-black text-white bg-indigo-600 px-3 py-0.5 rounded-lg shadow-sm">{totalGarments}</span>
              </div>
            </div>
          </div>

          {/* Columna Listado */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><ClipboardList className="w-5 h-5 text-emerald-600" /> Resumen para Confección</h2>
                  {isAdmin && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={handleExportPDF} className="flex-1 sm:flex-none text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm">
                        <FileText className="w-3 h-3" /> Exportar PDF
                      </button>
                    </div>
                  )}
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500">
                      <tr>
                        <th className="px-6 py-3 text-left">Talle</th>
                        <th className="px-6 py-3 text-center">Fem.</th>
                        <th className="px-6 py-3 text-center">Masc.</th>
                        <th className="px-6 py-3 text-center">Uni.</th>
                        <th className="px-6 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200 text-sm">
                      {summaryBySize.map((item) => (
                        <tr key={item.size} className={item.total > 0 ? 'bg-emerald-50/20' : ''}>
                          <td className="px-6 py-4 font-bold">{item.size}</td>
                          <td className="px-6 py-4 text-center">{item.fem || 0}</td>
                          <td className="px-6 py-4 text-center">{item.masc || 0}</td>
                          <td className="px-6 py-4 text-center">{item.uni || 0}</td>
                          <td className="px-6 py-4 text-right font-black text-indigo-700">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" /> Pedidos Recientes
              </h2>
              {loading ? (
                <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>
              ) : activeOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 italic">No hay pedidos en este grupo.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200 text-xs">
                    <thead className="bg-neutral-50">
                  <tr>
                    {isAdmin && adminGroupFilter === 'Todos' && <th className="px-4 py-3 text-left">Grupo</th>}
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Detalles</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    {isAdmin && <th className="px-4 py-3 text-right">Acción</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {activeOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      {isAdmin && adminGroupFilter === 'Todos' && <td className="px-4 py-3 font-bold text-indigo-600">{order.group_name}</td>}
                      <td className="px-4 py-3 font-medium text-neutral-900">{order.name}<br/><span className="text-[9px] text-neutral-400">{order.phone}</span></td>
                      <td className="px-4 py-3">{order.size} {order.gender} {order.longSleeve && '(L)'} x{order.quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${(order.paymentStatus || 'Pendiente') === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {order.paymentStatus || 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-400">{formatDate(order.created_at)}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                                <button onClick={() => handleEditClick(order)} className="text-amber-500 p-1 hover:bg-amber-50 rounded"><Edit className="w-3 h-3" /></button>
                                <button onClick={() => handleDelete(order.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
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
          </div>
        </div>

        {/* Papelera de Admin */}
        {isAdmin && deletedOrders.length > 0 && (
          <div className="bg-white/50 p-6 rounded-2xl border border-neutral-300 border-dashed">
            <h2 className="text-lg font-bold text-neutral-500 mb-4 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Papelera ({deletedOrders.length})</h2>
            <div className="overflow-x-auto">
               <table className="min-w-full text-xs text-neutral-500">
                  <tbody>
                    {deletedOrders.map(o => (
                      <tr key={o.id} className="border-t border-neutral-200">
                        <td className="py-2">{o.name} ({o.group_name})</td>
                        <td className="py-2 text-right">
                           <button onClick={() => handleRestore(o.id)} className="text-indigo-600 font-bold px-2 py-1">Restaurar</button>
                           <button onClick={() => handlePermanentDelete(o.id)} className="text-red-400 px-2 py-1">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        <div className="text-center pb-8">
          {!isAdmin ? (
            <button onClick={() => setShowAdminLogin(true)} className="text-neutral-400 hover:text-indigo-600 transition-colors text-[10px] flex items-center justify-center mx-auto gap-1">
               <Lock className="w-3 h-3" /> Acceso Admin
            </button>
          ) : (
            <button onClick={() => setIsAdmin(false)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center justify-center mx-auto gap-1">
               <Unlock className="w-3 h-3" /> Salir del Modo Admin
            </button>
          )}
        </div>

        {/* Notificación de éxito */}
        {showSuccess && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl z-50 animate-bounce">
            <span className="font-bold text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMessage}</span>
          </div>
        )}

        {/* Modal de Login */}
    {showAdminLogin && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Lock className="w-5 h-5" /> Iniciar Sesión</h3>
            <button onClick={() => setShowAdminLogin(false)} className="text-neutral-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="relative mb-4">
            <input 
              type={showPassword ? "text" : "password"} 
              value={adminPin} 
              onChange={(e) => setAdminPin(e.target.value)} 
              placeholder="Ingresa el PIN Admin" 
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {pinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
          <button onClick={handleAdminLogin} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">Ingresar</button>
        </div>
      </div>
    )}

    {/* Modal de Acceso a Grupos */}
    {showGroupAuth && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Lock className="w-5 h-5" /> Acceso a Grupos</h3>
            <button onClick={() => {setShowGroupAuth(false); setGroupPinError(false); setGroupPin(''); setShowGroupPassword(false);}} className="text-neutral-400"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-xs text-neutral-600 mb-4">Ingresa la contraseña para gestionar los grupos.</p>
          <div className="relative mb-4">
            <input 
              type={showGroupPassword ? "text" : "password"} 
              value={groupPin} 
              onChange={(e) => setGroupPin(e.target.value)} 
              placeholder="Contraseña de Grupos" 
              onKeyDown={(e) => e.key === 'Enter' && handleGroupAuth()} 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12" 
            />
            <button 
              type="button" 
              onClick={() => setShowGroupPassword(!showGroupPassword)} 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-indigo-600 transition-colors"
            >
              {showGroupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {groupPinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
          <button onClick={handleGroupAuth} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">Autorizar</button>
        </div>
      </div>
    )}
  </div>
</div>
);
}