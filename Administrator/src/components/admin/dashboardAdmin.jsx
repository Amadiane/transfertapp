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

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 25 }}>
        <LanguageSelector />
      </div>

      <h1 style={headerStyle}>{t('admin_dashboard')}</h1>

      
      {['/listeEmploye', '/sendTransfert', '/logout'].map((path, idx) => {
        const labels = [
          t('register_employee'),  // si tu n’as pas cette clé dans i18n, mettre le texte direct
          t('make_transfer'),
          // t('transfert recu'),
          t('logout'),
        ];
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-label={labels[idx]}
            style={{
              ...buttonStyle,
              ...(hoveredButton === idx ? buttonHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredButton(idx)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {labels[idx]}
          </button>
        );
      })}
    </div>
  );
};

export default DashboardAdmin;
