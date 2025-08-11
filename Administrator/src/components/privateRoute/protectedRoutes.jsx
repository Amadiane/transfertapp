import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => { //roleRequired si c'est seulement l'admin qui doit modifier et on écrit  allowedRoles si on veut donner la main à d'autres utilsateur "employee ou autes"
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    // Pas connecté du tout => redirection vers login
    return <Navigate to="/login" replace />;
  }

  // if (roleRequired && userRole !== roleRequired) {
  //   // Connecté mais pas le bon rôle => redirection ou page non autorisée
  //   return <Navigate to="/login" replace />;
  // }
   if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Connecté mais pas dans les rôles autorisés => redirection
    return <Navigate to="/login" replace />;
  }

  // Tout ok, afficher les routes enfants protégées
  return <Outlet />;
};

export default ProtectedRoutes;
