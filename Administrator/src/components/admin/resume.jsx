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
  const [confirmAction, setConfirmAction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Styles pour les modals et confirmations
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContainerStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  };

  const confirmationStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(30px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  };

  const formGroupStyle = {
    marginBottom: '1.5rem',
  };

  const formLabelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
  };

  const formInputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.8rem 1.2rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const statusLabelStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
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
    if (confirmAction?.type === 'delete' && confirmAction?.id === id) {
      try {
        const res = await fetch(`${API_ENDPOINTS.USERS}${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 204) {
          setEmployees(employees.filter((emp) => emp.id !== id));
          setConfirmAction(null);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const employee = employees.find(emp => emp.id === id);
      setConfirmAction({
        type: 'delete',
        id: id,
        message: `${t('employees.confirmDelete')} "${employee?.username}" ?`,
        employee: employee
      });
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
    setShowEditModal(true);
  };

  // 🔹 Envoyer la modification
  const updateEmployee = async (id) => {
    if (confirmAction?.type === 'update' && confirmAction?.id === id) {
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
        setShowEditModal(false);
        setConfirmAction(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      setConfirmAction({
        type: 'update',
        id: id,
        message: t('employees.confirmUpdate'),
        employee: employees.find(emp => emp.id === id)
      });
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

  const cancelAction = () => {
    setConfirmAction(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditEmployee(null);
    setFormData({ username: "", email: "", ville: "", role: "employe" });
  };

  const renderConfirmationModal = () => {
    if (!confirmAction) return null;

    const { type, message, employee } = confirmAction;
    const isDelete = type === 'delete';

    return (
      <div style={modalOverlayStyle} onClick={cancelAction}>
        <div style={confirmationStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{
            width: '80px',
            height: '80px',
            background: isDelete 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginBottom: '1rem',
            boxShadow: isDelete 
              ? '0 20px 40px rgba(239, 68, 68, 0.3)'
              : '0 20px 40px rgba(245, 158, 11, 0.3)',
          }}>
            {isDelete ? '🗑️' : '✏️'}
          </div>
          
          <h3 style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            fontSize: '1.3rem',
            marginBottom: '1rem',
          }}>
            {isDelete ? t('employees.confirmDeleteTitle') : t('employees.confirmUpdateTitle')}
          </h3>
          
          {employee && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                {t('employees.table.name')}: <span style={{ color: '#ffffff', fontWeight: '600' }}>{employee.username}</span>
              </div>
              <div style={{ marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                {t('employees.table.email')}: <span style={{ color: '#ffffff', fontWeight: '600' }}>{employee.email}</span>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                {t('employees.table.role')}: <span style={{ 
                  color: employee.role === 'admin' ? '#f59e0b' : '#10b981', 
                  fontWeight: '600' 
                }}>
                  {employee.role === 'admin' ? t('employees.roles.admin') : t('employees.roles.employee')}
                </span>
              </div>
            </div>
          )}
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            marginBottom: '2rem',
            lineHeight: '1.5',
          }}>
            {message}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              style={{
                ...getButtonStyle(`cancel-confirm`, 'warning'),
                padding: '0.8rem 1.5rem',
              }}
              onClick={cancelAction}
              onMouseEnter={() => setHoveredBtn('cancel-confirm')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              ❌ {t('employees.actions.cancel')}
            </button>
            <button
              style={{
                ...getButtonStyle(`confirm-${type}`, isDelete ? 'danger' : 'success'),
                padding: '0.8rem 1.5rem',
              }}
              onClick={() => {
                if (type === 'delete') {
                  deleteEmployee(confirmAction.id);
                } else if (type === 'update') {
                  updateEmployee(confirmAction.id);
                }
              }}
              onMouseEnter={() => setHoveredBtn(`confirm-${type}`)}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {isDelete ? '🗑️' : '💾'} {isDelete ? t('employees.actions.delete') : t('employees.actions.save')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!showEditModal || !editEmployee) return null;

    const employee = employees.find(emp => emp.id === editEmployee);

    return (
      <div style={modalOverlayStyle} onClick={closeEditModal}>
        <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
            }}>
              ✏️
            </div>
            
            <h3 style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
              fontSize: '1.5rem',
              margin: 0,
            }}>
              {t('employees.editTitle')}
            </h3>
          </div>

          {employee && (
            <div style={{
              ...statusLabelStyle,
              background: employee.role === 'admin' 
                ? 'rgba(245, 158, 11, 0.1)' 
                : 'rgba(16, 185, 129, 0.1)',
              border: employee.role === 'admin' 
                ? '1px solid rgba(245, 158, 11, 0.2)' 
                : '1px solid rgba(16, 185, 129, 0.2)',
              color: employee.role === 'admin' ? '#f59e0b' : '#10b981',
              width: 'fit-content',
              margin: '0 auto 1.5rem',
            }}>
              {employee.role === 'admin' ? '👑' : '👤'} 
              {employee.role === 'admin' ? t('employees.roles.admin') : t('employees.roles.employee')}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <div style={formGroupStyle}>
              <label style={formLabelStyle}>
                {t('employees.table.name')}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                style={formInputStyle}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={formLabelStyle}>
                {t('employees.table.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={formInputStyle}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={formLabelStyle}>
                {t('employees.table.city')}
              </label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                style={formInputStyle}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={formLabelStyle}>
                {t('employees.table.role')}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={formInputStyle}
                required
              >
                <option value="admin">{t('employees.roles.admin')}</option>
                <option value="employe">{t('employees.roles.employee')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                style={{
                  ...getButtonStyle('modal-cancel', 'warning'),
                  flex: 1,
                  padding: '0.8rem',
                }}
                onClick={closeEditModal}
                onMouseEnter={() => setHoveredBtn('modal-cancel')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                ❌ {t('employees.actions.cancel')}
              </button>
              <button
                type="button"
                style={{
                  ...getButtonStyle('modal-save', 'success'),
                  flex: 1,
                  padding: '0.8rem',
                }}
                onClick={() => updateEmployee(editEmployee)}
                onMouseEnter={() => setHoveredBtn('modal-save')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                💾 {t('employees.actions.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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

      {/* Modals de confirmation et d'édition */}
      {renderConfirmationModal()}
      {renderEditModal()}
    </div>
  );
}