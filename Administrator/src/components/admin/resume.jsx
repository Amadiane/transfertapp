import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Resume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Design ultra moderne avec thème sombre identique à SendTransfert
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
    color: '#ffffff',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'auto',
    padding: '1rem',
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

  // Style pour le bouton retour
  const backButtonStyle = {
    position: 'fixed',
    top: '2rem',
    left: '2rem',
    width: '50px',
    height: '50px',
    background: hoveredBtn === 'back'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1.2rem',
    zIndex: 1000,
    boxShadow: hoveredBtn === 'back' 
      ? '0 15px 35px rgba(102, 126, 234, 0.3)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)',
    transform: hoveredBtn === 'back' ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
    willChange: 'transform, box-shadow',
  };

  const resumeContainerStyle = {
    maxWidth: '1000px',
    margin: '2rem auto',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '30px',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '2rem',
    fontWeight: '300',
  };

  const transactionGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const getCardStyle = useCallback((cardId, isSpecial = false, isDate = false) => {
    const isHovered = hoveredCard === cardId;
    
    let baseStyle = {
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.5rem',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      willChange: 'transform, box-shadow',
      backfaceVisibility: 'hidden',
      transform: 'translateZ(0)',
    };

    if (isSpecial) {
      baseStyle = {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        gridColumn: '1 / -1',
      };
    }

    if (isDate) {
      baseStyle = {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        textAlign: 'center',
        gridColumn: '1 / -1',
      };
    }

    if (isHovered) {
      baseStyle = {
        ...baseStyle,
        transform: 'translateY(-2px) translateZ(0)',
        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
      };
    }

    return baseStyle;
  }, [hoveredCard]);

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const valueStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const buttonStyle = {
    width: '100%',
    height: '64px',
    background: hoveredBtn === 'home'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    border: hoveredBtn === 'home' ? '2px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
    boxShadow: hoveredBtn === 'home' 
      ? '0 20px 50px rgba(102, 126, 234, 0.4)' 
      : '0 10px 30px rgba(0, 0, 0, 0.2)',
    transform: hoveredBtn === 'home' ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem',
    willChange: 'transform, box-shadow',
  };

  const noTransactionStyle = {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
  };

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    navigate('/dashboardAdmin');
  }, [navigate]);

  const handleCardHover = useCallback((cardId) => {
    setHoveredCard(cardId);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  const renderTransactionField = useCallback((label, value, isSpecial = false, isDate = false, cardId) => {
    return (
      <div
        style={getCardStyle(cardId, isSpecial, isDate)}
        onMouseEnter={() => handleCardHover(cardId)}
        onMouseLeave={handleCardLeave}
        className={isSpecial ? 'special-card' : isDate ? 'date-card' : ''}
      >
        <span style={labelStyle}>{label}</span>
        <div style={valueStyle}>{value}</div>
      </div>
    );
  }, [getCardStyle, handleCardHover, handleCardLeave]);

  if (!transaction) {
    return (
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        
        <button
          style={backButtonStyle}
          onClick={handleBack}
          onMouseEnter={() => setHoveredBtn('back')}
          onMouseLeave={() => setHoveredBtn(null)}
          title="Retour"
        >
          ←
        </button>

        <div style={resumeContainerStyle}>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem',
              boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)',
            }}>
              ❌
            </div>
          </div>
          
          <div style={noTransactionStyle}>
            <h2 style={{...headerStyle, marginBottom: '1rem'}}>
              Aucune Transaction
            </h2>
            <p style={{margin: '0', fontSize: '1rem', fontWeight: '500'}}>
              Aucune transaction à afficher. Veuillez effectuer un transfert d'abord.
            </p>
          </div>

          <button
            style={buttonStyle}
            onClick={handleGoHome}
            onMouseEnter={() => setHoveredBtn('home')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <span style={{marginRight: '0.5rem'}}>🏠</span>
            Retour au Dashboard Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={backgroundOverlayStyle}></div>
      
      <button
        style={backButtonStyle}
        onClick={handleBack}
        onMouseEnter={() => setHoveredBtn('back')}
        onMouseLeave={() => setHoveredBtn(null)}
        title="Retour"
      >
        ←
      </button>

      <style>{`
        * {
          box-sizing: border-box;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1s ease-in-out;
        }
        
        /* Optimisation pour les performances */
        .resume-container,
        .transaction-grid,
        .special-card,
        .date-card {
          will-change: auto;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Responsivité complète */
        @media (max-width: 1200px) {
          .resume-container {
            max-width: 900px !important;
            margin: 1.5rem auto !important;
            padding: 2.5rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .transaction-grid { 
            grid-template-columns: 1fr !important; 
            gap: 1.25rem !important;
          }
          .resume-container { 
            max-width: 95% !important;
            margin: 1rem auto !important;
            padding: 2rem 1.5rem !important; 
            border-radius: 25px !important;
          }
          .header { 
            font-size: 1.8rem !important; 
            margin-bottom: 0.8rem !important;
          }
          .subtitle { 
            font-size: 0.95rem !important; 
            margin-bottom: 1.5rem !important;
          }
          .icon-container {
            width: 60px !important;
            height: 60px !important;
            font-size: 1.5rem !important;
            margin-bottom: 0.8rem !important;
          }
          .back-button {
            top: 1rem !important;
            left: 1rem !important;
            width: 45px !important;
            height: 45px !important;
            font-size: 1.1rem !important;
          }
          .special-card,
          .date-card {
            grid-column: 1 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0.5rem !important;
          }
          .resume-container { 
            max-width: 100% !important;
            margin: 0.5rem auto !important;
            padding: 1.5rem 1rem !important; 
            border-radius: 20px !important;
          }
          .header { 
            font-size: 1.5rem !important; 
            line-height: 1.3 !important;
          }
          .subtitle { 
            font-size: 0.9rem !important; 
          }
          .transaction-grid {
            gap: 1rem !important;
          }
          .card {
            padding: 1.25rem !important;
          }
          .button-style {
            height: 56px !important;
            font-size: 1rem !important;
            margin-top: 1.5rem !important;
          }
          .back-button {
            top: 0.8rem !important;
            left: 0.8rem !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 1rem !important;
          }
        }
        
        @media (max-width: 360px) {
          .resume-container {
            padding: 1rem 0.8rem !important;
          }
          .header {
            font-size: 1.3rem !important;
          }
          .card {
            padding: 1rem !important;
          }
          .button-style {
            height: 52px !important;
            font-size: 0.95rem !important;
          }
        }
        
        /* Amélioration du responsive pour les tablets */
        @media (min-width: 481px) and (max-width: 768px) {
          .transaction-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem 2rem !important;
          }
          .special-card,
          .date-card {
            grid-column: 1 / -1 !important;
          }
        }
        
        /* Mode paysage mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .container {
            padding: 0.5rem !important;
          }
          .resume-container {
            margin: 0.5rem auto !important;
            padding: 1.5rem !important;
          }
          .header {
            font-size: 1.4rem !important;
            margin-bottom: 0.5rem !important;
          }
          .subtitle {
            margin-bottom: 1rem !important;
          }
          .icon-container {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 0.5rem !important;
          }
          .back-button {
            top: 0.5rem !important;
            left: 0.5rem !important;
          }
        }
      `}</style>

      <div style={resumeContainerStyle} className="resume-container">
        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <div className="icon-container" style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginBottom: '1rem',
            animation: 'float 3s ease-in-out infinite',
            boxShadow: '0 20px 40px rgba(52, 211, 153, 0.3)',
          }}>
            ✅
          </div>
        </div>

        <h1 style={headerStyle} className="header">
          Résumé du Transfert
        </h1>
        <p style={subtitleStyle} className="subtitle">
          Transaction effectuée avec succès
        </p>

        <div style={transactionGridStyle} className="transaction-grid">
          {renderTransactionField(
            'Devise envoyée',
            transaction.devise_envoyee,
            false,
            false,
            'devise-envoyee'
          )}
          
          {renderTransactionField(
            'Montant envoyé',
            `${transaction.montant_envoye} ${transaction.devise_envoyee}`,
            false,
            false,
            'montant-envoye'
          )}
          
          {renderTransactionField(
            'Pourcentage de gain',
            `${transaction.pourcentage_gain}%`,
            false,
            false,
            'pourcentage-gain'
          )}
          
          {renderTransactionField(
            'Devise reçue',
            transaction.devise_recue,
            false,
            false,
            'devise-recue'
          )}
          
          {renderTransactionField(
            'Nom du bénéficiaire',
            transaction.beneficiaire_nom,
            false,
            false,
            'beneficiaire-nom'
          )}
          
          {renderTransactionField(
            'Numéro destinataire',
            transaction.numero_destinataire,
            false,
            false,
            'numero-destinataire'
          )}
          
          {renderTransactionField(
            'Montant converti',
            `${transaction.montant_converti} ${transaction.devise_recue}`,
            true,
            false,
            'montant-converti'
          )}
          
          {renderTransactionField(
            'Gain du transfert',
            `${transaction.gain_transfert} ${transaction.devise_recue}`,
            true,
            false,
            'gain-transfert'
          )}
          
          {renderTransactionField(
            'Montant remis au client',
            `${transaction.montant_remis} ${transaction.devise_recue}`,
            true,
            false,
            'montant-remis'
          )}
          
          {transaction.remarques && renderTransactionField(
            'Remarques',
            transaction.remarques,
            true,
            false,
            'remarques'
          )}
          
          {renderTransactionField(
            'Date du transfert',
            new Date(transaction.date_transfert).toLocaleString('fr-FR', {
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            false,
            true,
            'date-transfert'
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            color: '#4ade80',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            ✅ Transaction validée
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            🔒 Sécurisé
          </div>
        </div>

        <button
          style={buttonStyle}
          className="button-style"
          onClick={handleGoHome}
          onMouseEnter={() => setHoveredBtn('home')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <span style={{marginRight: '0.5rem'}}>🏠</span>
          Retour au Dashboard Admin
          
          {hoveredBtn === 'home' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 1s ease-in-out',
            }}></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Resume;