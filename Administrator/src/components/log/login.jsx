import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../config/apiConfig";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setError("Identifiants invalides");
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
        throw new Error("Échec de la récupération des données utilisateur.");
      }

      const userData = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Redirection selon le rôle
      if (userData.role === "admin") {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboardUser");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-160px',
        right: '-160px',
        width: '320px',
        height: '320px',
        background: 'rgba(59, 130, 246, 0.2)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-160px',
        left: '-160px',
        width: '320px',
        height: '320px',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '448px'
      }}>
        {/* Login Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              margin: '0 auto 16px',
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={32} color="white" />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 8px 0'
            }}>Connexion</h1>
            <p style={{
              color: '#6b7280',
              margin: 0
            }}>Accédez à votre espace personnel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'shake 0.5s ease-in-out'
            }}>
              <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
              <p style={{ color: '#b91c1c', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Username Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="username" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Nom d'utilisateur
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <User size={20} color="#9ca3af" />
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="password" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <Lock size={20} color="#9ca3af" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '48px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500',
                fontSize: '16px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                background: isLoading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                transition: 'all 0.2s',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'linear-gradient(135deg, #2563eb, #4f46e5)';
                  e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'linear-gradient(135deg, #3b82f6, #6366f1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Mot de passe oublié ?{' '}
              <button style={{
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                textDecoration: 'underline'
              }}>
                Récupérer
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            © 2025 Votre Entreprise. Tous droits réservés.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (max-width: 640px) {
            .login-card {
              margin: 16px;
              padding: 24px;
            }
          }
        `
      }} />
    </div>
  );
};

export default Login;