// src/pages/Logout.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apiConfig';

const Logout = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Récupérer le refresh token stocké en localStorage
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          // Si pas de refresh token, on redirige directement vers la page login
          navigate('/login');
          return;
        }

        // Faire la requête POST vers l'endpoint logout avec le refresh token dans le body
        const response = await fetch(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization généralement non nécessaire ici car c'est la blacklist du refresh token
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.status === 205 || response.status === 200) {
          // Déconnexion OK, on nettoie localStorage et redirige vers login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          const data = await response.json();
          setError(data.detail || 'Erreur lors de la déconnexion');
        }
      } catch (err) {
        setError('Erreur réseau ou serveur');
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Déconnexion...</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && <p>Merci de patienter...</p>}
    </div>
  );
};

export default Logout;
