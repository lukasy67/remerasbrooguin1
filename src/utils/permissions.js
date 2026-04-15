export const canManageSensitiveActions = ({ isCreator, isMasterOwner }) => Boolean(isCreator || isMasterOwner);
