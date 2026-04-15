export const ROLE_VISITANTE = "visitante";
export const ROLE_ADMIN_NORMAL = "admin_normal";
export const ROLE_ADMIN_SUPREMO = "admin_supremo";
export const ROLE_ADMIN_OCULTO = "admin_oculto";

export function getRoleFlags({ isAdmin = false, isMasterOwner = false, isCreator = false } = {}) {
  const isHiddenAdmin = Boolean(isCreator && isMasterOwner); // lukasy67
  const isSupremeAdmin = Boolean(isMasterOwner && !isCreator); // marseo / equipo supremo

  let role = ROLE_VISITANTE;
  if (isHiddenAdmin) role = ROLE_ADMIN_OCULTO;
  else if (isSupremeAdmin) role = ROLE_ADMIN_SUPREMO;
  else if (isAdmin) role = ROLE_ADMIN_NORMAL;

  return {
    role,
    isVisitante: role === ROLE_VISITANTE,
    isAdminNormal: role === ROLE_ADMIN_NORMAL,
    isAdminSupremo: role === ROLE_ADMIN_SUPREMO,
    isAdminOculto: role === ROLE_ADMIN_OCULTO,
    canManageOrders: role !== ROLE_VISITANTE,
    canManagePayments: role !== ROLE_VISITANTE,
    canDeleteSoft: role !== ROLE_VISITANTE,
    canDeletePermanent: role === ROLE_ADMIN_SUPREMO || role === ROLE_ADMIN_OCULTO,
    canChangePassword: role === ROLE_ADMIN_SUPREMO || role === ROLE_ADMIN_OCULTO,
    canEditManualPrice: role === ROLE_ADMIN_SUPREMO || role === ROLE_ADMIN_OCULTO,
    canEditGlobalPricing: role === ROLE_ADMIN_OCULTO, // solo lukasy67
    canManageSponsors: role === ROLE_ADMIN_OCULTO, // solo lukasy67
    roleLabel:
      role === ROLE_ADMIN_OCULTO
        ? "Admin Oculto"
        : role === ROLE_ADMIN_SUPREMO
        ? "Admin Supremo"
        : role === ROLE_ADMIN_NORMAL
        ? "Admin Normal"
        : "Visitante",
  };
}

export function canManageSensitiveActions(flags = {}) {
  return Boolean(flags.canEditManualPrice || flags.canDeletePermanent || flags.canChangePassword);
}
