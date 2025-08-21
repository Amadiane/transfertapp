import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import API from "../../config/apiConfig";

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  const loginCardStyle = {
    maxWidth: '450px',
    width: '100%',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '30px',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '3rem 2.5rem',
    position: 'relative',
    zIndex: 2,
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '2.2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
    fontWeight: '300',
  };

  const topBarStyle = {
    position: 'absolute',
    top: '1.5rem',
    right: i18n.language === "ar" ? "auto" : "1.5rem",
    left: i18n.language === "ar" ? "1.5rem" : "auto",
    zIndex: 3,
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

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.8rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.85rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    height: '56px',
    padding: '0 1.5rem',
    paddingLeft: '3.5rem',
    paddingRight: fieldName === 'password' ? '3.5rem' : '1.5rem',
    borderRadius: '16px',
    border: focusedInput === fieldName 
      ? '2px solid #667eea' 
      : error && fieldName === 'username'
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

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    position: 'absolute',
    left: '1.2rem',
    color: 'rgba(255, 255, 255, 0.6)',
    zIndex: 2,
    pointerEvents: 'none',
  };

  const eyeIconStyle = {
    position: 'absolute',
    right: '1.2rem',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    zIndex: 2,
  };

  const getButtonStyle = (buttonType) => ({
    width: '100%',
    height: '56px',
    background: hoveredBtn === buttonType
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    border: hoveredBtn === buttonType ? '2px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(20px)',
    boxShadow: hoveredBtn === buttonType 
      ? '0 20px 50px rgba(102, 126, 234, 0.4)' 
      : '0 10px 30px rgba(0, 0, 0, 0.2)',
    transform: hoveredBtn === buttonType ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    position: 'relative',
    overflow: 'hidden',
    opacity: isLoading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1rem',
  });

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1.5rem',
    color: '#ff6b6b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '500',
    fontSize: '0.9rem',
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 🔐 Requête d'authentification
      const response = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError(t('login.invalid_credentials'));
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // 💾 Stocker access et refresh token localement
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // 📥 Récupération des infos utilisateur
      const userResponse = await fetch(API.GET_USER_DATA, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access}`,
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
        throw new Error(t('login.user_data_error'));
      }

      const userData = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", userData.role);

      // ✅ Redirection selon le rôle
      if (userData.role === "admin") {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboardEmploye");
      }
    } catch (err) {
      setError(err.message || t('login.connection_error'));
    } finally {
      setIsLoading(false);
    }
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

      {/* Sélecteur de langue */}
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
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
        
        /* Responsivité */
        @media (max-width: 768px) {
          .login-card {
            max-width: 95% !important;
            margin: 1rem auto !important;
            padding: 2rem 1.5rem !important;
            border-radius: 25px !important;
          }
          .header {
            font-size: 1.8rem !important;
          }
          .top-bar {
            top: 1rem !important;
            right: 1rem !important;
            left: auto !important;
          }
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem 1rem !important;
            border-radius: 20px !important;
          }
          .header {
            font-size: 1.5rem !important;
          }
          .subtitle {
            font-size: 0.9rem !important;
          }
          .input-style {
            height: 50px !important;
            padding: 0 1rem !important;
            padding-left: 3rem !important;
          }
          .button-style {
            height: 50px !important;
            font-size: 1rem !important;
          }
        }
      `}</style>

      <div style={loginCardStyle} className="login-card">
        {/* Icon Container */}
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
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
            🔐
          </div>
        </div>

        {/* Header */}
        <h1 style={headerStyle} className="header">
          {t('login.title')}
        </h1>
        <p style={subtitleStyle} className="subtitle">
          {t('login.subtitle')}
        </p>

        {/* Error Message */}
        {error && (
          <div style={errorStyle}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div style={fieldGroupStyle}>
            <label htmlFor="username" style={labelStyle}>
              {t('login.username')} <span style={{color: '#ff6b6b'}}>*</span>
            </label>
            <div style={inputContainerStyle}>
              <User size={20} style={iconStyle} />
              <input
                id="username"
                type="text"
                name="username"
                placeholder={t('login.username_placeholder')}
                value={formData.username}
                onChange={handleChange}
                required
                style={getInputStyle('username')}
                className="input-style"
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                onMouseEnter={() => setHoveredField('username')}
                onMouseLeave={() => setHoveredField(null)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={fieldGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              {t('login.password')} <span style={{color: '#ff6b6b'}}>*</span>
            </label>
            <div style={inputContainerStyle}>
              <Lock size={20} style={iconStyle} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('login.password_placeholder')}
                value={formData.password}
                onChange={handleChange}
                required
                style={getInputStyle('password')}
                className="input-style"
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                onMouseEnter={() => setHoveredField('password')}
                onMouseLeave={() => setHoveredField(null)}
              />
              <div
                style={eyeIconStyle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => e.target.style.color = '#667eea'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={getButtonStyle('submit')}
            className={`button-style ${hoveredBtn === 'submit' ? 'shimmer-effect' : ''}`}
            onMouseEnter={() => setHoveredBtn('submit')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                {t('login.loading')}
              </div>
            ) : (
              <>
                <span style={{marginRight: '0.5rem'}}>🚀</span>
                {t('login.submit_button')}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            style={{
              color: '#667eea',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              textDecoration: 'underline',
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}
          >
            {t('login.forgot_password')}
          </button>
        </div>

        {/* Loading Progress Bar */}
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

        {/* Security Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.5rem',
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
            🔒 {t('login.secure_connection')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



// import React, { useState } from "react";
// import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import API from "../../config/apiConfig";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       // 🔐 Requête d'authentification
//       const response = await fetch(API.LOGIN, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         setError("Identifiants invalides");
//         setIsLoading(false);
//         return;
//       }

//       const data = await response.json();

//       // 💾 Stocker access et refresh token localement
//       localStorage.setItem("accessToken", data.access);
//       localStorage.setItem("refreshToken", data.refresh);

//       // 📥 Récupération des infos utilisateur
//       const userResponse = await fetch(API.GET_USER_DATA, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${data.access}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!userResponse.ok) {
//         throw new Error("Échec de la récupération des données utilisateur.");
//       }

//       const userData = await userResponse.json();
//       localStorage.setItem("user", JSON.stringify(userData));
//       localStorage.setItem("userRole", userData.role);


//       // ✅ Redirection selon le rôle
//       if (userData.role === "admin") {
//         navigate("/dashboardAdmin");
//       } else {
//         navigate("/dashboardEmploye");
//       }
//     } catch (err) {
//       setError(err.message || "Erreur lors de la connexion");
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '16px',
//       position: 'relative',
//       overflow: 'hidden'
//     }}>
//       {/* Background decoration */}
//       <div style={{
//         position: 'absolute',
//         top: '-160px',
//         right: '-160px',
//         width: '320px',
//         height: '320px',
//         background: 'rgba(59, 130, 246, 0.2)',
//         borderRadius: '50%',
//         filter: 'blur(60px)',
//         pointerEvents: 'none'
//       }}></div>
//       <div style={{
//         position: 'absolute',
//         bottom: '-160px',
//         left: '-160px',
//         width: '320px',
//         height: '320px',
//         background: 'rgba(99, 102, 241, 0.2)',
//         borderRadius: '50%',
//         filter: 'blur(60px)',
//         pointerEvents: 'none'
//       }}></div>

//       <div style={{
//         position: 'relative',
//         width: '100%',
//         maxWidth: '448px'
//       }}>
//         {/* Login Card */}
//         <div style={{
//           background: 'rgba(255, 255, 255, 0.8)',
//           backdropFilter: 'blur(8px)',
//           borderRadius: '16px',
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//           padding: '32px'
//         }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//             <div style={{
//               margin: '0 auto 16px',
//               width: '64px',
//               height: '64px',
//               background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}>
//               <Lock size={32} color="white" />
//             </div>
//             <h1 style={{
//               fontSize: '24px',
//               fontWeight: 'bold',
//               color: '#111827',
//               margin: '0 0 8px 0'
//             }}>Connexion</h1>
//             <p style={{
//               color: '#6b7280',
//               margin: 0
//             }}>Accédez à votre espace personnel</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div style={{
//               marginBottom: '24px',
//               padding: '16px',
//               background: '#fef2f2',
//               border: '1px solid #fecaca',
//               borderRadius: '8px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               animation: 'shake 0.5s ease-in-out'
//             }}>
//               <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
//               <p style={{ color: '#b91c1c', fontSize: '14px', margin: 0 }}>{error}</p>
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//             {/* Username Field */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               <label htmlFor="username" style={{
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: '#374151'
//               }}>
//                 Nom d'utilisateur
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   left: '12px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none'
//                 }}>
//                   <User size={20} color="#9ca3af" />
//                 </div>
//                 <input
//                   id="username"
//                   type="text"
//                   name="username"
//                   placeholder="Entrez votre nom d'utilisateur"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     paddingLeft: '40px',
//                     paddingRight: '16px',
//                     paddingTop: '12px',
//                     paddingBottom: '12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '8px',
//                     background: 'rgba(255, 255, 255, 0.5)',
//                     backdropFilter: 'blur(4px)',
//                     fontSize: '16px',
//                     transition: 'all 0.2s',
//                     outline: 'none',
//                     boxSizing: 'border-box'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.boxShadow = '0 0 0 2px #3b82f6';
//                     e.target.style.borderColor = 'transparent';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.boxShadow = 'none';
//                     e.target.style.borderColor = '#d1d5db';
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               <label htmlFor="password" style={{
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: '#374151'
//               }}>
//                 Mot de passe
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <div style={{
//                   position: 'absolute',
//                   left: '12px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   pointerEvents: 'none'
//                 }}>
//                   <Lock size={20} color="#9ca3af" />
//                 </div>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Entrez votre mot de passe"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     paddingLeft: '40px',
//                     paddingRight: '48px',
//                     paddingTop: '12px',
//                     paddingBottom: '12px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '8px',
//                     background: 'rgba(255, 255, 255, 0.5)',
//                     backdropFilter: 'blur(4px)',
//                     fontSize: '16px',
//                     transition: 'all 0.2s',
//                     outline: 'none',
//                     boxSizing: 'border-box'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.boxShadow = '0 0 0 2px #3b82f6';
//                     e.target.style.borderColor = 'transparent';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.boxShadow = 'none';
//                     e.target.style.borderColor = '#d1d5db';
//                   }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     color: '#9ca3af',
//                     transition: 'color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
//                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               style={{
//                 width: '100%',
//                 padding: '12px 16px',
//                 borderRadius: '8px',
//                 color: 'white',
//                 fontWeight: '500',
//                 fontSize: '16px',
//                 border: 'none',
//                 cursor: isLoading ? 'not-allowed' : 'pointer',
//                 background: isLoading 
//                   ? '#9ca3af' 
//                   : 'linear-gradient(135deg, #3b82f6, #6366f1)',
//                 transition: 'all 0.2s',
//                 transform: 'translateY(0)',
//                 boxShadow: 'none'
//               }}
//               onMouseEnter={(e) => {
//                 if (!isLoading) {
//                   e.target.style.background = 'linear-gradient(135deg, #2563eb, #4f46e5)';
//                   e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
//                   e.target.style.transform = 'translateY(-2px)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isLoading) {
//                   e.target.style.background = 'linear-gradient(135deg, #3b82f6, #6366f1)';
//                   e.target.style.boxShadow = 'none';
//                   e.target.style.transform = 'translateY(0)';
//                 }
//               }}
//             >
//               {isLoading ? (
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                   <div style={{
//                     width: '16px',
//                     height: '16px',
//                     border: '2px solid white',
//                     borderTop: '2px solid transparent',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite'
//                   }}></div>
//                   <span>Connexion en cours...</span>
//                 </div>
//               ) : (
//                 "Se connecter"
//               )}
//             </button>
//           </form>

//           {/* Footer */}
//           <div style={{ marginTop: '32px', textAlign: 'center' }}>
//             <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
//               Mot de passe oublié ?{' '}
//               <button style={{
//                 color: '#3b82f6',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 fontWeight: '500',
//                 textDecoration: 'underline'
//               }}>
//                 Récupérer
//               </button>
//             </p>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div style={{ marginTop: '24px', textAlign: 'center' }}>
//           <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
//             © 2025 Votre Entreprise. Tous droits réservés.
//           </p>
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{
//         __html: `
//           @keyframes shake {
//             0%, 100% { transform: translateX(0); }
//             10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
//             20%, 40%, 60%, 80% { transform: translateX(2px); }
//           }
//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           @media (max-width: 640px) {
//             .login-card {
//               margin: 16px;
//               padding: 24px;
//             }
//           }
//         `
//       }} />
//     </div>
//   );
// };

// export default Login;