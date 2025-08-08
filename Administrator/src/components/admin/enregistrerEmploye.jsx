// src/pages/EnregistrerEmploye.jsx

import React, { useState } from 'react';
import API from '../../config/apiConfig'; // ajuste le chemin si besoin
import { useNavigate } from 'react-router-dom';

const EnregistrerEmploye = () => {
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

  // Fonction pour rafraîchir le token
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

      console.log('Refresh token response status:', res.status);

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

  // Fonction fetch avec gestion automatique du refresh token
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
      console.log('Access token expiré, tentative de rafraîchissement');
      const newToken = await refreshToken();
      if (!newToken) {
        // Si pas possible de rafraîchir, on déconnecte
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert("Session expirée, veuillez vous reconnecter.");
        navigate('/login');
        throw new Error('Impossible de rafraîchir le token');
      }

      // Nouvelle tentative avec token rafraîchi
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetchWithRefresh(API.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de validation :", errorData);
        setErrorMsg(JSON.stringify(errorData));
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Employé enregistré :", data);

      // Optionnel : reset formulaire et/ou redirection
      setFormData({
        username: '',
        email: '',
        password: '',
        ville: '',
        role: '',
      });
      alert("Employé enregistré avec succès !");
      setLoading(false);
      navigate('/dashboard'); // (on doit créer une nouvelle page appeler liste des employés où on pourra modifier, supprimer et autres)
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>Enregistrer un nouvel employé</h2>
      {errorMsg && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          name="ville"
          placeholder="Ville"
          value={formData.ville}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '20px', padding: '8px' }}
        >
          <option value="">-- Choisir un rôle --</option>
          <option value="admin">Administrateur</option>
          <option value="employe">Employé</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
};

export default EnregistrerEmploye;
