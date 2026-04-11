import React, { useState, useMemo, useEffect } from 'react';
import { Shirt, PlusCircle, ClipboardList, Trash2, User, Hash, Phone, Loader2, Layers, Lock, Unlock, X, Eye, EyeOff, Download, FileText, Info, AlertCircle, Search, CheckCircle2, Edit, Filter, Link2, Plus, ShieldAlert, Settings, MessageCircle, DollarSign, TrendingUp, Scissors, History, KeyRound, RefreshCw, BarChart3, ExternalLink, Receipt, Target, QrCode, MapPin, Moon, Sun, ArrowRight, ArrowLeft, ImagePlus } from 'lucide-react';

// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const supabaseUrl = 'https://waoylkoopzluyhuuhbbc.supabase.co'; 
const supabaseKey = 'sb_publishable_JYC_sxawUbpXIYycV7HO3A_kiUiFyoy'; 

const URL_LOGO_BROOGUIN = 'https://i.postimg.cc/Ff77DPdm/logo.png'; 

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

// Talles universales
const SIZES_UNIVERSAL = ['P', 'M', 'G', 'XG', 'XXL', 'XXXL'];
const AGE_RANGES = ['2 a 5 años', '6 a 10 años', '11 a 14 años', '15 a 16 años'];

const PRECIOS_BASE = {
  Adultos: {
    Premium: { 'Solo Remera': 105000, 'Remera + Short': 155000, 'Equipo Completo': 175000 },
    'Semi-Premium': { 'Solo Remera': 95000, 'Remera + Short': 145000, 'Equipo Completo': 160000 },
    Estandard: { 'Solo Remera': 85000, 'Remera + Short': 130000, 'Equipo Completo': 150000 }
  },
  Infantil: {
    Premium: { 'Solo Remera': 90000, 'Remera + Short': 130000, 'Equipo Completo': 150000 },
    'Semi-Premium': { 'Solo Remera': 80000, 'Remera + Short': 110000, 'Equipo Completo': 130000 },
    Estandard: { 'Solo Remera': 60000, 'Remera + Short': 90000, 'Equipo Completo': 110000 }
  }
};

const HelperTooltip = ({ text, darkMode }) => {
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
};

const ANIMATION_THEMES = [
  { e: ['⚽', '🥅', '🏟️', '👟', '🥇'], a: 'anim-fall' }, { e: ['🏆', '🥇', '🏅', '🌟', '🙌'], a: 'anim-bounce' }, { e: ['🌸', '🌺', '💮', '🍃', '✨'], a: 'anim-float' }, { e: ['💋', '❤️', '💖', '😍', '🌹'], a: 'anim-float' }, { e: ['🔥', '💪', '💯', '💥', '⚡'], a: 'anim-zoom' }, { e: ['🎉', '🎊', '🎈', '✨', '🎁'], a: 'anim-fall' }, { e: ['🚀', '🌕', '⭐', '☄️', '🛸'], a: 'anim-rise' }, { e: ['⭐', '🌟', '✨', '💫', '🤩'], a: 'anim-fall' }, { e: ['💎', '💸', '💰', '🤑', '🪙'], a: 'anim-fall' }, { e: ['🏀', '🏐', '🎾', '🏓', '🎯'], a: 'anim-bounce' }
];

const SuccessAnimation = ({ themeIndex }) => {
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
};

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('es-PY', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const extractDetails = (obs) => {
  if (!obs) return { details: '', rest: '', loc: '' };
  let details = '';
  let rest = obs;
  let loc = '';

  // Extracción de la localización oculta
  const locMatch = rest.match(/\[Loc:\s*(.*?)\]/);
  if (locMatch) {
    loc = locMatch[1];
    rest = rest.replace(locMatch[0], '').trim();
  }

  const bracketRegex = /^(\[.*?\]\s*)+/;
  const match = rest.match(bracketRegex);
  
  if (match) {
    details = match[0].trim();
    rest = rest.replace(bracketRegex, '').trim();
  }
  if (rest.startsWith('Obs:')) rest = rest.substring(4).trim();
  return { details, rest, loc };
};

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const t = {
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
  };

  const [orders, setOrders] = useState([]);
  const [groupSettings, setGroupSettings] = useState([]); 
  const [groupConfigs, setGroupConfigs] = useState({}); 
  const [loading, setLoading] = useState(true);
  
  // IP Localización Silenciosa
  const [visitorLocation, setVisitorLocation] = useState('');
  
  // Modal de Catálogo
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  const [adminGroupFilter, setAdminGroupFilter] = useState('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminLegend, setShowAdminLegend] = useState(false);
  
  const [currentAdminPassword, setCurrentAdminPassword] = useState('brooguin2025'); 
  const MASTER_AUTHORIZATION = 'alucas123'; 

  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [isMasterOwner, setIsMasterOwner] = useState(false); 
  const [isCreator, setIsCreator] = useState(false); 
  
  const [showGroupAuth, setShowGroupAuth] = useState(false);
  const [groupPin, setGroupPin] = useState('');
  const [groupPinError, setGroupPinError] = useState(false);
  const [showGroupPassword, setShowGroupPassword] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);

  const [paymentModal, setPaymentModal] = useState({ isOpen: false, order: null, amount: 0, isSaved: false });
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

  // BUSCADOR INTELIGENTE GLOBAL
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const [activeGroup, setActiveGroup] = useState(() => urlParams.get('grupo') || 'General');

  const changeAdminFilter = (newGroup) => {
    setAdminGroupFilter(newGroup);
    if (newGroup !== 'Todos') {
      setActiveGroup(newGroup);
    }
  };

  const urlEstilo = urlParams.get('estilo') || (urlParams.get('tipo') === 'Remera Piqué' ? 'Piqué' : 'Deportiva');

  const [newGroupConfig, setNewGroupConfig] = useState({
    name: '', estilo: 'Deportiva'
  });

  const isPreviewMode = showGroupManager && isGroupAdmin;
  const contextualGroup = isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : (isPreviewMode ? (newGroupConfig.name || 'Vista Previa') : activeGroup);
  const displayGroup = contextualGroup;

  const archivedNames = useMemo(() => archivedGroups.map(g => g.name), [archivedGroups]);

  // CEREBRO: Deduce los detalles visuales basándose en el ADN del grupo
  const activeGroupConfig = useMemo(() => {
    if (isPreviewMode) return newGroupConfig;
    const conf = groupConfigs[contextualGroup];
    if (conf) return conf;

    const groupOrders = orders.filter(o => o.group_name === contextualGroup && !o.deleted);
    let est = urlEstilo;
    
    if (groupOrders.length > 0) {
       const isDep = groupOrders.some(o => o.observations && o.observations.includes('[#'));
       est = isDep ? 'Deportiva' : 'Piqué';
    }
    return { estilo: est };
  }, [contextualGroup, groupConfigs, orders, isPreviewMode, newGroupConfig, urlEstilo]);

  const displayEstilo = activeGroupConfig?.estilo || 'Deportiva';
  const isContextDeportiva = displayEstilo === 'Deportiva';
  const costoMangaLarga = isContextDeportiva ? 15000 : 10000;

  const [searchTerm, setSearchTerm] = useState(''); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Formulario del Cliente
  const [formData, setFormData] = useState({
    name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '',
    playerName: '', playerNumber: '', isGoalkeeper: false, 
    combo: 'Solo Remera', tela: 'Estandard',
    shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: '' 
  });

  const isCamisilla = formData.combo?.includes('Camisilla') || false;
  const allowLongSleeve = !isCamisilla || formData.isGoalkeeper; 

  const activeSizes = SIZES_UNIVERSAL;

  useEffect(() => {
    if (!editingId) {
      setFormData(prev => ({ ...prev, size: activeSizes[0], shortSize: activeSizes[0] }));
    }
  }, [formData.edad, displayEstilo, activeSizes, editingId]);

  // Efecto de inicialización: Fetch de datos y Localización por IP
  useEffect(() => {
    fetchOrdersAndSettings();
    trackVisit();
    
    // Rastreo Silencioso de IP (Para el Master Owner)
    const fetchLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.city) {
          setVisitorLocation(`${data.city}, ${data.country_name}`);
        }
      } catch (e) {
        console.log("Rastreo IP fallido u oculto por ad-blocker.");
      }
    };
    fetchLocation();
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
        const hoursElapsed = (now - delTime) / (1000 * 60 * 60);
        if (hoursElapsed >= 48) {
          await supabaseRequest(`orders?id=eq.${o.id}`, 'DELETE');
          needsRefetch = true;
        }
      }
    }

    const validArchived = [];
    for (const g of archivedGroupsData) {
      const daysElapsed = (now - g.archivedAt) / (1000 * 60 * 60 * 24);
      if (daysElapsed >= 40) {
         await supabaseRequest(`orders?group_name=eq.${g.name}`, 'DELETE');
         await supabaseRequest(`global_settings?id=eq.conf_${g.name}`, 'DELETE');
         needsRefetch = true;
      } else {
         validArchived.push(g);
      }
    }

    if (validArchived.length !== archivedGroupsData.length) {
       await saveToGlobalSettings('archived_groups', JSON.stringify(validArchived));
       setArchivedGroups(validArchived);
    }

    if (needsRefetch) {
      fetchOrdersAndSettings(); 
    }
  };

  const handleSponsorClick = async () => {
    const currentClicks = siteMetrics.sponsorClicks;
    setSiteMetrics(prev => ({ ...prev, sponsorClicks: currentClicks + 1 }));
    const res = await supabaseRequest('global_settings?id=eq.sponsor_clicks', 'GET');
    if (res.data && res.data.length > 0) await supabaseRequest('global_settings?id=eq.sponsor_clicks', 'PATCH', { value: (currentClicks + 1).toString() });
    else await supabaseRequest('global_settings', 'POST', { id: 'sponsor_clicks', value: '1' });
    window.open(`https://wa.me/595984948834?text=${encodeURIComponent("Hola quiero ser sponsor de la página de Brooguin")}`, '_blank');
  };

  const fetchOrdersAndSettings = async () => {
    setLoading(true);
    const [resOrders, resSettings, resGlobal] = await Promise.all([
      supabaseRequest('orders?select=*&order=created_at.desc'),
      supabaseRequest('group_settings?select=*'),
      supabaseRequest('global_settings?select=*') 
    ]);
    
    let parsedArchived = [];
    let parsedConfigs = {};

    if (resOrders.data) setOrders(resOrders.data);
    if (resSettings.data) setGroupSettings(resSettings.data);
    
    if (resGlobal.data) {
      const passObj = resGlobal.data.find(s => s.id === 'admin_password');
      if (passObj) setCurrentAdminPassword(passObj.value);

      const visitsObj = resGlobal.data.find(s => s.id === 'page_visits');
      const clicksObj = resGlobal.data.find(s => s.id === 'sponsor_clicks');
      setSiteMetrics({ visits: visitsObj ? parseInt(visitsObj.value) : 0, sponsorClicks: clicksObj ? parseInt(clicksObj.value) : 0 });
      
      const archivedObj = resGlobal.data.find(s => s.id === 'archived_groups');
      if (archivedObj) {
         try { parsedArchived = JSON.parse(archivedObj.value); } catch(e) {}
      }
      setArchivedGroups(parsedArchived);

      resGlobal.data.forEach(item => {
        if (item.id.startsWith('conf_')) {
          try { parsedConfigs[item.id.replace('conf_', '')] = JSON.parse(item.value); } catch(e){}
        }
      });
      setGroupConfigs(parsedConfigs);
    }
    
    setLoading(false);
    performAutoCleanups(resOrders.data || [], parsedArchived);
  };

  const logAction = async (action, details) => {
    let actor = 'Admin Normal';
    if (isMasterOwner) actor = 'Dueño Supremo';
    else if (isCreator) actor = 'Admin Creador';
    
    try {
      await supabaseRequest('audit_logs', 'POST', { action, details: `${details} (Por: ${actor})`, group_name: displayGroup });
    } catch (err) {}
  };

  const fetchAuditLogs = async () => {
    const { data } = await supabaseRequest('audit_logs?select=*&order=created_at.desc');
    if (data) setAuditLogsData(data);
  };

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
      return newData;
    });
  };

  const calculateCurrentTotal = () => {
    let unitPrice = 0; 
    if (isContextDeportiva) {
       unitPrice = PRECIOS_BASE[formData.edad]?.[formData.tela]?.[formData.combo] || 85000;
    } else {
       unitPrice = 95000; 
    }
    if (formData.longSleeve && allowLongSleeve) unitPrice += costoMangaLarga;
    return unitPrice * (parseInt(formData.quantity) || 1);
  };

  const currentOrderTotal = calculateCurrentTotal();

  const allGroupNames = useMemo(() => {
    const groupsFromSettings = groupSettings.map(g => g.group_name);
    const groupsFromOrders = orders.map(o => o.group_name || 'General');
    return [...new Set([...groupsFromSettings, ...groupsFromOrders])].filter(Boolean).filter(g => !archivedNames.includes(g));
  }, [groupSettings, orders, archivedNames]);

  const getGroupLink = (groupName) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.append('grupo', groupName);
    
    let conf = groupConfigs[groupName];
    if (groupName === newGroupConfig.name && isPreviewMode) {
       conf = newGroupConfig;
    }
    
    if (conf) {
       params.append('estilo', conf.estilo); 
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.quantity < 1) { alert("Completa el nombre y cantidad."); return; }
    if (!/^09\d{8}$/.test(formData.phone.trim())) { alert("Teléfono debe tener 10 dígitos y empezar con 09."); return; }

    let prefix = '';
    const currentUnitPrice = calculateCurrentTotal() / (parseInt(formData.quantity) || 1);

    if (isContextDeportiva) {
      const shortFormat = formData.combo.includes('Short') ? `${formData.shortSize}${formData.gender === 'Femenino' ? ' ('+formData.femaleShortType+')' : ''}` : 'NO';
      const ageInfo = formData.edad === 'Infantil' ? `Infantil (${formData.ageRange})` : 'Adultos';
      prefix = `[👔 ${ageInfo} | Tela: ${formData.tela} | Combo: ${formData.combo} | #${formData.playerNumber || 'S/N'} | ${formData.playerName?.toUpperCase() || 'SIN NOMBRE'} | Short: ${shortFormat} | Arquero: ${formData.isGoalkeeper ? 'SI' : 'NO'}] `;
    } else {
      const ageInfo = formData.edad === 'Infantil' ? `Infantil (${formData.ageRange})` : 'Adultos';
      prefix = `[👔 ${ageInfo} | Uniforme Piqué | Calidad: Premium] `;
    }
    prefix += `[Precio: ${currentUnitPrice}] `;

    let oldCleanObs = '';
    if (editingId && formData.observations) {
       oldCleanObs = extractDetails(formData.observations).rest;
    } else {
       oldCleanObs = formData.observations;
    }

    // Adjuntar la localización silenciosa solo en la creación original, no en las ediciones
    let silentLocStr = '';
    if (!editingId && visitorLocation) silentLocStr = ` [Loc: ${visitorLocation}]`;

    const finalObservations = `${prefix}${oldCleanObs ? 'Obs: ' + oldCleanObs : ''}${silentLocStr}`.trim();

    const orderData = {
      name: formData.name, phone: formData.phone || '-', size: formData.size, gender: formData.gender, quantity: parseInt(formData.quantity, 10), longSleeve: allowLongSleeve ? formData.longSleeve : false,
      observations: finalObservations, group_name: editingId ? (isCreator ? formData.group_name : formData.originalGroup) : contextualGroup 
    };

    try {
      if (editingId) {
        const { error } = await supabaseRequest(`orders?id=eq.${editingId}`, 'PATCH', orderData);
        if (error) throw new Error(error);
        logAction('Editó Pedido', `Editó a ${orderData.name}`);
        setSuccessMessage('¡Pedido Actualizado!'); setEditingId(null);
      } else {
        const newOrder = { ...orderData, paymentStatus: 'Pendiente', deleted: false, amount_paid: 0 };
        const { error } = await supabaseRequest('orders', 'POST', newOrder);
        if (error) throw new Error(error);
        if (isAdmin) logAction('Agregó Pedido Manual', `Agregó a ${orderData.name}`);
        setSuccessMessage('¡Pedido Registrado!');
        setActiveAnimationTheme(Math.floor(Math.random() * 10));
      }
      await fetchOrdersAndSettings(); 
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); 
      setTimeout(() => setActiveAnimationTheme(null), 5000); 

      setFormData({ name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '', playerName: '', playerNumber: '', isGoalkeeper: false, combo: 'Solo Remera', tela: 'Estandard', shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: '' });
    } catch (error) { alert("Hubo un error al procesar tu solicitud."); }
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
      
      if (adminGroupFilter === renameModal.oldName) {
        changeAdminFilter(cleanNewName);
      } else if (activeGroup === renameModal.oldName) {
        setActiveGroup(cleanNewName);
      }
      
      setRenameModal({ isOpen: false, oldName: '', newName: '' });
      alert(`¡Grupo renombrado exitosamente a "${cleanNewName}"! \nGenerar nuevo link si se estaba compartiendo.`);
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

  const handleOpenPayment = (order) => {
    if (!isAdmin) return;
    const total = getUnitPrice(order) * order.quantity;
    const amount = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    setPaymentModal({ isOpen: true, order, amount: amount, isSaved: false });
  };

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

  const getWhatsAppLink = (order) => {
    let phone = order.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '595' + phone.substring(1);
    const msg = `Hola *${order.name}*! Te escribo por tu pedido de indumentaria para el grupo/equipo *${order.group_name || 'General'}*.\n\nPor favor, avisame si está todo correcto para avanzar o si te falta abonar. ¡Gracias!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const getReceiptLink = (order) => {
    let phone = order.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '595' + phone.substring(1);
    const fins = getOrderFinancials(order);
    
    const { details } = extractDetails(order.observations);
    const desc = `${order.size} ${order.gender[0]} - ${details.replace(/\[|\]/g, '')}`;
    
    const msg = `🧾 *RECIBO VIRTUAL - BROOGUIN SPORT* 🦊\n\n¡Hola *${order.name}*! Confirmamos el registro de tu pago.\n\n*Detalles del Pedido:*\nGrupo: ${order.group_name || 'General'}\nPrenda: ${desc} (x${order.quantity})\n\n*Estado de Cuenta:*\nTotal del Pedido: ${new Intl.NumberFormat('es-PY').format(fins.total)} Gs.\n💰 *Pagado hasta ahora: ${new Intl.NumberFormat('es-PY').format(fins.paid)} Gs.*\n⚠️ *Saldo Pendiente: ${new Intl.NumberFormat('es-PY').format(fins.balance)} Gs.*\n\n¡Gracias por tu confianza!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const getUnitPrice = (order) => {
    const match = order.observations?.match(/\[Precio:\s*(\d+)\]/);
    if (match) return parseInt(match[1], 10);
    
    const isDep = order.observations?.includes('Combo:') || order.observations?.includes('Short:') || order.observations?.includes('[#');
    const mangaLargaCost = isDep ? 15000 : 10000;
    return 85000 + (order.longSleeve ? mangaLargaCost : 0);
  };

  const getOrderFinancials = (order) => {
    const total = getUnitPrice(order) * order.quantity;
    const paid = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    return { total, paid, balance: total - paid };
  };

  const handleAdminLogin = async () => {
    if (adminPin === currentAdminPassword) { 
      setIsAdmin(true); 
      setAdminGroupFilter(displayGroup); 
      setShowAdminLogin(false); setPinError(false); setAdminPin(''); setShowPassword(false); 
    } else { setPinError(true); }
  };
  
  const handleGroupAuth = () => {
    if (groupPin === 'marseo') { 
       setIsAdmin(true); 
       setIsGroupAdmin(true); setIsMasterOwner(false); setIsCreator(true);
       setShowGroupAuth(false); setShowGroupManager(true); setGroupPin(''); setGroupPinError(false); setShowGroupPassword(false); 
    } else if (groupPin === 'lukasy67') {
       setIsAdmin(true); 
       setIsGroupAdmin(true); setIsMasterOwner(true); setIsCreator(true);
       setShowGroupAuth(false); setShowGroupManager(true); setGroupPin(''); setGroupPinError(false); setShowGroupPassword(false); 
    } else {
       setGroupPinError(true);
    }
  };

  const handleChangePasswordSubmit = async () => {
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

  const copyExistingGroupLink = (groupName) => {
    const link = getGroupLink(groupName);
    const textArea = document.createElement("textarea"); textArea.value = link; document.body.appendChild(textArea); textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
    setQrModal({ isOpen: true, link: link, groupName: groupName });
  };

  const handleShareCurrentGroup = () => {
    const link = getGroupLink(displayGroup);
    setQrModal({ isOpen: true, link: link, groupName: displayGroup });
  };

  const handleEditClick = (order) => {
    let pName = ''; let pNum = '';
    let combo = 'Solo Remera'; let tela = 'Estandard';
    let eDad = 'Adultos'; let aRange = AGE_RANGES[1];
    let sSize = SIZES_UNIVERSAL[1]; let fShort = 'Standard'; let isGk = false;

    const obs = order.observations || '';
    
    if (obs.includes('Combo: Equipo Completo') || obs.includes('Combo: Remera + Short + Medias')) combo = 'Equipo Completo';
    else if (obs.includes('Combo: Remera + Short') || (obs.includes('Short: ') && !obs.includes('Short: NO'))) combo = 'Remera + Short'; 

    if (obs.includes('Tela: Premium') || obs.includes('Calidad: Premium')) tela = 'Premium';
    else if (obs.includes('Tela: Semi-Premium')) tela = 'Semi-Premium';

    if (obs.includes('Arquero: SI')) isGk = true;
    
    if (obs.includes('Infantil')) {
      eDad = 'Infantil';
      const matchAge = obs.match(/Infantil \((.*?)\)/);
      if (matchAge) aRange = matchAge[1];
    }

    const matchNum = obs.match(/#([0-9]+)/);
    if (matchNum) pNum = matchNum[1];

    const matchName = obs.match(/\|\s*#.*?\|\s*([^|]+)\s*\|/);
    if (matchName) pName = matchName[1].trim() === 'SIN NOMBRE' ? '' : matchName[1].trim();

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
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '', playerName: '', playerNumber: '', isGoalkeeper: false, combo: 'Solo Remera', tela: 'Estandard', shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: ''});
  };

  const handleDelete = async (order) => {
    if (!isAdmin) return;
    const delTime = Date.now();
    const newObs = (order.observations || '') + ` [DEL:${delTime}]`;
    await supabaseRequest(`orders?id=eq.${order.id}`, 'PATCH', { deleted: true, observations: newObs });
    logAction('Eliminó Pedido', `Envió pedido a papelera`); 
    fetchOrdersAndSettings();
    setUndoDeleteId(order.id);
    setTimeout(() => { setUndoDeleteId(current => current === order.id ? null : current); }, 4000);
  };

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

  const handleRestore = async (order) => {
    if (!isAdmin) return;
    const newObs = (order.observations || '').replace(/\s*\[DEL:\d+\]/g, '');
    await supabaseRequest(`orders?id=eq.${order.id}`, 'PATCH', { deleted: false, observations: newObs });
    logAction('Restauró Pedido', `Desde papelera`); fetchOrdersAndSettings();
  };

  const handlePermanentDelete = async (id) => {
    if (!isGroupAdmin) return; 
    if(!confirm("¿Estás seguro de eliminar esto permanentemente?")) return;
    await supabaseRequest(`orders?id=eq.${id}`, 'DELETE');
    logAction('Borro Permanente', `Destruyó pedido`); fetchOrdersAndSettings();
  };

  // BUSCADOR INTELIGENTE GLOBAL
  const globalFilteredOrders = useMemo(() => {
    if (!globalSearchTerm.trim()) return [];
    return orders.filter(o => 
       !o.deleted && 
       !archivedNames.includes(o.group_name || 'General') &&
       ((o.name && o.name.toLowerCase().includes(globalSearchTerm.toLowerCase())) || 
       (o.phone && o.phone.includes(globalSearchTerm)))
    ).slice(0, 10); 
  }, [orders, globalSearchTerm, archivedNames]);

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

  const availableGroups = useMemo(() => {
    return ['Todos', ...new Set(orders.filter(o => !o.deleted).map(o => o.group_name || 'General'))]
      .filter(g => g === 'Todos' || !archivedNames.includes(g));
  }, [orders, archivedNames]);

  const summaryBySize = useMemo(() => {
    return SIZES_UNIVERSAL.map(size => {
      const sizeOrders = activeOrders.filter(order => order.size === size);
      const fem = sizeOrders.filter(o => o.gender === 'Femenino').reduce((sum, o) => sum + o.quantity, 0);
      const masc = sizeOrders.filter(o => o.gender === 'Masculino').reduce((sum, o) => sum + o.quantity, 0);
      const uni = sizeOrders.filter(o => o.gender === 'Unisex').reduce((sum, o) => sum + o.quantity, 0);
      return { size, fem, masc, uni, total: fem + masc + uni };
    });
  }, [activeOrders]);

  const shortsSummary = useMemo(() => {
    const counts = {};
    activeOrders.forEach(o => {
       if (o.observations?.includes('Short:') && !o.observations?.includes('Short: NO')) {
          const match = o.observations.match(/Short:\s*([^|\]]+)/);
          if (match) { counts[match[1].trim()] = (counts[match[1].trim()] || 0) + o.quantity; }
       }
    }); return counts;
  }, [activeOrders]);

  const totalSocks = useMemo(() => activeOrders.reduce((sum, o) => o.observations?.includes('Medias: SI') || o.observations?.includes('Combo: Equipo Completo') ? sum + o.quantity : sum, 0), [activeOrders]);
  const totalGarments = activeOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalRevenue = activeOrders.reduce((sum, order) => sum + getOrderFinancials(order).total, 0);
  const totalCollected = activeOrders.reduce((sum, order) => sum + getOrderFinancials(order).paid, 0);

  const globalStats = useMemo(() => {
    const allActive = orders.filter(o => !o.deleted && !archivedNames.includes(o.group_name || 'General'));
    let expected = 0; let collected = 0;
    allActive.forEach(o => {
      const fins = getOrderFinancials(o);
      expected += fins.total; collected += fins.paid;
    });
    return { items: allActive.length, expected, collected, debt: expected - collected };
  }, [orders, archivedNames]);

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
  }, [orders]);

  const sortedGroupStats = useMemo(() => {
     return [...groupStatsList]
       .filter(g => !archivedNames.includes(g.name))
       .sort((a, b) => {
        let valA = a[groupSort.key]; let valB = b[groupSort.key];
        if (groupSort.key === 'name') { valA = (valA || '').toLowerCase(); valB = (valB || '').toLowerCase(); } 
        else { valA = valA ? new Date(valA).getTime() : 0; valB = valB ? new Date(valB).getTime() : 0; }
        if (valA < valB) return groupSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return groupSort.direction === 'asc' ? 1 : -1;
        return 0;
     });
  }, [groupStatsList, groupSort, archivedNames]);

  const progressPercent = totalRevenue === 0 ? 0 : Math.round((totalCollected / totalRevenue) * 100);

  const handleFilterFromDirectory = (groupName) => {
    changeAdminFilter(groupName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCSV = () => {
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
    csv += `\nTOTAL A RECAUDAR;;;; ${new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs\n\n`;
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
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    let html = `
      <html>
        <head>
          <title>Pedidos - ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</title>
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
          <h1>BROOGUIN SPORT - Reporte de Pedidos</h1>
          <p class="date">Vista: ${isGroupAdmin ? adminGroupFilter : displayGroup} | ${new Date().toLocaleString()}</p>
          
          <h2>Resumen para Confección (Remeras)</h2>
          <table>
            <thead><tr><th>Talle</th><th class="text-center">Femenino</th><th class="text-center">Masculino</th><th class="text-center">Unisex</th><th class="text-right">Total</th></tr></thead>
            <tbody>
    `;
    summaryBySize.forEach(item => {
      if (item.total > 0) html += `<tr><td class="font-bold">${item.size}</td><td class="text-center">${item.fem || '-'}</td><td class="text-center">${item.masc || '-'}</td><td class="text-center">${item.uni || '-'}</td><td class="text-right font-bold">${item.total}</td></tr>`;
    });
    html += `
            </tbody>
            <tfoot>
              <tr class="summary-total" style="background-color: #ecfdf5;"><td colspan="4" class="text-right font-bold">Total Remeras:</td><td class="text-right font-bold">${totalGarments}</td></tr>
              <tr class="summary-total" style="background-color: #e0e7ff;"><td colspan="4" class="text-right font-bold">Recaudación Total Calculada:</td><td class="text-right font-bold">${new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs</td></tr>
            </tfoot>
          </table>
    `;
    if (Object.keys(shortsSummary).length > 0 || totalSocks > 0) {
      html += `<h2>Extras Deportivos</h2><table style="width: 50%;"><thead><tr><th>Item</th><th>Talle / Tipo</th><th class="text-right">Total</th></tr></thead><tbody>`;
      Object.entries(shortsSummary).forEach(([size, qty]) => { html += `<tr><td>Short</td><td class="font-bold">${size}</td><td class="text-right">${qty}</td></tr>`; });
      if (totalSocks > 0) html += `<tr><td>Par de Medias</td><td class="font-bold">-</td><td class="text-right">${totalSocks}</td></tr>`;
      html += `</tbody></table>`;
    }
    html += `
          <h2>Lista de Pedidos Detallada</h2>
          <table>
            <thead><tr>${isGroupAdmin && adminGroupFilter === 'Todos' ? '<th>Grupo</th>' : ''}<th>Cliente</th><th>Talle</th><th>Género</th><th>Cant.</th><th>Estado</th><th>Datos Adicionales</th></tr></thead>
            <tbody>
    `;
    activeOrders.forEach(o => {
      const { details, rest } = extractDetails(o.observations);
      const obsFinal = `${details} ${rest}`.trim();
      html += `<tr>${isGroupAdmin && adminGroupFilter === 'Todos' ? `<td>${o.group_name || 'General'}</td>` : ''}<td>${o.name} <br><small>${o.phone || ''}</small></td><td>${o.size}</td><td>${o.gender} ${o.longSleeve ? '(ML)' : ''}</td><td>${o.quantity}</td><td>${o.paymentStatus || 'Pendiente'}</td><td><small>${obsFinal}</small></td></tr>`;
    });
    html += `</tbody></table><script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script></body></html>`;
    printWindow.document.write(html); printWindow.document.close();
  };

  const handleExportHojaCorte = () => {
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
      <html>
        <head>
          <title>Hoja de Corte - ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            h1 { font-size: 26px; text-align: center; margin-bottom: 5px; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 10px; }
            h2 { font-size: 20px; margin-top: 30px; background-color: #e5e5e5; padding: 8px; border-left: 5px solid #000; }
            .meta { font-size: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 16px; }
            th, td { border: 1px solid #000; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .qty { font-size: 22px; font-weight: 900; text-align: center; width: 100px; }
            .item-desc { font-weight: bold; text-transform: uppercase; }
            @media print { button { display: none; } body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>HOJA DE CORTE DE TALLER: ${isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : displayGroup}</h1>
          <div class="meta">
            <span><strong>Fecha de impresión:</strong> ${new Date().toLocaleDateString()}</span>
            <span><strong>Estilo:</strong> ${displayEstilo}</span>
          </div>
          <h2>1. CONFECCIÓN DE REMERAS</h2>
          <table><thead><tr><th>Especificación de Corte (Talle - Género - Manga)</th><th class="qty">Cant.</th></tr></thead>
            <tbody>
              ${Object.entries(cortesRemera).sort().map(([desc, cant]) => `<tr><td class="item-desc">${desc}</td><td class="qty">${cant}</td></tr>`).join('')}
            </tbody>
          </table>
    `;
    if (Object.keys(cortesShort).length > 0) {
      html += `<h2>2. CONFECCIÓN DE SHORTS</h2><table><thead><tr><th>Especificación de Corte (Talle y Diseño)</th><th class="qty">Cant.</th></tr></thead>
            <tbody>${Object.entries(cortesShort).sort().map(([desc, cant]) => `<tr><td class="item-desc">Short Talle ${desc}</td><td class="qty">${cant}</td></tr>`).join('')}</tbody></table>`;
    }
    if (totalSocks > 0) {
      html += `<h2>3. MEDIAS</h2><table><tbody><tr><td class="item-desc">Total de Pares de Medias a preparar</td><td class="qty">${totalSocks}</td></tr></tbody></table>`;
    }
    html += `<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script></body></html>`;
    printWindow.document.write(html); printWindow.document.close();
  };

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 transition-colors duration-500 relative pb-24 ${t.page}`}>
      
      <style>
        {`
          @keyframes anim-fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
          @keyframes anim-float {
            0% { transform: translateY(110vh) scale(0.5); opacity: 0; }
            50% { opacity: 1; transform: translateY(50vh) scale(1.2); }
            100% { transform: translateY(-10vh) scale(1); opacity: 0; }
          }
          @keyframes anim-bounce {
            0% { transform: translateY(110vh); }
            50% { transform: translateY(30vh); }
            100% { transform: translateY(110vh); }
          }
          @keyframes anim-zoom {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.5); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
          }
          @keyframes anim-rise {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-10vh) rotate(-360deg); opacity: 0; }
          }
        `}
      </style>

      {activeAnimationTheme !== null && <SuccessAnimation themeIndex={activeAnimationTheme} />}

      {/* Botones Flotantes (Oscuro y Ayuda) */}
      <div className="fixed bottom-20 right-6 flex flex-col gap-3 z-40 items-end">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 border-2 ${darkMode ? 'bg-slate-800 text-yellow-400 border-slate-600' : 'bg-white text-indigo-900 border-neutral-200'}`}
          title={darkMode ? "Activar Modo Claro" : "Activar Modo Oscuro"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {isAdmin && !showAdminLegend && (
          <button onClick={() => setShowAdminLegend(true)} className="bg-indigo-600 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all transform hover:scale-110 animate-in fade-in" title="Ver herramientas de administración">
             <span className="text-xl font-bold">?</span>
          </button>
        )}
      </div>

      {/* Botón Flotante Deshacer Eliminación */}
      {undoDeleteId && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 z-[100] border border-slate-700">
          <span className="text-sm font-medium">Pedido a papelera.</span>
          <button onClick={handleUndoDelete} className="bg-slate-700 hover:bg-slate-600 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
            Deshacer
          </button>
        </div>
      )}

      {/* Botón Flotante de Asistencia (WhatsApp) */}
      <a href="https://wa.me/595984948834" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all transform hover:scale-110 z-50 flex items-center justify-center group border-2 border-white/20">
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[150px] transition-all duration-300 ease-in-out font-bold text-sm ml-0 group-hover:ml-2">
          Asistencia
        </span>
      </a>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ESPACIO SPONSOR LOCAL */}
        <div className={`rounded-xl shadow-sm overflow-hidden flex items-center justify-center relative cursor-pointer hover:shadow-md transition-all group border bg-gradient-to-r ${t.sponsorCard}`} onClick={handleSponsorClick} title="¡Anúnciate Aquí!">
           <div className="absolute inset-0 bg-white/5 opacity-50"></div>
           <div className="p-3 text-center z-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-black text-xs border border-dashed border-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">LOGO</div>
             <div className="text-left">
               <p className={`text-[10px] uppercase tracking-widest font-bold mb-0.5 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>¿Quieres ser nuestro sponsor?</p>
               <p className={`text-sm font-black flex items-center gap-1 group-hover:text-indigo-500 transition-colors ${darkMode ? 'text-white' : 'text-neutral-800'}`}>🚀 ¡Destaca tu marca aquí! <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
             </div>
           </div>
        </div>

        {/* Header Adaptativo */}
        <header className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 text-left relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 z-10">
            <a href="https://www.instagram.com/brooguin_santani?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-2xl" title="Instagram de Brooguin">
              🦊
            </a>
            <div className="flex items-center gap-3">
              {URL_LOGO_BROOGUIN ? (
                <img src={URL_LOGO_BROOGUIN} alt="Brooguin Sport Logo" className="w-20 h-20 object-contain bg-white rounded-xl p-1.5 shadow-md" />
              ) : (
                <Shirt className="w-16 h-16 text-indigo-300 flex-shrink-0" />
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">BROOGUIN SPORT</h1>
                <p className="text-indigo-200 text-sm mt-1 font-medium tracking-wide">
                  {isContextDeportiva ? '🏃‍♂️ Indumentaria Deportiva' : '👔 Uniformes Piqué Institucionales'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto md:justify-end z-10">
            
            {/* Cajas de Contacto y Ubicación */}
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="bg-indigo-800/40 p-2.5 rounded-xl border border-indigo-700 flex-1 sm:flex-none shadow-inner flex flex-col justify-center">
                <p className="text-[9px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Consultas y Diseño</p>
                <div className="text-xs font-medium text-white flex flex-col xl:flex-row items-start xl:items-center gap-1">
                  <span className="hidden xl:inline">Lucas López</span>
                  <a href="https://wa.me/595984948834" target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded flex items-center gap-1 hover:bg-[#25D366]/30 transition-colors w-full xl:w-auto justify-center">
                    <Phone className="w-3 h-3" /> 0984 948 834
                  </a>
                </div>
              </div>

              <div className="bg-indigo-800/40 p-2.5 rounded-xl border border-indigo-700 flex-1 sm:flex-none shadow-inner flex flex-col justify-center">
                <p className="text-[9px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Visítanos</p>
                <div className="text-xs font-medium text-white flex flex-col xl:flex-row items-start xl:items-center gap-1">
                  <span className="hidden xl:inline">San Estanislao</span>
                  <a href="https://maps.app.goo.gl/7KNH1ieqe5rSto1L9" target="_blank" rel="noopener noreferrer" className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded flex items-center gap-1 hover:bg-red-500/30 transition-colors w-full xl:w-auto justify-center">
                    <MapPin className="w-3 h-3" /> Encuéntranos acá
                  </a>
                </div>
              </div>
            </div>

            {/* Caja de Grupo */}
            <div className="flex gap-2 w-full sm:w-auto">
              <div className={`p-3 rounded-xl border flex-1 sm:flex-none shadow-inner flex items-center justify-between min-w-[150px] transition-colors ${isPreviewMode ? 'bg-emerald-900/80 border-emerald-500' : 'bg-indigo-800/60 border-indigo-700'}`}>
                 <div>
                   <span className={`block text-[10px] uppercase tracking-widest font-bold mb-0.5 ${isPreviewMode ? 'text-emerald-300' : 'text-indigo-300'}`}>
                      {isPreviewMode ? 'Vista Previa' : 'Grupo Activo'}
                   </span>
                   <span className="text-lg font-black text-white truncate max-w-[150px] block" title={displayGroup}>{displayGroup}</span>
                 </div>
                 <button onClick={handleShareCurrentGroup} className={`${isPreviewMode ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-indigo-700 hover:bg-indigo-600'} p-2 rounded-lg ml-2 flex gap-1 transition-colors cursor-pointer`} title="Compartir grupo y ver QR">
                   {isPreviewMode ? <Eye className="w-5 h-5 text-emerald-200" /> : <QrCode className="w-5 h-5 text-indigo-300" />}
                 </button>
              </div>
            </div>
          </div>
        </header>

        {/* Panel de Administrador General */}
        {isAdmin && (
          <div className={`${darkMode ? 'bg-slate-800 border-indigo-500' : 'bg-white border-indigo-500'} border-l-4 p-4 rounded-r-xl shadow-md space-y-4 transition-colors`}>
            
            {/* LEYENDA EXPLICATIVA AUTO-OCULTABLE */}
            {showAdminLegend && (
              <div className={`p-4 rounded-xl border relative shadow-md animate-in fade-in slide-in-from-top-4 ${darkMode ? 'bg-indigo-900/40 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
                <button onClick={() => setShowAdminLegend(false)} className={`absolute top-2 right-2 ${t.muted} hover:text-indigo-500`}><X className="w-5 h-5"/></button>
                <h4 className={`font-bold flex items-center gap-1 mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  <Info className="w-4 h-4" /> Herramientas del Modo Administración
                </h4>
                <ul className={`text-xs space-y-2 ml-1 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  <li><b>🔹 Estado de Pago:</b> Clickea sobre 'Pendiente/Señado/Pagado' en la tabla para registrar entregas de dinero. Al hacerlo, te dará la opción de enviar un Recibo por WhatsApp.</li>
                  <li><b>🔹 Papelera:</b> Si borras un pedido, irá a la papelera. Tienes 48 horas para deshacerlo antes de que se autoelimine permanentemente para ahorrar espacio.</li>
                  <li><b>🔹 Cerrar Lista:</b> Bloquea el formulario para que los clientes ya no puedan agregar pedidos.</li>
                  {isGroupAdmin && (
                    <>
                      <li className="pt-1 mt-1 border-t border-indigo-300/30"><b>👑 Creador de Enlaces:</b> Genera links personalizados con precios bloqueados para cada colegio.</li>
                      <li><b>👑 Hojas de Corte:</b> Exporta un PDF resumido especial solo para el taller de costura.</li>
                      <li><b>👑 Mover Pedidos:</b> Al "Editar" un pedido, ahora puedes cambiarlo de grupo si el cliente se equivocó.</li>
                    </>
                  )}
                  {isCreator && (
                    <li className="pt-1 mt-1 border-t border-indigo-300/30"><b>👑 Todos los Grupos:</b> Verás un botón extra para acceder a un directorio completo y estadístico de todos los grupos y ventas.</li>
                  )}
                  {isMasterOwner && (
                    <li className="pt-1 mt-1 border-t border-indigo-300/30"><b>🚀 Dueño Supremo:</b> Tienes acceso al total financiero de toda la empresa, papelera de grupos de 40 días, y al historial silencioso de los administradores.</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className={`font-bold text-sm flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                    Panel de Administración 
                  </h3>
                  <p className={`text-xs ${t.muted}`}>Bienvenido. Herramientas exclusivas habilitadas.</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {!isGroupAdmin && (
                  <button onClick={() => setShowChangePass(true)} className="flex items-center gap-2 bg-indigo-500/20 text-indigo-500 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-500/30 transition-all">
                    <KeyRound className="w-4 h-4" /> Cambiar Clave
                  </button>
                )}

                {isCreator && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"><Search className="h-4 w-4 text-purple-500" /></div>
                    <input 
                      type="text" 
                      placeholder="Buscador Global..." 
                      value={globalSearchTerm} 
                      onChange={(e) => setGlobalSearchTerm(e.target.value)}
                      className={`block w-full pl-8 pr-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-colors border ${darkMode ? 'bg-slate-900 border-purple-800/50 text-white' : 'bg-purple-50 border-purple-200 text-purple-900'} w-48`}
                    />
                    
                    {globalSearchTerm.trim().length > 0 && (
                      <div className={`absolute top-full mt-2 left-0 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-neutral-200'}`}>
                         <div className={`p-2 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-neutral-100 text-neutral-500'}`}>Resultados en toda la base</div>
                         <div className="max-h-64 overflow-y-auto">
                            {globalFilteredOrders.length === 0 ? (
                              <div className={`p-4 text-center text-xs ${t.muted}`}>No hay resultados.</div>
                            ) : (
                              globalFilteredOrders.map(o => (
                                <div key={`glob-${o.id}`} className={`p-3 border-b last:border-b-0 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-neutral-100 hover:bg-neutral-50'}`}>
                                   <div className={`font-bold text-sm flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-neutral-800'}`}>
                                      {o.name} 
                                      <span className="font-normal text-xs text-indigo-500">({o.group_name})</span>
                                      {isMasterOwner && extractDetails(o.observations).loc && (
                                         <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded-sm">📍 {extractDetails(o.observations).loc}</span>
                                      )}
                                   </div>
                                   <div className={`text-[10px] mt-0.5 ${t.muted}`}>📱 {o.phone || '-'} | 👕 {o.size} {o.gender}</div>
                                </div>
                              ))
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                )}

                {isCreator ? (
                  <>
                    <button 
                      onClick={() => { 
                        if (!showAuditLogs) { fetchAuditLogs(); setShowAuditLogs(true); setTimeout(() => { document.getElementById('audit-logs-section')?.scrollIntoView({ behavior: 'smooth' }) }, 150); } 
                        else { setShowAuditLogs(false); }
                      }} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${showAuditLogs ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30'}`}
                    >
                      <History className="w-4 h-4" /> Historial
                    </button>
                    
                    <button 
                      onClick={() => { 
                        if (!showGroupManager) setShowGroupManager(true);
                        setTimeout(() => { document.getElementById('directorio-grupos-section')?.scrollIntoView({ behavior: 'smooth' }) }, 150);
                      }} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      <Layers className="w-4 h-4" /> Todos los Grupos
                    </button>

                    <button onClick={() => { setIsAdmin(false); setIsGroupAdmin(false); setIsMasterOwner(false); setIsCreator(false); setShowGroupManager(false); }} className="flex items-center gap-2 bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-neutral-700 transition-all">
                      <Unlock className="w-4 h-4" /> Cerrar Modo Supremo
                    </button>
                  </>
                ) : (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-indigo-50 border-indigo-100'}`}>
                     <Layers className="w-4 h-4 text-indigo-500" />
                     <span className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>Filtro bloqueado: {displayGroup}</span>
                  </div>
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
                        <button onClick={() => setRenameModal({ isOpen: true, oldName: adminGroupFilter, newName: adminGroupFilter })} className="p-1.5 bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white rounded transition-colors" title="Renombrar este grupo"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => copyExistingGroupLink(adminGroupFilter)} className="p-1.5 bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded transition-colors flex items-center gap-1" title="Copiar enlace y ver QR"><Link2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* MODO SUPREMO: DASHBOARD Y CREADOR */}
            {showGroupManager && isCreator && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                
                {/* DASHBOARD FINANCIERO GLOBAL Y MÉTRICAS DE TRÁFICO (SOLO PARA DUEÑO MASTER) */}
                {isMasterOwner && (
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner text-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> Dashboard Financiero Global 
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div><p className="text-[10px] uppercase text-slate-500">Recaudación Total</p><p className="text-xl font-black text-emerald-400">{new Intl.NumberFormat('es-PY').format(globalStats.collected)} Gs.</p></div>
                          <div><p className="text-[10px] uppercase text-slate-500">Deuda Pendiente</p><p className="text-xl font-black text-amber-400">{new Intl.NumberFormat('es-PY').format(globalStats.debt)} Gs.</p></div>
                        </div>
                      </div>
                      <div className="w-px bg-slate-800 hidden md:block"></div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between text-sm mb-1 border-b border-slate-800 pb-1"><span className="text-slate-400">Total Esperado:</span><span className="font-bold">{new Intl.NumberFormat('es-PY').format(globalStats.expected)} Gs.</span></div>
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
                    <Eye className="w-4 h-4" /> Creador de Enlaces Inteligente
                  </h4>
                  
                  <form onSubmit={handleCreateGroup} className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Nombre del Grupo/Equipo</label>
                      <input type="text" value={newGroupConfig.name} onChange={(e) => setNewGroupConfig({...newGroupConfig, name: e.target.value})} placeholder="Ej. Intercolegial2026" className={`w-full px-3 py-2 border rounded-lg text-sm outline-none shadow-sm focus:ring-2 focus:ring-emerald-400 ${darkMode ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500' : 'bg-indigo-800 border-indigo-600 text-white placeholder-indigo-400'}`} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-indigo-300 mb-1">Estilo de Uniforme Base</label>
                      <select value={newGroupConfig.estilo} onChange={(e) => setNewGroupConfig({...newGroupConfig, estilo: e.target.value})} className={`w-full px-3 py-2 border rounded-lg text-sm outline-none shadow-sm cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-indigo-800 border-indigo-600 text-white'}`}>
                        <option value="Deportiva">🏃‍♂️ Indumentaria Deportiva</option>
                        <option value="Piqué">👔 Uniformes Piqué</option>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            
            {isGroupLocked && !isAdmin ? (
               <div className={`p-8 rounded-2xl border text-center shadow-sm ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                     <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-red-400' : 'text-red-900'}`}>Lista Cerrada</h3>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>El administrador ha cerrado la recepción de pedidos para el grupo <strong>{displayGroup}</strong>. Contacta con tu encargado para más información.</p>
               </div>
            ) : (
              <div className={`p-6 rounded-2xl shadow-sm border transition-all ${t.card} ${editingId ? (darkMode ? 'border-amber-500 ring-2 ring-amber-900' : 'border-amber-400 ring-4 ring-amber-50') : isPreviewMode ? (darkMode ? 'border-emerald-500 ring-2 ring-emerald-900' : 'border-emerald-400 ring-2 ring-emerald-50') : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {editingId ? <><Edit className="w-5 h-5 text-amber-500" /> Editar Pedido</> : <><PlusCircle className={`w-5 h-5 ${isPreviewMode ? 'text-emerald-500' : 'text-indigo-500'}`} /> Nuevo Pedido</>}
                  </h2>
                  {isAdmin && (
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-neutral-100 text-neutral-500'}`}>
                      {isGroupLocked ? 'Lista Bloqueada' : 'Abierto'}
                    </span>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* SELECTOR PARA MOVER DE GRUPO (SÓLO PARA CREADORES AL EDITAR) */}
                  {editingId && isCreator && (
                    <div className={`p-3 rounded-lg border mb-4 shadow-inner ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
                       <label className={`flex items-center gap-1 text-xs font-bold mb-1 uppercase tracking-wide ${darkMode ? 'text-amber-500' : 'text-amber-700'}`}>
                         Mover a otro Grupo
                       </label>
                       <select name="group_name" value={formData.group_name} onChange={handleChange} className={`block w-full px-3 py-1.5 rounded-md text-sm font-bold outline-none focus:ring-2 ${t.input}`}>
                         {allGroupNames.map(g => (
                           <option key={g} value={g}>{g}</option>
                         ))}
                       </select>
                    </div>
                  )}

                  <div>
                    <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                      👤 Nombre del Cliente
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className={`h-4 w-4 ${t.muted}`} /></div>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Lucas López" className={`block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 sm:text-sm transition-colors ${t.input}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                      📱 Teléfono (Obligatorio)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className={`h-4 w-4 ${t.muted}`} /></div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Ej. 0984948834" className={`block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 sm:text-sm transition-colors ${t.input}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                        👶 Rango de Edad
                      </label>
                      <select name="edad" value={formData.edad} onChange={handleChange} className={`block w-full px-3 py-2 rounded-lg sm:text-sm cursor-pointer font-bold outline-none focus:ring-2 ${t.input} ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                        <option value="Adultos">Adultos</option>
                        <option value="Infantil">Infantil</option>
                      </select>
                    </div>
                    {formData.edad === 'Infantil' && (
                       <div>
                         <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                           Años aprox.
                         </label>
                         <select name="ageRange" value={formData.ageRange} onChange={handleChange} className={`block w-full px-3 py-2 rounded-lg sm:text-sm cursor-pointer outline-none focus:ring-2 ${t.input}`}>
                           {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
                         </select>
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                        📏 Talle (Letra)
                      </label>
                      <select name="size" value={formData.size} onChange={handleChange} className={`block w-full px-3 py-2 rounded-lg sm:text-sm cursor-pointer font-bold outline-none focus:ring-2 ${t.input}`}>
                        {SIZES_UNIVERSAL.map(s => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                        🏃‍♂️ Tipo de Corte
                      </label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`block w-full px-3 py-2 rounded-lg sm:text-sm cursor-pointer outline-none focus:ring-2 ${t.input}`}>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  {/* BLOQUE DE CONFIGURACIÓN DEL CLIENTE (Solo visible si es Deportiva) */}
                  {isContextDeportiva && (
                    <div className={`p-4 rounded-xl border space-y-4 ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-neutral-50 border-neutral-200'}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${t.muted}`}>
                        ⚽ Opciones del Conjunto
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className={`flex items-center gap-1 text-[10px] font-medium mb-1 ${t.label}`}>
                            Calidad de Tela
                          </label>
                          <select name="tela" value={formData.tela} onChange={handleChange} className={`block w-full px-3 py-2 rounded-lg sm:text-sm cursor-pointer outline-none focus:ring-2 ${t.input}`}>
                            <option value="Estandard">Estandard</option>
                            <option value="Semi-Premium">Semi-Premium</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </div>
                        <div>
                          <label className={`flex items-center gap-1 text-[10px] font-medium mb-1 ${t.label}`}>
                            🎽 Combinación de Prendas
                          </label>
                          <select name="combo" value={formData.combo} onChange={handleChange} className={`block w-full px-3 py-2 rounded-lg sm:text-sm cursor-pointer font-bold outline-none focus:ring-2 ${t.input} ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                            <option value="Solo Remera">Solo Remera</option>
                            <option value="Remera + Short">Remera + Short</option>
                            <option value="Equipo Completo">Equipo Completo (Remera+Short+Medias)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-gray-400/30">
                        <div>
                          <label className={`flex items-center gap-1 text-[10px] font-medium mb-1 ${t.label}`}>
                            Nombre (Espalda)
                          </label>
                          <input type="text" name="playerName" value={formData.playerName} onChange={handleChange} placeholder="Ej. LUKASY" className={`block w-full px-3 py-2 rounded-lg sm:text-sm uppercase outline-none focus:ring-2 ${t.input}`} />
                        </div>
                        <div>
                          <label className={`flex items-center gap-1 text-[10px] font-medium mb-1 ${t.label}`}>
                            🔢 Número (Dorsal)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className={`h-3 w-3 ${t.muted}`} /></div>
                            <input type="number" name="playerNumber" value={formData.playerNumber} onChange={handleChange} placeholder="10" className={`block w-full pl-8 pr-3 py-2 rounded-lg sm:text-sm font-bold outline-none focus:ring-2 ${t.input}`} />
                          </div>
                        </div>
                      </div>

                      {formData.combo.includes('Short') && !formData.combo.includes('Solo Remera') && (
                        <div className={`flex flex-col gap-2 rounded-lg ${t.box} p-3`}>
                          <div className="flex items-center justify-between">
                            <label className={`flex items-center gap-1 text-sm font-medium ${t.label}`}>
                              Talle del Short:
                            </label>
                            <select name="shortSize" value={formData.shortSize} onChange={handleChange} className={`px-3 py-1.5 rounded-lg text-sm font-bold outline-none border ${t.input}`}>
                               {SIZES_UNIVERSAL.map(s => (<option key={s} value={s}>{s}</option>))}
                            </select>
                          </div>
                          
                          {formData.gender === 'Femenino' && (
                            <div className={`flex items-center justify-between mt-2 border-t pt-3 ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
                              <span className={`flex items-center gap-1 text-[11px] font-medium ${t.muted}`}>
                                Diseño del Short Femenino:
                              </span>
                              <select name="femaleShortType" value={formData.femaleShortType} onChange={handleChange} className={`px-2 py-1 border rounded text-xs font-bold outline-none ${darkMode ? 'bg-pink-900/30 border-pink-800 text-pink-300' : 'bg-pink-50 border-pink-200 text-pink-900'}`}>
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
                      <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${t.label}`}>
                        📦 Cantidad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Hash className={`h-4 w-4 ${t.muted}`} /></div>
                        <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required className={`block w-full pl-10 pr-3 py-2 rounded-lg sm:text-sm font-bold outline-none focus:ring-2 ${t.input}`} />
                      </div>
                    </div>
                    {allowLongSleeve && (
                      <div className={`flex items-center gap-2 p-2 rounded-lg h-[38px] ${t.indigoBg}`}>
                        <input type="checkbox" id="longSleeve" name="longSleeve" checked={formData.longSleeve} onChange={handleChange} className="w-4 h-4 text-indigo-500 rounded cursor-pointer" />
                        <label htmlFor="longSleeve" className={`text-[11px] font-medium cursor-pointer flex-1 leading-tight flex items-center gap-1 ${t.indigoText}`}>
                          Manga Larga (+{new Intl.NumberFormat('es-PY').format(costoMangaLarga)})
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`flex items-center gap-1 text-sm font-medium mb-1 text-xs ${t.label}`}>
                      📝 Observaciones Adicionales
                    </label>
                    <textarea name="observations" value={formData.observations} onChange={handleChange} rows="2" placeholder="Opcional..." className={`block w-full px-3 py-2 rounded-lg text-sm resize-none outline-none focus:ring-2 ${t.input}`} />
                  </div>

                  {/* BASE DEL CATÁLOGO */}
                  <button type="button" onClick={() => setShowCatalogModal(true)} className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all border ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-indigo-300 border-slate-600' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
                    <Shirt className="w-5 h-5" /> Ver Catálogo de Diseños
                  </button>

                  <div className={`p-4 rounded-xl flex justify-between items-center mt-2 shadow-inner ${t.indigoBg}`}>
                    <span className={`text-sm font-semibold ${t.indigoText}`}>Total Calculado:</span>
                    <span className={`text-xl font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{new Intl.NumberFormat('es-PY').format(currentOrderTotal)} Gs.</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {editingId && (<button type="button" onClick={cancelEdit} className={`w-1/3 flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium transition-colors ${t.box} ${t.label}`}>Cancelar</button>)}
                    <button type="submit" className={`${editingId ? 'w-2/3 bg-amber-500 hover:bg-amber-600 text-white' : isPreviewMode ? 'w-full bg-emerald-500 hover:bg-emerald-600 text-white' : 'w-full bg-indigo-600 hover:bg-indigo-700 text-white'} flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold transition-all transform hover:-translate-y-0.5 border-none`}>
                      {editingId ? 'Guardar Cambios' : isPreviewMode ? 'Probar Pedido' : 'Agregar Pedido'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Resumen Compacto Financiero (VISITANTES) */}
            <div className={`p-5 rounded-2xl shadow-sm ${t.indigoBg}`}>
              <h3 className={`text-sm font-bold flex items-center gap-1 mb-3 ${t.indigoText}`}>
                <Layers className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} /> Resumen Financiero {displayGroup}
              </h3>
              
              <div className={`pt-2 flex flex-col sm:flex-row justify-between gap-4`}>
                 <div><p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Esperado de este Grupo</p><p className={`text-lg font-black ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs.</p></div>
                 <div><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Recaudado (Señas+Pagos)</p><p className={`text-lg font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{new Intl.NumberFormat('es-PY').format(totalCollected)} Gs.</p></div>
                 <div><p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Falta Cobrar</p><p className={`text-lg font-black ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{new Intl.NumberFormat('es-PY').format(totalRevenue - totalCollected)} Gs.</p></div>
              </div>
            </div>
          </div>

          {/* Columna Listado y Resumen */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* BARRA DE PROGRESO DE PAGOS */}
            <div className={`p-5 rounded-2xl shadow-sm flex flex-col justify-center ${t.card}`}>
               <div className="flex justify-between items-end mb-2">
                 <h3 className={`text-sm font-bold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                   <Target className="w-5 h-5 text-emerald-500" /> Progreso de Recaudación
                 </h3>
                 <span className="text-xs font-black text-emerald-500 bg-emerald-500/20 px-2 py-0.5 rounded-md">{progressPercent}%</span>
               </div>
               
               <div className={`w-full rounded-full h-3.5 mb-2 overflow-hidden border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-neutral-100 border-neutral-200'}`}>
                 <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3.5 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2" style={{ width: `${progressPercent}%` }}>
                 </div>
               </div>
               
               <p className={`text-xs text-center font-medium ${t.muted}`}>
                 {progressPercent === 0 && "¡Sé el primero en aportar a la meta del equipo!"}
                 {progressPercent > 0 && progressPercent < 100 && `¡El equipo se está armando! Llevamos recaudados ${new Intl.NumberFormat('es-PY').format(totalCollected)} Gs de ${new Intl.NumberFormat('es-PY').format(totalRevenue)} Gs.`}
                 {progressPercent === 100 && totalRevenue > 0 && "¡Meta financiera 100% alcanzada! El pedido está listo para producción."}
               </p>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm ${t.card}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                 
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                   <div className="flex items-center gap-1">
                     <h2 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                       <Search className="w-5 h-5 text-indigo-500" /> Pedidos Recientes
                     </h2>
                     <button 
                       onClick={fetchOrdersAndSettings} 
                       disabled={loading}
                       className={`p-1.5 rounded-lg transition-colors ml-1 ${darkMode ? 'bg-slate-700 text-indigo-400 hover:bg-slate-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                       title="Actualizar lista de pedidos"
                     >
                       <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                     </button>
                   </div>
                   <input 
                     type="text" 
                     placeholder="Buscar por nombre..." 
                     value={searchTerm} 
                     onChange={(e) => setSearchTerm(e.target.value)} 
                     className={`flex-1 w-full sm:w-48 px-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${t.input}`} 
                   />
                 </div>
                 
                 {isAdmin && (
                   <button onClick={toggleGroupLock} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all border ${isGroupLocked ? (darkMode ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-700 border-emerald-200') : (darkMode ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-50 text-red-600 border-red-200')}`}>
                     {isGroupLocked ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                     {isGroupLocked ? 'Reabrir Lista' : 'Cerrar Lista a Usuarios'}
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
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Fecha y Hora</th>
                    {isAdmin && <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Acción</th>}
                  </tr>
                </thead>
                <tbody className={`divide-y ${t.divide} ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  {activeOrders.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((order) => {
                    const { details, rest, loc } = extractDetails(order.observations);
                    const fins = getOrderFinancials(order);
                    
                    return (
                      <tr key={order.id} className={`${t.rowHover} transition-colors`}>
                        {isGroupAdmin && adminGroupFilter === 'Todos' && <td className="px-4 py-3 font-bold text-indigo-500">{order.group_name}</td>}
                        <td className={`px-4 py-3 font-medium ${darkMode ? 'text-slate-200' : 'text-neutral-900'}`}>
                          {order.name}
                          {isMasterOwner && loc && (
                            <span className="ml-2 text-[8px] bg-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded" title="Ubicación aproximada (IP)">📍 {loc}</span>
                          )}
                          {(isAdmin || isGroupAdmin) && order.phone && order.phone !== '-' && (
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] flex items-center gap-1 ${t.muted}`}><Phone className="w-2.5 h-2.5"/> {order.phone}</span>
                              <a href={getWhatsAppLink(order)} target="_blank" rel="noopener noreferrer" className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer border ${darkMode ? 'bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/50' : 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] border-[#25D366]/30'}`}>
                                <MessageCircle className="w-3 h-3" /> Escribir
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className={`font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                            {order.size} <span className={t.muted}>{order.gender[0]}. {order.longSleeve && '(ML)'} x{order.quantity}</span>
                          </div>
                          {details && (
                             <div className={`mt-1.5 p-2 rounded border text-[11px] font-mono leading-tight shadow-inner ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-neutral-100 border-neutral-200 text-neutral-600'} whitespace-pre-wrap break-words`}>
                               {details}
                             </div>
                          )}
                          {rest && <div className={`text-[10px] mt-1 italic ${t.muted}`}>📝 {rest}</div>}
                        </td>
                        <td className="px-4 py-3">
                          {isAdmin ? (
                            <button onClick={() => handleOpenPayment(order)} className={`text-left w-full p-1.5 rounded transition-colors group relative ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-neutral-100'}`}>
                              <div className={`text-[10px] font-black uppercase ${fins.balance === 0 ? 'text-green-500' : fins.paid > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                                 {fins.balance === 0 ? 'PAGADO' : fins.paid > 0 ? 'SEÑADO' : 'PENDIENTE'}
                              </div>
                              <div className={`text-[9px] font-medium ${t.muted}`}>
                                 {new Intl.NumberFormat('es-PY').format(fins.paid)} / {new Intl.NumberFormat('es-PY').format(fins.total)} Gs.
                              </div>
                            </button>
                          ) : (
                            <div className="p-1">
                              <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${fins.balance === 0 ? 'bg-green-500/20 text-green-500' : fins.paid > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
                                {fins.balance === 0 ? 'Pagado' : fins.paid > 0 ? 'Señado' : 'Pendiente'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap text-xs ${t.muted}`}>
                          {formatDate(order.created_at)}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                                  <button onClick={() => handleEditClick(order)} className={`p-1.5 rounded transition-colors ${darkMode ? 'text-amber-400 hover:bg-slate-700' : 'text-amber-500 hover:bg-amber-50'}`}><Edit className="w-3 h-3" /></button>
                                  <button onClick={() => handleDelete(order)} className={`p-1.5 rounded transition-colors ${darkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-500 hover:bg-red-50'}`}><Trash2 className="w-3 h-3" /></button>
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
                    <h2 className={`text-xl font-semibold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                      <ClipboardList className="w-5 h-5 text-emerald-500" /> Resumen de Pedidos (Taller)
                    </h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                      <button onClick={handleExportHojaCorte} className="flex-1 sm:flex-none text-xs bg-slate-800 text-white border border-slate-900 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-900">
                        <Scissors className="w-3 h-3" /> Hoja de Corte
                      </button>
                      <button onClick={handleExportCSV} className="flex-1 sm:flex-none text-xs bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-500/30">
                        <Download className="w-3 h-3" /> Excel
                      </button>
                      <button onClick={handleExportPDF} className="flex-1 sm:flex-none text-xs bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-red-500/30">
                        <FileText className="w-3 h-3" /> PDF
                      </button>
                    </div>
                 </div>
                 
                 <h3 className={`text-xs font-bold uppercase mb-2 ${t.muted}`}>Cantidades de Remeras</h3>
                 <div className="overflow-x-auto mb-6">
                    <table className={`min-w-full divide-y text-xs ${t.divide}`}>
                      <thead className={t.tableHead}>
                        <tr>
                          <th className="px-6 py-3 text-left font-bold">Talle</th>
                          <th className="px-6 py-3 text-center font-bold">Fem.</th>
                          <th className="px-6 py-3 text-center font-bold">Masc.</th>
                          <th className="px-6 py-3 text-center font-bold">Uni.</th>
                          <th className="px-6 py-3 text-right font-bold">Total</th>
                        </tr>
                      </thead>
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
                         <td className="px-4 py-3 text-right font-black text-emerald-500">{new Intl.NumberFormat('es-PY').format(group.revenue)} Gs.</td>
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
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${t.muted}`}><Trash2 className="w-5 h-5" /> Papelera de Grupos ({archivedGroups.length})</h2>
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
                    {archivedGroups.map(g => {
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
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${t.muted}`}>
              <Trash2 className="w-5 h-5" /> Papelera de Pedidos ({deletedOrders.length})
              <HelperTooltip darkMode={darkMode} text="Los pedidos aquí se auto-eliminarán permanentemente a las 48 horas exactas de su borrado." />
            </h2>
            <div className="overflow-x-auto">
               <table className={`min-w-full text-xs ${t.muted}`}>
                  <tbody>
                    {deletedOrders.map(o => {
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
                             {isGroupAdmin && (
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

        <div className={`flex justify-center items-center gap-6 pt-4 mt-4 border-t ${t.border}`}>
          {!isAdmin ? (
            <button onClick={() => setShowAdminLogin(true)} className={`text-2xl hover:scale-110 transition-transform ${darkMode ? 'text-slate-500 hover:text-white' : 'text-neutral-300 hover:text-indigo-900'}`} title="Acceso Admin">
               🔒
            </button>
          ) : (
            <button onClick={() => { setIsAdmin(false); setIsGroupAdmin(false); setIsMasterOwner(false); setIsCreator(false); setShowGroupManager(false); }} className={`text-[10px] uppercase font-bold flex items-center gap-1 transition-colors ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}>
               <Unlock className="w-3 h-3" /> Salir Admin
            </button>
          )}

          {!isAdmin && (
             <button onClick={() => setShowGroupAuth(true)} className="text-2xl hover:scale-110 transition-transform" title="Acceso Creadores">
               👑
             </button>
          )}
        </div>

        {/* Footer de Créditos de Desarrollador */}
        <div className={`text-center py-6 border-t flex flex-col items-center gap-3 ${darkMode ? 'border-slate-800 text-slate-500' : 'border-neutral-200 text-neutral-400'}`}>
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-widest">
            <span className="opacity-70">Desarrollo de Software por</span>
            <a href="https://www.instagram.com/lukasy.exe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
              Lukasy.exe
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <a href="https://wa.me/595984948834?text=Hola%20Lukasy,%20me%20interesa%20tu%20trabajo%20de%20desarrollo%20web!" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors">
              <Phone className="w-3.5 h-3.5" /> Contacto
            </a>
            <a href="https://www.instagram.com/lukasy.exe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
               Instagram
            </a>
          </div>
        </div>

        {/* Notificación de éxito Ampliada */}
        {showSuccess && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in z-50">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">{successMessage}</span>
              <span className="text-[11px] text-emerald-100 font-medium">
                {successMessage.includes('Registrado') ? 'Revisa que tu pedido aparezca en la lista de abajo.' : 'Los cambios han sido guardados.'}
              </span>
            </div>
          </div>
        )}

        {/* Modal de Catálogo (Placeholder UI) */}
        {showCatalogModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4 backdrop-blur-sm">
             <div className={`rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className={`font-black text-xl flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                     <Shirt className="w-6 h-6 text-indigo-500" /> Catálogo de Diseños
                   </h3>
                   <button onClick={() => setShowCatalogModal(false)} className={`p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-neutral-100 text-neutral-500'}`}><X className="w-6 h-6" /></button>
                </div>
                
                <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                  Explora las opciones de diseños disponibles para tu grupo. Selecciona el que más te guste y menciónalo en las observaciones de tu pedido.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                   {[1, 2, 3].map((item) => (
                     <div key={item} className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-colors cursor-pointer ${darkMode ? 'border-slate-700 hover:border-indigo-500 text-slate-500' : 'border-neutral-200 hover:border-indigo-400 text-neutral-400'}`}>
                       <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                       <span className="text-sm font-bold">Diseño Opción #{item}</span>
                       <span className="text-[10px] uppercase tracking-wider mt-1">Próximamente</span>
                     </div>
                   ))}
                </div>

                <button onClick={() => setShowCatalogModal(false)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all border-none">
                  Volver al Formulario
                </button>
             </div>
          </div>
        )}

        {/* Modal Pago (Gestor Señas) */}
        {paymentModal.isOpen && paymentModal.order && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
             <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><DollarSign className="w-5 h-5 bg-emerald-500/20 text-emerald-500 rounded-full p-0.5" /> Registrar Pago</h3>
                   <button onClick={() => setPaymentModal({isOpen: false, order: null, amount: 0})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
                </div>
                <div className={`p-3 rounded-lg mb-4 text-sm text-center ${darkMode ? 'bg-slate-700' : 'bg-neutral-50'}`}>
                   <p className={`mb-1 ${t.muted}`}>Total del pedido de {paymentModal.order.name}</p>
                   <p className={`text-xl font-black ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{new Intl.NumberFormat('es-PY').format(getUnitPrice(paymentModal.order) * paymentModal.order.quantity)} Gs.</p>
                </div>
                <label className={`block text-xs font-bold mb-1 ${t.muted}`}>Monto entregado hasta ahora (Gs):</label>
                <input 
                  type="number" value={paymentModal.amount} onChange={(e) => setPaymentModal({...paymentModal, amount: e.target.value})} 
                  className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg text-center mb-4 ${t.input}`} 
                />
                
                <div className="space-y-2">
                  <button onClick={savePayment} className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-md border-none">
                    Guardar Pago en el Sistema
                  </button>
                  
                  {paymentModal.isSaved && (
                    <a href={getReceiptLink(paymentModal.order)} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-all shadow-md flex items-center justify-center gap-2">
                      <Receipt className="w-4 h-4" /> Enviar Recibo por WhatsApp
                    </a>
                  )}
                </div>
             </div>
          </div>
        )}

        {/* Modal de Login Admin NORMAL (Sin Delegado) */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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

              <div className={`border-t pt-3 ${darkMode ? 'border-slate-700' : 'border-neutral-200'}`}>
                <button 
                  onClick={() => { setShowAdminLogin(false); setShowChangePass(true); }} 
                  className="w-full text-xs text-indigo-500 font-bold hover:text-indigo-400 transition-colors flex items-center justify-center gap-1"
                >
                  <KeyRound className="w-3 h-3" /> Cambiar Clave de Administrador
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cambio de Clave Admin */}
        {showChangePass && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><KeyRound className="w-5 h-5 text-indigo-500" /> Cambiar Contraseña</h3>
                <button onClick={() => {setShowChangePass(false); setPassChangeError('');}} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <p className={`text-xs mb-4 ${t.muted}`}>Para cambiar la clave de acceso debes ingresar la Clave Maestra de autorización.</p>
              
              <div className="space-y-3 mb-4">
                <input type="password" value={masterPassInput} onChange={(e) => setMasterPassInput(e.target.value)} placeholder="Clave Maestra de Autorización" className={`w-full px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${t.input}`} />
                <input type="text" value={newAdminPassInput} onChange={(e) => setNewAdminPassInput(e.target.value)} placeholder="Nueva Contraseña" className={`w-full px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold ${t.input} ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`} />
              </div>

              {passChangeError && <p className="text-xs text-red-500 mb-3 font-bold">{passChangeError}</p>}
              <button onClick={handleChangePasswordSubmit} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all border-none">Guardar Nueva Contraseña</button>
            </div>
          </div>
        )}

        {/* Modal de Acceso Modo Supremo */}
        {showGroupAuth && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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

        {/* Modal para Renombrar Grupo */}
        {renameModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><Edit className="w-5 h-5 text-amber-500" /> Renombrar Grupo</h3>
                <button onClick={() => setRenameModal({isOpen: false, oldName: '', newName: ''})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <p className={`text-xs mb-4 ${t.muted}`}>Se actualizarán automáticamente todos los pedidos, historiales y estados de bloqueo al nuevo nombre.</p>
              
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

        {/* Modal Código QR */}
        {qrModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in text-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}><QrCode className="w-5 h-5 text-indigo-500" /> Compartir Grupo</h3>
                <button onClick={() => setQrModal({isOpen: false, link: '', groupName: ''})} className={`${t.muted} hover:text-slate-200`}><X className="w-5 h-5" /></button>
              </div>
              <p className={`text-sm mb-4 ${t.muted}`}>Comparte este código con tu equipo para que ingresen directo al grupo <strong>{qrModal.groupName}</strong>.</p>
              
              <div className={`p-4 rounded-xl flex justify-center mb-4 border ${darkMode ? 'bg-slate-200 border-slate-400' : 'bg-neutral-100 border-neutral-200'}`}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrModal.link)}&margin=10`} alt="QR Code" className="rounded-lg shadow-sm" />
              </div>
              
              <div className="flex gap-2 mb-4">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Haz tu pedido de indumentaria para el grupo *${qrModal.groupName}* aquí:\n\n${qrModal.link}`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] text-white font-bold py-2 px-3 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Enviar
                </a>
                <button 
                  onClick={() => {
                    const textArea = document.createElement("textarea"); textArea.value = qrModal.link; document.body.appendChild(textArea); textArea.select();
                    try { document.execCommand('copy'); alert("¡Enlace copiado al portapapeles!"); } catch (err) {} document.body.removeChild(textArea);
                  }}
                  className={`flex-1 font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm border-none ${darkMode ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                >
                  <Link2 className="w-4 h-4" /> Copiar
                </button>
              </div>
              
              <button onClick={() => setQrModal({isOpen: false, link: '', groupName: ''})} className={`w-full font-bold py-2 rounded-xl transition-all text-sm border-none ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-neutral-800 text-white hover:bg-neutral-900'}`}>Cerrar Ventana</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}