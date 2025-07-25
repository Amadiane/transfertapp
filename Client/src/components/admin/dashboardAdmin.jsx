// src/pages/DashboardAdmin.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/enregistrerEmploye');
  };

  const goToLogout = () => {
    // Aller sur la page Logout qui fera la vraie déconnexion (appel API + nettoyage tokens)
    navigate('/logout');
  };

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord Administrateur</h1>
      <button onClick={goToRegister}>Enregistrer un employé</button>
      <button onClick={goToLogout}>Logout</button>
      {/* Tu peux ajouter d'autres composants ici */}
    </div>
  );
};

export default DashboardAdmin;
