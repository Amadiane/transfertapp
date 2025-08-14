import React, { useEffect, useState, useCallback } from 'react';
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
    if (
      window.confirm(
        `Confirmer que le transfert ID ${tx.id} a été remis avec succès ?`
      )
    ) {
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
          showSuccessMessage('✅ Transfert marqué comme distribué avec succès !');
        } else {
          alert('Erreur lors de la distribution');
        }
      } catch (error) {
        console.error(error);
        alert('Erreur réseau ou serveur');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAnnulerDistribution = async (tx) => {
    if (!window.confirm(`Annuler la distribution du transfert ID ${tx.id} ? Cette action est réservée à l'admin.`))
      return;

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
        showSuccessMessage('🔄 Distribution annulée avec succès !');
      } else {
        alert('Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur réseau ou serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression du transfert ?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.DELETE_TRANSACTION(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        showSuccessMessage('🗑️ Transfert supprimé avec succès !');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
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
        showSuccessMessage('✏️ Transfert modifié avec succès !');
      } else {
        alert('Erreur lors de la modification');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
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
          Résumé des Transferts
        </h1>
        <p style={subtitleStyle}>
          Gestion complète des transactions et transferts
        </p>
      </div>

      {successMessage && (
        <div style={successMessageStyle} className="success-message">
          {successMessage}
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
            Aucun transfert disponible
          </p>
          <p style={{margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: '0.8'}}>
            Les transactions apparaîtront ici une fois créées
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
                  ID: {tx.id}
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
                  {tx.is_distribue ? '✅ Distribué' : '⏳ En attente'}
                </div>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Envoyé par :</span>
                <span style={valueStyle}>
                  {tx.sender?.username} ({tx.sender?.email})
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Devise envoyée :</span>
                <span style={valueStyle}>{tx.devise_envoyee}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Montant :</span>
                <span style={{...valueStyle, fontWeight: '700', color: '#4ade80'}}>
                  {tx.montant_envoye} {tx.devise_envoyee}
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Gain :</span>
                <span style={{...valueStyle, fontWeight: '700', color: '#a855f7'}}>
                  {tx.pourcentage_gain}%
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Devise reçue :</span>
                <span style={valueStyle}>{tx.devise_recue}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Bénéficiaire :</span>
                <span style={valueStyle}>{tx.beneficiaire_nom}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>N° destinataire :</span>
                <span style={valueStyle}>{tx.numero_destinataire}</span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Date :</span>
                <span style={valueStyle}>
                  {new Date(tx.date_transfert).toLocaleString('fr-FR')}
                </span>
              </div>

              <div style={fieldStyle}>
                <span style={labelStyle}>Remarques :</span>
                <span style={{...valueStyle, fontStyle: tx.remarques ? 'normal' : 'italic', opacity: tx.remarques ? 1 : 0.7}}>
                  {tx.remarques || 'Aucune remarque'}
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
                      ✅ Distribué par {tx.distributeur?.username || 'inconnu'}
                    </div>
                    {currentUser?.role === 'admin' && (
                      <button
                        style={getButtonStyle(`annuler-${tx.id}`, 'danger')}
                        onClick={() => handleAnnulerDistribution(tx)}
                        onMouseEnter={() => setHoveredBtn(`annuler-${tx.id}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        disabled={isLoading}
                      >
                        🔄 Annuler
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
                    ✅ Distribuer
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
                      ✏️ Modifier
                    </button>
                    <button
                      style={getButtonStyle(`delete-${tx.id}`, 'danger')}
                      onClick={() => handleDelete(tx.id)}
                      onMouseEnter={() => setHoveredBtn(`delete-${tx.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      disabled={(tx.is_distribue && currentUser?.role !== 'admin') || isLoading}
                    >
                      🗑️ Supprimer
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
              ✏️ Modifier Transfert ID {editingTx.id}
            </h3>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Devise envoyée :
              </label>
              <input
                type="text"
                name="devise_envoyee"
                value={editFormData.devise_envoyee}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder="Ex: USD, EUR..."
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Montant envoyé :
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
                Pourcentage de gain (%) :
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
                Devise reçue :
              </label>
              <input
                type="text"
                name="devise_recue"
                value={editFormData.devise_recue}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder="Ex: USD, EUR..."
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Nom du bénéficiaire :
              </label>
              <input
                type="text"
                name="beneficiaire_nom"
                value={editFormData.beneficiaire_nom}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder="Nom complet du bénéficiaire"
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Numéro destinataire :
              </label>
              <input
                type="text"
                name="numero_destinataire"
                value={editFormData.numero_destinataire}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={inputStyle}
                placeholder="Numéro de téléphone ou compte"
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{
                ...labelStyle,
                display: 'block',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                Date du transfert :
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
                Remarques :
              </label>
              <textarea
                name="remarques"
                value={editFormData.remarques}
                onChange={handleEditChange}
                disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
                style={textareaStyle}
                placeholder="Remarques optionnelles..."
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
                ❌ Annuler
              </button>
              <button
                onClick={submitEdit}
                disabled={(editingTx.is_distribue && currentUser?.role !== 'admin') || isLoading}
                style={getButtonStyle('save-edit', 'success')}
                onMouseEnter={() => setHoveredBtn('save-edit')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {isLoading ? '⏳ En cours...' : '💾 Enregistrer'}
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
          Traitement en cours...
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