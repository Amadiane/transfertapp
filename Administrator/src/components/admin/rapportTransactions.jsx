import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../../config/apiConfig';

const RapportTransactions = () => {
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken');

  const fetchReport = async (selectedPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_ENDPOINTS.TRANSACTION_REPORT}?period=${selectedPeriod}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Erreur: ${res.status}`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
      setReport(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport(period);
  }, [period]);

  return (
    <div>
      <h2>Rapport des transactions</h2>
      <label>
        Période :
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="day">Jour</option>
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
      </label>

      {loading && <p>Chargement...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}

      {report && (
        <ul>
          <li>Total transactions : {report.total_transactions}</li>
          <li>Total montant envoyé : {report.total_montant_envoye}</li>
          <li>Total montant remis : {report.total_montant_remis}</li>
          <li>Total gain : {report.total_gain}</li>
        </ul>
      )}
    </div>
  );
};

export default RapportTransactions;
