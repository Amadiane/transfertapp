import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../../LanguageSelector';

const DashboardEmploye = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <LanguageSelector />
      </div>

      <h1>Tableau de bord Employé</h1>

      <button onClick={() => navigate('/monProfil')} style={{ margin: '10px 0' }}>
        Mon profil
      </button>

      <button onClick={() => navigate('/sendTransfert')} style={{ margin: '10px 0' }}>
        Faire un transfert
      </button>

      <button onClick={() => navigate('/rapports')} style={{ margin: '10px 0' }}>
        Voir mes rapports
      </button>

      <button onClick={() => navigate('/logout')} style={{ margin: '10px 0' }}>
        Se déconnecter
      </button>
    </div>
  );
};

export default DashboardEmploye;
