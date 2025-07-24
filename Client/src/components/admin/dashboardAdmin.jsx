import React, { useState, useEffect } from 'react';
import API from '../config/apiConfig';

const DashboardAdmin = () => {
  const storedUser = localStorage.getItem('user');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [employees, setEmployees] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [matches, setMatches] = useState([]);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return null;
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
      }
    } catch (error) {
      console.error('Erreur rafraîchissement token', error);
    }
    return null;
  };

  const fetchWithRefresh = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token manquant');

    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      const newToken = await refreshToken();
      if (!newToken) throw new Error('Impossible de rafraîchir le token');

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

  const fetchClubs = async () => {
    try {
      const res = await fetchWithRefresh(API.CLUBS);
      if (res.ok) {
        const data = await res.json();
        setClubs(data);
      }
    } catch (err) {
      console.error('Erreur fetch clubs:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetchWithRefresh(API.GET_EMPLOYEES);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Erreur fetch employés:', err);
    }
  };

  const fetchStadiums = async () => {
    try {
      const res = await fetchWithRefresh(API.STADIUMS);
      if (res.ok) {
        const data = await res.json();
        setStadiums(data);
      }
    } catch (err) {
      console.error('Erreur fetch stades:', err);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetchWithRefresh(API.MATCHES);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Erreur fetch matchs:', err);
    }
  };

  useEffect(() => {
    if (activeSection === 'clubs') fetchClubs();
    if (activeSection === 'employees' && user?.role === 'admin') fetchEmployees();
    if (activeSection === 'stadiums') fetchStadiums();
    if (activeSection === 'matches') {
      fetchClubs();
      fetchStadiums();
      fetchMatches();
    }
  }, [activeSection, user]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    // Redirection vers la page de connexion
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
    { id: 'matches', label: 'Matchs', icon: '⚽' },
    { id: 'clubs', label: 'Clubs', icon: '🏆' },
    { id: 'stadiums', label: 'Stades', icon: '🏟️' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'employees', label: 'Employés', icon: '👥' });
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px', marginRight: '10px' }}>⚽</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{matches.length}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Matchs</p>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px', marginRight: '10px' }}>🏆</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{clubs.length}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Clubs</p>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px', marginRight: '10px' }}>🏟️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stadiums.length}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Stades</p>
                  </div>
                </div>
              </div>

              {user?.role === 'admin' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>👥</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{employees.length}</h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Employés</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Bienvenue dans le système de gestion</h3>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Gérez efficacement les événements du championnat national de la Fédération Guinéenne de Football.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Gestion des Matchs</h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Planifiez et gérez les matchs du championnat national</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Clubs & Stades</h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Administrez les clubs participants et les infrastructures</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'employees':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Gestion des Employés</h2>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <AddEmployee onEmployeeAdded={fetchEmployees} />
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <ListEmployee employees={employees} />
            </div>
          </div>
        );

      case 'clubs':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Gestion des Clubs</h2>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <ClubList clubs={clubs} />
            </div>
            {user?.role === 'admin' && (
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <AddClub token={localStorage.getItem('accessToken')} onClubAdded={fetchClubs} />
              </div>
            )}
          </div>
        );

      case 'stadiums':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Gestion des Stades</h2>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <StadiumLists stadiums={stadiums} />
            </div>
            {user?.role === 'admin' && (
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <AddStadiums onStadiumAdded={fetchStadiums} />
              </div>
            )}
          </div>
        );

      case 'matches':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Gestion des Matchs</h2>
              <button
                onClick={() => setShowAddMatchForm(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {showAddMatchForm ? '❌ Masquer le formulaire' : '➕ Ajouter un match'}
              </button>
            </div>

            {showAddMatchForm && (
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                <AddMatch
                  onMatchAdded={() => {
                    fetchMatches();
                    setShowAddMatchForm(false);
                  }}
                  clubs={clubs}
                  stadiums={stadiums}
                  createdBy={user?.id}
                />
              </div>
            )}

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <MatchList
                matches={matches}
                token={localStorage.getItem('accessToken')}
                onMatchDeleted={fetchMatches}
                onSelectMatch={setSelectedMatchId}
                onStatusChange={fetchMatches}
              />
            </div>

            {selectedMatchId && (
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <PutMatch
                  selectedMatchId={selectedMatchId}
                  clubs={clubs}
                  stadiums={stadiums}
                  onMatchUpdated={() => {
                    fetchMatches();
                    setSelectedMatchId(null);
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 40, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: window.innerWidth < 1024 ? 'block' : 'none'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '256px',
        backgroundColor: 'white',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        transform: sidebarOpen || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', padding: '0 16px', backgroundColor: '#059669', color: 'white' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>FGF Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              display: window.innerWidth < 1024 ? 'block' : 'none',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            ❌
          </button>
        </div>

        <nav style={{ marginTop: '32px', padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeSection === item.id ? '#d1fae5' : 'transparent',
                  color: activeSection === item.id ? '#065f46' : '#374151'
                }}
              >
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>👤</span>
            </div>
            <div style={{ marginLeft: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>{user?.username}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#dc2626',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <span style={{ marginRight: '12px' }}>🚪</span>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: window.innerWidth >= 1024 ? '256px' : '0' }}>
        {/* Top bar */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ padding: '0 16px 0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    display: window.innerWidth < 1024 ? 'block' : 'none',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginRight: '16px'
                  }}
                >
                  ☰
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Fédération Guinéenne de Football
                </h1>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Championnat National 2024-2025
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;