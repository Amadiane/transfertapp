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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(API_ENDPOINTS.TRANSACTIONS, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirection vers la page résumé avec les données retournées
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
    <div className="send-transfert-container">
      <h2>Envoyer un Transfert</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Devise envoyée :</label>
          <select name="devise_envoyee" value={formData.devise_envoyee} onChange={handleChange} required>
            <option value="">-- Choisir --</option>
            {DEVISES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          {errors.devise_envoyee && <p className="error">{errors.devise_envoyee}</p>}
        </div>

        <div>
          <label>Montant envoyé :</label>
          <input
            type="number"
            name="montant_envoye"
            step="0.01"
            value={formData.montant_envoye}
            onChange={handleChange}
            required
          />
          {errors.montant_envoye && <p className="error">{errors.montant_envoye}</p>}
        </div>

        <div>
          <label>Pourcentage de gain (%) :</label>
          <input
            type="number"
            name="pourcentage_gain"
            step="0.01"
            value={formData.pourcentage_gain}
            onChange={handleChange}
            required
          />
          {errors.pourcentage_gain && <p className="error">{errors.pourcentage_gain}</p>}
        </div>

        <div>
          <label>Devise reçue :</label>
          <select name="devise_recue" value={formData.devise_recue} onChange={handleChange} required>
            <option value="">-- Choisir --</option>
            {DEVISES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          {errors.devise_recue && <p className="error">{errors.devise_recue}</p>}
        </div>

        <div>
          <label>Nom du bénéficiaire :</label>
          <input
            type="text"
            name="beneficiaire_nom"
            value={formData.beneficiaire_nom}
            onChange={handleChange}
            required
          />
          {errors.beneficiaire_nom && <p className="error">{errors.beneficiaire_nom}</p>}
        </div>

        <div>
          <label>Numéro du destinataire :</label>
          <input
            type="text"
            name="numero_destinataire"
            value={formData.numero_destinataire}
            onChange={handleChange}
            required
          />
          {errors.numero_destinataire && <p className="error">{errors.numero_destinataire}</p>}
        </div>

        <div>
          <label>Remarques (facultatif) :</label>
          <textarea
            name="remarques"
            value={formData.remarques}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Traitement en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default SendTransfert;
