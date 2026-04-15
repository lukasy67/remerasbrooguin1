export const canEditPrice = (user) =>
  user?.role === "supremo" || user?.role === "creador";

export const canDeletePermanent = (user) =>
  user?.role === "supremo" || user?.role === "creador";

export const canChangePassword = (user) =>
  user?.role === "supremo" || user?.role === "creador";