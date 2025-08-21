import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../LanguageSelector';
import API_ENDPOINTS from '../../config/apiConfig';

const DashboardEmploye = ({ isAdminView }) => {
  const { id } = useParams();  // Récupère l'ID de l'URL (employé à afficher)
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

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
          setError(t('user_not_found') || "Utilisateur non trouvé");
        } else {
          setError(t('loading_error') || "Erreur lors du chargement des données");
        }
        setEmployeeData(null);
        return;
      }
      const data = await response.json();
      setEmployeeData(data);
    } catch (error) {
      console.error(error);
      setError(t('loading_error') || "Erreur lors du chargement des données");
      setEmployeeData(null);
    }
  };

  useEffect(() => {
    if (isAdminView && id) {
      fetchEmployeeData(id);
    } else {
      fetchEmployeeData('me');
    }
  }, [id, isAdminView]);

  // Boutons avec traductions et icônes
  const buttons = [
    { path: '/sendTransfert', label: t('make_transfer') || 'Faire un transfert', icon: '💸', bgColor: '#f59e0b' },
    { path: '/transactionsLists', label: t('received_transfers') || 'Transfert reçu', icon: '💰', bgColor: '#3b82f6' },
    { path: '/rapportTransactions', label: t('view_reports') || 'Voir mes rapports', icon: '📊', bgColor: '#10b981' },
    { path: '/logout', label: t('logout') || 'Se déconnecter', icon: '🚪', bgColor: '#ef4444' },
  ];

  // Styles modernes inspirés du DashboardAdmin
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
    color: '#ffffff',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
    `,
    zIndex: 1,
  };

  const contentWrapperStyle = {
    position: 'relative',
    zIndex: 2,
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem 1rem',
  };

  const headerContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const logoIconStyle = {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
    boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    margin: '0',
    background: 'linear-gradient(135deg, #ffffff 0%, #10b981 50%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.2rem',
    margin: '0.5rem 0 0 0',
    fontWeight: '300',
  };

  const langSelectorStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    padding: '1.2rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  };

  const mainContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem 1rem',
  };

  const errorStyle = {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '20px',
    padding: '2rem',
    textAlign: 'center',
    color: '#fecaca',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 15px 50px rgba(239, 68, 68, 0.2)',
  };

  const loadingStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '3rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.2rem',
    fontWeight: '600',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
  };

  const profileCardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '30px',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '3rem',
    overflow: 'hidden',
    position: 'relative',
  };

  const profileButtonStyle = {
    width: '100%',
    padding: '2rem',
    border: 'none',
    background: hoveredButton === 0 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'transparent',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    fontSize: '1.4rem',
    fontWeight: '700',
    position: 'relative',
    overflow: 'hidden',
  };

  const profileIconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: hoveredButton === 0 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontSize: '1.8rem',
    marginRight: '1.5rem',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
  };

  const profileInfoStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)',
    padding: '2.5rem',
    margin: '0 2rem 2rem 2rem',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
  };

  const infoIconStyle = (color) => ({
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    color: 'white',
    fontSize: '1.4rem',
    boxShadow: `0 8px 25px ${color}40`,
  });

  const buttonsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  };

  const actionButtonStyle = (isHovered, bgColor) => ({
    width: '100%',
    height: '200px',
    border: 'none',
    borderRadius: '25px',
    background: isHovered 
      ? `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${bgColor}bb 100%)` 
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-15px) scale(1.03)' : 'translateY(0) scale(1)',
    boxShadow: isHovered 
      ? `0 30px 80px ${bgColor}50` 
      : '0 15px 50px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    border: isHovered ? `2px solid ${bgColor}80` : '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(30px)',
    borderRadius: '25px',
    boxShadow: isHovered 
      ? `0 30px 80px ${bgColor}50` 
      : '0 15px 50px rgba(0, 0, 0, 0.2)',
  });

  const buttonIconStyle = (isHovered) => ({
    fontSize: '3.5rem',
    transition: 'all 0.5s ease',
    transform: isHovered ? 'scale(1.3) rotate(10deg)' : 'scale(1) rotate(0deg)',
    filter: isHovered ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' : 'none',
  });

  const footerStyle = {
    textAlign: 'center',
    marginTop: '4rem',
    padding: '3rem',
  };

  const footerBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem 3rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '60px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    fontWeight: '600',
  };

  const dotStyle = (color, delay) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    animation: `pulse 3s infinite ${delay}ms`,
    boxShadow: `0 0 20px ${color}80`,
  });

  // Gestion des erreurs et du chargement
  if (error) {
    return (
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={contentWrapperStyle}>
          <div style={mainContentStyle}>
            <div style={errorStyle}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚠️</div>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={contentWrapperStyle}>
          <div style={mainContentStyle}>
            <div style={loadingStyle}>
              <div style={{fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite'}}>⏳</div>
              {t('loading') || 'Chargement...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={backgroundOverlayStyle}></div>
      <div style={contentWrapperStyle}>
        {/* CSS pour animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
              transform: scale(1);
            }
            50% { 
              opacity: 0.4; 
              transform: scale(1.2);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @media (max-width: 768px) {
            .title { font-size: 2.2rem !important; }
            .button-grid { grid-template-columns: 1fr !important; }
          }
          .info-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          }
        `}</style>

        {/* Header */}
        <div style={headerStyle}>
          <div style={headerContentStyle}>
            <div style={logoStyle}>
              <div style={logoIconStyle}>
                <span style={{animation: 'float 3s ease-in-out infinite'}}>👤</span>
              </div>
              <div>
                <h1 style={titleStyle} className="title">
                  {isAdminView ? `${t('dashboard_of') || 'Dashboard de'} ${employeeData.username}` : t('employee_dashboard') || 'Dashboard Employé'}
                </h1>
                <p style={subtitleStyle}>{t('employee_interface_subtitle') || 'Interface employé'}</p>
              </div>
            </div>
            <div style={langSelectorStyle}>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={mainContentStyle}>
          {/* Section Profil */}
          <div style={profileCardStyle}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              aria-label={t('profile') || 'Profil'}
              style={profileButtonStyle}
              onMouseEnter={() => setHoveredButton(0)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={profileIconStyle}>👤</div>
                <div style={{textAlign: 'left'}}>
                  <div>{t('profile') || 'Profil'}</div>
                  <div style={{fontSize: '1rem', opacity: 0.8, fontWeight: '400'}}>
                    {t('account_information') || 'Informations du compte'}
                  </div>
                </div>
              </div>
              <svg 
                style={{
                  width: '28px', 
                  height: '28px', 
                  transition: 'transform 0.5s ease',
                  transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Affichage des informations du profil */}
            {showProfile && employeeData && (
              <div style={profileInfoStyle}>
                <div style={infoGridStyle}>
                  <div style={infoItemStyle} className="info-item">
                    <div style={infoIconStyle('#3b82f6')}>👤</div>
                    <div>
                      <div style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600', letterSpacing: '1px'}}>
                        {(t('username') || 'NOM D\'UTILISATEUR').toUpperCase()}
                      </div>
                      <div style={{fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginTop: '0.3rem'}}>
                        {employeeData.username}
                      </div>
                    </div>
                  </div>

                  <div style={infoItemStyle} className="info-item">
                    <div style={infoIconStyle('#10b981')}>📧</div>
                    <div>
                      <div style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600', letterSpacing: '1px'}}>
                        {(t('email') || 'EMAIL').toUpperCase()}
                      </div>
                      <div style={{fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginTop: '0.3rem'}}>
                        {employeeData.email}
                      </div>
                    </div>
                  </div>

                  <div style={infoItemStyle} className="info-item">
                    <div style={infoIconStyle('#f59e0b')}>🌍</div>
                    <div>
                      <div style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600', letterSpacing: '1px'}}>
                        {(t('city') || 'VILLE').toUpperCase()}
                      </div>
                      <div style={{fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginTop: '0.3rem'}}>
                        {employeeData.ville || t('not_specified') || 'Non renseignée'}
                      </div>
                    </div>
                  </div>

                  <div style={infoItemStyle} className="info-item">
                    <div style={infoIconStyle('#8b5cf6')}>🎯</div>
                    <div>
                      <div style={{fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600', letterSpacing: '1px'}}>
                        {(t('role') || 'RÔLE').toUpperCase()}
                      </div>
                      <div style={{fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginTop: '0.3rem'}}>
                        {employeeData.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div style={buttonsGridStyle} className="button-grid">
            {buttons.map(({ path, label, icon, bgColor }, idx) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                aria-label={label}
                style={actionButtonStyle(hoveredButton === idx + 1, bgColor)}
                onMouseEnter={() => setHoveredButton(idx + 1)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div style={buttonIconStyle(hoveredButton === idx + 1)}>
                  {icon}
                </div>
                <span style={{textAlign: 'center', lineHeight: '1.4', letterSpacing: '0.5px'}}>
                  {label}
                </span>
                
                {/* Effet de brillance */}
                {hoveredButton === idx + 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    transition: 'left 0.8s ease',
                    left: '100%',
                  }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <div style={footerBadgeStyle}>
              <div style={dotStyle('#10b981', 0)}></div>
              <div style={dotStyle('#3b82f6', 300)}></div>
              <div style={dotStyle('#f59e0b', 600)}></div>
              <span>{t('employee_secure_interface') || 'Interface employé sécurisée'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmploye;