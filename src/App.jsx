import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Shirt, PlusCircle, ClipboardList, Trash2, User, Hash, Phone,
  Loader2, Layers, Lock, Unlock, X, Eye, EyeOff, Download,
  FileText, Info, AlertCircle, Search, CheckCircle2, Edit,
  Filter, Link2, ShieldAlert, MessageCircle, DollarSign,
  TrendingUp, Scissors, History, KeyRound, RefreshCw,
  BarChart3, ExternalLink, Receipt, Target, QrCode,
  MapPin, Moon, Sun, ArrowRight, ArrowLeft,
  ImagePlus, Smartphone
} from "lucide-react";

// ✅ IMPORTS CORRECTOS
import { useDebounce } from "./hooks/useDebounce";
import PricingTable from "./components/PricingTable";

import {
  SIZES_UNIVERSAL,
  AGE_RANGES,
  PRECIOS_BASE,
  PRECIOS_CAMISILLA
} from "./utils/constants";

import {
  formatDate,
  formatNumber,
  formatCurrency,
  extractDetails
} from "./utils/formatters";

import {
  canEditPrice,
  canDeletePermanent,
  canChangePassword
} from "./utils/permissions";

// ==========================================
// HOOK DE OPTIMIZACIÓN (DEBOUNCE)
// ==========================================
// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const supabaseRequest = async (path, method = 'GET', body = null) => {
  if (!supabaseUrl || supabaseUrl.includes('TU_URL_AQUI')) return { data: null, error: 'Configuración pendiente.' };
  const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, { method, headers, body: body ? JSON.stringify(body) : null });
    if (!response.ok) throw new Error(await response.text());
    const data = response.status !== 204 ? await response.json() : null;
    return { data, error: null };
  } catch (error) { return { data: null, error: error.message }; }
};

// ==========================================
// CONSTANTES Y PRECIOS
// ==========================================
// ==========================================
// FUNCIONES UTILITARIAS
// ==========================================
// ==========================================
// COMPONENTES AUXILIARES
// ==========================================
const HelperTooltip = React.memo(({ text, darkMode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex items-center align-middle z-30">
      <button type="button" onClick={() => setShow(!show)} onBlur={() => setTimeout(() => setShow(false), 200)} className={`rounded-full p-0.5 transition-colors focus:outline-none ${darkMode ? 'text-indigo-400 hover:bg-slate-700' : 'text-indigo-500 hover:bg-indigo-100'}`} title="Más información"><Info className="w-4 h-4" /></button>
      {show && (
        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 text-xs leading-snug rounded-xl shadow-2xl pointer-events-none font-medium text-center z-50 ${darkMode ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-indigo-900 text-indigo-50 border border-indigo-800'}`}>
          {text}<div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${darkMode ? 'border-t-slate-700' : 'border-t-indigo-900'}`}></div>
        </div>
      )}
    </div>
  );
});

const SuccessAnimation = React.memo(({ themeIndex }) => {
  const theme = ANIMATION_THEMES[themeIndex] || ANIMATION_THEMES[0];
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="absolute" style={{ left: `${Math.random() * 100}vw`, fontSize: `${1.5 + Math.random() * 2}rem`, animation: `${theme.a} ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 1.5}s forwards`, opacity: 0 }}>
          {theme.e[Math.floor(Math.random() * theme.e.length)]}
        </div>
      ))}
    </div>
  );
});

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const t = useMemo(() => ({
    page: darkMode ? 'bg-slate-950 text-slate-200' : 'bg-neutral-100 text-neutral-800',
    card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-neutral-200',
    input: darkMode ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 shadow-inner' : 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 shadow-sm focus:bg-white focus:border-indigo-400',
    label: darkMode ? 'text-slate-300 font-semibold' : 'text-neutral-700 font-bold',
    muted: darkMode ? 'text-slate-400' : 'text-neutral-500',
    tableHead: darkMode ? 'bg-slate-900/80 text-slate-300' : 'bg-neutral-50 text-neutral-500',
    rowHover: darkMode ? 'hover:bg-slate-800' : 'hover:bg-neutral-50',
    border: darkMode ? 'border-slate-800' : 'border-neutral-200',
    divide: darkMode ? 'divide-slate-800' : 'divide-neutral-200',
    indigoBg: darkMode ? 'bg-indigo-950/40 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100',
    indigoText: darkMode ? 'text-indigo-300' : 'text-indigo-900',
    box: darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-neutral-300 shadow-sm',
    sponsorCard: darkMode ? 'bg-slate-900 border-slate-800 from-slate-950 to-slate-900' : 'bg-white border-neutral-200 from-neutral-100 to-white',
  }), [darkMode]);

  const [orders, setOrders] = useState([]);
  const [groupSettings, setGroupSettings] = useState([]); 
  const [groupConfigs, setGroupConfigs] = useState({}); 
  const [loading, setLoading] = useState(true);
  
  const [visitorLocation, setVisitorLocation] = useState('');
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  const [adminGroupFilter, setAdminGroupFilter] = useState('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminLegend, setShowAdminLegend] = useState(false);
  
  const [currentAdminPassword, setCurrentAdminPassword] = useState('brooguin2025'); 
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [isMasterOwner, setIsMasterOwner] = useState(false); 
  const [isCreator, setIsCreator] = useState(false); 
  
  const [showGroupAuth, setShowGroupAuth] = useState(false);
  const [groupPin, setGroupPin] = useState('');
  const [groupPinError, setGroupPinError] = useState(false);
  const [showGroupPassword, setShowGroupPassword] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);

  const canManageSensitive = canManageSensitiveActions({ isCreator, isMasterOwner });

  const [paymentModal, setPaymentModal] = useState({ isOpen: false, order: null, amount: 0, isSaved: false });
  const [priceModal, setPriceModal] = useState({ isOpen: false, order: null, newTotal: 0 }); // Modal de Precio

  const [showChangePass, setShowChangePass] = useState(false);
  const [masterPassInput, setMasterPassInput] = useState('');
  const [newAdminPassInput, setNewAdminPassInput] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogsData, setAuditLogsData] = useState([]);
  
  const [qrModal, setQrModal] = useState({ isOpen: false, link: '', groupName: '' });
  const [renameModal, setRenameModal] = useState({ isOpen: false, oldName: '', newName: '' });

  const [siteMetrics, setSiteMetrics] = useState({ visits: 0, sponsorClicks: 0 });
  const [activeAnimationTheme, setActiveAnimationTheme] = useState(null);
  
  const [undoDeleteId, setUndoDeleteId] = useState(null);
  const [archivedGroups, setArchivedGroups] = useState([]);
  const [cleanupRun, setCleanupRun] = useState(false);
  const [groupSort, setGroupSort] = useState({ key: 'lastOrder', direction: 'desc' });
  
  // IMPLEMENTACIÓN DE DEBOUNCE PARA OPTIMIZAR BUSCADORES
  const [searchTerm, setSearchTerm] = useState(''); 
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const debouncedGlobalSearchTerm = useDebounce(globalSearchTerm, 300);

  const [archivedGroupSearch, setArchivedGroupSearch] = useState('');
  const debouncedArchivedSearch = useDebounce(archivedGroupSearch, 300);

  const [deletedOrderSearch, setDeletedOrderSearch] = useState('');
  const debouncedDeletedSearch = useDebounce(deletedOrderSearch, 300);

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [activeGroup, setActiveGroup] = useState(() => urlParams.get('grupo') || 'General');

  const changeAdminFilter = useCallback((newGroup) => {
    setAdminGroupFilter(newGroup);
    if (newGroup !== 'Todos') {
      setActiveGroup(newGroup);
      try {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('grupo', newGroup);
        window.history.pushState({}, '', newUrl);
      } catch(e) {}
    }
  }, []);

  const urlEstilo = urlParams.get('estilo') || (urlParams.get('tipo') === 'Remera Piqué' ? 'Piqué' : 'Deportiva');
  const [newGroupConfig, setNewGroupConfig] = useState({ name: '', estilo: 'Deportiva' });

  const isPreviewMode = showGroupManager && isGroupAdmin;
  const contextualGroup = isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : (isPreviewMode ? (newGroupConfig.name || 'Vista Previa') : activeGroup);
  const displayGroup = isGroupAdmin && adminGroupFilter === 'Todos' ? 'Visión Global (Todos)' : contextualGroup;

  const archivedNames = useMemo(() => archivedGroups.map(g => g.name), [archivedGroups]);

  const activeGroupConfig = useMemo(() => {
    if (isPreviewMode) return newGroupConfig;
    const conf = groupConfigs[contextualGroup];
    if (conf) return conf;

    const groupOrders = orders.filter(o => o.group_name === contextualGroup && !o.deleted);
    let est = urlEstilo;
    if (groupOrders.length > 0) {
       const isDep = groupOrders.some(o => o.observations && o.observations.includes('[#'));
       const isCam = groupOrders.some(o => o.observations && o.observations.includes('Camisilla'));
       est = isCam ? 'Camisilla' : (isDep ? 'Deportiva' : 'Piqué');
    }
    return { estilo: est };
  }, [contextualGroup, groupConfigs, orders, isPreviewMode, newGroupConfig, urlEstilo]);

  const displayEstilo = activeGroupConfig?.estilo || 'Deportiva';
  const isContextDeportiva = displayEstilo === 'Deportiva' || displayEstilo === 'Camisilla';
  const costoMangaLarga = isContextDeportiva ? 15000 : 10000;

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '',
    playerName: '', playerNumber: '', isGoalkeeper: false, combo: 'Solo Remera', tela: 'Premium',
    shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: '' 
  });

  const isCamisilla = displayEstilo === 'Camisilla';
  const allowLongSleeve = !isCamisilla || formData.isGoalkeeper; 

  const activeSizes = SIZES_UNIVERSAL;

  useEffect(() => {
    if (!editingId) {
      let defCombo = displayEstilo === 'Camisilla' ? 'Solo Camisilla' : 'Solo Remera';
      setFormData(prev => ({ ...prev, size: activeSizes[0], shortSize: activeSizes[0], combo: defCombo }));
    }
  }, [formData.edad, displayEstilo, activeSizes, editingId]);

  useEffect(() => {
    fetchOrdersAndSettings();
    trackVisit();
    const fetchLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.city) setVisitorLocation(`${data.city}, ${data.country_name}`);
      } catch (e) { console.log("Rastreo IP fallido."); }
    };
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && activeGroup !== 'General' && !groupConfigs[activeGroup] && orders.some(o => o.group_name === activeGroup && !o.deleted)) {
      saveToGlobalSettings(`conf_${activeGroup}`, JSON.stringify(activeGroupConfig));
      setGroupConfigs(prev => ({...prev, [activeGroup]: activeGroupConfig}));
    }
  }, [loading, activeGroup, groupConfigs, orders, activeGroupConfig]);

  useEffect(() => {
    if (isAdmin) {
      setShowAdminLegend(true);
      const timer = setTimeout(() => setShowAdminLegend(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, isGroupAdmin, isMasterOwner, isCreator]);

  const saveToGlobalSettings = async (id, value) => {
    const res = await supabaseRequest(`global_settings?id=eq.${id}`);
    if (res.data && res.data.length > 0) await supabaseRequest(`global_settings?id=eq.${id}`, 'PATCH', { value });
    else await supabaseRequest('global_settings', 'POST', { id, value });
  };

  const trackVisit = async () => {
    if (!sessionStorage.getItem('brooguin_visited')) {
      sessionStorage.setItem('brooguin_visited', 'true');
      const res = await supabaseRequest('global_settings?id=eq.page_visits', 'GET');
      let currentVisits = 0;
      if (res.data && res.data.length > 0) {
        currentVisits = parseInt(res.data[0].value) || 0;
        await supabaseRequest('global_settings?id=eq.page_visits', 'PATCH', { value: (currentVisits + 1).toString() });
      } else {
        await supabaseRequest('global_settings', 'POST', { id: 'page_visits', value: '1' });
      }
    }
  };

  const performAutoCleanups = async (ordersData, archivedGroupsData) => {
    if (cleanupRun) return;
    setCleanupRun(true);
    const now = Date.now();
    let needsRefetch = false;

    for (const o of ordersData) {
      if (o.deleted) {
        const delMatch = o.observations?.match(/\[DEL:(\d+)\]/);
        const delTime = delMatch ? parseInt(delMatch[1]) : new Date(o.created_at).getTime();
        if ((now - delTime) / (1000 * 60 * 60) >= 48) {
          await supabaseRequest(`orders?id=eq.${o.id}`, 'DELETE');
          needsRefetch = true;
        }
      }
    }
    const validArchived = [];
    for (const g of archivedGroupsData) {
      if ((now - g.archivedAt) / (1000 * 60 * 60 * 24) >= 40) {
         await supabaseRequest(`orders?group_name=eq.${g.name}`, 'DELETE');
         await supabaseRequest(`global_settings?id=eq.conf_${g.name}`, 'DELETE');
         needsRefetch = true;
      } else validArchived.push(g);
    }
    if (validArchived.length !== archivedGroupsData.length) {
       await saveToGlobalSettings('archived_groups', JSON.stringify(validArchived));
       setArchivedGroups(validArchived);
    }
    if (needsRefetch) fetchOrdersAndSettings(); 
  };

  const handleSponsorClick = async () => {
    const currentClicks = siteMetrics.sponsorClicks;
    setSiteMetrics(prev => ({ ...prev, sponsorClicks: currentClicks + 1 }));
    const res = await supabaseRequest('global_settings?id=eq.sponsor_clicks', 'GET');
    if (res.data && res.data.length > 0) await supabaseRequest('global_settings?id=eq.sponsor_clicks', 'PATCH', { value: (currentClicks + 1).toString() });
    else await supabaseRequest('global_settings', 'POST', { id: 'sponsor_clicks', value: '1' });
    window.open(`https://wa.me/595984948834?text=${encodeURIComponent("Hola quiero ser sponsor de la página de Brooguin")}`, '_blank');
  };

  const handleCatalogContact = useCallback(() => {
    const msg = "Hola, vengo desde la página de Brooguin Sport. ¡Estoy interesado/a en realizar un pedido personalizado y me gustaron los diseños!";
    window.open(`https://wa.me/595984948834?text=${encodeURIComponent(msg)}`, '_blank');
  }, []);

  const fetchOrdersAndSettings = useCallback(async () => {
    setLoading(true);
    const [resOrders, resSettings, resGlobal] = await Promise.all([
      supabaseRequest('orders?select=*&order=created_at.desc'),
      supabaseRequest('group_settings?select=*'),
      supabaseRequest('global_settings?select=*') 
    ]);
    if (resOrders.data) setOrders(resOrders.data);
    if (resSettings.data) setGroupSettings(resSettings.data);
    if (resGlobal.data) {
      const passObj = resGlobal.data.find(s => s.id === 'admin_password');
      if (passObj) setCurrentAdminPassword(passObj.value);
      const visitsObj = resGlobal.data.find(s => s.id === 'page_visits');
      const clicksObj = resGlobal.data.find(s => s.id === 'sponsor_clicks');
      setSiteMetrics({ visits: visitsObj ? parseInt(visitsObj.value) : 0, sponsorClicks: clicksObj ? parseInt(clicksObj.value) : 0 });
      const archivedObj = resGlobal.data.find(s => s.id === 'archived_groups');
      const parsedArchived = archivedObj ? JSON.parse(archivedObj.value) : [];
      setArchivedGroups(parsedArchived);
      const parsedConfigs = {};
      resGlobal.data.forEach(item => {
        if (item.id.startsWith('conf_')) {
          try { parsedConfigs[item.id.replace('conf_', '')] = JSON.parse(item.value); } catch(e){}
        }
      });
      setGroupConfigs(parsedConfigs);
      setLoading(false);
      performAutoCleanups(resOrders.data || [], parsedArchived);
    }
  }, [performAutoCleanups]);

  const logAction = async (action, details) => {
    let actor = isMasterOwner ? 'Dueño Supremo' : isCreator ? 'Admin Creador' : 'Admin Normal';
    try { await supabaseRequest('audit_logs', 'POST', { action, details: `${details} (Por: ${actor})`, group_name: displayGroup }); } catch (err) {}
  };

  const fetchAuditLogs = async () => {
    const { data } = await supabaseRequest('audit_logs?select=*&order=created_at.desc');
    if (data) setAuditLogsData(data);
  };

  const currentGroupSettings = groupSettings.find(g => g.group_name === displayGroup);
  const isGroupLocked = currentGroupSettings ? currentGroupSettings.is_locked : false;

  const handleChange = useCallback((e) => {
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
  }, []);

  const calculateCurrentTotal = useCallback(() => {
    let unitPrice = 0; 
    if (displayEstilo === 'Deportiva') {
       unitPrice = PRECIOS_BASE[formData.edad]?.[formData.tela]?.[formData.combo] || 85000;
    } else if (displayEstilo === 'Camisilla') {
       unitPrice = PRECIOS_CAMISILLA[formData.edad]?.[formData.tela]?.[formData.combo] || 80000;
    } else {
       unitPrice = 95000; 
    }
    if (formData.longSleeve && allowLongSleeve) unitPrice += costoMangaLarga;
    if (['XXL', 'XXXL'].includes(formData.size)) unitPrice += 10000;

    return unitPrice * (parseInt(formData.quantity) || 1);
  }, [displayEstilo, formData, allowLongSleeve, costoMangaLarga]);

  const currentOrderTotal = calculateCurrentTotal();

  const allGroupNames = useMemo(() => {
    const groupsFromSettings = groupSettings.map(g => g.group_name);
    const groupsFromOrders = orders.map(o => o.group_name || 'General');
    return [...new Set([...groupsFromSettings, ...groupsFromOrders])].filter(Boolean).filter(g => !archivedNames.includes(g));
  }, [groupSettings, orders, archivedNames]);

  const getGroupLink = useCallback((groupName) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.append('grupo', groupName);
    let conf = groupConfigs[groupName];
    if (groupName === newGroupConfig.name && isPreviewMode) conf = newGroupConfig;
    if (conf) params.append('estilo', conf.estilo); 
    return `${baseUrl}?${params.toString()}`;
  }, [groupConfigs, newGroupConfig, isPreviewMode]);

  const handleFilterFromDirectory = useCallback((groupName) => {
    changeAdminFilter(groupName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [changeAdminFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.quantity < 1) return;
    if (!/^09\d{8}$/.test(formData.phone.trim())) { alert("Teléfono debe tener 10 dígitos y empezar con 09."); return; }

    let prefix = '';
    const currentUnitPrice = calculateCurrentTotal() / (parseInt(formData.quantity) || 1);
    
    if (isContextDeportiva) {
      const shortFormat = (formData.combo.includes('Short') || formData.combo === 'Equipo Completo') ? `${formData.shortSize}${formData.gender === 'Femenino' ? ' ('+formData.femaleShortType+')' : ''}` : 'NO';
      const ageInfo = formData.edad === 'Infantil' ? `Infantil (${formData.ageRange})` : 'Adultos';
      prefix = `[👔 ${ageInfo} | Tela: ${formData.tela} | Combo: ${formData.combo} | #${formData.playerNumber || 'S/N'} | ${formData.playerName?.toUpperCase() || 'SIN NOMBRE'} | Short: ${shortFormat} | Arquero: ${formData.isGoalkeeper ? 'SI' : 'NO'}] `;
    } else {
      const ageInfo = formData.edad === 'Infantil' ? `Infantil (${formData.ageRange})` : 'Adultos';
      prefix = `[👔 ${ageInfo} | Uniforme Piqué | Calidad: Premium] `;
    }
    
    prefix += `[Precio: ${currentUnitPrice}] `;
    
    let oldCleanObs = editingId && formData.observations ? extractDetails(formData.observations).rest : formData.observations;
    let silentLocStr = !editingId && visitorLocation ? ` [Loc: ${visitorLocation}]` : '';
    const finalObservations = `${prefix}${oldCleanObs ? 'Obs: ' + oldCleanObs : ''}${silentLocStr}`.trim();
    
    const orderData = {
      name: formData.name, phone: formData.phone || '-', size: formData.size, gender: formData.gender, quantity: parseInt(formData.quantity, 10), longSleeve: allowLongSleeve ? formData.longSleeve : false,
      observations: finalObservations, group_name: editingId ? (isCreator ? formData.group_name : formData.originalGroup) : contextualGroup 
    };
    
    try {
      if (editingId) {
        await supabaseRequest(`orders?id=eq.${editingId}`, 'PATCH', orderData);
        setEditingId(null);
      } else {
        await supabaseRequest('orders', 'POST', { ...orderData, paymentStatus: 'Pendiente', deleted: false, amount_paid: 0 });
        setActiveAnimationTheme(Math.floor(Math.random() * 6));
      }
      fetchOrdersAndSettings();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); 
      setTimeout(() => setActiveAnimationTheme(null), 5000); 
      let defCombo = displayEstilo === 'Camisilla' ? 'Solo Camisilla' : 'Solo Remera';
      setFormData({ name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '', playerName: '', playerNumber: '', isGoalkeeper: false, combo: defCombo, tela: 'Premium', shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: '' });
    } catch (error) { alert("Error de red al guardar el pedido."); }
  };

  const toggleGroupLock = async () => {
    if (!isAdmin) return;
    const newStatus = !isGroupLocked;
    try {
      const exists = groupSettings.find(g => g.group_name === displayGroup);
      if (exists) await supabaseRequest(`group_settings?group_name=eq.${displayGroup}`, 'PATCH', { is_locked: newStatus });
      else await supabaseRequest('group_settings', 'POST', { group_name: displayGroup, is_locked: newStatus });
      logAction(newStatus ? 'Cerró Lista' : 'Reabrió Lista', `Afectó al grupo ${displayGroup}`);
      await fetchOrdersAndSettings();
    } catch (err) { alert("Error al bloquear la lista."); }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupConfig.name.trim()) return;
    const cleanName = newGroupConfig.name.trim().replace(/\s+/g, '');
    await saveToGlobalSettings(`conf_${cleanName}`, JSON.stringify(newGroupConfig));
    setGroupConfigs(prev => ({...prev, [cleanName]: newGroupConfig}));
    const link = getGroupLink(cleanName);
    const textArea = document.createElement("textarea"); textArea.value = link; document.body.appendChild(textArea); textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
    setQrModal({ isOpen: true, link: link, groupName: cleanName });
    setNewGroupConfig({ ...newGroupConfig, name: '' });
  };

  const handleRenameGroupSubmit = async () => {
    if (!renameModal.newName.trim() || renameModal.newName === renameModal.oldName) return;
    const cleanNewName = renameModal.newName.trim().replace(/\s+/g, '');
    setLoading(true);
    try {
      await supabaseRequest(`orders?group_name=eq.${renameModal.oldName}`, 'PATCH', { group_name: cleanNewName });
      await supabaseRequest(`audit_logs?group_name=eq.${renameModal.oldName}`, 'PATCH', { group_name: cleanNewName });
      const setting = groupSettings.find(g => g.group_name === renameModal.oldName);
      if (setting) {
        await supabaseRequest(`group_settings?group_name=eq.${renameModal.oldName}`, 'DELETE');
        await supabaseRequest('group_settings', 'POST', { group_name: cleanNewName, is_locked: setting.is_locked });
      }
      const oldConf = groupConfigs[renameModal.oldName];
      if (oldConf) {
         await saveToGlobalSettings(`conf_${cleanNewName}`, JSON.stringify(oldConf));
         await supabaseRequest(`global_settings?id=eq.conf_${renameModal.oldName}`, 'DELETE');
      }
      logAction('Renombró Grupo', `El grupo ${renameModal.oldName} ahora se llama ${cleanNewName}`);
      if (adminGroupFilter === renameModal.oldName) changeAdminFilter(cleanNewName);
      else if (activeGroup === renameModal.oldName) setActiveGroup(cleanNewName);
      setRenameModal({ isOpen: false, oldName: '', newName: '' });
      alert(`¡Grupo renombrado exitosamente a "${cleanNewName}"!`);
      await fetchOrdersAndSettings();
    } catch (err) { alert("Error al renombrar el grupo."); }
    setLoading(false);
  };

  const handleArchiveGroup = async (groupName) => {
    if(!confirm(`¿Mover el grupo "${groupName}" a la papelera?\nSe conservarán sus datos por 40 días antes de eliminarse para siempre.`)) return;
    const newArchived = [...archivedGroups, { name: groupName, archivedAt: Date.now() }];
    setArchivedGroups(newArchived);
    await saveToGlobalSettings('archived_groups', JSON.stringify(newArchived));
    logAction('Archivó Grupo', `El grupo ${groupName} fue movido a la papelera`);
    if (adminGroupFilter === groupName) changeAdminFilter('Todos');
    fetchOrdersAndSettings();
  };

  const handleRestoreGroup = async (groupName) => {
    const newArchived = archivedGroups.filter(g => g.name !== groupName);
    setArchivedGroups(newArchived);
    await saveToGlobalSettings('archived_groups', JSON.stringify(newArchived));
    logAction('Restauró Grupo', `El grupo ${groupName} fue restaurado de la papelera`);
    fetchOrdersAndSettings();
  };

  // ==========================================
  // FUNCIONES DE PRECIOS Y PAGOS
  // ==========================================
  const getUnitPrice = useCallback((order) => {
    const match = order.observations?.match(/\[Precio:\s*(\d+)\]/);
    if (match) return parseInt(match[1], 10);
    const isDep = order.observations?.includes('Combo:') || order.observations?.includes('Short:') || order.observations?.includes('[#');
    const mangaLargaCost = isDep ? 15000 : 10000;
    return 85000 + (order.longSleeve ? mangaLargaCost : 0);
  }, []);

  const getOrderFinancials = useCallback((order) => {
    const total = getUnitPrice(order) * order.quantity;
    const paid = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    return { total, paid, balance: total - paid };
  }, [getUnitPrice]);

  // ABRIR MODAL PARA AJUSTAR PRECIO FINAL
  const handleOpenPriceModal = useCallback((order) => {
    if (!canManageSensitive) return;
    const currentTotal = getUnitPrice(order) * order.quantity;
    setPriceModal({ isOpen: true, order, newTotal: currentTotal });
  }, [canManageSensitive, getUnitPrice]);

  // GUARDAR EL NUEVO PRECIO EN SUPABASE
  const saveNewPrice = async () => {
    if (!canManageSensitive || !priceModal.order) return;
    const { order, newTotal } = priceModal;
    
    // Calculamos el nuevo precio unitario
    const newUnitPrice = Math.round(newTotal / order.quantity); 
    
    let newObs = order.observations || '';
    if (/\[Precio:\s*\d+\]/.test(newObs)) {
       newObs = newObs.replace(/\[Precio:\s*\d+\]/, `[Precio: ${newUnitPrice}]`);
    } else {
       newObs = `[Precio: ${newUnitPrice}] ` + newObs;
    }
    
    try {
      await supabaseRequest(`orders?id=eq.${order.id}`, 'PATCH', { observations: newObs });
      logAction('Ajuste de Precio Manual', `El pedido de ${order.name} cambió a ${newTotal} Gs.`);
      setPriceModal({ isOpen: false, order: null, newTotal: 0 });
      fetchOrdersAndSettings();
    } catch (err) { alert("Error al actualizar precio."); }
  };

  const handleOpenPayment = useCallback((order) => {
    if (!isAdmin) return;
    const total = getUnitPrice(order) * order.quantity;
    const amount = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    setPaymentModal({ isOpen: true, order, amount: amount, isSaved: false });
  }, [isAdmin, getUnitPrice]);

  const savePayment = async () => {
    if (!isAdmin || !paymentModal.order) return;
    const amount = parseInt(paymentModal.amount) || 0;
    const total = getUnitPrice(paymentModal.order) * paymentModal.order.quantity;
    let newStatus = 'Pendiente';
    if (amount > 0 && amount < total) newStatus = 'Señado';
    if (amount >= total) newStatus = 'Pagado';

    try {
      await supabaseRequest(`orders?id=eq.${paymentModal.order.id}`, 'PATCH', { amount_paid: amount, paymentStatus: newStatus });
      logAction('Actualizó Pago', `De ${paymentModal.order.name} a ${amount} Gs.`);
      const updatedOrder = {...paymentModal.order, amount_paid: amount, paymentStatus: newStatus};
      setPaymentModal({ isOpen: true, order: updatedOrder, amount: amount, isSaved: true }); 
      fetchOrdersAndSettings();
    } catch (err) { alert("Error guardando el pago"); }
  };

  const getWhatsAppLink = useCallback((order) => {
    let phone = order.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '595' + phone.substring(1);
    const msg = `Hola *${order.name}*! Te escribo por tu pedido de indumentaria para el grupo/equipo *${order.group_name || 'General'}*.\n\nPor favor, avisame si está todo correcto para avanzar o si te falta abonar. ¡Gracias!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, []);

  const getReceiptLink = useCallback((order) => {
    let phone = order.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '595' + phone.substring(1);
    const fins = getOrderFinancials(order);
    const { details } = extractDetails(order.observations);
    const desc = `${order.size} ${order.gender[0]} - ${details.replace(/\[|\]/g, '')}`;
    const msg = `🧾 *RECIBO VIRTUAL - BROOGUIN SPORT* 🦊\n\n¡Hola *${order.name}*! Confirmamos el registro de tu pago.\n\n*Detalles del Pedido:*\nGrupo: ${order.group_name || 'General'}\nPrenda: ${desc} (x${order.quantity})\n\n*Estado de Cuenta:*\nTotal del Pedido: ${formatNumber(fins.total)} Gs.\n💰 *Pagado hasta ahora: ${formatNumber(fins.paid)} Gs.*\n⚠️ *Saldo Pendiente: ${formatNumber(fins.balance)} Gs.*\n\n¡Gracias por tu confianza!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [getOrderFinancials]);

  const handleChangePasswordSubmit = async () => {
    if (!canManageSensitive) { setPassChangeError('Solo el admin supremo o el creador pueden cambiar la contraseña.'); return; }
    if (masterPassInput !== MASTER_AUTHORIZATION) { setPassChangeError('Clave de autorización incorrecta.'); return; }
    if (!newAdminPassInput || newAdminPassInput.length < 4) { setPassChangeError('La nueva contraseña debe ser más larga.'); return; }
    try {
      await saveToGlobalSettings('admin_password', newAdminPassInput);
      setCurrentAdminPassword(newAdminPassInput);
      logAction('Cambió Clave Admin', 'Nueva clave configurada');
      alert("¡Contraseña de Administrador cambiada exitosamente!");
      setShowChangePass(false); setMasterPassInput(''); setNewAdminPassInput(''); setPassChangeError('');
    } catch (err) { setPassChangeError('Error de red al guardar.'); }
  };

  const copyExistingGroupLink = useCallback((groupName) => {
    const link = getGroupLink(groupName);
    const textArea = document.createElement("textarea"); textArea.value = link; document.body.appendChild(textArea); textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
    setQrModal({ isOpen: true, link: link, groupName: groupName });
  }, [getGroupLink]);

  const handleShareCurrentGroup = () => {
    const link = getGroupLink(displayGroup);
    setQrModal({ isOpen: true, link: link, groupName: displayGroup });
  };

  const handleEditClick = useCallback((order) => {
    let pName = ''; let pNum = '';
    let combo = 'Solo Remera'; let tela = 'Premium';
    let eDad = 'Adultos'; let aRange = AGE_RANGES[1];
    let sSize = SIZES_UNIVERSAL[1]; let fShort = 'Standard'; let isGk = false;

    const obs = order.observations || '';
    if (obs.includes('Combo: Equipo Completo') || obs.includes('Combo: Remera + Short + Medias')) combo = 'Equipo Completo';
    else if (obs.includes('Combo: Remera + Short') || (obs.includes('Short: ') && !obs.includes('Short: NO'))) combo = 'Remera + Short'; 
    else if (obs.includes('Combo: Camisilla + Short')) combo = 'Camisilla + Short';
    else if (obs.includes('Combo: Solo Camisilla')) combo = 'Solo Camisilla';
    
    if (obs.includes('Tela: Estandard') || obs.includes('Calidad: Estandard')) tela = 'Estandard';
    else if (obs.includes('Tela: Semi-Premium')) tela = 'Semi-Premium';
    
    if (obs.includes('Arquero: SI')) isGk = true;
    if (obs.includes('Infantil')) { eDad = 'Infantil'; const matchAge = obs.match(/Infantil \((.*?)\)/); if (matchAge) aRange = matchAge[1]; }
    
    const matchNum = obs.match(/#([0-9]+)/); if (matchNum) pNum = matchNum[1];
    const matchName = obs.match(/\|\s*#.*?\|\s*([^|]+)\s*\|/); if (matchName) pName = matchName[1].trim() === 'SIN NOMBRE' ? '' : matchName[1].trim();
    const matchShort = obs.match(/Short:\s*([^|\]]+)/);
    if (matchShort && matchShort[1].trim() !== 'NO') {
      const sData = matchShort[1].trim();
      if (sData.includes('(Corte Femenino)')) fShort = 'Femenino';
      sSize = sData.replace(/\s*\(.*?\)/, '').trim();
    }
    const { rest } = extractDetails(obs);

    setFormData({
      ...formData, name: order.name, phone: order.phone === '-' ? '' : (order.phone || ''), size: order.size, gender: order.gender, quantity: order.quantity, longSleeve: order.longSleeve || false, 
      observations: rest, originalGroup: order.group_name, group_name: order.group_name, 
      playerName: pName, playerNumber: pNum, combo, tela, edad: eDad, ageRange: aRange, shortSize: sSize || SIZES_UNIVERSAL[1], femaleShortType: fShort, isGoalkeeper: isGk
    });
    setEditingId(order.id); window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '', playerName: '', playerNumber: '', isGoalkeeper: false, combo: displayEstilo === 'Camisilla' ? 'Solo Camisilla' : 'Solo Remera', tela: 'Premium', shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: ''});
  };

  const handleDelete = useCallback(async (order) => {
    if (!isAdmin) return;
    const delTime = Date.now();
    const newObs = (order.observations || '') + ` [DEL:${delTime}]`;
    await supabaseRequest(`orders?id=eq.${order.id}`, 'PATCH', { deleted: true, observations: newObs });
    logAction('Eliminó Pedido', `Envió pedido a papelera`); 
    fetchOrdersAndSettings();
    setUndoDeleteId(order.id);
    setTimeout(() => { setUndoDeleteId(current => current === order.id ? null : current); }, 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, fetchOrdersAndSettings]);

  const handleUndoDelete = async () => {
    if (!undoDeleteId) return;
    const orderToRestore = orders.find(o => o.id === undoDeleteId);
    if (!orderToRestore) return;
    const newObs = (orderToRestore.observations || '').replace(/\s*\[DEL:\d+\]/g, '');
    await supabaseRequest(`orders?id=eq.${undoDeleteId}`, 'PATCH', { deleted: false, observations: newObs });
    logAction('Deshizo Eliminación', `Restauró pedido`);
    fetchOrdersAndSettings();
    setUndoDeleteId(null);
  };

  const handleRestore = useCallback(async (order) => {
    if (!isAdmin) return;
    const newObs = (order.observations || '').replace(/\s*\[DEL:\d+\]/g, '');
    await supabaseRequest(`orders?id=eq.${order.id}`, 'PATCH', { deleted: false, observations: newObs });
    logAction('Restauró Pedido', `Desde papelera`); fetchOrdersAndSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, fetchOrdersAndSettings]);

  const handlePermanentDelete = useCallback(async (id) => {
    if (!canManageSensitive) return; 
    if(!confirm("¿Estás seguro de eliminar esto permanentemente?")) return;
    await supabaseRequest(`orders?id=eq.${id}`, 'DELETE');
    logAction('Borro Permanente', `Destruyó pedido`); fetchOrdersAndSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageSensitive, fetchOrdersAndSettings]);

  const handleAdminLogin = () => {
    if (adminPin === currentAdminPassword) { setIsAdmin(true); setAdminGroupFilter(displayGroup); setShowAdminLogin(false); setPinError(false); setAdminPin(''); setShowPassword(false); }
    else setPinError(true);
  };
  
  const handleGroupAuth = () => {
    if (groupPin === 'marseo' || groupPin === 'lukasy67') { 
       setIsAdmin(true); setIsGroupAdmin(true); setIsCreator(true);
       setIsMasterOwner(groupPin === 'lukasy67');
       setShowGroupAuth(false); setShowGroupManager(true); setGroupPin(''); setGroupPinError(false); setShowGroupPassword(false); 
    } else setGroupPinError(true);
  };

  // --- FILTROS Y BÚSQUEDAS ---
  const globalFilteredOrders = useMemo(() => {
    if (!debouncedGlobalSearchTerm.trim()) return [];
    return orders.filter(o => !o.deleted && !archivedNames.includes(o.group_name) && ((o.name && o.name.toLowerCase().includes(debouncedGlobalSearchTerm.toLowerCase())) || (o.phone && o.phone.includes(debouncedGlobalSearchTerm)))).slice(0, 10); 
  }, [orders, debouncedGlobalSearchTerm, archivedNames]);

  const activeOrders = useMemo(() => {
    let filtered = orders.filter(o => !o.deleted && !archivedNames.includes(o.group_name || 'General'));
    if (!isGroupAdmin) filtered = filtered.filter(o => (o.group_name || 'General') === displayGroup);
    else if (adminGroupFilter !== 'Todos') filtered = filtered.filter(o => (o.group_name || 'General') === adminGroupFilter);
    return filtered;
  }, [orders, isGroupAdmin, displayGroup, adminGroupFilter, archivedNames]);

  const deletedOrders = useMemo(() => {
    let filtered = orders.filter(o => o.deleted && !archivedNames.includes(o.group_name || 'General'));
    if (!isGroupAdmin) filtered = filtered.filter(o => (o.group_name || 'General') === displayGroup);
    return filtered;
  }, [orders, isGroupAdmin, displayGroup, archivedNames]);

  const filteredDeletedOrders = useMemo(() => {
    if (!debouncedDeletedSearch.trim()) return deletedOrders;
    return deletedOrders.filter(o => 
      o.name.toLowerCase().includes(debouncedDeletedSearch.toLowerCase()) || 
      (o.group_name && o.group_name.toLowerCase().includes(debouncedDeletedSearch.toLowerCase()))
    );
  }, [deletedOrders, debouncedDeletedSearch]);

  const availableGroups = useMemo(() => {
    return ['Todos', ...new Set(orders.filter(o => !o.deleted).map(o => o.group_name || 'General'))]
      .filter(g => g === 'Todos' || !archivedNames.includes(g));
  }, [orders, archivedNames]);

  const summaryBySize = useMemo(() => SIZES_UNIVERSAL.map(size => {
      const sizeOrders = activeOrders.filter(order => order.size === size);
      const fem = sizeOrders.filter(o => o.gender === 'Femenino').reduce((sum, o) => sum + o.quantity, 0);
      const masc = sizeOrders.filter(o => o.gender === 'Masculino').reduce((sum, o) => sum + o.quantity, 0);
      const uni = sizeOrders.filter(o => o.gender === 'Unisex').reduce((sum, o) => sum + o.quantity, 0);
      return { size, fem, masc, uni, total: fem + masc + uni };
  }), [activeOrders]);

  const shortsSummary = useMemo(() => {
    const counts = {};
    activeOrders.forEach(o => {
       if (o.observations?.includes('Short:') && !o.observations?.includes('Short: NO')) {
          const match = o.observations.match(/Short:\s*([^|\]]+)/);
          if (match) { counts[match[1].trim()] = (counts[match[1].trim()] || 0) + o.quantity; }
       }
    }); return counts;
  }, [activeOrders]);

  const totalRevenue = useMemo(() => activeOrders.reduce((sum, order) => sum + getOrderFinancials(order).total, 0), [activeOrders, getOrderFinancials]);
  const totalCollected = useMemo(() => activeOrders.reduce((sum, order) => sum + getOrderFinancials(order).paid, 0), [activeOrders, getOrderFinancials]);
  const progressPercent = totalRevenue === 0 ? 0 : Math.round((totalCollected / totalRevenue) * 100);
  const totalSocks = useMemo(() => activeOrders.reduce((sum, o) => o.observations?.includes('Medias: SI') || o.observations?.includes('Combo: Equipo Completo') ? sum + o.quantity : sum, 0), [activeOrders]);
  const totalGarments = activeOrders.reduce((sum, order) => sum + order.quantity, 0);

  const globalStats = useMemo(() => {
    const allActive = orders.filter(o => !o.deleted && !archivedNames.includes(o.group_name || 'General'));
    let expected = 0; let collected = 0;
    allActive.forEach(o => {
      const f = getOrderFinancials(o);
      expected += f.total; collected += f.paid;
    });
    return { items: allActive.length, expected, collected, debt: expected - collected };
  }, [orders, archivedNames, getOrderFinancials]);

  const groupStatsList = useMemo(() => {
    const stats = {};
    orders.filter(o => !o.deleted).forEach(o => {
      const g = o.group_name || 'General';
      if (!stats[g]) { stats[g] = { name: g, count: 0, firstOrder: o.created_at, lastOrder: o.created_at, revenue: 0 }; }
      stats[g].count += o.quantity;
      stats[g].revenue += getUnitPrice(o) * o.quantity;
      if (new Date(o.created_at) < new Date(stats[g].firstOrder)) stats[g].firstOrder = o.created_at;
      if (new Date(o.created_at) > new Date(stats[g].lastOrder)) stats[g].lastOrder = o.created_at;
    });
    return Object.values(stats);
  }, [orders, getUnitPrice]);

  const sortedGroupStats = useMemo(() => {
     return [...groupStatsList].filter(g => !archivedNames.includes(g.name)).sort((a, b) => {
        let valA = a[groupSort.key]; let valB = b[groupSort.key];
        if (groupSort.key === 'name') { valA = (valA || '').toLowerCase(); valB = (valB || '').toLowerCase(); } 
        else { valA = valA ? new Date(valA).getTime() : 0; valB = valB ? new Date(valB).getTime() : 0; }
        if (valA < valB) return groupSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return groupSort.direction === 'asc' ? 1 : -1;
        return 0;
     });
  }, [groupStatsList, groupSort, archivedNames]);

  const filteredArchivedGroups = useMemo(() => {
    if (!debouncedArchivedSearch.trim()) return archivedGroups;
    return archivedGroups.filter(g => g.name.toLowerCase().includes(debouncedArchivedSearch.toLowerCase()));
  }, [archivedGroups, debouncedArchivedSearch]);

  const handleExportCSV = useCallback(() => {
    let csv = "\uFEFF"; 
    csv += `RESUMEN PARA CONFECCION - VISTA: ${isGroupAdmin ? adminGroupFilter : displayGroup}\n`;
    csv += "Talle Remera;Femenino;Masculino;Unisex;Total\n";
    summaryBySize.forEach(item => { csv += `${item.size};${item.fem || '-'};${item.masc || '-'};${item.uni || '-'};${item.total}\n`; });
    csv += `\nTOTAL REMERAS;;;; ${totalGarments}\n`;
    if (Object.keys(shortsSummary).length > 0 || totalSocks > 0) {
      csv += `\nEXTRAS DEPORTIVOS\nItem;Talle;Total\n`;
      Object.entries(shortsSummary).forEach(([size, qty]) => { csv += `Short;${size};${qty}\n`; });
      if (totalSocks > 0) csv += `Medias;-;${totalSocks}\n`;
    }
    csv += `\nTOTAL A RECAUDAR;;;; ${formatNumber(totalRevenue)} Gs\n\n`;
    csv += "LISTA DE PEDIDOS\nGrupo;Cliente;Telefono;Talle;Género;Manga;Cantidad;Estado de Pago;Observaciones;Fecha\n";
    activeOrders.forEach(o => {
      const { details, rest } = extractDetails(o.observations);
      const obsFinal = `${details} ${rest}`.trim();
      csv += `"${o.group_name || 'General'}";"${o.name}";"${o.phone || '-'}";"${o.size}";"${o.gender}";"${o.longSleeve ? 'Larga' : 'Corta'}";${o.quantity};"${o.paymentStatus || 'Pendiente'}";"${obsFinal}";"${formatDate(o.created_at)}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.setAttribute('download', `Pedidos_${isGroupAdmin ? adminGroupFilter : displayGroup}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }, [isGroupAdmin, adminGroupFilter, displayGroup, summaryBySize, totalGarments, shortsSummary, totalSocks, totalRevenue, activeOrders]);

  const handleExportPDF = useCallback(() => {
    const printWindow = window.open('', '_blank');
    let html = `
      <html><head><title>Pedidos - ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</title>
      <style>body { font-family: Arial, sans-serif; padding: 20px; color: #333; } h1 { color: #312e81; font-size: 24px; text-align: center; margin-bottom: 5px; } p.date { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; } h2 { color: #4338ca; font-size: 18px; margin-top: 30px; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; } table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; } th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; } th { background-color: #f3f4f6; color: #374151; } .text-right { text-align: right; } .text-center { text-align: center; } .font-bold { font-weight: bold; }</style></head>
      <body><h1>BROOGUIN SPORT - Reporte de Pedidos</h1><p class="date">Vista: ${isGroupAdmin ? adminGroupFilter : displayGroup} | ${new Date().toLocaleString()}</p>
      <h2>Resumen para Confección (Remeras)</h2><table><thead><tr><th>Talle</th><th class="text-center">Femenino</th><th class="text-center">Masculino</th><th class="text-center">Unisex</th><th class="text-right">Total</th></tr></thead><tbody>
    `;
    summaryBySize.forEach(item => {
      if (item.total > 0) html += `<tr><td class="font-bold">${item.size}</td><td class="text-center">${item.fem || '-'}</td><td class="text-center">${item.masc || '-'}</td><td class="text-center">${item.uni || '-'}</td><td class="text-right font-bold">${item.total}</td></tr>`;
    });
    html += `
            </tbody>
            <tfoot>
              <tr class="summary-total" style="background-color: #ecfdf5;"><td colspan="4" class="text-right font-bold">Total Remeras:</td><td class="text-right font-bold">${totalGarments}</td></tr>
              <tr class="summary-total" style="background-color: #e0e7ff;"><td colspan="4" class="text-right font-bold">Recaudación Total Calculada:</td><td class="text-right font-bold">${formatNumber(totalRevenue)} Gs</td></tr>
            </tfoot>
          </table>
    `;
    if (Object.keys(shortsSummary).length > 0 || totalSocks > 0) {
      html += `<h2>Extras Deportivos</h2><table style="width: 50%;"><thead><tr><th>Item</th><th>Talle / Tipo</th><th class="text-right">Total</th></tr></thead><tbody>`;
      Object.entries(shortsSummary).forEach(([size, qty]) => { html += `<tr><td>Short</td><td class="font-bold">${size}</td><td class="text-right">${qty}</td></tr>`; });
      if (totalSocks > 0) html += `<tr><td>Par de Medias</td><td class="font-bold">-</td><td class="text-right">${totalSocks}</td></tr>`;
      html += `</tbody></table>`;
    }
    html += `<h2>Lista de Pedidos Detallada</h2><table><thead><tr>${isGroupAdmin && adminGroupFilter === 'Todos' ? '<th>Grupo</th>' : ''}<th>Cliente</th><th>Talle</th><th>Género</th><th>Cant.</th><th>Estado</th><th>Datos Adicionales</th></tr></thead><tbody>`;
    activeOrders.forEach(o => {
      const { details, rest } = extractDetails(o.observations);
      const obsFinal = `${details} ${rest}`.trim();
      html += `<tr>${isGroupAdmin && adminGroupFilter === 'Todos' ? `<td>${o.group_name || 'General'}</td>` : ''}<td>${o.name} <br><small>${o.phone || ''}</small></td><td>${o.size}</td><td>${o.gender} ${o.longSleeve ? '(ML)' : ''}</td><td>${o.quantity}</td><td>${o.paymentStatus || 'Pendiente'}</td><td><small>${obsFinal}</small></td></tr>`;
    });
    html += `</tbody></table><script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script></body></html>`;
    printWindow.document.write(html); printWindow.document.close();
  }, [isGroupAdmin, adminGroupFilter, displayGroup, summaryBySize, totalGarments, totalRevenue, shortsSummary, totalSocks, activeOrders]);

  const handleExportHojaCorte = useCallback(() => {
    const printWindow = window.open('', '_blank');
    const cortesRemera = {};
    activeOrders.forEach(o => {
      const tipoManga = o.longSleeve ? 'MANGA LARGA' : 'Manga Corta';
      const key = `Talle ${o.size} - ${o.gender} - ${tipoManga}`;
      cortesRemera[key] = (cortesRemera[key] || 0) + o.quantity;
    });

    const cortesShort = {};
    activeOrders.forEach(o => {
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
    printWindow.document.write(html); printWindow.document.close();
  }, [activeOrders, isGroupAdmin, adminGroupFilter, displayGroup, displayEstilo, totalSocks]);



  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 transition-colors duration-500 relative pb-24 ${t.page}`}>
      
      <style>{`@keyframes anim-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } } @keyframes anim-float { 0% { transform: translateY(110vh) scale(0.5); opacity: 0; } 50% { opacity: 1; transform: translateY(50vh) scale(1.2); } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } } @keyframes anim-bounce { 0% { transform: translateY(110vh); } 50% { transform: translateY(30vh); } 100% { transform: translateY(110vh); } } @keyframes anim-zoom { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }`}</style>
      {activeAnimationTheme !== null && <SuccessAnimation themeIndex={activeAnimationTheme} />}

      {/* Botones Flotantes */}
      <div className="fixed bottom-20 right-6 flex flex-col gap-3 z-40 items-end">
        <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 border-2 ${darkMode ? 'bg-slate-800 text-yellow-400 border-slate-600' : 'bg-white text-indigo-900 border-neutral-200'}`}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {isAdmin && !showAdminLegend && (
          <button onClick={() => setShowAdminLegend(true)} className="bg-indigo-600 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all transform hover:scale-110">
             <span className="text-xl font-bold">?</span>
          </button>
        )}
      </div>

      {undoDeleteId && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 z-[100] border border-slate-700">
          <span className="text-sm font-medium">Pedido a papelera.</span>
          <button onClick={handleUndoDelete} className="bg-slate-700 hover:bg-slate-600 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Deshacer</button>
        </div>
      )}

      {/* Asistencia */}
      <a href="https://wa.me/595984948834" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all transform hover:scale-110 z-50 flex items-center justify-center group border-2 border-white/20">
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[150px] transition-all duration-300 ease-in-out font-bold text-sm ml-0 group-hover:ml-2">Asistencia</span>
      </a>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER Y SPONSOR */}
        <div className={`rounded-xl shadow-sm overflow-hidden flex items-center justify-center relative cursor-pointer hover:shadow-md transition-all group border bg-gradient-to-r ${t.sponsorCard}`} onClick={handleSponsorClick}>
           <div className="absolute inset-0 bg-white/5 opacity-50"></div>
           <div className="p-3 text-center z-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-black text-xs border border-dashed border-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">LOGO</div>
             <div className="text-left">
               <p className={`text-[10px] uppercase tracking-widest font-bold mb-0.5 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>¿Quieres ser nuestro sponsor?</p>
               <p className={`text-sm font-black flex items-center gap-1 group-hover:text-indigo-500 transition-colors ${darkMode ? 'text-white' : 'text-neutral-800'}`}>🚀 ¡Destaca tu marca aquí! <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
             </div>
           </div>
        </div>

        <header className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="flex items-center gap-4 z-10">
            <a href="https://www.instagram.com/brooguin_santani" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-all text-2xl" title="Instagram Brooguin">🦊</a>
            <div className="flex items-center gap-3">
              <img src={URL_LOGO_BROOGUIN} alt="Logo" className="w-20 h-20 object-contain bg-white rounded-xl p-1.5 shadow-md" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">BROOGUIN SPORT</h1>
                <p className="text-indigo-200 text-sm mt-1 font-medium">{isContextDeportiva ? (displayEstilo === 'Camisilla' ? '🎽 Camisillas Deportivas' : '🏃‍♂️ Indumentaria Deportiva') : '👔 Uniformes Piqué'}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto md:justify-end z-10">
            <div className={`p-3 rounded-xl border flex items-center justify-between min-w-[150px] ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-indigo-800/60 border-indigo-700'}`}>
                 <div>
                   <span className="block text-[10px] uppercase font-bold text-indigo-300">Grupo Activo</span>
                   <span className="text-lg font-black text-white">{displayGroup}</span>
                 </div>
                 <button onClick={() => setQrModal({isOpen: true, link: window.location.href, groupName: displayGroup})} className="p-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg ml-2"><QrCode className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        {/* PANEL ADMIN */}
        {isAdmin && (
          <div className={`${t.card} border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-md space-y-4`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className={`font-bold text-sm ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>Panel de Administración</h3>
                  <p className={`text-xs ${t.muted}`}>Bienvenido. Herramientas exclusivas habilitadas.</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {canManageSensitive && (
                  <button onClick={() => setShowChangePass(true)} className="flex items-center gap-2 bg-indigo-500/20 text-indigo-500 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-500/30 transition-all">
                    <KeyRound className="w-4 h-4" /> Cambiar Clave
                  </button>
                )}

                {isCreator && (
                   <div className="relative z-50">
                      <input type="text" placeholder="Buscador Global..." value={globalSearchTerm} onChange={(e) => setGlobalSearchTerm(e.target.value)} className={`block pl-8 pr-3 py-1.5 rounded-lg text-sm border focus:ring-2 outline-none ${t.input} w-48`} />
                      <Search className="absolute left-2.5 top-2 w-4 h-4 text-purple-500" />
                      {debouncedGlobalSearchTerm.trim() && (
                        <div className={`absolute top-full mt-2 left-0 w-80 rounded-xl shadow-2xl border max-h-64 overflow-y-auto ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-neutral-200'}`}>
                          {globalFilteredOrders.length === 0 ? (
                             <div className="p-4 text-center text-xs opacity-50">No hay resultados.</div>
                          ) : (
                             globalFilteredOrders.map(o => (
                               <div key={o.id} onClick={() => { handleFilterFromDirectory(o.group_name || 'General'); setGlobalSearchTerm(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-indigo-500/10 transition-colors">
                                  <div className="font-bold text-sm flex items-center gap-2">{o.name} <span className="text-[10px] text-indigo-500">({o.group_name})</span> {isMasterOwner && extractDetails(o.observations).loc && <span className="text-[8px] bg-slate-200 text-slate-700 px-1 rounded">📍 {extractDetails(o.observations).loc}</span>}</div>
                                  <div className="text-[10px] opacity-70 mt-1">📱 {o.phone || '-'} | 👕 {o.size} {o.gender}</div>
                               </div>
                             ))
                          )}
                        </div>
                      )}
                   </div>
                )}
                
                {isCreator ? (
                  <>
                    <button onClick={() => { if (!showAuditLogs) { fetchAuditLogs(); setShowAuditLogs(true); } else setShowAuditLogs(false); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${showAuditLogs ? 'bg-purple-600 text-white' : 'bg-purple-500/20 text-purple-500'}`}><History className="w-4 h-4" /> Historial</button>
                    <button onClick={() => setShowGroupManager(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}><Layers className="w-4 h-4" /> Todos los Grupos</button>
                    <button onClick={() => { setIsAdmin(false); setIsGroupAdmin(false); setIsMasterOwner(false); setIsCreator(false); setShowGroupManager(false); }} className="flex items-center gap-2 bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-neutral-700 transition-all"><Unlock className="w-4 h-4" /> Cerrar Supremo</button>
                  </>
                ) : (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-indigo-50 border-indigo-100'}`}><Layers className="w-4 h-4 text-indigo-500" /><span className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>Filtro bloqueado: {displayGroup}</span></div>
                )}

                {/* Filtro Restringido */}
                {isCreator && (
                  <div className={`flex items-center gap-1 p-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-indigo-50 border-indigo-100'}`}>
                    <Filter className="w-4 h-4 text-indigo-500 ml-1" />
                    <select value={adminGroupFilter} onChange={(e) => changeAdminFilter(e.target.value)} className={`bg-transparent border-none text-sm font-bold outline-none cursor-pointer max-w-[150px] truncate ml-1 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                      {availableGroups.map(g => (<option key={g} value={g}>{g === 'Todos' ? 'Todos los Grupos' : `Grupo: ${g}`}</option>))}
                    </select>
                    {adminGroupFilter !== 'Todos' && (
                      <div className={`flex gap-1 ml-1 border-l pl-2 ${darkMode ? 'border-slate-500' : 'border-indigo-200'}`}>
                        <button onClick={() => setRenameModal({ isOpen: true, oldName: adminGroupFilter, newName: adminGroupFilter })} className="p-1.5 bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => copyExistingGroupLink(adminGroupFilter)} className="p-1.5 bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded"><Link2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* MODO SUPREMO: DASHBOARD Y CREADOR */}
            {showGroupManager && isCreator && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                
                {/* DASHBOARD FINANCIERO GLOBAL */}
                {isMasterOwner && (
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner text-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> Dashboard Financiero Global 
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div><p className="text-[10px] uppercase text-slate-500">Recaudación Total</p><p className="text-xl font-black text-emerald-400">{formatNumber(globalStats.collected)} Gs.</p></div>
                          <div><p className="text-[10px] uppercase text-slate-500">Deuda Pendiente</p><p className="text-xl font-black text-amber-400">{formatNumber(globalStats.debt)} Gs.</p></div>
                        </div>
                      </div>
                      <div className="w-px bg-slate-800 hidden md:block"></div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between text-sm mb-1 border-b border-slate-800 pb-1"><span className="text-slate-400">Total Esperado:</span><span className="font-bold">{formatNumber(globalStats.expected)} Gs.</span></div>
                        <div className="flex justify-between text-sm mb-4 border-b border-slate-800 pb-1"><span className="text-slate-400">Total Prendas Generales:</span><span className="font-bold">{globalStats.items}</span></div>
                        
                        <h4 className="text-[10px] font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                          <BarChart3 className="w-3 h-3" /> Métricas de Tráfico (Sponsors)
                        </h4>
                        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2 rounded-lg">
                           <div><p className="text-[10px] text-slate-400">Visitas a la Web</p><p className="text-sm font-bold text-white">{siteMetrics.visits}</p></div>
                           <div><p className="text-[10px] text-slate-400">Clics en Auspiciantes</p><p className="text-sm font-bold text-blue-400">{siteMetrics.sponsorClicks}</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`p-5 rounded-xl shadow-inner text-white ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-indigo-900 border border-indigo-700'}`}>
                  <h4 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Creador Inteligente
                  </h4>
                  <form onSubmit={handleCreateGroup} className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Nombre del Grupo/Equipo</label>
                      <input type="text" value={newGroupConfig.name} onChange={(e) => setNewGroupConfig({...newGroupConfig, name: e.target.value})} placeholder="Ej. Inter2026" className={`w-full px-3 py-2 border rounded-lg text-sm outline-none shadow-sm focus:ring-2 focus:ring-emerald-400 ${darkMode ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500' : 'bg-indigo-800 border-indigo-600 text-white placeholder-indigo-400'}`} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Estilo de Uniforme Base</label>
                      <select value={newGroupConfig.estilo} onChange={(e) => setNewGroupConfig({...newGroupConfig, estilo: e.target.value})} className={`w-full px-3 py-2 border rounded-lg text-sm outline-none shadow-sm cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-indigo-800 border-indigo-600 text-white'}`}>
                        <option value="Deportiva">🏃‍♂️ Deportiva</option>
                        <option value="Camisilla">🎽 Camisillas</option>
                        <option value="Piqué">👔 Piqué</option>
                      </select>
                    </div>
                    <div className="flex justify-end items-end">
                      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-900 px-6 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg h-[38px]">
                        <QrCode className="w-4 h-4" /> Generar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENIDO PRINCIPAL: FORULARIO Y LISTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {!isGroupLocked || isAdmin ? (
              <div className={`p-6 rounded-2xl shadow-sm border ${t.card}`}>
                <h2 className="text-xl font-black flex items-center gap-2 mb-4">
                  {editingId ? <Edit className="w-5 h-5 text-amber-500" /> : <PlusCircle className="w-5 h-5 text-indigo-500" />}
                  {editingId ? 'Editar Pedido' : 'Nuevo Pedido'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {editingId && isCreator && (
                    <div className={`p-3 rounded-lg border mb-4 shadow-inner ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
                       <label className={`flex items-center gap-1 text-xs font-bold mb-1 uppercase tracking-wide ${darkMode ? 'text-amber-500' : 'text-amber-700'}`}>Mover Grupo</label>
                       <select name="group_name" value={formData.group_name} onChange={handleChange} className={`block w-full px-3 py-1.5 rounded-md text-sm font-bold outline-none focus:ring-2 ${t.input}`}>
                         {allGroupNames.map(g => <option key={g} value={g}>{g}</option>)}
                       </select>
                    </div>
                  )}

                  <div>
                    <label className={`text-xs font-bold mb-1 block ${t.label}`}>👤 Nombre y Apellido</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className={`h-4 w-4 ${t.muted}`} /></div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Lucas López" className={`block w-full pl-10 pr-3 py-2 rounded-lg outline-none focus:ring-2 ${t.input}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-bold mb-1 block ${t.label}`}>📱 Teléfono (Obligatorio)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className={`h-4 w-4 ${t.muted}`} /></div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0984948834" className={`block w-full pl-10 pr-3 py-2 rounded-lg outline-none focus:ring-2 ${t.input}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-bold mb-1 block ${t.label}`}>👶 Edad</label>
                      <select name="edad" value={formData.edad} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none ${t.input}`}>
                        <option value="Adultos">Adultos</option><option value="Infantil">Infantil</option>
                      </select>
                    </div>
                    {formData.edad === 'Infantil' && (
                       <div>
                         <label className={`text-xs font-bold mb-1 block ${t.label}`}>Años</label>
                         <select name="ageRange" value={formData.ageRange} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none ${t.input}`}>
                           {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
                         </select>
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-bold mb-1 block ${t.label}`}>📏 Talle</label>
                      <select name="size" value={formData.size} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none ${t.input}`}>
                        {SIZES_UNIVERSAL.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs font-bold mb-1 block ${t.label}`}>🏃‍♂️ Corte</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none ${t.input}`}>
                        <option value="Femenino">Femenino</option><option value="Masculino">Masculino</option><option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  {isContextDeportiva && (
                    <div className={`p-4 rounded-xl space-y-4 ${darkMode ? 'bg-slate-800' : 'bg-neutral-50'} border border-dashed border-gray-400/30`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>⚽ Opciones Deportivas</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className={`text-[10px] font-medium mb-1 block ${t.label}`}>Calidad de Tela</label>
                          <select name="tela" value={formData.tela} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none font-bold ${t.input}`}>
                            <option value="Premium">⭐ Premium</option><option value="Semi-Premium">Semi-Premium</option><option value="Estandard">Estandard</option>
                          </select>
                        </div>
                        <div>
                          <label className={`text-[10px] font-medium mb-1 block ${t.label}`}>🎽 Combinación de Prendas</label>
                          <select name="combo" value={formData.combo} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none font-bold ${t.input} ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                            {displayEstilo === 'Camisilla' ? (
                               <>
                                 <option value="Solo Camisilla">Solo Camisilla</option>
                                 <option value="Camisilla + Short">Camisilla + Short</option>
                               </>
                            ) : (
                               <>
                                 <option value="Solo Remera">Solo Remera</option>
                                 <option value="Remera + Short">Remera + Short</option>
                                 <option value="Equipo Completo">Equipo Completo</option>
                               </>
                            )}
                          </select>
                        </div>
                      </div>

                      {/* Restauramos Nombre en la espalda y Dorsal */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-gray-400/30">
                        <div>
                          <label className={`text-[10px] font-medium mb-1 block ${t.label}`}>Nombre (Espalda)</label>
                          <input type="text" name="playerName" value={formData.playerName} onChange={handleChange} placeholder="Ej. LUKASY" className={`w-full px-3 py-2 rounded-lg uppercase outline-none focus:ring-2 ${t.input}`} />
                        </div>
                        <div>
                          <label className={`text-[10px] font-medium mb-1 block ${t.label}`}>🔢 Dorsal</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className={`h-3 w-3 ${t.muted}`} /></div>
                            <input type="number" name="playerNumber" value={formData.playerNumber} onChange={handleChange} placeholder="10" className={`w-full pl-8 pr-3 py-2 rounded-lg font-bold outline-none focus:ring-2 ${t.input}`} />
                          </div>
                        </div>
                      </div>

                      {(formData.combo.includes('Short') || formData.combo === 'Equipo Completo') && !formData.combo.includes('Solo Remera') && !formData.combo.includes('Solo Camisilla') && (
                        <div className={`flex flex-col gap-2 rounded-lg ${t.box} p-3`}>
                          <div className="flex items-center justify-between">
                            <label className={`text-sm font-medium ${t.label}`}>Talle Short:</label>
                            <select name="shortSize" value={formData.shortSize} onChange={handleChange} className={`px-3 py-1.5 rounded-lg font-bold outline-none border ${t.input}`}>
                               {SIZES_UNIVERSAL.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          {formData.gender === 'Femenino' && (
                            <div className={`flex items-center justify-between mt-2 border-t pt-3 ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
                              <span className={`text-[11px] font-medium ${t.muted}`}>Diseño Short Femenino:</span>
                              <select name="femaleShortType" value={formData.femaleShortType} onChange={handleChange} className={`px-2 py-1 border rounded text-xs font-bold outline-none ${darkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-pink-900'}`}>
                                <option value="Standard">Standard</option><option value="Femenino">Corte Femenino</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={`flex items-center gap-3 p-2 rounded-lg border mt-2 ${darkMode ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-200'}`}>
                        <input type="checkbox" id="isGoalkeeper" name="isGoalkeeper" checked={formData.isGoalkeeper} onChange={handleChange} className="w-4 h-4 text-indigo-500 rounded cursor-pointer" />
                        <label htmlFor="isGoalkeeper" className={`flex items-center gap-1 text-sm font-bold cursor-pointer flex-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                          🧤 Es Arquero
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className={`text-sm font-medium mb-1 block ${t.label}`}>📦 Cantidad</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className={`h-4 w-4 ${t.muted}`} /></div>
                        <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required className={`w-full pl-10 pr-3 py-2 rounded-lg font-bold outline-none focus:ring-2 ${t.input}`} />
                      </div>
                    </div>
                    {allowLongSleeve && (
                      <div className={`flex items-center gap-2 p-2 rounded-lg h-[38px] ${t.indigoBg}`}>
                        <input type="checkbox" id="longSleeve" name="longSleeve" checked={formData.longSleeve} onChange={handleChange} className="w-4 h-4 text-indigo-500 rounded cursor-pointer" />
                        <label htmlFor="longSleeve" className={`text-[11px] font-medium cursor-pointer flex-1 leading-tight ${t.indigoText}`}>Manga Larga (+{formatNumber(costoMangaLarga)})</label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`text-sm font-medium mb-1 text-xs block ${t.label}`}>📝 Observaciones</label>
                    <textarea name="observations" value={formData.observations} onChange={handleChange} rows="2" placeholder="Opcional..." className={`w-full px-3 py-2 rounded-lg text-sm resize-none outline-none focus:ring-2 ${t.input}`} />
                  </div>

                  <button type="button" onClick={() => setShowCatalogModal(true)} className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg flex justify-center items-center gap-2"><ImagePlus className="w-5 h-5"/> Ver Catálogo y Precios</button>

                  <div className={`p-4 rounded-xl flex justify-between items-center shadow-inner ${t.indigoBg}`}>
                    <span className={`text-sm font-semibold ${t.indigoText}`}>Total Calculado:</span>
                    <span className={`text-xl font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{formatNumber(currentOrderTotal)} Gs.</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {editingId && (<button type="button" onClick={cancelEdit} className={`w-1/3 flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium transition-colors ${t.box} ${t.label}`}>Cancelar</button>)}
                    <button type="submit" className={`${editingId ? 'w-2/3 bg-amber-500 hover:bg-amber-600 text-white' : isPreviewMode ? 'w-full bg-emerald-500 hover:bg-emerald-600 text-white' : 'w-full bg-indigo-600 hover:bg-indigo-700 text-white'} flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold transition-all transform hover:-translate-y-0.5 border-none`}>
                      {editingId ? 'Guardar Cambios' : isPreviewMode ? 'Probar Pedido' : 'Agregar Pedido'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500 text-center">
                 <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                 <h3 className="text-xl font-black text-red-600">Lista Cerrada</h3>
                 <p className="text-sm text-red-500">Ya no se aceptan más pedidos para este grupo.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className={`p-5 rounded-2xl shadow-sm flex flex-col justify-center ${t.card}`}>
               <div className="flex justify-between items-end mb-2">
                 <h3 className={`text-sm font-bold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><Target className="w-5 h-5 text-emerald-500" /> Progreso de Recaudación</h3>
                 <span className="text-xs font-black text-emerald-500 bg-emerald-500/20 px-2 py-0.5 rounded-md">{progressPercent}%</span>
               </div>
               <div className={`w-full rounded-full h-3.5 mb-2 overflow-hidden border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-neutral-100 border-neutral-200'}`}>
                 <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3.5 rounded-full transition-all duration-1000 flex items-center justify-end px-2" style={{ width: `${progressPercent}%` }}></div>
               </div>
               <div className={`flex flex-col sm:flex-row justify-between gap-4 mt-4 pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-neutral-100'}`}>
                 <div><p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Esperado</p><p className={`text-lg font-black ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{formatNumber(totalRevenue)}</p></div>
                 <div><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Recaudado</p><p className={`text-lg font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{formatNumber(totalCollected)}</p></div>
                 <div><p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Deuda</p><p className={`text-lg font-black ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{formatNumber(totalRevenue - totalCollected)}</p></div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm ${t.card}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                   <div className="flex items-center gap-1">
                     <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><Search className="w-5 h-5 text-indigo-500" /> Recientes</h2>
                     <button onClick={fetchOrdersAndSettings} disabled={loading} className={`p-1.5 rounded-lg transition-colors ml-1 ${darkMode ? 'bg-slate-700 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                   </div>
                   <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`flex-1 w-full sm:w-48 px-3 py-1.5 rounded-lg text-sm border focus:ring-2 outline-none ${t.input}`} />
                 </div>
                 {isAdmin && (
                   <button onClick={toggleGroupLock} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all border ${isGroupLocked ? (darkMode ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-700 border-emerald-200') : (darkMode ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-50 text-red-600 border-red-200')}`}>
                     {isGroupLocked ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>} {isGroupLocked ? 'Reabrir Lista' : 'Cerrar Lista'}
                   </button>
                 )}
              </div>

              {loading ? (
                <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" /></div>
              ) : activeOrders.length === 0 ? (
                <div className={`text-center py-8 italic ${t.muted}`}>No hay pedidos en este grupo.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className={`min-w-full divide-y text-xs ${t.divide}`}>
                    <thead className={t.tableHead}>
                      <tr>
                        {isGroupAdmin && adminGroupFilter === 'Todos' && <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Grupo</th>}
                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Prenda</th>
                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Estado / Pago</th>
                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Fecha</th>
                        {isAdmin && <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Acción</th>}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${t.divide} ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                      {/* FILTRO APLICADO CON DEBOUNCE */}
                      {activeOrders.filter(o => o.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())).map((order) => {
                         const { details, rest, loc } = extractDetails(order.observations);
                         const fins = getOrderFinancials(order);
                         return (
                           <tr key={order.id} className={`${t.rowHover} transition-colors`}>
                             {isGroupAdmin && adminGroupFilter === 'Todos' && <td className="px-4 py-3 font-bold text-indigo-500">{order.group_name}</td>}
                             <td className={`px-4 py-3 font-medium ${darkMode ? 'text-slate-200' : 'text-neutral-900'}`}>
                               {order.name}
                               {isMasterOwner && loc && <span className="ml-2 text-[8px] bg-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded">📍 {loc}</span>}
                               {(isAdmin || isGroupAdmin) && order.phone && order.phone !== '-' && (
                                 <div className="mt-1 flex flex-wrap items-center gap-2">
                                   <span className={`text-[10px] flex items-center gap-1 ${t.muted}`}><Phone className="w-2.5 h-2.5"/> {order.phone}</span>
                                   <a href={getWhatsAppLink(order)} target="_blank" rel="noopener noreferrer" className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-colors border ${darkMode ? 'bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/50' : 'bg-[#25D366]/10 text-[#075E54] border-[#25D366]/30 hover:bg-[#25D366]/20'}`}><MessageCircle className="w-3 h-3" /> Escribir</a>
                                 </div>
                               )}
                             </td>
                             <td className="px-4 py-3 min-w-[200px]">
                               <div className={`font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                                 {order.size} <span className={t.muted}>{order.gender[0]}. {order.longSleeve && '(ML)'} x{order.quantity}</span>
                               </div>
                               {details && <div className={`mt-1.5 p-2 rounded border text-[11px] font-mono shadow-inner ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-neutral-100 border-neutral-200 text-neutral-600'} whitespace-pre-wrap break-words`}>{details}</div>}
                               {rest && <div className={`text-[10px] mt-1 italic ${t.muted}`}>📝 {rest}</div>}
                             </td>
                             <td className="px-4 py-3">
                               {isAdmin ? (
                                 <button onClick={() => handleOpenPayment(order)} className={`text-left w-full p-1.5 rounded transition-colors group relative ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-neutral-100'}`}>
                                   <div className={`text-[10px] font-black uppercase ${fins.balance === 0 ? 'text-green-500' : fins.paid > 0 ? 'text-amber-500' : 'text-red-500'}`}>{fins.balance === 0 ? 'PAGADO' : fins.paid > 0 ? 'SEÑADO' : 'PENDIENTE'}</div>
                                   <div className={`text-[9px] font-medium ${t.muted}`}>{formatNumber(fins.paid)} / {formatNumber(fins.total)} Gs.</div>
                                 </button>
                               ) : (
                                 <div className="p-1">
                                   <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${fins.balance === 0 ? 'bg-green-500/20 text-green-500' : fins.paid > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>{fins.balance === 0 ? 'Pagado' : fins.paid > 0 ? 'Señado' : 'Pendiente'}</span>
                                 </div>
                               )}
                             </td>
                             <td className={`px-4 py-3 whitespace-nowrap text-xs ${t.muted}`}>{formatDate(order.created_at)}</td>
                             {isAdmin && (
                               <td className="px-4 py-3 text-right">
                                 <div className="flex justify-end gap-1">
                                       {canManageSensitive && <button onClick={() => handleOpenPriceModal(order)} className={`p-1.5 rounded transition-colors font-bold flex items-center justify-center w-7 h-7 ${darkMode ? 'text-emerald-400 hover:bg-slate-700' : 'text-emerald-600 hover:bg-emerald-50'}`} title="Modificar Precio">₲</button>}
                                       <button onClick={() => handleEditClick(order)} className={`p-1.5 rounded transition-colors ${darkMode ? 'text-amber-400 hover:bg-slate-700' : 'text-amber-500 hover:bg-amber-50'}`} title="Editar Pedido"><Edit className="w-3 h-3" /></button>
                                       <button onClick={() => handleDelete(order)} className={`p-1.5 rounded transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-500 hover:bg-red-50'}`} title="Eliminar Pedido"><Trash2 className="w-3 h-3" /></button>
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

            {isAdmin && (
              <div className={`p-6 rounded-2xl shadow-sm ${t.card}`}>
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className={`text-xl font-semibold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><ClipboardList className="w-5 h-5 text-emerald-500" /> Resumen (Taller)</h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                      <button onClick={handleExportHojaCorte} className="flex-1 sm:flex-none text-xs bg-slate-800 text-white border border-slate-900 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2"><Scissors className="w-3 h-3" /> Hoja de Corte</button>
                      <button onClick={handleExportCSV} className="flex-1 sm:flex-none text-xs bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2"><Download className="w-3 h-3" /> Excel</button>
                      <button onClick={handleExportPDF} className="flex-1 sm:flex-none text-xs bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2"><FileText className="w-3 h-3" /> PDF</button>
                    </div>
                 </div>
                 
                 <h3 className={`text-xs font-bold uppercase mb-2 ${t.muted}`}>Cantidades de Remeras</h3>
                 <div className="overflow-x-auto mb-6">
                    <table className={`min-w-full divide-y text-xs ${t.divide}`}>
                      <thead className={t.tableHead}><tr><th className="px-6 py-3 text-left font-bold">Talle</th><th className="px-6 py-3 text-center font-bold">Fem.</th><th className="px-6 py-3 text-center font-bold">Masc.</th><th className="px-6 py-3 text-center font-bold">Uni.</th><th className="px-6 py-3 text-right font-bold">Total</th></tr></thead>
                      <tbody className={`divide-y ${t.divide} ${darkMode ? 'bg-slate-800' : 'bg-white'} text-sm`}>
                        {summaryBySize.map((item) => (
                          <tr key={item.size} className={item.total > 0 ? (darkMode ? 'bg-emerald-900/10' : 'bg-emerald-50/30') : ''}>
                            <td className={`px-6 py-4 font-bold ${darkMode ? 'text-slate-200' : 'text-neutral-900'}`}>{item.size}</td>
                            <td className="px-6 py-4 text-center">{item.fem > 0 ? <span className="text-emerald-500 font-bold">{item.fem}</span> : <span className={t.muted}>-</span>}</td>
                            <td className="px-6 py-4 text-center">{item.masc > 0 ? <span className="text-emerald-500 font-bold">{item.masc}</span> : <span className={t.muted}>-</span>}</td>
                            <td className="px-6 py-4 text-center">{item.uni > 0 ? <span className="text-emerald-500 font-bold">{item.uni}</span> : <span className={t.muted}>-</span>}</td>
                            <td className={`px-6 py-4 text-right font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{item.total > 0 ? item.total : <span className={t.muted}>0</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>

                 {isContextDeportiva && (Object.keys(shortsSummary).length > 0 || totalSocks > 0) && (
                   <>
                     <h3 className={`text-xs font-bold uppercase mb-2 ${t.muted}`}>Extras Deportivos</h3>
                     <div className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-8 ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-neutral-50 border-neutral-200'}`}>
                       {Object.keys(shortsSummary).length > 0 && (
                         <div className="flex-1">
                           <span className={`text-xs font-bold block mb-2 border-b pb-1 ${darkMode ? 'text-indigo-300 border-slate-600' : 'text-indigo-900 border-neutral-300'}`}>Confección de Shorts</span>
                           <ul className="space-y-1">
                             {Object.entries(shortsSummary).map(([sz, qty]) => (
                               <li key={`sum-${sz}`} className={`text-sm flex justify-between ${darkMode ? 'text-slate-300' : 'text-neutral-700'}`}>Talle <strong>{sz}</strong> <span className="font-bold text-indigo-500">{qty} und.</span></li>
                             ))}
                           </ul>
                         </div>
                       )}
                       {totalSocks > 0 && (
                         <div className="flex-1">
                           <span className={`text-xs font-bold block mb-2 border-b pb-1 ${darkMode ? 'text-indigo-300 border-slate-600' : 'text-indigo-900 border-neutral-300'}`}>Medias</span>
                           <div className={`text-sm flex justify-between ${darkMode ? 'text-slate-300' : 'text-neutral-700'}`}>Total pares: <span className="font-bold text-indigo-500">{totalSocks} pares</span></div>
                         </div>
                       )}
                     </div>
                   </>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* MODO SUPREMO: DIRECTORIO DE GRUPOS */}
        {showGroupManager && isCreator && (
          <div id="directorio-grupos-section" className={`p-6 rounded-2xl shadow-sm border mt-8 ${t.card}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                <Layers className="w-5 h-5 text-indigo-500" /> Directorio Maestro de Grupos
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center mb-4">
               <span className={`text-sm font-bold ${t.muted}`}>Ordenar por:</span>
               <select value={groupSort.key} onChange={(e) => setGroupSort({...groupSort, key: e.target.value})} className={`px-3 py-1.5 rounded-lg text-sm font-bold outline-none cursor-pointer ${t.input}`}>
                 <option value="name">Orden Alfabético</option>
                 <option value="firstOrder">Fecha de Creación</option>
                 <option value="lastOrder">Último Pedido Ingresado</option>
               </select>
               
               <button onClick={() => setGroupSort({...groupSort, direction: groupSort.direction === 'asc' ? 'desc' : 'asc'})} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-indigo-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}>
                 {groupSort.direction === 'asc' ? (
                   <>A <ArrowRight className="w-3 h-3" /> Z (Ascendente)</>
                 ) : (
                   <>Z <ArrowLeft className="w-3 h-3" /> A (Descendente)</>
                 )}
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y text-xs ${t.divide}`}>
                <thead className={t.tableHead}>
                  <tr>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Nombre del Grupo</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Creación (1er Pedido)</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Última Actividad</th>
                    <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Total Prendas</th>
                    <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Recaudación</th>
                    <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${t.divide} ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                   {sortedGroupStats.length === 0 ? (
                     <tr><td colSpan="6" className={`p-8 text-center italic ${t.muted}`}>No hay grupos registrados aún.</td></tr>
                   ) : (
                     sortedGroupStats.map(group => (
                       <tr key={group.name} className={`${t.rowHover} transition-colors`}>
                         <td className="px-4 py-3 font-bold text-indigo-500">
                           <button onClick={() => handleFilterFromDirectory(group.name)} className="hover:underline text-left outline-none transition-colors" title={`Ver pedidos de ${group.name}`}>
                             {group.name}
                           </button>
                         </td>
                         <td className={`px-4 py-3 ${t.muted}`}>{formatDate(group.firstOrder)}</td>
                         <td className={`px-4 py-3 ${t.muted}`}>{formatDate(group.lastOrder)}</td>
                         <td className={`px-4 py-3 text-right font-bold ${darkMode ? 'text-slate-300' : 'text-neutral-800'}`}>{group.count} und.</td>
                         <td className="px-4 py-3 text-right font-black text-emerald-500">{formatNumber(group.revenue)} Gs.</td>
                         <td className="px-4 py-3 text-right">
                           <button onClick={() => handleArchiveGroup(group.name)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Mover a papelera de grupos"><Trash2 className="w-4 h-4" /></button>
                         </td>
                       </tr>
                     ))
                   )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Papelera de Grupos (Dueño Supremo y Creador) */}
        {showGroupManager && isCreator && archivedGroups.length > 0 && (
          <div className={`p-6 rounded-2xl shadow-sm border mt-4 ${t.card}`}>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${t.muted}`}><Trash2 className="w-5 h-5" /> Papelera de Grupos ({filteredArchivedGroups.length})</h2>
              <input type="text" placeholder="Buscar grupo..." value={archivedGroupSearch} onChange={(e) => setArchivedGroupSearch(e.target.value)} className={`px-3 py-1 text-xs rounded-lg border focus:ring-2 outline-none ${t.input}`} />
            </div>
            <div className="overflow-x-auto">
               <table className={`min-w-full text-xs ${t.muted}`}>
                  <thead className={t.tableHead}>
                      <tr>
                         <th className="px-4 py-3 text-left">Grupo</th>
                         <th className="px-4 py-3 text-left">Eliminado el</th>
                         <th className="px-4 py-3 text-left">Tiempo Restante</th>
                         <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                    {filteredArchivedGroups.map(g => {
                      const daysLeft = Math.max(0, 40 - (Date.now() - g.archivedAt) / (1000 * 60 * 60 * 24));
                      return (
                      <tr key={g.name} className={`border-t ${t.border}`}>
                        <td className="py-2 px-4 font-bold">{g.name}</td>
                        <td className="py-2 px-4">{formatDate(g.archivedAt)}</td>
                        <td className="py-2 px-4 text-red-400 font-bold">{Math.ceil(daysLeft)} días</td>
                        <td className="py-2 px-4 text-right">
                           <button onClick={() => handleRestoreGroup(g.name)} className={`font-bold px-2 py-1 rounded transition-colors mr-2 ${darkMode ? 'text-indigo-400 hover:bg-slate-700' : 'text-indigo-600 hover:bg-indigo-50'}`}>Restaurar</button>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Papelera de Pedidos */}
        {isAdmin && deletedOrders.length > 0 && (
          <div className={`p-6 rounded-2xl border border-dashed ${darkMode ? 'bg-slate-800/50 border-slate-600' : 'bg-white/50 border-neutral-300'}`}>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${t.muted}`}>
                <Trash2 className="w-5 h-5" /> Papelera de Pedidos ({filteredDeletedOrders.length})
                <HelperTooltip darkMode={darkMode} text="Los pedidos aquí se auto-eliminarán permanentemente a las 48 horas exactas de su borrado." />
              </h2>
              <input type="text" placeholder="Buscar pedido o grupo..." value={deletedOrderSearch} onChange={(e) => setDeletedOrderSearch(e.target.value)} className={`px-3 py-1 text-xs rounded-lg border focus:ring-2 outline-none ${t.input}`} />
            </div>
            <div className="overflow-x-auto">
               <table className={`min-w-full text-xs ${t.muted}`}>
                  <tbody>
                    {filteredDeletedOrders.map(o => {
                      const delMatch = o.observations?.match(/\[DEL:(\d+)\]/);
                      const delTime = delMatch ? parseInt(delMatch[1]) : new Date(o.created_at).getTime();
                      const hoursLeft = Math.max(0, 48 - (Date.now() - delTime) / (1000 * 60 * 60));
                      const timeLeftStr = hoursLeft > 24 ? `${Math.floor(hoursLeft/24)} días` : `${Math.floor(hoursLeft)} hs`;
                      
                      return (
                        <tr key={o.id} className={`border-t ${t.border}`}>
                          <td className="py-2">
                             {o.name} ({o.group_name}) <br/>
                             <span className="text-[10px] text-red-400 font-bold">Desaparece en {timeLeftStr}</span>
                          </td>
                          <td className="py-2 text-right">
                             <button onClick={() => handleRestore(o)} className={`font-bold px-2 py-1 rounded transition-colors ${darkMode ? 'text-indigo-400 hover:bg-slate-700' : 'text-indigo-600 hover:bg-indigo-50'}`}>Restaurar</button>
                             {canManageSensitive && (
                                <button onClick={() => handlePermanentDelete(o.id)} className={`px-2 py-1 rounded transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-400 hover:bg-red-50'}`}>Eliminar Ya</button>
                             )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* HISTORIAL DE AUDITORÍA */}
        {showAuditLogs && isGroupAdmin && (
          <div id="audit-logs-section" className={`p-6 rounded-2xl shadow-sm border mt-8 mb-4 ${darkMode ? 'bg-slate-800 border-purple-800' : 'bg-white border-purple-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}><History className="w-5 h-5 text-purple-500" /> Historial de Actividad (Auditoría)</h2>
              <div className="flex gap-2">
                <button onClick={() => fetchAuditLogs()} className="text-indigo-500 hover:bg-indigo-500/20 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold" title="Actualizar Datos">
                  <RefreshCw className="w-4 h-4" /> Refrescar
                </button>
                <button onClick={() => setShowAuditLogs(false)} className={`p-2 rounded-lg transition-colors ${t.muted} ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-neutral-100'}`} title="Ocultar Historial">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className={`text-sm mb-4 ${t.muted}`}>Registro detallado de todos los movimientos realizados por los administradores en el sistema.</p>
            <div className={`overflow-x-auto max-h-[400px] overflow-y-auto border rounded-lg ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
               <table className="min-w-full text-xs text-left">
                  <thead className={`sticky top-0 shadow-sm z-10 ${t.tableHead}`}>
                     <tr>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider">Fecha y Hora</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider">Grupo</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider">Acción</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider">Detalles</th>
                     </tr>
                  </thead>
                  <tbody className={`divide-y ${t.divide} ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                     {auditLogsData.length === 0 ? (
                       <tr><td colSpan="4" className={`p-8 text-center italic ${t.muted}`}>No hay registros de actividad aún.</td></tr>
                     ) : (
                       auditLogsData.map(log => (
                         <tr key={log.id} className={`${t.rowHover} transition-colors`}>
                            <td className={`px-4 py-3 whitespace-nowrap ${t.muted}`}>{new Date(log.created_at).toLocaleString('es-PY')}</td>
                            <td className="px-4 py-3 font-bold text-indigo-500 whitespace-nowrap">{log.group_name}</td>
                            <td className={`px-4 py-3 font-bold whitespace-nowrap ${darkMode ? 'text-slate-300' : 'text-neutral-800'}`}>{log.action}</td>
                            <td className={`px-4 py-3 ${darkMode ? 'text-slate-400' : 'text-neutral-600'}`}>{log.details}</td>
                         </tr>
                       ))
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Modal CATÁLOGO MEJORADO */}
        {showCatalogModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4 backdrop-blur-sm overflow-y-auto">
             <div className={`rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in my-auto ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                
                <div className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 rounded-t-2xl ${darkMode ? 'bg-slate-900/90 border-slate-700 backdrop-blur-md' : 'bg-white/90 border-neutral-200 backdrop-blur-md'}`}>
                   <h3 className={`font-black text-xl flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><Shirt className="w-6 h-6 text-indigo-500" /> Catálogo y Aranceles</h3>
                   <button onClick={() => setShowCatalogModal(false)} className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-neutral-100 text-neutral-500'}`}><X className="w-6 h-6" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[75vh]">
                  <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                    Explora nuestros estilos de fabricación. Haz clic en cualquier imagen para comunicarte directamente con nuestro equipo de diseño vía WhatsApp y empezar tu pedido.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                     {CATALOG_ITEMS.map((item, idx) => (
                       <div key={idx} onClick={handleCatalogContact} className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 ${darkMode ? 'border-slate-800 hover:border-indigo-500' : 'border-neutral-100 hover:border-indigo-400'}`}>
                         <div className="h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-slate-100 flex items-center justify-center p-2">
                           <img src={item.img} alt={item.name} loading="lazy" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                         </div>
                         <div className={`absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100`}>
                            <div className="bg-[#25D366] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"><MessageCircle className="w-4 h-4" /> Consultar Diseño</div>
                         </div>
                         <div className={`p-3 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                           <h4 className={`font-bold text-sm ${darkMode ? 'text-slate-200' : 'text-neutral-800'}`}>{item.name}</h4>
                           <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>{item.desc}</p>
                         </div>
                       </div>
                     ))}
                  </div>
                  <div className="mb-8">
                     <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                       <span className="flex items-center justify-center w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full font-black text-sm">₲</span> Tabla de Aranceles Base
                     </h3>
                     
                     {/* TABLA DE DEPORTIVAS Y PIQUÉ */}
                     {displayEstilo !== 'Camisilla' && (
                       <>
                         <PricingTable ageGroupTitle="Adultos" dataObject={PRECIOS_BASE.Adultos} isCamisillaCat={false} darkMode={darkMode} />
                         <PricingTable ageGroupTitle="Infantil" dataObject={PRECIOS_BASE.Infantil} isCamisillaCat={false} darkMode={darkMode} />
                       </>
                     )}

                     {/* TABLA DE CAMISILLAS */}
                     {displayEstilo === 'Camisilla' && (
                       <>
                         <PricingTable ageGroupTitle="Adultos" dataObject={PRECIOS_CAMISILLA.Adultos} isCamisillaCat={true} darkMode={darkMode} />
                         <PricingTable ageGroupTitle="Infantil" dataObject={PRECIOS_CAMISILLA.Infantil} isCamisillaCat={true} darkMode={darkMode} />
                       </>
                     )}

                     <div className={`text-[10px] italic mt-2 text-right ${darkMode ? 'text-slate-400' : 'text-neutral-500'} bg-slate-100/50 p-3 rounded-lg border border-slate-200`}>
                       <p className="font-bold text-indigo-600 mb-1">Cargos Adicionales:</p>
                       <ul className="list-disc pl-4 space-y-1">
                          <li>La inclusión de Manga Larga tiene un costo adicional de <strong>10.000 ₲</strong> (Piqué) o <strong>15.000 ₲</strong> (Deportivas).</li>
                          <li>Talles especiales <strong>(XXL y XXXL)</strong> tienen un costo extra de <strong>10.000 ₲</strong> por prenda.</li>
                       </ul>
                     </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-dashed border-slate-300 dark:border-slate-700">
                    <button onClick={handleCatalogContact} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-lg py-4 px-8 rounded-2xl w-full sm:w-auto shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-3">
                      <Smartphone className="w-6 h-6 animate-bounce" /> ¡QUIERO PERSONALIZAR MI PEDIDO!
                    </button>
                    <button onClick={() => setShowCatalogModal(false)} className={`text-sm font-bold hover:underline ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-neutral-500 hover:text-neutral-700'}`}>Volver al formulario de llenado</button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* MODAL DE PAGOS */}
        {paymentModal.isOpen && paymentModal.order && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
             <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                     <span className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">₲</span> Registrar Pago
                   </h3>
                   <button onClick={() => setPaymentModal({isOpen: false, order: null, amount: 0})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
                </div>
                <div className={`p-3 rounded-lg mb-4 text-sm text-center ${darkMode ? 'bg-slate-700' : 'bg-neutral-50'}`}>
                   <p className={`mb-1 ${t.muted}`}>Total de {paymentModal.order.name}</p>
                   <p className={`text-xl font-black ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{formatNumber(getUnitPrice(paymentModal.order) * paymentModal.order.quantity)} Gs.</p>
                </div>
                <label className={`block text-xs font-bold mb-1 ${t.muted}`}>Monto entregado (Gs):</label>
                <input type="number" value={paymentModal.amount} onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })} className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg text-center mb-4 ${t.input}`} />
                <div className="space-y-2">
                  <button onClick={savePayment} className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-md border-none">Guardar Pago</button>
                  {paymentModal.isSaved && (
                    <a href={getReceiptLink(paymentModal.order)} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-all shadow-md flex items-center justify-center gap-2"><Receipt className="w-4 h-4" /> Enviar Recibo WhatsApp</a>
                  )}
                </div>
             </div>
          </div>
        )}

        {/* NUEVO MODAL: AJUSTE DE PRECIO MANUAL */}
        {priceModal.isOpen && priceModal.order && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
             <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                     <span className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center font-bold text-sm">₲</span> Ajustar Precio Total
                   </h3>
                   <button onClick={() => setPriceModal({isOpen: false, order: null, newTotal: 0})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
                </div>
                <p className={`text-xs mb-4 ${t.muted}`}>Modifica el precio final de este pedido para agregar costos extra (ej. Nombres, dorsales, diseño especial).</p>
                <div className={`p-3 rounded-lg mb-4 text-sm text-center ${darkMode ? 'bg-slate-700' : 'bg-neutral-50'}`}>
                   <p className={`mb-1 font-bold ${darkMode ? 'text-slate-200' : 'text-neutral-800'}`}>Cliente: {priceModal.order.name}</p>
                   <p className={`text-xs ${t.muted}`}>{priceModal.order.quantity} Prenda(s)</p>
                </div>
                <label className={`block text-xs font-bold mb-1 ${t.muted}`}>Nuevo Precio Total (Gs):</label>
                <input type="number" value={priceModal.newTotal} onChange={(e) => setPriceModal({...priceModal, newTotal: e.target.value})} className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-lg text-center mb-4 ${t.input}`} />
                <button onClick={saveNewPrice} className="w-full bg-amber-500 text-white font-black py-3 rounded-xl hover:bg-amber-400 transition-all shadow-md border-none">Guardar Nuevo Precio</button>
             </div>
          </div>
        )}

        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><Lock className="w-5 h-5" /> Iniciar Sesión</h3>
                <button onClick={() => setShowAdminLogin(false)} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <div className="relative mb-4">
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${t.muted}`}>Contraseña de Acceso</label>
                <input type={showPassword ? "text" : "password"} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="Contraseña..." onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12 ${t.input}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute bottom-3 right-0 pr-4 flex items-center ${t.muted}`}><EyeOff className="w-5 h-5" /></button>
              </div>
              {pinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
              <button onClick={handleAdminLogin} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all mb-4 border-none">Ingresar</button>
            </div>
          </div>
        )}

        {showGroupAuth && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><ShieldAlert className="w-5 h-5 text-red-500" /> Modo Supremo</h3>
                <button onClick={() => {setShowGroupAuth(false); setGroupPinError(false); setGroupPin(''); setShowGroupPassword(false); setIsMasterOwner(false); setIsCreator(false);}} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <div className="relative mb-4">
                <input type={showGroupPassword ? "text" : "password"} value={groupPin} onChange={(e) => setGroupPin(e.target.value)} placeholder="Contraseña Maestra" onKeyDown={(e) => e.key === 'Enter' && handleGroupAuth()} className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none pr-12 ${t.input}`} />
                <button type="button" onClick={() => setShowGroupPassword(!showGroupPassword)} className={`absolute inset-y-0 right-0 pr-4 flex items-center ${t.muted}`}><EyeOff className="w-5 h-5" /></button>
              </div>
              {groupPinError && <p className="text-xs text-red-500 mb-3 mt-[-10px]">Contraseña incorrecta.</p>}
              <button onClick={handleGroupAuth} className={`w-full text-white font-bold py-3 rounded-xl transition-all border-none ${darkMode ? 'bg-slate-950 hover:bg-black' : 'bg-neutral-900 hover:bg-black'}`}>Activar Modo Supremo</button>
            </div>
          </div>
        )}

        {renameModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><Edit className="w-5 h-5 text-amber-500" /> Renombrar Grupo</h3>
                <button onClick={() => setRenameModal({isOpen: false, oldName: '', newName: ''})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${t.muted}`}>Nombre Actual</label>
                  <input type="text" value={renameModal.oldName} disabled className={`w-full px-4 py-2 border rounded-xl text-sm cursor-not-allowed ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`} />
                </div>
                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>Nuevo Nombre (Sin Espacios)</label>
                  <input type="text" value={renameModal.newName} onChange={(e) => setRenameModal({...renameModal, newName: e.target.value})} placeholder="Ej. ColegioNacional" className={`w-full px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold ${t.input} ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRenameModal({isOpen: false, oldName: '', newName: ''})} className={`flex-1 font-bold py-2 rounded-xl transition-all text-sm border-none ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>Cancelar</button>
                <button onClick={handleRenameGroupSubmit} disabled={loading} className="flex-1 bg-amber-500 text-white font-bold py-2 rounded-xl hover:bg-amber-600 transition-all text-sm flex items-center justify-center gap-2 border-none">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Cambio'}
                </button>
              </div>
            </div>
          </div>
        )}

        {qrModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in text-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><QrCode className="w-5 h-5 text-indigo-500" /> Compartir Grupo</h3>
                <button onClick={() => setQrModal({isOpen: false, link: '', groupName: ''})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <p className={`text-sm mb-4 ${t.muted}`}>Comparte este código para que ingresen al grupo <strong>{qrModal.groupName}</strong>.</p>
              <div className={`p-4 rounded-xl flex justify-center mb-4 border ${darkMode ? 'bg-slate-200 border-slate-400' : 'bg-neutral-100 border-neutral-200'}`}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrModal.link)}&margin=10`} alt="QR Code" className="rounded-lg shadow-sm" />
              </div>
              <div className="flex gap-2 mb-4">
                <a href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Haz tu pedido de indumentaria para el grupo *${qrModal.groupName}* aquí:\n\n${qrModal.link}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold py-2 px-3 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 text-sm shadow-sm"><MessageCircle className="w-4 h-4" /> Enviar</a>
                <button onClick={() => { const textArea = document.createElement("textarea"); textArea.value = qrModal.link; document.body.appendChild(textArea); textArea.select(); try { document.execCommand('copy'); alert("¡Enlace copiado al portapapeles!"); } catch (err) {} document.body.removeChild(textArea); }} className={`flex-1 font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm border-none ${darkMode ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}><Link2 className="w-4 h-4" /> Copiar</button>
              </div>
              <button onClick={() => setQrModal({isOpen: false, link: '', groupName: ''})} className={`w-full font-bold py-2 rounded-xl transition-all text-sm border-none ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-neutral-800 text-white hover:bg-neutral-900'}`}>Cerrar Ventana</button>
            </div>
          </div>
        )}

        {/* Footer de Créditos de Desarrollador */}
        <div className={`text-center py-8 border-t mt-12 flex flex-col items-center gap-4 ${darkMode ? 'border-slate-800 text-slate-500' : 'border-neutral-200 text-neutral-400'}`}>
          <div className="flex justify-center items-center gap-8 mb-2">
             <button onClick={() => setShowAdminLogin(true)} className="text-2xl hover:scale-125 transition-transform opacity-30 hover:opacity-100" title="Acceso Admin">🔒</button>
             <button onClick={() => setShowGroupAuth(true)} className="text-2xl hover:scale-125 transition-transform opacity-30 hover:opacity-100" title="Acceso Creadores">👑</button>
             <a href="https://www.instagram.com/brooguin_santani" target="_blank" rel="noopener noreferrer" className="text-2xl hover:scale-125 transition-transform opacity-30 hover:opacity-100" title="Instagram Brooguin">🦊</a>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Plataforma desarrollada profesionalmente por</span>
            <a href="https://www.instagram.com/lukasy.exe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="font-black text-indigo-500 hover:text-indigo-400 transition-colors text-sm flex items-center gap-1">
              Lukasy.exe
            </a>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold mt-2">
            <a href="https://wa.me/595984948834?text=Hola%20Lukasy,%20me%20interesa%20tu%20trabajo%20de%20desarrollo%20web!" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors">
              <Phone className="w-3.5 h-3.5" /> Contacto
            </a>
            <a href="https://www.instagram.com/lukasy.exe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
               Instagram
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}