import React from 'react';
import { useLocation } from 'react-router-dom';

const Resume = () => {
  const location = useLocation();
  const transaction = location.state?.transaction;

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
    color: '#6366f1',
    fontWeight: '600',
  };

  const paragraphStyle = {
    fontSize: '1rem',
    marginBottom: 14,
    lineHeight: 1.5,
  };

  if (!transaction) {
    return (
      <div style={containerStyle}>
        <p style={{ textAlign: 'center', color: '#dc2626', fontWeight: '600' }}>
          Aucune transaction à afficher.
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Résumé du Transfert</h2>

      <p style={paragraphStyle}>
        <span style={labelStyle}>Devise envoyée :</span> {transaction.devise_envoyee}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Montant envoyé :</span> {transaction.montant_envoye} {transaction.devise_envoyee}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Pourcentage de gain :</span> {transaction.pourcentage_gain} %
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Devise reçue :</span> {transaction.devise_recue}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Nom du bénéficiaire :</span> {transaction.beneficiaire_nom}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Montant converti :</span> {transaction.montant_converti} {transaction.devise_recue}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Gain du transfert :</span> {transaction.gain_transfert} {transaction.devise_recue}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Numéro destinataire :</span> {transaction.numero_destinataire}
      </p>
      <p style={paragraphStyle}>
        <span style={labelStyle}>Montant remis au client :</span> {transaction.montant_remis} {transaction.devise_recue}
      </p>
      {transaction.remarques && (
        <p style={paragraphStyle}>
          <span style={labelStyle}>Remarques :</span> {transaction.remarques}
        </p>
      )}
      <p style={paragraphStyle}>
        <span style={labelStyle}>Date du transfert :</span>{' '}
        {new Date(transaction.date_transfert).toLocaleString('fr-FR', {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </p>
    </div>
  );
};

export default Resume;
