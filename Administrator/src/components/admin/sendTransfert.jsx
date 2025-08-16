import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API_ENDPOINTS from '../../config/apiConfig';


const DEVISES = [
  { value: 'USD', label: 'Dollar Américain' },
  { value: 'EUR', label: 'Euro' },
  { value: 'CAD', label: 'Dollar Canadien' },
  { value: 'SAR', label: 'Riyal Saoudien' },
  { value: 'GNF', label: 'Franc Guinéen' },
];

const SendTransfert = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    devise_envoyee: '',
    montant_envoye: '',
    pourcentage_gain: '',
    devise_recue: '',
    numero_destinataire: '',
    beneficiaire_nom: '',
    remarques: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);

  // Design ultra moderne avec thème sombre
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
    color: '#ffffff',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
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

  // Style pour le bouton retour
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
  const formContainerStyle = {
    maxWidth: '1000px',
    margin: '2rem auto',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '30px',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    position: 'relative',
    zIndex: 2,
  };

  const handleGoBack = () => {
    navigate(-1);
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

   const topBarStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const backButtonWrapper = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  zIndex: 3,
  left: i18n.language === "ar" ? "auto" : "20px",
  right: i18n.language === "ar" ? "20px" : "auto",
  
  };

  

  

  // Grille CSS responsive
  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
    alignItems: 'start',
  };

  // Style pour les groupes de champs avec hauteur uniforme
  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '120px',
  };

  const fullWidthFieldStyle = {
    ...fieldGroupStyle,
    gridColumn: '1 / -1',
    minHeight: '180px', // Augmenté pour le champ remarques
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.8rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.85rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    height: '18px',
    lineHeight: '18px',
  };

  const inputContainerStyle = {
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    height: '56px',
    padding: '0 1.5rem',
    borderRadius: '16px',
    border: focusedInput === fieldName 
      ? '2px solid #667eea' 
      : errors[fieldName] 
        ? '2px solid #ef4444'
        : '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    background: hoveredField === fieldName || focusedInput === fieldName
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.04)',
    color: '#ffffff',
    backdropFilter: 'blur(20px)',
    boxShadow: focusedInput === fieldName 
      ? '0 0 30px rgba(102, 126, 234, 0.3)' 
      : hoveredField === fieldName
        ? '0 8px 25px rgba(255, 255, 255, 0.1)'
        : '0 4px 15px rgba(0, 0, 0, 0.1)',
    transform: focusedInput === fieldName ? 'translateY(-2px)' : 'translateY(0)',
    boxSizing: 'border-box',
  });

  const selectStyle = (fieldName) => ({
    ...getInputStyle(fieldName),
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 1rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '3rem',
  });

  const textareaStyle = (fieldName) => ({
    ...getInputStyle(fieldName),
    height: '140px', // Hauteur augmentée pour un meilleur design
    resize: 'vertical',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    fontFamily: 'inherit',
    minHeight: '120px',
    maxHeight: '200px',
  });

  const errorStyle = {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    height: '24px',
    minHeight: '24px',
  };

  const getButtonStyle = (buttonType) => ({
    height: '64px',
    background: hoveredBtn === buttonType
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    border: hoveredBtn === buttonType ? '2px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: isLoading && buttonType === 'submit' ? 'not-allowed' : 'pointer',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(20px)',
    boxShadow: hoveredBtn === buttonType 
      ? '0 20px 50px rgba(102, 126, 234, 0.4)' 
      : '0 10px 30px rgba(0, 0, 0, 0.2)',
    transform: hoveredBtn === buttonType ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    position: 'relative',
    overflow: 'hidden',
    opacity: (isLoading && buttonType === 'submit') ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const buttonContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1rem',
    marginTop: '2rem',
  };

  const successIconStyle = {
    color: '#4ade80',
    fontSize: '1.2rem',
    position: 'absolute',
    right: '1.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const errorIconStyle = {
    color: '#ff6b6b',
    fontSize: '1rem',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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


  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrors({});


  



    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(API_ENDPOINTS.TRANSACTIONS, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/resume', { state: { transaction: response.data } });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error(error);
        setErrors({ general: t('send_transfer.error_general') });
      }
    } finally {
      setIsLoading(false);
    }
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

  const renderField = (fieldName, type, options = null, fullWidth = false) => {
    const hasError = errors[fieldName];
    const isFocused = focusedInput === fieldName;
    const isRequired = ['devise_envoyee', 'montant_envoye', 'pourcentage_gain', 'devise_recue', 'beneficiaire_nom', 'numero_destinataire'].includes(fieldName);
    
    const fieldStyle = fullWidth ? fullWidthFieldStyle : fieldGroupStyle;
    
    return (
      <div style={fieldStyle}>
        <label htmlFor={fieldName} style={labelStyle}>
          {t(`send_transfer.${fieldName}`)}
          {isRequired && (
            <span style={{color: '#ff6b6b', marginLeft: '4px'}}>*</span>
          )}
        </label>
        
        <div style={inputContainerStyle}>
          {type === 'select' ? (
            <select
              id={fieldName}
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleChange}
              required={isRequired}
              style={selectStyle(fieldName)}
              onFocus={() => setFocusedInput(fieldName)}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField(fieldName)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <option value="" style={{background: '#1a1a2e', color: '#fff'}}>
                {t('send_transfer.choose_option')}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value} style={{background: '#1a1a2e', color: '#fff'}}>
                  {t(`currencies.${option.value}`, option.label)}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              id={fieldName}
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleChange}
              rows={5}
              placeholder={t(`send_transfer.${fieldName}_placeholder`)}
              style={textareaStyle(fieldName)}
              onFocus={() => setFocusedInput(fieldName)}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField(fieldName)}
              onMouseLeave={() => setHoveredField(null)}
            />
          ) : (
            <input
              id={fieldName}
              type={type}
              name={fieldName}
              step={type === 'number' ? '0.01' : undefined}
              value={formData[fieldName]}
              onChange={handleChange}
              required={isRequired}
              placeholder={t(`send_transfer.${fieldName}_placeholder`)}
              style={getInputStyle(fieldName)}
              onFocus={() => setFocusedInput(fieldName)}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField(fieldName)}
              onMouseLeave={() => setHoveredField(null)}
            />
          )}
          
          {isFocused && !hasError && type !== 'textarea' && (
            <div style={successIconStyle}>
              ✓
            </div>
          )}
        </div>
        
        <div style={errorStyle}>
          {hasError && (
            <>
              <span style={errorIconStyle}>⚠</span>
              {Array.isArray(hasError) ? hasError[0] : hasError}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...backgroundOverlayStyle, display: "flex", justifyContent: i18n.language === "ar" ? "flex-end" : "flex-start" }}></div>
      {/* Bouton retour */}
    <div style={backButtonWrapper}>
    <button
    style={backButtonStyle}
    onClick={handleGoBack}
    onMouseEnter={(e) => setHoveredBtn('back')}
    onMouseLeave={() => setHoveredBtn(null)}
    >
    ← {t('buttons.back')}
    </button>
    </div>

{/* Sélecteur de langue en haut à droite */}
<div style={topBarStyle}>
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
      style={languageButtonStyle(i18n.language === 'en')}
      onClick={() => changeLanguage('en')}
    >
      EN
    </button>

    <button
      style={languageButtonStyle(i18n.language === 'ar')}
      onClick={() => changeLanguage('ar')}
    >
      AR
    </button>
  </div>
</div>


      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        input::placeholder, textarea::placeholder, select::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }
        select option {
          background: #1a1a2e;
          color: #fff;
          padding: 0.5rem;
        }
        
        /* Responsivité complète */
        @media (max-width: 1200px) {
          .form-container {
            max-width: 900px !important;
            margin: 1.5rem auto !important;
            padding: 2.5rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .form-grid { 
            grid-template-columns: 1fr !important; 
            gap: 1.25rem !important;
          }
          .form-container { 
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
          .button-container {
            grid-template-columns: 1fr !important;
            gap: 0.8rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0.5rem !important;
          }
          .form-container { 
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
          .form-grid {
            gap: 1rem !important;
          }
          .field-group {
            min-height: 110px !important;
          }
          .full-width-field {
            min-height: 160px !important;
          }
          .input-style {
            height: 50px !important;
            padding: 0 1rem !important;
            font-size: 0.95rem !important;
          }
          .textarea-style {
            height: 120px !important;
            min-height: 100px !important;
          }
          .button-style {
            height: 56px !important;
            font-size: 1rem !important;
          }
          .label-style {
            font-size: 0.8rem !important;
          }
          .badges-container {
            flex-direction: column !important;
            gap: 0.8rem !important;
            margin-top: 1.5rem !important;
          }
          .badge {
            justify-content: center !important;
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
          .form-container {
            padding: 1rem 0.8rem !important;
          }
          .header {
            font-size: 1.3rem !important;
          }
          .input-style {
            height: 48px !important;
            padding: 0 0.8rem !important;
          }
          .textarea-style {
            height: 110px !important;
          }
          .button-style {
            height: 52px !important;
            font-size: 0.95rem !important;
          }
        }
        
        /* Amélioration du responsive pour les tablets */
        @media (min-width: 481px) and (max-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem 2rem !important;
          }
          .full-width {
            grid-column: 1 / -1 !important;
          }
          .button-container {
            grid-template-columns: 1fr 2fr !important;
          }
        }
        
        /* Mode paysage mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .container {
            padding: 0.5rem !important;
          }
          .form-container {
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

      <div style={formContainerStyle} className="form-container">
        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <div className="icon-container" style={{
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
            💸
          </div>
        </div>

        <h1 style={headerStyle} className="header">
          {t('send_transfer.title')}
        </h1>
        <p style={subtitleStyle} className="subtitle">
          {t('send_transfer.subtitle')}
        </p>

        <div>
          <div style={formGridStyle} className="form-grid">
            {renderField('devise_envoyee', 'select', DEVISES)}
            {renderField('montant_envoye', 'number')}
            {renderField('pourcentage_gain', 'number')}
            {renderField('devise_recue', 'select', DEVISES)}
            {renderField('beneficiaire_nom', 'text')}
            {renderField('numero_destinataire', 'text')}
            <div className="full-width">
              {renderField('remarques', 'textarea', null, true)}
            </div>
          </div>

          <div style={buttonContainerStyle} className="button-container">
            <button
              type="button"
              style={getButtonStyle('cancel')}
              onClick={handleBack}
              onMouseEnter={() => setHoveredBtn('cancel')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{marginRight: '0.5rem'}}>←</span>
              {t('send_transfer.cancel_button')}
            </button>
            
            <button
              type="button"
              disabled={isLoading}
              style={getButtonStyle('submit')}
              className={`button-style ${hoveredBtn === 'submit' ? 'shimmer-effect' : ''}`}
              onClick={handleSubmit}
              onMouseEnter={() => setHoveredBtn('submit')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {isLoading ? (
                <>
                  <span style={{marginRight: '0.5rem', animation: 'float 1s ease-in-out infinite'}}>⏳</span>
                  {t('send_transfer.processing')}
                </>
              ) : (
                <>
                  <span style={{marginRight: '0.5rem'}}>🚀</span>
                  {t('send_transfer.send_button')}
                </>
              )}
              
              {hoveredBtn === 'submit' && (
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

        {errors.general && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '1rem',
            color: '#ff6b6b',
            textAlign: 'center',
            fontWeight: '500',
          }}>
            ⚠️ {errors.general}
          </div>
        )}

        {isLoading && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0 0 30px 30px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              animation: 'shimmer 2s infinite',
            }}></div>
          </div>
        )}

        <div className="badges-container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap',
        }}>
          <div className="badge" style={{
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
            🔒 {t('send_transfer.secure_transaction')}
          </div>
          <div className="badge" style={{
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
            ⚡ {t('send_transfer.instant_processing')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendTransfert;