import React, { useState } from 'react';
import API from '../../config/apiConfig'; // ajuste le chemin si besoin
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EnregistrerEmploye = () => {
  const { t } = useTranslation();
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
    if (!token) throw new Error(t('token_missing'));

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
        alert(t('session_expired'));
        navigate('/login');
        throw new Error(t('token_refresh_failed'));
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
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
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

    // Juste attendre la fin de la lecture, pas besoin de data ici
    await response.json();

    setFormData({
      username: '',
      email: '',
      password: '',
      ville: '',
      role: '',
    });

    alert(t('employee_registered_success'));
    setLoading(false);
    navigate('/listeEmploye');
  } catch (error) {
    setErrorMsg(error.message);
    setLoading(false);
  }
};

  return (
    <div className="container" style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>{t('register_new_employee')}</h2>
      {errorMsg && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder={t('username')}
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="email"
          name="email"
          placeholder={t('email')}
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          name="password"
          placeholder={t('password')}
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          name="ville"
          placeholder={t('city')}
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
          <option value="">{t('choose_role')}</option>
          <option value="admin">{t('administrator')}</option>
          <option value="employe">{t('employee')}</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? t('registering') : t('register')}
        </button>
      </form>
    </div>
  );
};

export default EnregistrerEmploye;
