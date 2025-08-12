import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LanguageSelector from '../../LanguageSelector';
import API_ENDPOINTS from '../../config/apiConfig';

const DashboardEmploye = ({ isAdminView }) => {
  const { id } = useParams();  // Récupère l'ID de l'URL (employé à afficher)
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

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
        : `${API_ENDPOINTS.USERS}${employeeId}/`;  // Slash final important
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

  const containerStyle = {
    maxWidth: 600,
    margin: 'auto',
    padding: 20,
    backgroundColor: 'white',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1f2937',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 0',
    margin: '12px 0',
    background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    position: 'relative',
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
  };

  const profileBoxStyle = {
    backgroundColor: '#f0f4f8',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    fontSize: '0.9rem',
    color: '#1f2937',
  };

  const buttons = [
    { path: '/sendTransfert', label: 'Faire un transfert' },
    { path: '/transactionsLists', label: 'Transfert reçu' },
    { path: '/rapportTransactions', label: 'Voir mes rapports' },
    { path: '/logout', label: 'Se déconnecter' },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <LanguageSelector />
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>
        Dashboard {isAdminView ? `de ${employeeData.username}` : "Employé"}
      </h1>

      {/* Bouton Profil avec toggle */}
      <button
        onClick={() => setShowProfile(!showProfile)}
        aria-label="Profil"
        style={{
          ...buttonStyle,
          ...(hoveredButton === 0 ? buttonHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredButton(0)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        Profil
      </button>

      {showProfile && (
        <div style={profileBoxStyle}>
          <p><strong>Nom d’utilisateur :</strong> {employeeData.username}</p>
          <p><strong>Email :</strong> {employeeData.email}</p>
          <p><strong>Ville :</strong> {employeeData.ville || 'Non renseignée'}</p>
          <p><strong>Rôle :</strong> {employeeData.role}</p>
        </div>
      )}

      {/* Autres boutons */}
      {buttons.map(({ path, label }, idx) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          aria-label={label}
          style={{
            ...buttonStyle,
            ...(hoveredButton === idx + 1 ? buttonHoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton(idx + 1)}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DashboardEmploye;
