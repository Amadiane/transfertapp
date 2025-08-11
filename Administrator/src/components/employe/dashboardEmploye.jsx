import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LanguageSelector from '../../LanguageSelector';
import API_ENDPOINTS from '../../config/apiConfig';

const DashboardEmploye = ({ isAdminView }) => {
  const { id } = useParams();  // Récupère l'ID de l'URL (employé à afficher)
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAdminView && id) {
      fetchEmployeeData(id);
    } else {
      fetchEmployeeData('me');
    }
  }, [id, isAdminView]);

  const fetchEmployeeData = async (employeeId) => {
    try {
      setError(null);
      const token = localStorage.getItem("accessToken");
      const url = employeeId === 'me' 
        ? API_ENDPOINTS.GET_USER_DATA 
        : `${API_ENDPOINTS.USERS}${employeeId}/`;  // AJOUT DU SLASH FINAL IMPORTANT
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if(response.status === 404){
          setError("Utilisateur non trouvé");
        } else {
          setError("Erreur lors du chargement des données");
        }
        setEmployeeData(null);
        return;
      }
      const data = await response.json();
      setEmployeeData(data);
    } catch (error) {
      console.error(error);
      setError("Erreur lors du chargement des données");
      setEmployeeData(null);
    }
  };

  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</div>;

  if (!employeeData) return <div>Chargement...</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <LanguageSelector />
      </div>

      <h1>Dashboard {isAdminView ? `de ${employeeData.username}` : "Employé"}</h1>

      <button onClick={() => navigate(`/monProfil`)} style={{ margin: '10px 0' }}>
        Mon profil
      </button>

      <button onClick={() => navigate(`/sendTransfert`)} style={{ margin: '10px 0' }}>
        Faire un transfert
      </button>

      <button onClick={() => navigate(`/rapports`)} style={{ margin: '10px 0' }}>
        Voir mes rapports
      </button>

      <button onClick={() => navigate('/logout')} style={{ margin: '10px 0' }}>
        Se déconnecter
      </button>

      {/* Ajoute ici d’autres boutons ou fonctionnalités spécifiques */}
    </div>
  );
};

export default DashboardEmploye;
