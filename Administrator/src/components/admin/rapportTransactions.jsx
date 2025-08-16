import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API_ENDPOINTS from '../../config/apiConfig';

const RapportTransactions = () => {
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchPeriod, setSearchPeriod] = useState('day');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('accessToken');

  // Styles inspirés de TransactionsList
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
    color: '#ffffff',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'auto',
    padding: '2rem',
  };

  const backgroundOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
    `,
    zIndex: 0,
    pointerEvents: 'none',
  };

  const topBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const backButtonStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.8rem 1.2rem',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
  };

  const languageSelectorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.5rem',
  };

  const languageButtonStyle = (isActive) => ({
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    background: isActive 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    fontSize: '0.85rem',
  });

  const headerContainerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
    position: 'relative',
    zIndex: 1,
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.1rem',
    fontWeight: '300',
    marginBottom: '2rem',
  };

  const controlsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginBottom: '3rem',
    position: 'relative',
    zIndex: 1,
  };

  const searchContainerStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const selectStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.8rem 1.2rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '150px',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.8rem 1.2rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    minWidth: '200px',
  };

  const getButtonStyle = useCallback((buttonType, variant = 'primary') => {
    const isHovered = hoveredBtn === buttonType;
    
    const variants = {
      primary: {
        background: isHovered
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
        color: '#ffffff',
      },
      success: {
        background: isHovered
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.8) 100%)',
        color: '#ffffff',
      },
      warning: {
        background: isHovered
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          : 'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.8) 100%)',
        color: '#ffffff',
      },
    };

    return {
      ...variants[variant],
      border: isHovered ? '2px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '0.8rem 1.5rem',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(20px)',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(102, 126, 234, 0.3)' 
        : '0 4px 15px rgba(0, 0, 0, 0.1)',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginRight: '1rem',
      marginBottom: '0.5rem',
      willChange: 'transform, box-shadow',
    };
  }, [hoveredBtn]);

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1,
  };

  const statItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const statLabelStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const statValueStyle = {
    color: '#ffffff',
    fontSize: '1.2rem',
    fontWeight: '700',
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    animation: 'pulse 1.5s infinite',
  };

  const errorStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: '#ef4444',
    fontSize: '1.1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  };

  // Gestion RTL pour l'arabe
  useEffect(() => {
    if (i18n.language === "ar") {
      document.body.dir = "rtl";
      document.body.style.textAlign = "right";
    } else {
      document.body.dir = "ltr";
      document.body.style.textAlign = "left";
    }
  }, [i18n.language]);

  // Fonction pour ajouter un délai avec loader
  const delayWithLoader = (duration = 2000) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  };

  const fetchReport = async (selectedPeriod, specificDate = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Ajout du délai pour le loader (2 secondes)
      await delayWithLoader(2000);
      
      let url = `${API_ENDPOINTS.TRANSACTION_REPORT}?period=${selectedPeriod}`;
      if (specificDate) {
        url += `&date=${specificDate}`;
      }
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Erreur: ${res.status}`);
      }
      
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSmartSearch = async () => {
    // Reset l'état avant de faire la nouvelle recherche
    setReport(null);
    setError(null);
    setLoading(true);
    
    try {
      // Ajout du délai pour le loader (2.5 secondes pour la recherche)
      await delayWithLoader(2500);
      
      if (searchDate) {
        await fetchReportDirectly(searchPeriod, searchDate);
      } else {
        await fetchReportDirectly(searchPeriod);
      }
    } finally {
      setShowDatePicker(false);
      setLoading(false);
    }
  };

  // Fonction directe sans délai supplémentaire (utilisée dans handleSmartSearch)
  const fetchReportDirectly = async (selectedPeriod, specificDate = null) => {
    try {
      let url = `${API_ENDPOINTS.TRANSACTION_REPORT}?period=${selectedPeriod}`;
      if (specificDate) {
        url += `&date=${specificDate}`;
      }
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Erreur: ${res.status}`);
      }
      
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
      setReport(null);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Gestion du changement de période avec délai
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    // Reset l'état avant de faire la nouvelle recherche
    setReport(null);
    setError(null);
    fetchReport(newPeriod);
  };

  useEffect(() => {
    // Chargement initial au montage du composant
    setReport(null);
    setError(null);
    fetchReport(period);
  }, []); // Ne se déclenche qu'une fois au montage

  return (
    <div style={containerStyle}>
      <div style={backgroundOverlayStyle}></div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        input:focus, select:focus {
          border-color: rgba(102, 126, 234, 0.5) !important;
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.3) !important;
        }
        
        select option {
          background: #1a1a2e;
          color: #ffffff;
        }
        
        /* Scroll personnalisé */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 4px;
        }
        
        /* Responsivité */
        @media (max-width: 768px) {
          .search-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .search-container > * {
            width: 100% !important;
            min-width: auto !important;
          }
        }
        
        .loading-container {
          animation: fadeIn 0.3s ease-in;
        }
        
        .report-card {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>

      {/* Barre du haut */}
      <div style={topBarStyle}>
        <button
          style={backButtonStyle}
          onClick={handleGoBack}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }}
        >
          ← {t('buttons.back')}
        </button>
        
        <div style={languageSelectorStyle}>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            {t('language.select')}:
          </span>
          <button
            style={languageButtonStyle(i18n.language === 'fr')}
            onClick={() => changeLanguage('fr')}
          >
            FR
          </button>
          <button
            style={languageButtonStyle(i18n.language === 'ar')}
            onClick={() => changeLanguage('ar')}
          >
            AR
          </button>
          <button
            style={languageButtonStyle(i18n.language === 'en')}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
        </div>
      </div>

      {/* En-tête */}
      <div style={headerContainerStyle}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '1rem',
          animation: 'float 3s ease-in-out infinite',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
        }}>
          📊
        </div>
        <h1 style={headerStyle}>
          {t('report.title')}
        </h1>
        <p style={subtitleStyle}>
          {t('report.subtitle')}
        </p>
      </div>

      {/* Contrôles */}
      <div style={controlsContainerStyle}>
        <div style={searchContainerStyle} className="search-container">
          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '0.5rem' }}>
              {t('report.period.label')}:
            </label>
            <select 
              value={period} 
              onChange={e => handlePeriodChange(e.target.value)}
              style={selectStyle}
              disabled={loading}
            >
              <option value="day">{t('report.period.day')}</option>
              <option value="week">{t('report.period.week')}</option>
              <option value="month">{t('report.period.month')}</option>
              <option value="year">{t('report.period.year')}</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '0.5rem' }}>
              {t('report.search.period')}:
            </label>
            <select 
              value={searchPeriod} 
              onChange={e => setSearchPeriod(e.target.value)}
              style={selectStyle}
              disabled={loading}
            >
              <option value="day">{t('report.period.day')}</option>
              <option value="week">{t('report.period.week')}</option>
              <option value="month">{t('report.period.month')}</option>
              <option value="year">{t('report.period.year')}</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '0.5rem' }}>
              {t('report.search.date')}:
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
              style={inputStyle}
              disabled={loading}
            />
          </div>

          <button
            style={{
              ...getButtonStyle('search', 'success'),
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleSmartSearch}
            onMouseEnter={() => !loading && setHoveredBtn('search')}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                Recherche...
              </>
            ) : (
              <>
                🔍 {t('report.search.button')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenu */}
      {loading && (
        <div style={loadingStyle} className="loading-container">
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem',
          }}></div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '600',
            fontSize: '1.2rem',
            marginBottom: '0.5rem'
          }}>
            ⏳ Chargement en cours...
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem'
          }}>
            Traitement des données...
          </div>
        </div>
      )}

      {error && (
        <div style={errorStyle}>
          ❌ {t('error.loading')}: {error}
        </div>
      )}

      {report && !loading && (
        <div style={cardStyle} className="report-card">
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            📈 Statistiques
          </h3>

          <div style={statItemStyle}>
            <span style={statLabelStyle}>{t('report.stats.totalTransactions')}</span>
            <span style={{...statValueStyle, color: '#4ade80'}}>{report.total_transactions}</span>
          </div>

          <div style={statItemStyle}>
            <span style={statLabelStyle}>{t('report.stats.totalSent')}</span>
            <span style={{...statValueStyle, color: '#60a5fa'}}>{report.total_montant_envoye}</span>
          </div>

          <div style={statItemStyle}>
            <span style={statLabelStyle}>{t('report.stats.totalReceived')}</span>
            <span style={{...statValueStyle, color: '#fbbf24'}}>{report.total_montant_remis}</span>
          </div>

          <div style={statItemStyle}>
            <span style={statLabelStyle}>{t('report.stats.totalProfit')}</span>
            <span style={{...statValueStyle, color: '#a855f7'}}>{report.total_gain}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RapportTransactions;














































// import React, { useState, useEffect } from 'react';
// import API_ENDPOINTS from '../../config/apiConfig';

// const RapportTransactions = () => {
//   const [report, setReport] = useState(null);
//   const [period, setPeriod] = useState('day');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem('accessToken');

//   const fetchReport = async (selectedPeriod) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_ENDPOINTS.TRANSACTION_REPORT}?period=${selectedPeriod}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!res.ok) {
//         throw new Error(`Erreur: ${res.status}`);
//       }
//       const data = await res.json();
//       setReport(data);
//     } catch (err) {
//       setError(err.message);
//       setReport(null);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchReport(period);
//   }, [period]);

//   return (
//     <div>
//       <h2>Rapport des transactions</h2>
//       <label>
//         Période :
//         <select value={period} onChange={e => setPeriod(e.target.value)}>
//           <option value="day">Jour</option>
//           <option value="week">Semaine</option>
//           <option value="month">Mois</option>
//           <option value="year">Année</option>
//         </select>
//       </label>

//       {loading && <p>Chargement...</p>}
//       {error && <p style={{color:'red'}}>{error}</p>}

//       {report && (
//         <ul>
//           <li>Total transactions : {report.total_transactions}</li>
//           <li>Total montant envoyé : {report.total_montant_envoye}</li>
//           <li>Total montant remis : {report.total_montant_remis}</li>
//           <li>Total gain : {report.total_gain}</li>
//         </ul>
//       )}
//     </div>
//   );
// };

// export default RapportTransactions;
