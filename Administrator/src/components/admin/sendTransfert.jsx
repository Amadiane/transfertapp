import React, { useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const DEVISES = [
  { value: 'USD', label: 'Dollar Américain' },
  { value: 'EUR', label: 'Euro' },
  { value: 'CAD', label: 'Dollar Canadien' },
  { value: 'SAR', label: 'Riyal Saoudien' },
  { value: 'GNF', label: 'Franc Guinéen' },
];

const SendTransfert = () => {
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
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const navigate = useNavigate();

  const containerStyle = {
    maxWidth: 600,
    margin: '40px auto',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1f2937',
  };

  const headerStyle = {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: '2rem',
    marginBottom: 30,
    textAlign: 'center',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontWeight: '600',
    color: '#374151', // gris foncé
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 16,
    borderRadius: 6,
    border: '1.5px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 0 4px #3b82f6',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px 0',
    marginTop: 10,
    background: hoveredBtn
      ? 'linear-gradient(90deg, #2563eb, #4f46e5)'
      : 'linear-gradient(90deg, #3b82f6, #6366f1)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontWeight: '600',
    fontSize: '1.15rem',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background 0.3s ease',
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '-12px',
    marginBottom: 10,
  };

  // Handle focus style for inputs
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Envoyer un Transfert</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="devise_envoyee" style={labelStyle}>Devise envoyée :</label>
        <select
          id="devise_envoyee"
          name="devise_envoyee"
          value={formData.devise_envoyee}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === 'devise_envoyee' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('devise_envoyee')}
          onBlur={() => setFocusedInput(null)}
        >
          <option value="">-- Choisir --</option>
          {DEVISES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        {errors.devise_envoyee && <p style={errorStyle}>{errors.devise_envoyee}</p>}

        <label htmlFor="montant_envoye" style={labelStyle}>Montant envoyé :</label>
        <input
          id="montant_envoye"
          type="number"
          name="montant_envoye"
          step="0.01"
          value={formData.montant_envoye}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === 'montant_envoye' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('montant_envoye')}
          onBlur={() => setFocusedInput(null)}
        />
        {errors.montant_envoye && <p style={errorStyle}>{errors.montant_envoye}</p>}

        <label htmlFor="pourcentage_gain" style={labelStyle}>Pourcentage de gain (%) :</label>
        <input
          id="pourcentage_gain"
          type="number"
          name="pourcentage_gain"
          step="0.01"
          value={formData.pourcentage_gain}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === 'pourcentage_gain' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('pourcentage_gain')}
          onBlur={() => setFocusedInput(null)}
        />
        {errors.pourcentage_gain && <p style={errorStyle}>{errors.pourcentage_gain}</p>}

        <label htmlFor="devise_recue" style={labelStyle}>Devise reçue :</label>
        <select
          id="devise_recue"
          name="devise_recue"
          value={formData.devise_recue}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === 'devise_recue' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('devise_recue')}
          onBlur={() => setFocusedInput(null)}
        >
          <option value="">-- Choisir --</option>
          {DEVISES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        {errors.devise_recue && <p style={errorStyle}>{errors.devise_recue}</p>}

        <label htmlFor="beneficiaire_nom" style={labelStyle}>Nom du bénéficiaire :</label>
        <input
          id="beneficiaire_nom"
          type="text"
          name="beneficiaire_nom"
          value={formData.beneficiaire_nom}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === 'beneficiaire_nom' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('beneficiaire_nom')}
          onBlur={() => setFocusedInput(null)}
        />
        {errors.beneficiaire_nom && <p style={errorStyle}>{errors.beneficiaire_nom}</p>}

        <label htmlFor="numero_destinataire" style={labelStyle}>Numéro du destinataire :</label>
        <input
          id="numero_destinataire"
          type="text"
          name="numero_destinataire"
          value={formData.numero_destinataire}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            ...(focusedInput === 'numero_destinataire' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('numero_destinataire')}
          onBlur={() => setFocusedInput(null)}
        />
        {errors.numero_destinataire && <p style={errorStyle}>{errors.numero_destinataire}</p>}

        <label htmlFor="remarques" style={labelStyle}>Remarques (facultatif) :</label>
        <textarea
          id="remarques"
          name="remarques"
          value={formData.remarques}
          onChange={handleChange}
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical',
            ...(focusedInput === 'remarques' ? inputFocusStyle : {}),
          }}
          onFocus={() => setFocusedInput('remarques')}
          onBlur={() => setFocusedInput(null)}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={buttonStyle}
          onMouseEnter={() => setHoveredBtn(true)}
          onMouseLeave={() => setHoveredBtn(false)}
        >
          {isLoading ? 'Traitement en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default SendTransfert;
