import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API_ENDPOINTS from '../../config/apiConfig';

export default function ListeEmploye() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", ville: "", role: "employe" });
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRole, setSearchRole] = useState("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // Styles inspirés de RapportTransactions
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
      danger: {
        background: isHovered
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%)',
        color: '#ffffff',
      },
    };

    return {
      ...variants[variant],
      border: isHovered ? '2px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      fontWeight: '600',
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(20px)',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(102, 126, 234, 0.3)' 
        : '0 4px 15px rgba(0, 0, 0, 0.1)',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      marginRight: '0.5rem',
      willChange: 'transform, box-shadow',
    };
  }, [hoveredBtn]);

  const tableContainerStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1,
    overflow: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  };

  const thStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const editInputStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    padding: '0.5rem',
    color: '#ffffff',
    fontSize: '0.85rem',
    width: '100%',
    outline: 'none',
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

  // 🔹 Charger la liste des employés
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(API_ENDPOINTS.LIST_USERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setEmployees(data);
      } catch (e) {
        console.error("Réponse non JSON reçue:", text);
        throw new Error("La réponse du serveur n'est pas au format JSON.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer un employé
  const deleteEmployee = async (id) => {
    if (!window.confirm(t('employees.confirmDelete'))) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 204) {
        setEmployees(employees.filter((emp) => emp.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Préparer la modification
  const startEdit = (employee) => {
    setEditEmployee(employee.id);
    setFormData({
      username: employee.username,
      email: employee.email,
      ville: employee.ville,
      role: employee.role,
    });
  };

  // 🔹 Envoyer la modification
  const updateEmployee = async (id) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      const updated = await res.json();
      setEmployees(employees.map((emp) => (emp.id === id ? updated : emp)));
      setEditEmployee(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleAddEmployee = () => {
    navigate("/enregistrerEmploye");
  };

  // Filtrage intelligent des employés
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.ville.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = searchRole === 'all' || emp.role === searchRole;
    
    return matchesSearch && matchesRole;
  });

  const handleSmartSearch = () => {
    // La recherche est déjà réactive via filteredEmployees
    // Cette fonction pourrait être étendue pour des fonctionnalités avancées
    console.log("Recherche intelligente effectuée");
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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
        
        tr:hover {
          background: rgba(255, 255, 255, 0.03);
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
          
          .table-container {
            overflow-x: auto;
          }
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
          👥
        </div>
        <h1 style={headerStyle}>
          {t('employees.title')}
        </h1>
        <p style={subtitleStyle}>
          {t('employees.subtitle')}
        </p>
      </div>

      {/* Contrôles de recherche */}
      <div style={controlsContainerStyle}>
        <div style={searchContainerStyle} className="search-container">
          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '0.5rem' }}>
              {t('employees.search.name')}:
            </label>
            <input
              type="text"
              placeholder={t('employees.search.placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '0.5rem' }}>
              {t('employees.search.role')}:
            </label>
            <select 
              value={searchRole} 
              onChange={e => setSearchRole(e.target.value)}
              style={selectStyle}
            >
              <option value="all">{t('employees.roles.all')}</option>
              <option value="admin">{t('employees.roles.admin')}</option>
              <option value="employe">{t('employees.roles.employee')}</option>
            </select>
          </div>

          <button
            style={getButtonStyle('search', 'success')}
            onClick={handleSmartSearch}
            onMouseEnter={() => setHoveredBtn('search')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            🔍 {t('employees.search.button')}
          </button>

          <button
            style={getButtonStyle('add', 'primary')}
            onClick={handleAddEmployee}
            onMouseEnter={() => setHoveredBtn('add')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            ➕ {t('employees.addButton')}
          </button>
        </div>
      </div>

      {/* Tableau des employés */}
      <div style={tableContainerStyle} className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid #ffffff',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite',
              margin: '0 auto 1rem',
            }}></div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('employees.loading')}
            </p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{t('employees.table.name')}</th>
                <th style={thStyle}>{t('employees.table.email')}</th>
                <th style={thStyle}>{t('employees.table.city')}</th>
                <th style={thStyle}>{t('employees.table.role')}</th>
                <th style={thStyle}>{t('employees.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  {editEmployee === emp.id ? (
                    <>
                      <td style={tdStyle}>
                        <input
                          style={editInputStyle}
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          style={editInputStyle}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          style={editInputStyle}
                          value={formData.ville}
                          onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                        />
                      </td>
                      <td style={tdStyle}>
                        <select
                          style={editInputStyle}
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option value="admin">{t('employees.roles.admin')}</option>
                          <option value="employe">{t('employees.roles.employee')}</option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <button
                          style={getButtonStyle(`save-${emp.id}`, 'success')}
                          onClick={() => updateEmployee(emp.id)}
                          onMouseEnter={() => setHoveredBtn(`save-${emp.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                        >
                          💾 {t('employees.actions.save')}
                        </button>
                        <button
                          style={getButtonStyle(`cancel-${emp.id}`, 'warning')}
                          onClick={() => setEditEmployee(null)}
                          onMouseEnter={() => setHoveredBtn(`cancel-${emp.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                        >
                          ❌ {t('employees.actions.cancel')}
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{emp.username}</td>
                      <td style={tdStyle}>{emp.email}</td>
                      <td style={tdStyle}>{emp.ville}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: emp.role === 'admin' 
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                            : 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                        }}>
                          {emp.role === 'admin' ? t('employees.roles.admin') : t('employees.roles.employee')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          style={getButtonStyle(`edit-${emp.id}`, 'primary')}
                          onClick={() => startEdit(emp)}
                          onMouseEnter={() => setHoveredBtn(`edit-${emp.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                        >
                          ✏️ {t('employees.actions.edit')}
                        </button>
                        <button
                          style={getButtonStyle(`delete-${emp.id}`, 'danger')}
                          onClick={() => deleteEmployee(emp.id)}
                          onMouseEnter={() => setHoveredBtn(`delete-${emp.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                        >
                          🗑️ {t('employees.actions.delete')}
                        </button>
                        <button
                          style={getButtonStyle(`view-${emp.id}`, 'success')}
                          onClick={() => navigate(`/employe/${emp.id}`)}
                          onMouseEnter={() => setHoveredBtn(`view-${emp.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                        >
                          👁️ {t('employees.actions.viewDashboard')}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredEmployees.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('employees.noResults')}</h3>
            <p>{t('employees.noResultsDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}