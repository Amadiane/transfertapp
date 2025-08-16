import React, { useState, useEffect } from 'react';
import API from '../../config/apiConfig'; // ajuste le chemin si besoin
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EnregistrerEmploye = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    ville: '',
    role: '', // vide au départ, à choisir dans le formulaire
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Design ultra moderne avec thème sombre inspiré de SendTransfert
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

  const backButtonWrapper = {
    position: 'absolute',
    top: '1rem',
    zIndex: 3,
    left: i18n.language === "ar" ? "auto" : "20px",
    right: i18n.language === "ar" ? "20px" : "auto",
  };

  const topBarStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const formContainerStyle = {
    maxWidth: '600px',
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

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.5rem',
    minHeight: '100px',
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

  const getInputStyle = (fieldName) => ({
    width: '100%',
    height: '56px',
    padding: '0 1.5rem',
    borderRadius: '16px',
    border: focusedInput === fieldName 
      ? '2px solid #667eea' 
      : errorMsg && fieldName === 'general'
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
    cursor: loading && buttonType === 'submit' ? 'not-allowed' : 'pointer',
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
    opacity: (loading && buttonType === 'submit') ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  });

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
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

  // Style pour le dialog de confirmation
  const confirmDialogStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  };

  const confirmDialogBoxStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    color: '#fff',
    textAlign: 'center',
    minWidth: '300px',
  };

  const confirmButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  };

  const confirmButtonStyle = (type) => ({
    flex: 1,
    padding: '0.8rem',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: type === 'confirm' 
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    color: '#fff',
  });

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      console.warn('Pas de refresh token en localStorage');
      return null;
    }

    try {
      const res = await fetch(API.REFRESH_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.access);
        return data.access;
      } else {
        const errorData = await res.text();
        console.error('Erreur refresh token:', errorData);
        return null;
      }
    } catch (error) {
      console.error('Erreur rafraîchissement token', error);
      return null;
    }
  };

  const fetchWithRefresh = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');
    if (!token) throw new Error(t('register_employee.token_missing'));

    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      const newToken = await refreshToken();
      if (!newToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert(t('register_employee.session_expired'));
        navigate('/login');
        throw new Error(t('register_employee.token_refresh_failed'));
      }

      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    return res;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errorMsg) {
      setErrorMsg('');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPendingAction(() => submitForm);
    setShowConfirmDialog(true);
  };

  const submitForm = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetchWithRefresh(API.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(JSON.stringify(errorData));
        setLoading(false);
        return;
      }

      await response.json();

      setFormData({
        username: '',
        email: '',
        password: '',
        ville: '',
        role: '',
      });

      alert(t('register_employee.success_message'));
      setLoading(false);
      navigate('/listeEmploye');
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  // Gestion de la langue (RTL pour arabe, LTR sinon)
  useEffect(() => {
    if (i18n.language === "ar") {
      document.body.dir = "rtl";
      document.body.style.textAlign = "right";
    } else {
      document.body.dir = "ltr";
      document.body.style.textAlign = "left";
    }
  }, [i18n.language]);

  return (
    <div style={containerStyle}>
      <div style={backgroundOverlayStyle}></div>
      
      {/* Bouton retour */}
      <div style={backButtonWrapper}>
        <button
          style={backButtonStyle}
          onClick={handleGoBack}
          onMouseEnter={() => setHoveredBtn('back')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          ← {t('register_employee.back_button')}
        </button>
      </div>

      {/* Sélecteur de langue */}
      <div style={topBarStyle}>
        <div style={languageSelectorStyle}>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            {t('register_employee.language_select')}:
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
        
        /* Styles responsifs */
        @media (max-width: 768px) {
          .form-container { 
            max-width: 95% !important;
            margin: 1rem auto !important;
            padding: 1.5rem !important; 
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
          .back-button {
            top: 1rem !important;
            left: 1rem !important;
            width: 45px !important;
            height: 45px !important;
            font-size: 1.1rem !important;
          }
        }
        
        @media (max-width: 480px) {
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
          .button-container {
            flex-direction: column !important;
          }
        }
      `}</style>

      <div style={formContainerStyle} className="form-container">
        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
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
            👤
          </div>
        </div>

        <h1 style={headerStyle} className="header">
          {t('register_employee.title')}
        </h1>
        <p style={subtitleStyle} className="subtitle">
          {t('register_employee.subtitle')}
        </p>

        {errorMsg && (
          <div style={{
            color: '#ff6b6b',
            marginBottom: '1rem',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              {t('register_employee.username')} *
            </label>
            <input
              type="text"
              name="username"
              placeholder={t('register_employee.username_placeholder')}
              value={formData.username}
              onChange={handleChange}
              required
              style={getInputStyle('username')}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField('username')}
              onMouseLeave={() => setHoveredField(null)}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              {t('register_employee.email')} *
            </label>
            <input
              type="email"
              name="email"
              placeholder={t('register_employee.email_placeholder')}
              value={formData.email}
              onChange={handleChange}
              required
              style={getInputStyle('email')}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField('email')}
              onMouseLeave={() => setHoveredField(null)}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              {t('register_employee.password')} *
            </label>
            <input
              type="password"
              name="password"
              placeholder={t('register_employee.password_placeholder')}
              value={formData.password}
              onChange={handleChange}
              required
              style={getInputStyle('password')}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField('password')}
              onMouseLeave={() => setHoveredField(null)}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              {t('register_employee.city')}
            </label>
            <input
              type="text"
              name="ville"
              placeholder={t('register_employee.city_placeholder')}
              value={formData.ville}
              onChange={handleChange}
              style={getInputStyle('ville')}
              onFocus={() => setFocusedInput('ville')}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField('ville')}
              onMouseLeave={() => setHoveredField(null)}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              {t('register_employee.role')} *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={selectStyle('role')}
              onFocus={() => setFocusedInput('role')}
              onBlur={() => setFocusedInput(null)}
              onMouseEnter={() => setHoveredField('role')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <option value="" style={{background: '#1a1a2e', color: '#fff'}}>
                {t('register_employee.choose_role')}
              </option>
              <option value="admin" style={{background: '#1a1a2e', color: '#fff'}}>
                {t('register_employee.administrator')}
              </option>
              <option value="employe" style={{background: '#1a1a2e', color: '#fff'}}>
                {t('register_employee.employee')}
              </option>
            </select>
          </div>

          <div style={buttonContainerStyle} className="button-container">
            <button
              type="button"
              style={getButtonStyle('cancel')}
              onClick={handleGoBack}
              onMouseEnter={() => setHoveredBtn('cancel')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{marginRight: '0.5rem'}}>←</span>
              {t('register_employee.cancel_button')}
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={getButtonStyle('submit')}
              className={hoveredBtn === 'submit' ? 'shimmer-effect' : ''}
              onMouseEnter={() => setHoveredBtn('submit')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {loading ? (
                <>
                  <span style={{marginRight: '0.5rem', animation: 'float 1s ease-in-out infinite'}}>⏳</span>
                  {t('register_employee.registering')}
                </>
              ) : (
                <>
                  <span style={{marginRight: '0.5rem'}}>✅</span>
                  {t('register_employee.register_button')}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Badges informatifs */}
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
            🔒 {t('register_employee.secure_registration')}
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
            ⚡ {t('register_employee.instant_access')}
          </div>
        </div>

        {/* Barre de progression pendant le chargement */}
        {loading && (
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
      </div>

      {/* Dialog de confirmation */}
      {showConfirmDialog && (
        <div style={confirmDialogStyle}>
          <div style={confirmDialogBoxStyle}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
              {t('register_employee.confirm_title')}
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
              {t('register_employee.confirm_message')}
            </p>
            <div style={confirmButtonsStyle}>
              <button
                style={confirmButtonStyle('cancel')}
                onClick={handleCancel}
              >
                {t('register_employee.confirm_cancel')}
              </button>
              <button
                style={confirmButtonStyle('confirm')}
                onClick={handleConfirm}
              >
                {t('register_employee.confirm_register')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnregistrerEmploye;