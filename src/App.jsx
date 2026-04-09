import React, { useState, useMemo, useEffect } from 'react';
import { Shirt, PlusCircle, ClipboardList, Trash2, User, Hash, Phone, Loader2, Layers, Lock, Unlock, X, Eye, EyeOff, Download, FileText, Info, RefreshCw, AlertCircle, Search, CheckCircle2, AlignLeft, Edit, Filter, Link2, Plus, ShieldAlert, Settings, MessageCircle, DollarSign, TrendingUp } from 'lucide-react';

// ==========================================
// CONFIGURACIÓN DE SUPABASE (CONEXIÓN DIRECTA API REST)
// ==========================================
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

// CONSTANTES Y PRECIOS DEL PDF OFICIAL
const SIZES_ADULTS = ['P', 'M', 'G', 'XG', 'XXL', 'XXXL'];
const SIZES_KIDS = ['2', '4', '6', '8', '10', '12', '14', '16'];

const PRECIOS_BASE = {
  Adultos: {
    Premium: { 'Solo Remera': 105000, 'Remera + Short': 155000, 'Remera + Short + Medias': 175000 },
    'Semi-Premium': { 'Solo Remera': 95000, 'Remera + Short': 145000, 'Remera + Short + Medias': 160000 },
    Estandard: { 'Solo Remera': 85000, 'Remera + Short': 130000, 'Remera + Short + Medias': 150000 }
  },
  Infantil: {
    Premium: { 'Solo Remera': 90000, 'Remera + Short': 130000, 'Remera + Short + Medias': 150000 },
    'Semi-Premium': { 'Solo Remera': 80000, 'Remera + Short': 110000, 'Remera + Short + Medias': 130000 },
    Estandard: { 'Solo Remera': 60000, 'Remera + Short': 90000, 'Remera + Short + Medias': 110000 }
  }
};

export default function App() {
  const [orders, setOrders] = useState([]);
  const [groupSettings, setGroupSettings] = useState([]); // Configuraciones de grupos (Bloqueos)
  const [loading, setLoading] = useState(true);
  
  // ==========================================
  // ESTADOS DEL PANEL DE ADMINISTRACIÓN
  // ==========================================
  const [adminGroupFilter, setAdminGroupFilter] = useState('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_SECRET = 'brooguin2025';
  const GROUP_SECRET = 'remeras'; 

  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [showGroupAuth, setShowGroupAuth] = useState(false);
  const [groupPin, setGroupPin] = useState('');
  const [groupPinError, setGroupPinError] = useState(false);
  const [showGroupPassword, setShowGroupPassword] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);

  // Estados Modal Pagos
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, order: null, amount: 0 });

  // ==========================================
  // LECTURA DE URL Y PREVISUALIZACIÓN EN VIVO
  // ==========================================
  const urlParams = new URLSearchParams(window.location.search);
  const urlGroup = urlParams.get('grupo') || 'General';
  const urlAge = urlParams.get('edad') || 'Adultos';
  const urlType = urlParams.get('tipo') || 'Remera Piqué';
  const urlFabric = urlParams.get('tela') || 'Estandard';
  const urlCost = parseInt(urlParams.get('costo')) || 85000;

  const [newGroupConfig, setNewGroupConfig] = useState({
    name: '', edad: 'Adultos', tipo: 'Remera + Short', tela: 'Estandard', costo: 130000
  });

  const isPreviewMode = showGroupManager && isGroupAdmin;
  const displayGroup = isPreviewMode ? (newGroupConfig.name || 'Vista Previa') : urlGroup;
  const displayAge = isPreviewMode ? newGroupConfig.edad : urlAge;
  const displayType = isPreviewMode ? newGroupConfig.tipo : urlType;
  const displayFabric = isPreviewMode ? newGroupConfig.tela : urlFabric;
  const displayCost = isPreviewMode ? newGroupConfig.costo : urlCost;

  const activeSizes = displayAge === 'Infantil' ? SIZES_KIDS : SIZES_ADULTS;
  const isDeportiva = displayType !== 'Remera Piqué';
  const isCamisilla = displayType.toLowerCase().includes('camisilla');
  const costoMangaLarga = isDeportiva ? 15000 : 10000;

  useEffect(() => {
    if (newGroupConfig.tipo === 'Remera Piqué') {
      if (newGroupConfig.tela !== 'Premium') setNewGroupConfig(prev => ({ ...prev, tela: 'Premium' }));
      return; 
    }
    let calcPrice = PRECIOS_BASE[newGroupConfig.edad]?.[newGroupConfig.tela]?.[newGroupConfig.tipo];
    if (!calcPrice && newGroupConfig.tipo.includes('Camisilla + Short + Medias')) {
      calcPrice = PRECIOS_BASE[newGroupConfig.edad]?.[newGroupConfig.tela]?.['Remera + Short + Medias'];
    } else if (!calcPrice && newGroupConfig.tipo.includes('Camisilla + Short')) {
      calcPrice = PRECIOS_BASE[newGroupConfig.edad]?.[newGroupConfig.tela]?.['Remera + Short'];
    }
    if (calcPrice) {
      setNewGroupConfig(prev => ({ ...prev, costo: calcPrice }));
    }
  }, [newGroupConfig.edad, newGroupConfig.tela, newGroupConfig.tipo]);

  // ==========================================
  // ESTADOS DEL FORMULARIO
  // ==========================================
  const [showInfo, setShowInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', size: activeSizes[0], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '',
    playerName: '', playerNumber: '', isGoalkeeper: false, includeShort: displayType.includes('Short'), shortSize: activeSizes[0], femaleShortType: 'Standard', includeSocks: displayType.includes('Medias')
  });

  const allowLongSleeve = !isCamisilla || formData.isGoalkeeper; 

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, size: activeSizes[0], shortSize: activeSizes[0], includeShort: displayType.includes('Short'), includeSocks: displayType.includes('Medias')
    }));
  }, [displayAge, displayType]);

  useEffect(() => {
    fetchOrdersAndSettings();
  }, []);

  const fetchOrdersAndSettings = async () => {
    setLoading(true);
    const [resOrders, resSettings] = await Promise.all([
      supabaseRequest('orders?select=*&order=created_at.desc'),
      supabaseRequest('group_settings?select=*')
    ]);
    
    if (resOrders.data) setOrders(resOrders.data);
    if (resSettings.data) setGroupSettings(resSettings.data);
    setLoading(false);
  };

  // Check Si el grupo actual está bloqueado
  const currentGroupSettings = groupSettings.find(g => g.group_name === displayGroup);
  const isGroupLocked = currentGroupSettings ? currentGroupSettings.is_locked : false;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    let sanitizedValue = inputValue;

    if (type !== 'checkbox') {
      if (name === 'name' || name === 'playerName') sanitizedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
      else if (name === 'phone' || name === 'playerNumber') sanitizedValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: sanitizedValue };
      if (name === 'size') newData.shortSize = sanitizedValue;
      return newData;
    });
  };

  const calculateCurrentTotal = () => {
    let unitPrice = displayCost; 
    if (isDeportiva) {
       const matrix = PRECIOS_BASE[displayAge]?.[displayFabric];
       if (matrix) {
          if (formData.includeShort && formData.includeSocks) unitPrice = matrix['Remera + Short + Medias'] || (displayCost + 60000);
          else if (formData.includeShort) unitPrice = matrix['Remera + Short'] || (displayCost + 40000);
          else if (formData.includeSocks) unitPrice = matrix['Solo Remera'] + 20000; 
          else unitPrice = matrix['Solo Remera'] || displayCost;
       } else {
          if (formData.includeShort) unitPrice += 40000;
          if (formData.includeSocks) unitPrice += 20000;
       }
    }
    if (formData.longSleeve && allowLongSleeve) unitPrice += costoMangaLarga;
    return unitPrice * (parseInt(formData.quantity) || 1);
  };

  const currentOrderTotal = calculateCurrentTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.quantity < 1) {
      alert("Por favor completa el nombre y la cantidad obligatorios."); return;
    }
    if (isAdmin || isGroupAdmin) {
      if (formData.phone.trim() && !/^09\d{8}$/.test(formData.phone.trim())) {
        alert("El número de teléfono debe tener 10 dígitos y empezar con 09 (Ej: 0984948834). Corrige para proceder."); return;
      }
    }

    let prefix = '';
    const currentUnitPrice = calculateCurrentTotal() / (parseInt(formData.quantity) || 1);

    if (!editingId) {
      if (isDeportiva) {
        const shortFormat = formData.includeShort 
          ? `${formData.shortSize}${formData.gender === 'Femenino' ? ' ('+formData.femaleShortType+')' : ''}` : 'NO';
        prefix = `[#${formData.playerNumber || 'S/N'} | ${formData.playerName?.toUpperCase() || 'SIN NOMBRE'} | Short: ${shortFormat} | Medias: ${formData.includeSocks ? 'SI' : 'NO'} | Arquero: ${formData.isGoalkeeper ? 'SI' : 'NO'}] `;
      }
      prefix += `[Precio: ${currentUnitPrice}] `;
    }

    const finalObservations = editingId ? formData.observations : `${prefix}${formData.observations ? 'Obs: ' + formData.observations : ''}`.trim();

    const orderData = {
      name: formData.name, phone: formData.phone || '-', size: formData.size, gender: formData.gender,
      quantity: parseInt(formData.quantity, 10), longSleeve: allowLongSleeve ? formData.longSleeve : false,
      observations: finalObservations, group_name: displayGroup 
    };

    try {
      if (editingId) {
        const { error } = await supabaseRequest(`orders?id=eq.${editingId}`, 'PATCH', orderData);
        if (error) throw new Error(error);
        setSuccessMessage('¡Pedido Actualizado!'); setEditingId(null);
      } else {
        const newOrder = { ...orderData, paymentStatus: 'Pendiente', deleted: false, amount_paid: 0 };
        const { error } = await supabaseRequest('orders', 'POST', newOrder);
        if (error) throw new Error(error);
        setSuccessMessage('¡Pedido Registrado!');
      }
      await fetchOrdersAndSettings(); 
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({ 
        name: '', phone: '', size: activeSizes[0], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '',
        playerName: '', playerNumber: '', isGoalkeeper: false, includeShort: displayType.includes('Short'), shortSize: activeSizes[0], femaleShortType: 'Standard', includeSocks: displayType.includes('Medias')
      });
    } catch (error) {
      console.error("Error al guardar:", error); alert("Hubo un error al procesar tu solicitud.");
    }
  };

  // --- BOTÓN CERRAR LISTA (BLOQUEO) ---
  const toggleGroupLock = async () => {
    if (!isAdmin) return;
    const newStatus = !isGroupLocked;
    try {
      const exists = groupSettings.find(g => g.group_name === displayGroup);
      if (exists) {
        await supabaseRequest(`group_settings?group_name=eq.${displayGroup}`, 'PATCH', { is_locked: newStatus });
      } else {
        await supabaseRequest('group_settings', 'POST', { group_name: displayGroup, is_locked: newStatus });
      }
      await fetchOrdersAndSettings();
    } catch (err) {
      console.error(err); alert("Error al bloquear la lista.");
    }
  };

  // --- GESTOR DE SEÑAS (PAGOS PARCIALES) ---
  const handleOpenPayment = (order) => {
    if (!isAdmin) return;
    const total = getUnitPrice(order) * order.quantity;
    // Transición: Si es de los viejos "Pagado" pero tiene 0 en amount_paid, asumimos que pagó todo
    const amount = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    setPaymentModal({ isOpen: true, order, amount: amount });
  };

  const savePayment = async () => {
    if (!isAdmin || !paymentModal.order) return;
    const amount = parseInt(paymentModal.amount) || 0;
    const total = getUnitPrice(paymentModal.order) * paymentModal.order.quantity;
    
    let newStatus = 'Pendiente';
    if (amount > 0 && amount < total) newStatus = 'Señado';
    if (amount >= total) newStatus = 'Pagado';

    try {
      await supabaseRequest(`orders?id=eq.${paymentModal.order.id}`, 'PATCH', { 
        amount_paid: amount, paymentStatus: newStatus 
      });
      setPaymentModal({ isOpen: false, order: null, amount: 0 });
      fetchOrdersAndSettings();
    } catch (err) {
      alert("Error guardando el pago");
    }
  };

  // Utilidades y Vistas
  const getWhatsAppLink = (order) => {
    let phone = order.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '595' + phone.substring(1);
    const msg = `Hola *${order.name}*! Te escribo por tu pedido de indumentaria para el grupo/equipo *${order.group_name || 'General'}*.\n\nPor favor, avisame si está todo correcto para avanzar o si te falta abonar. ¡Gracias!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const getUnitPrice = (order) => {
    const match = order.observations?.match(/\[Precio:\s*(\d+)\]/);
    return match ? parseInt(match[1]) : (displayCost + (order.longSleeve ? costoMangaLarga : 0));
  };

  const getOrderFinancials = (order) => {
    const total = getUnitPrice(order) * order.quantity;
    const paid = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    return { total, paid, balance: total - paid };
  };

  const handleAdminLogin = () => {
    if (adminPin === ADMIN_SECRET) { setIsAdmin(true); setShowAdminLogin(false); setPinError(false); setAdminPin(''); setShowPassword(false); } 
    else setPinError(true);
  };
  
  const handleGroupAuth = () => {
    if (groupPin === GROUP_SECRET) { setIsGroupAdmin(true); setShowGroupAuth(false); setShowGroupManager(true); setGroupPin(''); setGroupPinError(false); setShowGroupPassword(false); } 
    else setGroupPinError(true);
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupConfig.name.trim()) return;
    const cleanName = newGroupConfig.name.trim().replace(/\s+/g, '');
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.append('grupo', cleanName); params.append('edad', newGroupConfig.edad); params.append('tipo', newGroupConfig.tipo); params.append('tela', newGroupConfig.tela); params.append('costo', newGroupConfig.costo);
    const link = `${baseUrl}?${params.toString()}`;
    const textArea = document.createElement("textarea"); textArea.value = link; document.body.appendChild(textArea); textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
    setNewGroupConfig({ ...newGroupConfig, name: '' });
    alert(`Grupo "${cleanName}" configurado.\nEnlace copiado al portapapeles.`);
  };

  const activeOrders = useMemo(() => {
    let filtered = orders.filter(o => !o.deleted);
    if (!isAdmin) filtered = filtered.filter(o => (o.group_name || 'General') === displayGroup);
    else if (adminGroupFilter !== 'Todos') filtered = filtered.filter(o => (o.group_name || 'General') === adminGroupFilter);
    return filtered;
  }, [orders, isAdmin, displayGroup, adminGroupFilter]);

  const deletedOrders = useMemo(() => orders.filter(o => o.deleted), [orders]);

  const availableGroups = useMemo(() => ['Todos', ...new Set(orders.filter(o => !o.deleted).map(o => o.group_name || 'General'))], [orders]);

  // Cálculos Generales del Grupo Activo
  const summaryBySize = useMemo(() => {
    return activeSizes.map(size => {
      const sizeOrders = activeOrders.filter(order => order.size === size);
      const fem = sizeOrders.filter(o => o.gender === 'Femenino').reduce((sum, o) => sum + o.quantity, 0);
      const masc = sizeOrders.filter(o => o.gender === 'Masculino').reduce((sum, o) => sum + o.quantity, 0);
      const uni = sizeOrders.filter(o => o.gender === 'Unisex').reduce((sum, o) => sum + o.quantity, 0);
      return { size, fem, masc, uni, total: fem + masc + uni };
    });
  }, [activeOrders, activeSizes]);

  const shortsSummary = useMemo(() => {
    const counts = {};
    activeOrders.forEach(o => {
       if (o.observations?.includes('Short:') && !o.observations?.includes('Short: NO')) {
          const match = o.observations.match(/Short:\s*([^|]+)/);
          if (match) { counts[match[1].trim()] = (counts[match[1].trim()] || 0) + o.quantity; }
       }
    }); return counts;
  }, [activeOrders]);

  const totalSocks = useMemo(() => activeOrders.reduce((sum, o) => o.observations?.includes('Medias: SI') ? sum + o.quantity : sum, 0), [activeOrders]);
  const totalGarments = activeOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalRevenue = activeOrders.reduce((sum, order) => sum + getOrderFinancials(order).total, 0);
  const totalCollected = activeOrders.reduce((sum, order) => sum + getOrderFinancials(order).paid, 0);

  // DASHBOARD SUPREMO (GLOBAL)
  const globalStats = useMemo(() => {
    const allActive = orders.filter(o => !o.deleted);
    let expected = 0; let collected = 0;
    allActive.forEach(o => {
      const fins = getOrderFinancials(o);
      expected += fins.total; collected += fins.paid;
    });
    return { items: allActive.length, expected, collected, debt: expected - collected };
  }, [orders]);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 font-sans p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Adaptativo */}
        <header className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 text-left relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 z-10">
            <Shirt className="w-12 h-12 text-indigo-300 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">BROOGUIN SPORT</h1>
              <p className="text-indigo-200 text-sm mt-1 font-medium tracking-wide">
                {isDeportiva ? 'Indumentaria Deportiva' : 'Uniformes Institucionales'}
              </p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full md:w-auto md:justify-end z-10">
            <div className={`p-3 rounded-xl border max-w-xs flex-shrink-0 shadow-inner flex items-center justify-between min-w-[150px] transition-colors ${isPreviewMode ? 'bg-emerald-900/80 border-emerald-500' : 'bg-indigo-800/60 border-indigo-700'}`}>
               <div>
                 <span className={`block text-[10px] uppercase tracking-widest font-bold mb-0.5 ${isPreviewMode ? 'text-emerald-300' : 'text-indigo-300'}`}>
                    {isPreviewMode ? 'Vista Previa' : 'Grupo Activo'}
                 </span>
                 <span className="text-lg font-black text-white truncate max-w-[150px] block" title={displayGroup}>{displayGroup}</span>
               </div>
               <div className={`${isPreviewMode ? 'bg-emerald-700' : 'bg-indigo-700'} p-2 rounded-lg ml-2`}>
                 {isPreviewMode ? <Eye className="w-5 h-5 text-emerald-200" /> : <Link2 className="w-5 h-5 text-indigo-300" />}
               </div>
            </div>
            <div className="bg-indigo-800/40 p-3 rounded-xl border border-indigo-700 text-sm flex-1 max-w-sm shadow-inner">
              <h3 className="font-bold text-indigo-100 mb-1 border-b border-indigo-700/50 pb-1 text-xs uppercase tracking-wider">Detalle del Producto</h3>
              <ul className="text-indigo-200 space-y-1 mt-2 text-xs">
                <li><span className="font-semibold text-white">Prenda:</span> {displayType}</li>
                <li><span className="font-semibold text-white">Tela/Edad:</span> {displayFabric} ({displayAge})</li>
                <li className="pt-1"><span className="font-bold text-emerald-400 text-sm">Desde: {new Intl.NumberFormat('es-PY').format(displayCost)} Gs.</span></li>
              </ul>
            </div>
          </div>
        </header>

        {/* Panel de Administrador General */}
        {isAdmin && (
          <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-indigo-900">Panel de Administración</h3>
                  <p className="text-xs text-neutral-600">Visualizando y gestionando pedidos.</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {!isGroupAdmin ? (
                  <button onClick={() => setShowGroupAuth(true)} className="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-neutral-900 transition-all">
                    <ShieldAlert className="w-4 h-4" /> Modo Supremo
                  </button>
                ) : (
                  <button onClick={() => setShowGroupManager(!showGroupManager)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all">
                    <Settings className="w-4 h-4" /> {showGroupManager ? 'Ocultar Opciones Supremas' : 'Herramientas Supremas'}
                  </button>
                )}

                <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  <select value={adminGroupFilter} onChange={(e) => setAdminGroupFilter(e.target.value)} className="bg-transparent border-none text-sm font-bold text-indigo-900 outline-none cursor-pointer">
                    {availableGroups.map(g => (<option key={g} value={g}>{g === 'Todos' ? 'Todos los Grupos' : `Grupo: ${g}`}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* MODO SUPREMO: DASHBOARD Y CREADOR */}
            {showGroupManager && isGroupAdmin && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                
                {/* DASHBOARD FINANCIERO GLOBAL */}
                <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-700 shadow-inner text-white flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-neutral-400 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Dashboard Financiero Global</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[10px] uppercase text-neutral-500">Recaudación Total</p><p className="text-xl font-black text-emerald-400">{new Intl.NumberFormat('es-PY').format(globalStats.collected)} Gs.</p></div>
                      <div><p className="text-[10px] uppercase text-neutral-500">Deuda Pendiente</p><p className="text-xl font-black text-amber-400">{new Intl.NumberFormat('es-PY').format(globalStats.debt)} Gs.</p></div>
                    </div>
                  </div>
                  <div className="w-px bg-neutral-700 hidden md:block"></div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between text-sm mb-1"><span className="text-neutral-400">Total Esperado:</span><span className="font-bold">{new Intl.NumberFormat('es-PY').format(globalStats.expected)} Gs.</span></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">Total Prendas:</span><span className="font-bold">{globalStats.items}</span></div>
                  </div>
                </div>

                <div className="bg-indigo-900 p-5 rounded-xl border border-indigo-700 shadow-inner text-white">
                  <h4 className="text-sm font-bold text-emerald-300 mb-4 flex items-center gap-2"><Eye className="w-4 h-4" /> Creador de Enlaces Parametrizados (Vista en Vivo)</h4>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Nombre del Grupo/Equipo</label>
                        <input type="text" value={newGroupConfig.name} onChange={(e) => setNewGroupConfig({...newGroupConfig, name: e.target.value})} placeholder="Ej. Intercolegial2026" className="w-full px-3 py-2 rounded-lg bg-indigo-800 border-indigo-600 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-400" required />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Rango de Edad</label>
                        <select value={newGroupConfig.edad} onChange={(e) => setNewGroupConfig({...newGroupConfig, edad: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-indigo-800 border-indigo-600 text-white text-sm outline-none cursor-pointer">
                          <option value="Adultos">Adultos</option><option value="Infantil">Infantil</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Tipo de Prenda Base</label>
                        <select value={newGroupConfig.tipo} onChange={(e) => setNewGroupConfig({...newGroupConfig, tipo: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-indigo-800 border-indigo-600 text-white text-sm outline-none cursor-pointer">
                          <option value="Remera + Short">Remera + Short</option>
                          <option value="Remera + Short + Medias">Remera + Short + Medias</option>
                          <option value="Solo Remera">Solo Remera</option>
                          <option value="Camisilla + Short">Camisilla + Short</option>
                          <option value="Camisilla + Short + Medias">Camisilla + Short + Medias</option>
                          <option value="Remera Piqué">Remera Piqué</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Calidad de Tela</label>
                        <select value={newGroupConfig.tela} onChange={(e) => setNewGroupConfig({...newGroupConfig, tela: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-indigo-800 border-indigo-600 text-white text-sm outline-none cursor-pointer disabled:opacity-50" disabled={newGroupConfig.tipo === 'Remera Piqué'}>
                          <option value="Premium">Premium</option><option value="Semi-Premium">Semi-Premium</option><option value="Estandard">Estandard</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-indigo-800 pt-4 mt-2">
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] uppercase tracking-wider text-indigo-300">Costo Base (Gs):</label>
                        <input type="number" value={newGroupConfig.costo} onChange={(e) => setNewGroupConfig({...newGroupConfig, costo: e.target.value})} className="w-32 px-3 py-1.5 rounded-lg bg-indigo-800 border-indigo-600 text-white font-bold text-sm outline-none" required />
                      </div>
                      <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900 px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                        <Link2 className="w-4 h-4" /> Generar Link
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Formulario Principal (Y AVISO DE BLOQUEO) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Si el grupo está bloqueado y NO es admin, mostramos el candado y ocultamos form */}
            {isGroupLocked && !isAdmin ? (
               <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center shadow-sm">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Lock className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">Lista Cerrada</h3>
                  <p className="text-sm text-red-700">El administrador ha cerrado la recepción de pedidos para el grupo <strong>{displayGroup}</strong>. Contacta con tu encargado para más información.</p>
               </div>
            ) : (
              <div className={`bg-white p-6 rounded-2xl shadow-sm border ${editingId ? 'border-amber-400 ring-4 ring-amber-50' : isPreviewMode ? 'border-emerald-400 ring-2 ring-emerald-50' : 'border-neutral-200'} transition-all`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {editingId ? <><Edit className="w-5 h-5 text-amber-500" /> Editar Pedido</> : <><PlusCircle className={`w-5 h-5 ${isPreviewMode ? 'text-emerald-500' : 'text-indigo-600'}`} /> Nuevo Pedido</>}
                  </h2>
                  {isAdmin && (
                    <span className="bg-neutral-100 text-neutral-500 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest">
                      {isGroupLocked ? 'Lista Bloqueada a Usuarios' : 'Abierto a Usuarios'}
                    </span>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del Cliente</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-neutral-400" /></div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Juan Pérez" className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                  </div>

                  {(isAdmin || isGroupAdmin) && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono (Obligatorio Admin)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-neutral-400" /></div>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 0984948834" className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Talle (Remera)</label>
                      <select name="size" value={formData.size} onChange={handleChange} className="block w-full px-3 py-2 border border-neutral-300 rounded-lg sm:text-sm bg-white cursor-pointer font-bold text-indigo-900">
                        {activeSizes.map(s => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Género</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full px-3 py-2 border border-neutral-300 rounded-lg sm:text-sm bg-white cursor-pointer">
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  {isDeportiva && (
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Detalles Deportivos</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-neutral-700 mb-1">Nombre (Espalda)</label>
                          <input type="text" name="playerName" value={formData.playerName} onChange={handleChange} placeholder="Ej. PÉREZ" className="block w-full px-3 py-2 border border-neutral-300 rounded-lg sm:text-sm uppercase" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-neutral-700 mb-1">Número (Dorsal)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className="h-3 w-3 text-neutral-400" /></div>
                            <input type="number" name="playerNumber" value={formData.playerNumber} onChange={handleChange} placeholder="10" className="block w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg sm:text-sm font-bold" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col bg-white rounded-lg border border-neutral-200 p-2">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="includeShort" name="includeShort" checked={formData.includeShort} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                            <label htmlFor="includeShort" className="text-sm font-medium text-indigo-900 cursor-pointer flex-1">Añadir Short</label>
                            {formData.includeShort && (
                               <select name="shortSize" value={formData.shortSize} onChange={handleChange} className="px-2 py-1 border border-neutral-300 rounded text-xs bg-indigo-50 font-bold text-indigo-900 outline-none">
                                 {activeSizes.map(s => (<option key={s} value={s}>{s}</option>))}
                               </select>
                            )}
                          </div>
                          {formData.includeShort && formData.gender === 'Femenino' && (
                            <div className="flex items-center justify-end gap-2 mt-2 border-t border-neutral-100 pt-2">
                              <span className="text-[10px] font-medium text-neutral-500">Diseño del Short:</span>
                              <select name="femaleShortType" value={formData.femaleShortType} onChange={handleChange} className="px-2 py-1 border border-neutral-300 rounded text-xs bg-pink-50 font-bold text-pink-900 outline-none">
                                <option value="Standard">Standard</option><option value="Femenino">Corte Femenino</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-neutral-200">
                          <input type="checkbox" id="includeSocks" name="includeSocks" checked={formData.includeSocks} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                          <label htmlFor="includeSocks" className="text-sm font-medium text-indigo-900 cursor-pointer flex-1">Añadir Medias</label>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-indigo-100/50 rounded-lg border border-indigo-200 mt-2">
                          <input type="checkbox" id="isGoalkeeper" name="isGoalkeeper" checked={formData.isGoalkeeper} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                          <label htmlFor="isGoalkeeper" className="text-sm font-bold text-indigo-900 cursor-pointer flex-1">Es Arquero</label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Cantidad de Kits</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className="h-4 w-4 text-neutral-400" /></div>
                        <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg sm:text-sm font-bold" />
                      </div>
                    </div>
                    {allowLongSleeve && (
                      <div className="flex items-center gap-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 h-[38px]">
                        <input type="checkbox" id="longSleeve" name="longSleeve" checked={formData.longSleeve} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
                        <label htmlFor="longSleeve" className="text-[11px] font-medium text-indigo-900 cursor-pointer flex-1 leading-tight">
                          Manga Larga (+{new Intl.NumberFormat('es-PY').format(costoMangaLarga)})
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1 text-xs">Observaciones Adicionales</label>
                    <textarea name="observations" value={formData.observations} onChange={handleChange} rows="2" placeholder="Opcional..." className="block w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm resize-none" />
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center mt-2 shadow-inner">
                    <span className="text-sm font-semibold text-indigo-900">Total Calculado:</span>
                    <span className="text-xl font-black text-indigo-700">{new Intl.NumberFormat('es-PY').format(currentOrderTotal)} Gs.</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {editingId && (<button type="button" onClick={cancelEdit} className="w-1/3 flex justify-center py-3 px-4 border border-neutral-300 rounded-xl shadow-sm text-sm font-medium text-neutral-700 bg-white">Cancelar</button>)}
                    <button type="submit" className={`${editingId ? 'w-2/3 bg-amber-500' : isPreviewMode ? 'w-full bg-emerald-500' : 'w-full bg-indigo-600'} flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white transition-all transform hover:-translate-y-0.5`}>
                      {editingId ? 'Guardar Cambios' : isPreviewMode ? 'Probar Pedido' : 'Agregar Pedido'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Columna Listado y Resumen */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                 <h2 className="text-xl font-semibold flex items-center gap-2"><Search className="w-5 h-5 text-indigo-400" /> Pedidos Recientes</h2>
                 
                 {/* BOTÓN CERRAR LISTA PARA ADMIN */}
                 {isAdmin && (
                   <button onClick={toggleGroupLock} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${isGroupLocked ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}>
                     {isGroupLocked ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                     {isGroupLocked ? 'Reabrir Lista' : 'Cerrar Lista a Usuarios'}
                   </button>
                 )}
              </div>

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
                    <th className="px-4 py-3 text-left">Prenda</th>
                    <th className="px-4 py-3 text-left">Estado / Pago</th>
                    {isAdmin && <th className="px-4 py-3 text-right">Acción</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {activeOrders.map((order) => {
                    const cleanObs = order.observations ? order.observations.replace(/\[Precio:\s*\d+\]/, '').trim() : '';
                    const fins = getOrderFinancials(order);
                    
                    return (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        {isAdmin && adminGroupFilter === 'Todos' && <td className="px-4 py-3 font-bold text-indigo-600">{order.group_name}</td>}
                        <td className="px-4 py-3 font-medium text-neutral-900">
                          {order.name}
                          {(isAdmin || isGroupAdmin) && order.phone && order.phone !== '-' && (
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-[10px] text-neutral-500 flex items-center gap-1"><Phone className="w-2.5 h-2.5"/> {order.phone}</span>
                              <a href={getWhatsAppLink(order)} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer border border-[#25D366]/30">
                                <MessageCircle className="w-3 h-3" /> Escribir
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-indigo-900">{order.size}</span> {order.gender[0]}. {order.longSleeve && '(ML)'} x{order.quantity}
                          {cleanObs && <div className="text-[10px] text-neutral-500 mt-1 italic text-wrap max-w-[200px] leading-tight">{cleanObs}</div>}
                        </td>
                        <td className="px-4 py-3">
                          {/* NUEVO GESTOR DE SEÑAS EN LA TABLA */}
                          {isAdmin ? (
                            <button onClick={() => handleOpenPayment(order)} className="text-left w-full hover:bg-neutral-100 p-1.5 rounded transition-colors group relative">
                              <div className={`text-[10px] font-black uppercase ${fins.balance === 0 ? 'text-green-600' : fins.paid > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                                 {fins.balance === 0 ? 'PAGADO' : fins.paid > 0 ? 'SEÑADO' : 'PENDIENTE'}
                              </div>
                              <div className="text-[9px] text-neutral-500 font-medium">
                                 {new Intl.NumberFormat('es-PY').format(fins.paid)} / {new Intl.NumberFormat('es-PY').format(fins.total)} Gs.
                              </div>
                              <div className="absolute right-1 top-2 hidden group-hover:block"><Edit className="w-3 h-3 text-neutral-400"/></div>
                            </button>
                          ) : (
                            <div className="p-1">
                              <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${fins.balance === 0 ? 'bg-green-100 text-green-800' : fins.paid > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                {fins.balance === 0 ? 'Pagado' : fins.paid > 0 ? 'Señado' : 'Pendiente'}
                              </span>
                            </div>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                                  <button onClick={() => handleEditClick(order)} className="text-amber-500 p-1 hover:bg-amber-50 rounded"><Edit className="w-3 h-3" /></button>
                                  <button onClick={() => handleDelete(order.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </td>
                            )}
                          </tr>
                    );
                  })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><ClipboardList className="w-5 h-5 text-emerald-600" /> Resumen de Producción</h2>
                  {isAdmin && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={handleExportCSV} className="flex-1 sm:flex-none text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-100">
                        <Download className="w-3 h-3" /> Excel
                      </button>
                      <button onClick={handleExportPDF} className="flex-1 sm:flex-none text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-red-100">
                        <FileText className="w-3 h-3" /> PDF
                      </button>
                    </div>
                  )}
               </div>
               
               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div><p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Esperado de este Grupo</p><p className="text-lg font-black text-indigo-900">{new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs.</p></div>
                  <div><p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Recaudado (Señas+Pagos)</p><p className="text-lg font-black text-emerald-700">{new Intl.NumberFormat('es-PY').format(totalCollected)} Gs.</p></div>
                  <div><p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Falta Cobrar</p><p className="text-lg font-black text-red-600">{new Intl.NumberFormat('es-PY').format(totalRevenue - totalCollected)} Gs.</p></div>
               </div>

               <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Cantidades de Remeras</h3>
               <div className="overflow-x-auto mb-6">
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
                        <tr key={item.size} className={item.total > 0 ? 'bg-emerald-50/30' : ''}>
                          <td className="px-6 py-4 font-bold">{item.size}</td>
                          <td className="px-6 py-4 text-center">{item.fem > 0 ? <span className="text-emerald-700 font-bold">{item.fem}</span> : <span className="text-neutral-300">-</span>}</td>
                          <td className="px-6 py-4 text-center">{item.masc > 0 ? <span className="text-emerald-700 font-bold">{item.masc}</span> : <span className="text-neutral-300">-</span>}</td>
                          <td className="px-6 py-4 text-center">{item.uni > 0 ? <span className="text-emerald-700 font-bold">{item.uni}</span> : <span className="text-neutral-300">-</span>}</td>
                          <td className="px-6 py-4 text-right font-black text-indigo-700">{item.total > 0 ? item.total : <span className="text-neutral-400">0</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>

               {isDeportiva && (Object.keys(shortsSummary).length > 0 || totalSocks > 0) && (
                 <>
                   <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Extras Deportivos</h3>
                   <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row gap-8">
                     {Object.keys(shortsSummary).length > 0 && (
                       <div className="flex-1">
                         <span className="text-xs font-bold text-indigo-900 block mb-2 border-b border-neutral-300 pb-1">Confección de Shorts</span>
                         <ul className="space-y-1">
                           {Object.entries(shortsSummary).map(([sz, qty]) => (
                             <li key={`sum-${sz}`} className="text-sm flex justify-between">Talle <strong>{sz}</strong> <span className="font-bold text-indigo-600">{qty} und.</span></li>
                           ))}
                         </ul>
                       </div>
                     )}
                     {totalSocks > 0 && (
                       <div className="flex-1">
                         <span className="text-xs font-bold text-indigo-900 block mb-2 border-b border-neutral-300 pb-1">Medias</span>
                         <div className="text-sm flex justify-between">Total pares: <span className="font-bold text-indigo-600">{totalSocks} pares</span></div>
                       </div>
                     )}
                   </div>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Papelera */}
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

        {/* Modal Pago (Gestor Señas) */}
        {paymentModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
             <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-indigo-900 flex items-center gap-2"><DollarSign className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full p-0.5" /> Registrar Pago</h3>
                   <button onClick={() => setPaymentModal({isOpen: false, order: null, amount: 0})} className="text-neutral-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg mb-4 text-sm text-center">
                   <p className="text-neutral-500 mb-1">Total del pedido de {paymentModal.order.name}</p>
                   <p className="text-xl font-black text-indigo-900">{new Intl.NumberFormat('es-PY').format(getUnitPrice(paymentModal.order) * paymentModal.order.quantity)} Gs.</p>
                </div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Monto entregado hasta ahora (Gs):</label>
                <input 
                  type="number" value={paymentModal.amount} onChange={(e) => setPaymentModal({...paymentModal, amount: e.target.value})} 
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg text-center mb-4" 
                />
                <button onClick={savePayment} className="w-full bg-emerald-500 text-neutral-900 font-black py-3 rounded-xl hover:bg-emerald-400 transition-all">Guardar Pago</button>
             </div>
          </div>
        )}

        {/* Modal de Login Admin */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Lock className="w-5 h-5" /> Iniciar Sesión</h3>
                <button onClick={() => setShowAdminLogin(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="relative mb-4">
                <input type={showPassword ? "text" : "password"} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="PIN Administrador" onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500"><EyeOff className="w-5 h-5" /></button>
              </div>
              {pinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
              <button onClick={handleAdminLogin} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">Ingresar</button>
            </div>
          </div>
        )}

        {/* Modal de Acceso Modo Supremo */}
        {showGroupAuth && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-indigo-900 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Modo Supremo</h3>
                <button onClick={() => {setShowGroupAuth(false); setGroupPinError(false); setGroupPin(''); setShowGroupPassword(false);}} className="text-neutral-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="relative mb-4">
                <input type={showGroupPassword ? "text" : "password"} value={groupPin} onChange={(e) => setGroupPin(e.target.value)} placeholder="Contraseña Maestra" onKeyDown={(e) => e.key === 'Enter' && handleGroupAuth()} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none pr-12" />
                <button type="button" onClick={() => setShowGroupPassword(!showGroupPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500"><EyeOff className="w-5 h-5" /></button>
              </div>
              <button onClick={handleGroupAuth} className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all">Activar Modo Supremo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}