import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ roleRequired }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    // Pas connecté du tout => redirection vers login
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // Connecté mais pas le bon rôle => redirection ou page non autorisée
    return <Navigate to="/login" replace />;
  }

  // Tout ok, afficher les routes enfants protégées
  return <Outlet />;
};

export default ProtectedRoutes;
