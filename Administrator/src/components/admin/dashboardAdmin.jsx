import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../LanguageSelector';
import API_ENDPOINTS from '../../config/apiConfig';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [hoveredButton, setHoveredButton] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Récupération des infos utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(API_ENDPOINTS.GET_USER_DATA, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Erreur récupération utilisateur", error);
      }
    };
    fetchUser();
  }, []);

  const containerStyle = {
    maxWidth: 600,
    margin: '40px auto',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
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
    { path: '/transactionsLists', label: t('received_transfers') || 'Transferts reçus' },
    { path: '/rapportTransactions', label: t('activity_reports') || "Rapports d'activités" },
    { path: '/listeEmploye', label: t('register_employee') || 'Enregistrer Employé' },
    { path: '/sendTransfert', label: t('make_transfer') || 'Faire un transfert' },
    { path: '/logout', label: t('logout') || 'Se déconnecter' },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 25 }}>
        <LanguageSelector />
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>
        {t('admin_dashboard') || 'Tableau de bord Admin'}
      </h1>

      {/* Bouton Profil avec toggle */}
      <button
        onClick={() => setShowProfile(!showProfile)}
        aria-label={t('profile') || 'Profil'}
        style={{
          ...buttonStyle,
          ...(hoveredButton === 0 ? buttonHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredButton(0)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {t('profile') || 'Profil'}
      </button>

      {showProfile && userData && (
        <div style={profileBoxStyle}>
          <p><strong>Nom d’utilisateur :</strong> {userData.username}</p>
          <p><strong>Email :</strong> {userData.email}</p>
          <p><strong>Ville :</strong> {userData.ville || 'Non renseignée'}</p>
          <p><strong>Rôle :</strong> {userData.role}</p>
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

export default DashboardAdmin;
