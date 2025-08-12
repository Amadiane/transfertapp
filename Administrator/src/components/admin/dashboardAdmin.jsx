import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../LanguageSelector';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const headerStyle = {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: '2rem',
    marginBottom: 30,
    textAlign: 'center',
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
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
  };

  const [hoveredButton, setHoveredButton] = React.useState(null);

  // Nouveau tableau avec tous les boutons et leurs chemins + labels
  const buttons = [
    { path: '/profil', label: t('profile') || 'Profil' },
    { path: '/transactionsLists', label: t('received_transfers') || 'Transferts reçus' },
    { path: '/rapportsActivites', label: t('activity_reports') || "Rapports d'activités" },
    { path: '/listeEmploye', label: t('register_employee') || 'Enregistrer Employé' },
    { path: '/sendTransfert', label: t('make_transfer') || 'Faire un transfert' },
    { path: '/logout', label: t('logout') || 'Se déconnecter' },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 25 }}>
        <LanguageSelector />
      </div>

      <h1 style={headerStyle}>{t('admin_dashboard') || 'Tableau de bord Admin'}</h1>

      {buttons.map(({ path, label }, idx) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          aria-label={label}
          style={{
            ...buttonStyle,
            ...(hoveredButton === idx ? buttonHoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton(idx)}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DashboardAdmin;
