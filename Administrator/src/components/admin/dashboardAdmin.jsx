import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container" style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Tableau de bord Administrateur</h1>
      <button onClick={() => navigate('/enregistrerEmploye')} aria-label="Enregistrer un employé">
        Enregistrer un employé
      </button>
      <button onClick={() => navigate('/sendTransfert')} aria-label="Effectuer un transfert">
        Transfert
      </button>
      <button onClick={() => navigate('/logout')} aria-label="Se déconnecter">
        Logout
      </button>
    </div>
  );
};

export default DashboardAdmin;
