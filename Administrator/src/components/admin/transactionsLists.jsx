import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API_ENDPOINTS from '../../config/apiConfig';

// Fonction pour récupérer le token JWT depuis le localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

const TransactionsLists = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const token = getAuthToken();

  // Design ultra moderne avec thème sombre
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

  const transactionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const fieldStyle = {
    marginBottom: '0.8rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  };

  const labelStyle = {
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem',
    minWidth: '120px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle = {
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  };

  const confirmModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 3000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const confirmContentStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
  };

  const getCardStyle = useCallback((cardId) => {
    const isHovered = hoveredCard === cardId;
    
    return {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
      backdropFilter: 'blur(30px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: isHovered 
        ? '0 20px 40px rgba(102, 126, 234, 0.2)' 
        : '0 10px 30px rgba(0, 0, 0, 0.2)',
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      willChange: 'transform, box-shadow',
      backfaceVisibility: 'hidden',
    };
  }, [hoveredCard]);

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
      danger: {
        background: isHovered
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%)',
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
      padding: '0.5rem 1rem',
      fontWeight: '600',
      fontSize: '0.85rem',
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
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
      willChange: 'transform, box-shadow',
    };
  }, [hoveredBtn]);

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const modalContentStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#ffffff',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const noTransactionsStyle = {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.1rem',
  };

  const successMessageStyle = {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
    zIndex: 3000,
    animation: 'slideIn 0.3s ease-out',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
  };

  const showSuccessMessage = useCallback((message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const showConfirmDialog = useCallback((message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  }, []);

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirm(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Gestion de la langue (RTL pour arabe, LTR sinon)
useEffect(() => {
  if (i18n.language === "ar") {
    document.body.dir = "rtl";  // sens droite → gauche
    document.body.style.textAlign = "right";
  } else {
    document.body.dir = "ltr";  // sens gauche → droite
    document.body.style.textAlign = "left";
  }
}, [i18n.language]);

  useEffect(() => {
    if (!token) return;

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.GET_USER_DATA, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Erreur fetch user data', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.TRANSACTIONS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Erreur fetch transactions', error);
      }
    };

    

    fetchCurrentUser();
    fetchTransactions();
  }, [token]);

  const handleDistribuer = async (tx) => {
    showConfirmDialog(
      t('confirm.distribute', { id: tx.id }),
      async () => {
        setIsLoading(true);
        try {
          const res = await fetch(API_ENDPOINTS.DISTRIBUER_TRANSACTION(tx.id), {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (res.ok) {
            const updatedTx = await res.json();
            setTransactions((prev) =>
              prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
            );
            showSuccessMessage(t('success.distributed'));
          } else {
            alert(t('error.distribution'));
          }
        } catch (error) {
          console.error(error);
          alert(t('error.network'));
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleAnnulerDistribution = async (tx) => {
    showConfirmDialog(
      t('confirm.cancelDistribution', { id: tx.id }),
      async () => {
        // Récupération du token CSRF si nécessaire
        function getCookie(name) {
          let cookieValue = null;
          if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
              cookie = cookie.trim();
              if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
              }
            }
          }
          return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');

        setIsLoading(true);
        try {
          const res = await fetch(API_ENDPOINTS.ANNULER_DISTRIBUTION(tx.id), {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
          });
          if (res.ok) {
            const updatedTx = await res.json();
            setTransactions((prev) =>
              prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
            );
            showSuccessMessage(t('success.cancelled'));
          } else {
            alert(t('error.cancellation'));
          }
        } catch (error) {
          console.error(error);
          alert(t('error.network'));
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleDelete = async (id) => {
    showConfirmDialog(
      t('confirm.delete'),
      async () => {
        setIsLoading(true);
        try {
          const res = await fetch(API_ENDPOINTS.DELETE_TRANSACTION(id), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setTransactions((prev) => prev.filter((tx) => tx.id !== id));
            showSuccessMessage(t('success.deleted'));
          } else {
            alert(t('error.deletion'));
          }
        } catch (err) {
          console.error(err);
          alert(t('error.deletion'));
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const openEditForm = (tx) => {
    setEditingTx(tx);
    setEditFormData({
      devise_envoyee: tx.devise_envoyee || '',
      montant_envoye: tx.montant_envoye || '',
      pourcentage_gain: tx.pourcentage_gain || '',
      devise_recue: tx.devise_recue || '',
      beneficiaire_nom: tx.beneficiaire_nom || '',
      numero_destinataire: tx.numero_destinataire || '',
      date_transfert: tx.date_transfert ? tx.date_transfert.slice(0, 16) : '',
      remarques: tx.remarques || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    const payload = { ...editFormData };

    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_TRANSACTION(editingTx.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updatedTx = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
        );
        setEditingTx(null);
        showSuccessMessage(t('success.updated'));
      } else {
        alert(t('error.update'));
      }
    } catch (err) {
      console.error(err);
      alert(t('error.update'));
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => setEditingTx(null);

  return (
    <div style={containerStyle}>
      <div style={backgroundOverlayStyle}></div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: rgba(102, 126, 234, 0.5) !important;
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.3) !important;
        }
        
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
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
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
        
        /* Responsivité */
        @media (max-width: 1200px) {
          .transactions-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)) !important;
            gap: 1.5rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 1rem !important;
          }
          .transactions-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .header {
            font-size: 2rem !important;
          }
          .modal-content {
            padding: 1.5rem !important;
            margin: 0.5rem !important;
          }
          .success-message {
            top: 1rem !important;
            right: 1rem !important;
            left: 1rem !important;
            right: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .header {
            font-size: 1.5rem !important;
          }
          .card {
            padding: 1rem !important;
          }
          .button-group {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .button-group button {
            width: 100% !important;
            margin-right: 0 !important;
            margin-bottom: 0.5rem !important;
          }
        }
      `}</style>

      {/* Barre du haut avec bouton retour et sélecteur de langue */}
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
        <h1 style={headerStyle} className="header">
          {t('title.transfersSummary')}
        </h1>
        <p style={subtitleStyle}>
          {t('subtitle.completeManagement')}
        </p>
      </div>

      {successMessage && (
        <div style={successMessageStyle} className="success-message">
          {successMessage}
        </div>
      )}

      {/* Modal de confirmation personnalisé */}
      {showConfirm && (
        <div style={confirmModalStyle}>
          <div style={confirmContentStyle}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
            }}>
              ⚠️
            </div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '1rem',
            }}>
              {t('confirm.title')}
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '2rem',
              lineHeight: '1.5',
            }}>
              {confirmMessage}
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
            }}>
              <button
                style={getButtonStyle('confirm-cancel', 'danger')}
                onClick={handleCancel}
                onMouseEnter={() => setHoveredBtn('confirm-cancel')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {t('buttons.cancel')}
              </button>
              <button
                style={getButtonStyle('confirm-ok', 'success')}
                onClick={handleConfirm}
                onMouseEnter={() => setHoveredBtn('confirm-ok')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {t('buttons.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {transactions.length === 0 ? (
        <div style={noTransactionsStyle}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>
            📝
          </div>
          <p style={{margin: '0', fontWeight: '600'}}>
            {t('noTransactions.title')}
          </p>
          <p style={{margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: '0.8'}}>
            {t('noTransactions.subtitle')}
          </p>
        </div>
      ) : (
        <div style={transactionsGridStyle} className="transactions-grid">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              style={getCardStyle(`card-${tx.id}`)}
              onMouseEnter={() => setHoveredCard(`card-${tx.id}`)}
              onMouseLeave={() => setHoveredCard(null)}
              className="card"
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}>
                  {t('labels.id')}: {tx.id}
                </div>
                <div style={{
                  background: tx.is_distribue 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}>
                  {tx.is_distribue ? t('status.distributed') : t('status.pending')}
                </div>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.sentBy')} :</span>
                <span style={valueStyle}>
                  {tx.sender?.username} ({tx.sender?.email})
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.sentCurrency')} :</span>
                <span style={valueStyle}>{tx.devise_envoyee}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.amount')} :</span>
                <span style={{...valueStyle, fontWeight: '700', color: '#4ade80'}}>
                  {tx.montant_envoye} {tx.devise_envoyee}
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.profit')} :</span>
                <span style={{...valueStyle, fontWeight: '700', color: '#a855f7'}}>
                  {tx.pourcentage_gain}%
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.receivedCurrency')} :</span>
                <span style={valueStyle}>{tx.devise_recue}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.beneficiary')} :</span>
                <span style={valueStyle}>{tx.beneficiaire_nom}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.recipientNumber')} :</span>
                <span style={valueStyle}>{tx.numero_destinataire}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.date')} :</span>
                <span style={valueStyle}>
                  {new Date(tx.date_transfert).toLocaleString('fr-FR')}
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>{t('labels.remarks')} :</span>
                <span style={{...valueStyle, fontStyle: tx.remarques ? 'normal' : 'italic', opacity: tx.remarques ? 1 : 0.7}}>
                  {tx.remarques || t('labels.noRemarks')}
                </span>
              </div>

              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                {tx.is_distribue ? (
                  <div style={{
                    marginBottom: '1rem',
                    padding: '0.8rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                    <div style={{color: '#4ade80', fontWeight: '600', fontSize: '0.9rem'}}>
                      ✅ {t('labels.distributedBy')} {tx.distributeur?.username || t('labels.unknown')}
                    </div>
                    {currentUser?.role === 'admin' && (
                      <button
                        style={getButtonStyle(`annuler-${tx.id}`, 'danger')}
                        onClick={() => handleAnnulerDistribution(tx)}
                        onMouseEnter={() => setHoveredBtn(`annuler-${tx.id}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        disabled={isLoading}
                      >
                        🔄 {t('buttons.cancel')}
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    style={getButtonStyle(`distribuer-${tx.id}`, 'success')}
                    onClick={() => handleDistribuer(tx)}
                    onMouseEnter={() => setHoveredBtn(`distribuer-${tx.id}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    disabled={isLoading}
                  >
                    ✅ {t('buttons.distribute')}
                  </button>
                )}

                {(currentUser?.role === 'admin' || !tx.is_distribue) && (
                  <div className="button-group" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '1rem',
                  }}>
                    <button
                      style={getButtonStyle(`edit-${tx.id}`, 'primary')}
                      onClick={() => openEditForm(tx)}
                      onMouseEnter={() => setHoveredBtn(`edit-${tx.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      disabled={(tx.is_distribue && currentUser?.role !== 'admin') || isLoading}
                    >
                      ✏️ {t('buttons.edit')}
                    </button>
                    <button
                      style={getButtonStyle(`delete-${tx.id}`, 'danger')}
                      onClick={() => handleDelete(tx.id)}
                      onMouseEnter={() => setHoveredBtn(`delete-${tx.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      disabled={(tx.is_distribue && currentUser?.role !== 'admin') || isLoading}
                    >
                      🗑️ {t('buttons.delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTx && (
        <div style={modalStyle}>
          <div style={modalContentStyle} className="modal-content">
            <h3 style={{
              ...headerStyle,
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              ✏️ {t('modal.editTitle')} {editingTx.id}
            </h3>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.sentCurrency')} :
              </label>
              <input
                type="text"
                name="devise_envoyee"
                value={editFormData.devise_envoyee}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder={t('placeholders.currency')}
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.sentAmount')} :
              </label>
              <input
                type="number"
                step="0.01"
                name="montant_envoye"
                value={editFormData.montant_envoye}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder="0.00"
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.profitPercentage')} (%) :
              </label>
              <input
                type="number"
                step="0.01"
                name="pourcentage_gain"
                value={editFormData.pourcentage_gain}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder="0.00"
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.receivedCurrency')} :
              </label>
              <input
                type="text"
                name="devise_recue"
                value={editFormData.devise_recue}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder={t('placeholders.currency')}
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.beneficiaryName')} :
              </label>
              <input
                type="text"
                name="beneficiaire_nom"
                value={editFormData.beneficiaire_nom}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder={t('placeholders.beneficiaryName')}
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.recipientNumber')} :
              </label>
              <input
                type="text"
                name="numero_destinataire"
                value={editFormData.numero_destinataire}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder={t('placeholders.recipientNumber')}
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.transferDate')} :
              </label>
              <input
                type="datetime-local"
                name="date_transfert"
                value={editFormData.date_transfert}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
              />
            </div>

            <div style={{marginBottom: '2rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {t('labels.remarks')} :
              </label>
              <textarea
                name="remarques"
                value={editFormData.remarques}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={textareaStyle}
                placeholder={t('placeholders.remarks')}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
            }}>
              <button 
                onClick={cancelEdit}
                style={getButtonStyle('cancel-edit', 'danger')}
                onMouseEnter={() => setHoveredBtn('cancel-edit')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                ❌ {t('buttons.cancel')}
              </button>
              <button
                onClick={submitEdit}
                disabled={(editingTx.is_distribue && currentUser?.role !== 'admin') || isLoading}
                style={getButtonStyle('save-edit', 'success')}
                onMouseEnter={() => setHoveredBtn('save-edit')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {isLoading ? t('buttons.loading') : t('buttons.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          {t('loading.processing')}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TransactionsLists;


























// import React, { useEffect, useState } from 'react';
// import API_ENDPOINTS from '../../config/apiConfig';

// // Fonction pour récupérer le token JWT depuis le localStorage
// const getAuthToken = () => {
//   return localStorage.getItem('accessToken');
// };

// const TransactionsLists = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [editingTx, setEditingTx] = useState(null);
//   const [editFormData, setEditFormData] = useState({});
//   const token = getAuthToken();

//   useEffect(() => {
//     if (!token) return;

//     const fetchCurrentUser = async () => {
//       try {
//         const res = await fetch(API_ENDPOINTS.GET_USER_DATA, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const userData = await res.json();
//           setCurrentUser(userData);
//         }
//       } catch (error) {
//         console.error('Erreur fetch user data', error);
//       }
//     };

//     const fetchTransactions = async () => {
//       try {
//         const res = await fetch(API_ENDPOINTS.TRANSACTIONS, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setTransactions(data);
//         }
//       } catch (error) {
//         console.error('Erreur fetch transactions', error);
//       }
//     };

//     fetchCurrentUser();
//     fetchTransactions();
//   }, [token]);

//   const handleDistribuer = async (tx) => {
//     if (
//       window.confirm(
//         `Confirmer que le transfert ID ${tx.id} a été remis avec succès ?`
//       )
//     ) {
//       try {
//         const res = await fetch(API_ENDPOINTS.DISTRIBUER_TRANSACTION(tx.id), {
//           method: 'PATCH',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (res.ok) {
//           const updatedTx = await res.json();
//           setTransactions((prev) =>
//             prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
//           );
//           alert('Transfert marqué comme distribué.');
//         } else {
//           alert('Erreur lors de la distribution');
//         }
//       } catch (error) {
//         console.error(error);
//         alert('Erreur réseau ou serveur');
//       }
//     }
//   };

//   const handleAnnulerDistribution = async (tx) => {
//     if (!window.confirm(`Annuler la distribution du transfert ID ${tx.id} ? Cette action est réservée à l'admin.`))
//       return;

//     // Récupération du token CSRF si nécessaire
//     function getCookie(name) {
//       let cookieValue = null;
//       if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let cookie of cookies) {
//           cookie = cookie.trim();
//           if (cookie.startsWith(name + '=')) {
//             cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//             break;
//           }
//         }
//       }
//       return cookieValue;
//     }
//     const csrftoken = getCookie('csrftoken');

//     try {
//       const res = await fetch(API_ENDPOINTS.ANNULER_DISTRIBUTION(tx.id), {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrftoken,
//         },
//       });
//       if (res.ok) {
//         const updatedTx = await res.json();
//         setTransactions((prev) =>
//           prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
//         );
//         alert('Distribution annulée.');
//       } else {
//         alert('Erreur lors de l\'annulation');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Erreur réseau ou serveur');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Confirmer la suppression du transfert ?')) return;

//     try {
//       const res = await fetch(API_ENDPOINTS.DELETE_TRANSACTION(id), {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         setTransactions((prev) => prev.filter((tx) => tx.id !== id));
//       } else {
//         alert('Erreur lors de la suppression');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Erreur lors de la suppression');
//     }
//   };

//   const openEditForm = (tx) => {
//     setEditingTx(tx);
//     setEditFormData({
//       devise_envoyee: tx.devise_envoyee || '',
//       montant_envoye: tx.montant_envoye || '',
//       pourcentage_gain: tx.pourcentage_gain || '',
//       devise_recue: tx.devise_recue || '',
//       beneficiaire_nom: tx.beneficiaire_nom || '',
//       numero_destinataire: tx.numero_destinataire || '',
//       date_transfert: tx.date_transfert ? tx.date_transfert.slice(0, 16) : '',
//       remarques: tx.remarques || '',
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const submitEdit = async () => {
//     const payload = { ...editFormData };
//     // On peut choisir d'envoyer uniquement les champs modifiables et valides

//     try {
//       const res = await fetch(API_ENDPOINTS.UPDATE_TRANSACTION(editingTx.id), {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         const updatedTx = await res.json();
//         setTransactions((prev) =>
//           prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
//         );
//         setEditingTx(null);
//       } else {
//         alert('Erreur lors de la modification');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Erreur lors de la modification');
//     }
//   };

//   const cancelEdit = () => setEditingTx(null);

//   return (
//     <div>
//       <h2>Résumé des Transferts</h2>
//       {transactions.length === 0 && <p>Aucun transfert disponible</p>}
//       {transactions.map((tx) => (
//         <div
//           key={tx.id}
//           style={{
//             border: '1px solid #ccc',
//             margin: '10px',
//             padding: '15px',
//             borderRadius: 6,
//           }}
//         >
//           <p><strong>ID :</strong> {tx.id}</p>
//           <p><strong>Envoyé par :</strong> {tx.sender?.username} ({tx.sender?.email})</p>
//           <p><strong>Devise envoyée :</strong> {tx.devise_envoyee}</p>
//           <p><strong>Montant envoyé :</strong> {tx.montant_envoye}</p>
//           <p><strong>Pourcentage de gain :</strong> {tx.pourcentage_gain} %</p>
//           <p><strong>Devise reçue :</strong> {tx.devise_recue}</p>
//           <p><strong>Nom bénéficiaire :</strong> {tx.beneficiaire_nom}</p>
//           <p><strong>Numéro destinataire :</strong> {tx.numero_destinataire}</p>
//           <p><strong>Date transfert :</strong> {new Date(tx.date_transfert).toLocaleString()}</p>
//           <p><strong>Remarques :</strong> {tx.remarques || 'Aucune'}</p>

//           <p>
//             <strong>Statut :</strong>{' '}
//             {tx.is_distribue ? (
//               <>
//                 Distribué par <em>{tx.distributeur?.username || 'inconnu'}</em>
//                 {currentUser?.role === 'admin' && (
//                   <button
//                     onClick={() => handleAnnulerDistribution(tx)}
//                     style={{
//                       marginLeft: 10,
//                       backgroundColor: '#f87171',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: 4,
//                       cursor: 'pointer',
//                       padding: '3px 8px',
//                     }}
//                   >
//                     Annuler
//                   </button>
//                 )}
//               </>
//             ) : (
//               <button
//                 onClick={() => handleDistribuer(tx)}
//                 style={{
//                   backgroundColor: '#4caf50',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 4,
//                   cursor: 'pointer',
//                   padding: '6px 12px',
//                 }}
//               >
//                 Distribuer
//               </button>
//             )}
//           </p>

//           {(currentUser?.role === 'admin' || !tx.is_distribue) && (
//             <div style={{ marginTop: 10 }}>
//               <button
//                 onClick={() => openEditForm(tx)}
//                 style={{ marginRight: 10 }}
//                 disabled={tx.is_distribue && currentUser?.role !== 'admin'}
//               >
//                 Modifier
//               </button>
//               <button
//                 onClick={() => handleDelete(tx.id)}
//                 style={{ color: 'red' }}
//                 disabled={tx.is_distribue && currentUser?.role !== 'admin'}
//               >
//                 Supprimer
//               </button>
//             </div>
//           )}
//         </div>
//       ))}

//       {editingTx && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '20%',
//             left: '50%',
//             transform: 'translate(-50%, 0)',
//             background: '#fff',
//             padding: 20,
//             boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//             zIndex: 1000,
//             borderRadius: 8,
//             width: 400,
//             maxHeight: '70vh',
//             overflowY: 'auto',
//           }}
//         >
//           <h3>Modifier Transfert ID {editingTx.id}</h3>

//           <label>
//             Devise envoyée :
//             <input
//               type="text"
//               name="devise_envoyee"
//               value={editFormData.devise_envoyee}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Montant envoyé :
//             <input
//               type="number"
//               step="0.01"
//               name="montant_envoye"
//               value={editFormData.montant_envoye}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Pourcentage de gain (%):
//             <input
//               type="number"
//               step="0.01"
//               name="pourcentage_gain"
//               value={editFormData.pourcentage_gain}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Devise reçue :
//             <input
//               type="text"
//               name="devise_recue"
//               value={editFormData.devise_recue}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Nom du bénéficiaire :
//             <input
//               type="text"
//               name="beneficiaire_nom"
//               value={editFormData.beneficiaire_nom}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Numéro destinataire :
//             <input
//               type="text"
//               name="numero_destinataire"
//               value={editFormData.numero_destinataire}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Date du transfert :
//             <input
//               type="datetime-local"
//               name="date_transfert"
//               value={editFormData.date_transfert}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', marginBottom: 10 }}
//             />
//           </label>

//           <label>
//             Remarques :
//             <textarea
//               name="remarques"
//               value={editFormData.remarques}
//               onChange={handleEditChange}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//               style={{ width: '100%', height: 60, marginBottom: 10 }}
//             />
//           </label>

//           <div style={{ textAlign: 'right' }}>
//             <button onClick={cancelEdit} style={{ marginRight: 10 }}>
//               Annuler
//             </button>
//             <button
//               onClick={submitEdit}
//               disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
//             >
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionsLists;
