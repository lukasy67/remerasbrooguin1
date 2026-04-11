import React, { useState, useMemo, useEffect } from 'react';
import { Shirt, PlusCircle, ClipboardList, Trash2, User, Hash, Phone, Loader2, Layers, Lock, Unlock, X, Eye, EyeOff, Download, FileText, Info, AlertCircle, Search, CheckCircle2, Edit, Filter, Link2, Plus, ShieldAlert, Settings, MessageCircle, DollarSign, TrendingUp, Scissors, History, KeyRound, RefreshCw, BarChart3, ExternalLink, Receipt, Target, QrCode, MapPin, Moon, Sun, ArrowRight, ArrowLeft, ImagePlus, Smartphone } from 'lucide-react';

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

// GALERÍA DE CATÁLOGO (Imágenes Directas)
const CATALOG_ITEMS = [
  { name: 'Calidad Premium', desc: 'Máxima durabilidad y detalles.', img: 'https://i.imgur.com/8Gs1xK9.png' },
  { name: 'Calidad Premium (Alternativa)', desc: 'Diseños de alta gama.', img: 'https://i.imgur.com/dYyyKTQ.png' },
  { name: 'Calidad Semi-Premium', desc: 'Excelente relación precio/calidad.', img: 'https://i.imgur.com/0H3lWcd.png' },
  { name: 'Calidad Estandard', desc: 'Para el juego de cada semana.', img: 'https://i.imgur.com/U5MHAMW.png' },
  { name: 'Diseño Camisilla', desc: 'Libertad de movimiento.', img: 'https://i.imgur.com/ZA9DGL5.png' },
  { name: 'Corte Femenino', desc: 'Entalle especial y short adaptado.', img: 'https://i.imgur.com/9pPEhCN.png' },
  { name: 'Uniformes Piqué', desc: 'Para intercolegiales e institutos.', img: 'https://i.imgur.com/mvDtiHe.png' },
];

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
  { e: ['⚽', '🥅', '🏟️', '👟', '🥇'], a: 'anim-fall' }, { e: ['🏆', '🥇', '🏅', '🌟', '🙌'], a: 'anim-bounce' }, { e: ['🌸', '🌺', '💮', '🍃', '✨'], a: 'anim-float' }, { e: ['💋', '❤️', '💖', '😍', '🌹'], a: 'anim-float' }, { e: ['🔥', '💪', '💯', '💥', '⚡'], a: 'anim-zoom' }, { e: ['🎉', '🎊', '🎈', '✨', '🎁'], a: 'anim-fall' }
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

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [archivedGroupSearch, setArchivedGroupSearch] = useState('');
  const [deletedOrderSearch, setDeletedOrderSearch] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const [activeGroup, setActiveGroup] = useState(() => urlParams.get('grupo') || 'General');

  const changeAdminFilter = (newGroup) => {
    setAdminGroupFilter(newGroup);
    if (newGroup !== 'Todos') {
      setActiveGroup(newGroup);
      try {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('grupo', newGroup);
        window.history.pushState({}, '', newUrl);
      } catch(e) {}
    }
  };

  const urlEstilo = urlParams.get('estilo') || (urlParams.get('tipo') === 'Remera Piqué' ? 'Piqué' : 'Deportiva');

  const [newGroupConfig, setNewGroupConfig] = useState({ name: '', estilo: 'Deportiva' });

  const isPreviewMode = showGroupManager && isGroupAdmin;
  const contextualGroup = isGroupAdmin && adminGroupFilter !== 'Todos' ? adminGroupFilter : (isPreviewMode ? (newGroupConfig.name || 'Vista Previa') : activeGroup);
  const displayGroup = contextualGroup;

  const archivedNames = useMemo(() => archivedGroups.map(g => g.name), [archivedGroups]);

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

  const [formData, setFormData] = useState({
    name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '',
    playerName: '', playerNumber: '', isGoalkeeper: false, combo: 'Solo Remera', tela: 'Premium',
    shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: '' 
  });

  const isCamisilla = formData.combo?.includes('Camisilla') || false;
  const allowLongSleeve = !isCamisilla || formData.isGoalkeeper; 

  const activeSizes = SIZES_UNIVERSAL;

  useEffect(() => {
    if (!editingId) setFormData(prev => ({ ...prev, size: activeSizes[0], shortSize: activeSizes[0] }));
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

  const handleCatalogContact = () => {
    const msg = "Hola, vengo desde la pagina de brooguin, estoy interesado/a en realizar un pedido personalizado y me gustaron los diseños!";
    window.open(`https://wa.me/595984948834?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const fetchOrdersAndSettings = async () => {
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
  };

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
    if (!formData.name.trim() || formData.quantity < 1) return;
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
      setFormData({ name: '', phone: '', edad: 'Adultos', ageRange: AGE_RANGES[1], size: SIZES_UNIVERSAL[1], gender: 'Femenino', quantity: 1, longSleeve: false, observations: '', playerName: '', playerNumber: '', isGoalkeeper: false, combo: 'Solo Remera', tela: 'Premium', shortSize: SIZES_UNIVERSAL[1], femaleShortType: 'Standard', originalGroup: '', group_name: '' });
    } catch (error) { alert("Error de red."); }
  };

  const calculateFinancials = () => {
    let expected = 0; let collected = 0;
    activeOrders.forEach(o => {
      const fins = getOrderFinancials(o);
      expected += fins.total; collected += fins.paid;
    });
    return { expected, collected, balance: expected - collected, progress: expected === 0 ? 0 : Math.round((collected / expected) * 100) };
  };

  const getUnitPrice = (order) => {
    const match = order.observations?.match(/\[Precio:\s*(\d+)\]/);
    if (match) return parseInt(match[1], 10);
    return 85000 + (order.longSleeve ? (order.observations?.includes('[#') ? 15000 : 10000) : 0);
  };

  const getOrderFinancials = (order) => {
    const total = getUnitPrice(order) * order.quantity;
    const paid = order.amount_paid ?? (order.paymentStatus === 'Pagado' ? total : 0);
    return { total, paid, balance: total - paid };
  };

  const handleGroupAuth = () => {
    if (groupPin === 'marseo' || groupPin === 'lukasy67') { 
       setIsAdmin(true); setIsGroupAdmin(true); setIsCreator(true);
       setIsMasterOwner(groupPin === 'lukasy67');
       setShowGroupAuth(false); setShowGroupManager(true); setGroupPin('');
    } else setGroupPinError(true);
  };

  const handleAdminLogin = () => {
    if (adminPin === currentAdminPassword) { setIsAdmin(true); setAdminGroupFilter(displayGroup); setShowAdminLogin(false); }
    else setPinError(true);
  };

  const globalFilteredOrders = useMemo(() => {
    if (!globalSearchTerm.trim()) return [];
    return orders.filter(o => !o.deleted && !archivedNames.includes(o.group_name) && ((o.name && o.name.toLowerCase().includes(globalSearchTerm.toLowerCase())) || (o.phone && o.phone.includes(globalSearchTerm)))).slice(0, 10); 
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

  const filteredDeletedOrders = useMemo(() => {
    if (!deletedOrderSearch.trim()) return deletedOrders;
    return deletedOrders.filter(o => 
      o.name.toLowerCase().includes(deletedOrderSearch.toLowerCase()) || 
      (o.group_name && o.group_name.toLowerCase().includes(deletedOrderSearch.toLowerCase()))
    );
  }, [deletedOrders, deletedOrderSearch]);

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

  const totalSocks = useMemo(() => activeOrders.reduce((sum, o) => o.observations?.includes('Medias: SI') || o.observations?.includes('Combo: Equipo Completo') ? sum + o.quantity : sum, 0), [activeOrders]);
  const totalGarments = activeOrders.reduce((sum, order) => sum + order.quantity, 0);
  
  const fins = calculateFinancials();

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

  const filteredArchivedGroups = useMemo(() => {
    if (!archivedGroupSearch.trim()) return archivedGroups;
    return archivedGroups.filter(g => g.name.toLowerCase().includes(archivedGroupSearch.toLowerCase()));
  }, [archivedGroups, archivedGroupSearch]);

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
    csv += `\nTOTAL A RECAUDAR;;;; ${new Intl.NumberFormat('es-PY').format(fins.expected)} Gs\n\n`;
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
              <tr class="summary-total" style="background-color: #e0e7ff;"><td colspan="4" class="text-right font-bold">Recaudación Total Calculada:</td><td class="text-right font-bold">${new Intl.NumberFormat('es-PY').format(fins.expected)} Gs</td></tr>
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

  const renderPricingTable = (ageGroupTitle, dataObject) => (
    <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <div className="bg-slate-100 p-2 font-black text-center text-slate-700 uppercase tracking-wider text-xs border-b border-slate-200">
        Precios para {ageGroupTitle}
      </div>
      <table className="w-full text-xs text-left min-w-[400px]">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="p-3">Calidad Base</th>
            <th className="p-3">Solo Remera</th>
            <th className="p-3">Remera + Short</th>
            <th className="p-3 text-indigo-600">Equipo Completo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {['Premium', 'Semi-Premium', 'Estandard'].map(cal => (
            <tr key={cal} className="hover:bg-slate-50">
              <td className="p-3 font-bold text-slate-700 flex items-center gap-1">
                 {cal === 'Premium' && <span className="text-yellow-500">⭐</span>}
                 {cal}
              </td>
              <td className="p-3 text-slate-600 font-medium">{new Intl.NumberFormat('es-PY').format(dataObject[cal]['Solo Remera'])} Gs</td>
              <td className="p-3 text-slate-600 font-medium">{new Intl.NumberFormat('es-PY').format(dataObject[cal]['Remera + Short'])} Gs</td>
              <td className="p-3 text-indigo-600 font-black">{new Intl.NumberFormat('es-PY').format(dataObject[cal]['Equipo Completo'])} Gs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 transition-colors duration-500 relative pb-24 ${t.page}`}>
      
      {activeAnimationTheme !== null && <SuccessAnimation themeIndex={activeAnimationTheme} />}

      {/* Botones Flotantes (Oscuro y Ayuda) */}
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

      {/* Botón Flotante Deshacer Eliminación */}
      {undoDeleteId && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 z-[100] border border-slate-700">
          <span className="text-sm font-medium">Pedido a papelera.</span>
          <button onClick={handleUndoDelete} className="bg-slate-700 hover:bg-slate-600 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Deshacer</button>
        </div>
      )}

      {/* Botón Flotante de Asistencia (WhatsApp) */}
      <a href="https://wa.me/595984948834" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all transform hover:scale-110 z-50 flex items-center justify-center group border-2 border-white/20">
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[150px] transition-all duration-300 ease-in-out font-bold text-sm ml-0 group-hover:ml-2">Asistencia</span>
      </a>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="flex items-center gap-4 z-10">
            <a href="https://www.instagram.com/brooguin_santani" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-all text-2xl" title="Instagram Brooguin">🦊</a>
            <div className="flex items-center gap-3">
              <img src={URL_LOGO_BROOGUIN} alt="Logo" className="w-20 h-20 object-contain bg-white rounded-xl p-1.5 shadow-md" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">BROOGUIN SPORT</h1>
                <p className="text-indigo-200 text-sm mt-1 font-medium">{isContextDeportiva ? '🏃‍♂️ Indumentaria Deportiva' : '👔 Uniformes Piqué'}</p>
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
                <h3 className={`font-bold text-sm ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>Panel de Administración</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {isCreator && (
                   <div className="relative">
                      <input type="text" placeholder="Buscador Global..." value={globalSearchTerm} onChange={(e) => setGlobalSearchTerm(e.target.value)} className={`block pl-8 pr-3 py-1.5 rounded-lg text-sm border focus:ring-2 outline-none ${t.input} w-48`} />
                      <Search className="absolute left-2.5 top-2 w-4 h-4 text-purple-500" />
                      {globalSearchTerm.trim() && (
                        <div className={`absolute top-full mt-2 left-0 w-80 rounded-xl shadow-2xl border z-50 max-h-64 overflow-y-auto ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-neutral-200'}`}>
                          {globalFilteredOrders.length === 0 ? (
                             <div className="p-4 text-center text-xs opacity-50">No hay resultados.</div>
                          ) : (
                             globalFilteredOrders.map(o => (
                               <div key={o.id} onClick={() => { changeAdminFilter(o.group_name); setGlobalSearchTerm(''); }} className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-indigo-500/10">
                                  <div className="font-bold text-sm">{o.name} <span className="text-[10px] text-indigo-500">({o.group_name})</span></div>
                                  <div className="text-[10px] opacity-70">👕 {o.size} {o.gender}</div>
                               </div>
                             ))
                          )}
                        </div>
                      )}
                   </div>
                )}
                <button onClick={() => { setIsAdmin(false); setShowGroupManager(false); }} className="flex items-center gap-2 bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-neutral-700 transition-all">
                  <Unlock className="w-4 h-4" /> Salir
                </button>
              </div>
            </div>
            {showGroupManager && isCreator && (
               <div className={`p-5 rounded-xl text-white ${darkMode ? 'bg-slate-800' : 'bg-indigo-900'}`}>
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">👑 Creador de Enlaces</h4>
                  <form onSubmit={handleCreateGroup} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <input type="text" value={newGroupConfig.name} onChange={(e) => setNewGroupConfig({...newGroupConfig, name: e.target.value})} placeholder="Nombre Colegio..." className="p-2 rounded bg-white/10 text-white outline-none border border-white/20 focus:border-emerald-400" required />
                     <select value={newGroupConfig.estilo} onChange={(e) => setNewGroupConfig({...newGroupConfig, estilo: e.target.value})} className="p-2 rounded bg-white/10 text-white outline-none border border-white/20">
                        <option value="Deportiva">🏃‍♂️ Deportiva</option><option value="Piqué">👔 Piqué</option>
                     </select>
                     <button type="submit" className="bg-emerald-500 p-2 rounded font-black hover:bg-emerald-400">Generar Link</button>
                  </form>
               </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {!isGroupLocked || isAdmin ? (
              <div className={`p-6 rounded-2xl shadow-sm border ${t.card}`}>
                <h2 className="text-xl font-black flex items-center gap-2 mb-4">
                  {editingId ? <Edit className="w-5 h-5 text-amber-500" /> : <PlusCircle className="w-5 h-5 text-indigo-500" />}
                  {editingId ? 'Editar Pedido' : 'Nuevo Pedido'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`text-xs font-bold mb-1 block ${t.label}`}>👤 Nombre y Apellido</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Lucas López" className={`block w-full px-3 py-2 rounded-lg outline-none focus:ring-2 ${t.input}`} />
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
                      <select name="tela" value={formData.tela} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none font-bold ${t.input}`}>
                        <option value="Premium">⭐ Premium</option><option value="Semi-Premium">Semi-Premium</option><option value="Estandard">Estandard</option>
                      </select>
                      <select name="combo" value={formData.combo} onChange={handleChange} className={`w-full p-2 rounded-lg outline-none font-bold ${t.input}`}>
                        <option value="Solo Remera">Solo Remera</option><option value="Remera + Short">Remera + Short</option><option value="Equipo Completo">Equipo Completo</option>
                      </select>
                      {(formData.combo.includes('Short') || formData.combo === 'Equipo Completo') && (
                        <div className="p-3 bg-white/5 rounded-lg border border-slate-500/20">
                           <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Talle Short</label>
                           <select name="shortSize" value={formData.shortSize} onChange={handleChange} className={`w-full p-1.5 rounded outline-none ${t.input}`}>
                             {SIZES_UNIVERSAL.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                           {formData.gender === 'Femenino' && (
                             <select name="femaleShortType" value={formData.femaleShortType} onChange={handleChange} className={`w-full mt-2 p-1.5 rounded outline-none text-xs font-bold ${darkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-pink-900'}`}>
                               <option value="Standard">Short Normal</option><option value="Femenino">Short Femenino</option>
                             </select>
                           )}
                        </div>
                      )}
                    </div>
                  )}
                  <button type="button" onClick={() => setShowCatalogModal(true)} className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg">📸 Ver Catálogo y Precios</button>
                  <div className={`p-4 rounded-xl flex justify-between items-center shadow-inner ${t.indigoBg}`}>
                    <span className="text-sm font-semibold">Total a pagar:</span>
                    <span className="text-xl font-black">{new Intl.NumberFormat('es-PY').format(currentOrderTotal)} Gs.</span>
                  </div>
                  <button type="submit" className="w-full py-4 rounded-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 transform transition hover:-translate-y-1">
                    {editingId ? 'Guardar Cambios' : 'Confirmar Pedido'}
                  </button>
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
            <div className={`p-6 rounded-2xl shadow-sm border ${t.card}`}>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-black flex items-center gap-2">🔍 Pedidos Recientes</h2>
                 <input type="text" placeholder="Tu nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-48 px-3 py-1.5 rounded-lg text-sm border focus:ring-2 outline-none ${t.input}`} />
              </div>
              <div className="overflow-x-auto">
                 <table className={`min-w-full divide-y text-xs ${t.divide}`}>
                    <thead className={t.tableHead}>
                       <tr><th className="px-4 py-3 text-left">Cliente</th><th className="px-4 py-3 text-left">Prenda</th><th className="px-4 py-3 text-left">Pago</th><th className="px-4 py-3 text-right">Acción</th></tr>
                    </thead>
                    <tbody className="divide-y">
                       {activeOrders.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map(order => {
                         const { details, rest, loc } = extractDetails(order.observations);
                         const fins = getOrderFinancials(order);
                         return (
                           <tr key={order.id} className={`${t.rowHover} transition-colors`}>
                              <td className="px-4 py-3">
                                 <div className="font-bold">{order.name}</div>
                                 {isMasterOwner && loc && <div className="text-[8px] opacity-50">📍 {loc}</div>}
                              </td>
                              <td className="px-4 py-3">
                                 <div className="font-bold text-indigo-500">{order.size} {order.gender[0]} x{order.quantity}</div>
                                 <div className="text-[10px] opacity-70 italic">{details}</div>
                              </td>
                              <td className="px-4 py-3">
                                 <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${fins.balance === 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {fins.balance === 0 ? 'Pagado' : `Debe ${new Intl.NumberFormat('es-PY').format(fins.balance)}`}
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                 {isAdmin && (
                                   <div className="flex justify-end gap-1">
                                      <button onClick={() => handleEditClick(order)} className="p-1 hover:bg-amber-100 text-amber-500 rounded"><Edit className="w-3 h-3"/></button>
                                      <button onClick={() => handleDelete(order)} className="p-1 hover:bg-red-100 text-red-500 rounded"><Trash2 className="w-3 h-3"/></button>
                                   </div>
                                 )}
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL CATÁLOGO */}
        {showCatalogModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4 backdrop-blur-sm overflow-y-auto">
             <div className={`rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in my-auto ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                
                {/* Header del Catálogo */}
                <div className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 rounded-t-2xl ${darkMode ? 'bg-slate-900/90 border-slate-700 backdrop-blur-md' : 'bg-white/90 border-neutral-200 backdrop-blur-md'}`}>
                   <h3 className={`font-black text-xl flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                     <Shirt className="w-6 h-6 text-indigo-500" /> Catálogo y Aranceles
                   </h3>
                   <button onClick={() => setShowCatalogModal(false)} className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-neutral-100 text-neutral-500'}`}><X className="w-6 h-6" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[75vh]">
                  <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                    Explora nuestros estilos de fabricación. Haz clic en cualquier imagen para comunicarte directamente con nuestro equipo de diseño vía WhatsApp y empezar tu pedido.
                  </p>

                  {/* Galería Visual */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                     {CATALOG_ITEMS.map((item, idx) => (
                       <div 
                         key={idx} 
                         onClick={handleCatalogContact}
                         className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 ${darkMode ? 'border-slate-800 hover:border-indigo-500' : 'border-neutral-100 hover:border-indigo-400'}`}
                       >
                         <div className="h-48 overflow-hidden bg-slate-100">
                           <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         </div>
                         <div className={`absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100`}>
                            <div className="bg-[#25D366] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                              <MessageCircle className="w-4 h-4" /> Consultar Diseño
                            </div>
                         </div>
                         <div className={`p-3 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                           <h4 className={`font-bold text-sm ${darkMode ? 'text-slate-200' : 'text-neutral-800'}`}>{item.name}</h4>
                           <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-neutral-500'}`}>{item.desc}</p>
                         </div>
                       </div>
                     ))}
                  </div>

                  {/* Tabla de Aranceles Dinámica */}
                  <div className="mb-8">
                     <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-indigo-900'}`}>
                       <DollarSign className="w-5 h-5 text-emerald-500" /> Tabla de Aranceles Base
                     </h3>
                     {renderPricingTable('Adultos', PRECIOS_BASE.Adultos)}
                     {renderPricingTable('Infantil', PRECIOS_BASE.Infantil)}
                     <p className={`text-[10px] italic mt-2 text-right ${darkMode ? 'text-slate-500' : 'text-neutral-400'}`}>* La inclusión de Manga Larga tiene un costo adicional de 10.000 Gs (o 15.000 Gs en deportivas).</p>
                  </div>

                  {/* Botón de Acción Call to Action (CTA) */}
                  <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-dashed border-slate-300 dark:border-slate-700">
                    <button onClick={handleCatalogContact} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-lg py-4 px-8 rounded-2xl w-full sm:w-auto shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-3">
                      <Smartphone className="w-6 h-6 animate-bounce" /> 
                      ¡QUIERO PERSONALIZAR MI PEDIDO!
                    </button>
                    <button onClick={() => setShowCatalogModal(false)} className={`text-sm font-bold hover:underline ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-neutral-500 hover:text-neutral-700'}`}>
                      Volver al formulario de llenado
                    </button>
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

        {/* MODAL CÓDIGO QR */}
        {qrModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
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
                <a href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Haz tu pedido de indumentaria para el grupo *${qrModal.groupName}* aquí:\n\n${qrModal.link}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold py-2 px-3 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
                  <MessageCircle className="w-4 h-4" /> Enviar
                </a>
                <button onClick={() => { const textArea = document.createElement("textarea"); textArea.value = qrModal.link; document.body.appendChild(textArea); textArea.select(); try { document.execCommand('copy'); alert("¡Enlace copiado al portapapeles!"); } catch (err) {} document.body.removeChild(textArea); }} className={`flex-1 font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm border-none ${darkMode ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
                  <Link2 className="w-4 h-4" /> Copiar
                </button>
              </div>
              <button onClick={() => setQrModal({isOpen: false, link: '', groupName: ''})} className={`w-full font-bold py-2 rounded-xl transition-all text-sm border-none ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-neutral-800 text-white hover:bg-neutral-900'}`}>Cerrar Ventana</button>
            </div>
          </div>
        )}

        {/* MODAL RENOMBRAR */}
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

        {/* Modal de Login Admin NORMAL */}
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
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
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

        {/* Footer de Créditos de Desarrollador */}
        <div className={`text-center py-8 border-t mt-12 flex flex-col items-center gap-4 ${darkMode ? 'border-slate-800 text-slate-500' : 'border-neutral-200 text-neutral-400'}`}>
          <div className="flex justify-center items-center gap-8 mb-2">
             {/* Botones secretos Admin */}
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