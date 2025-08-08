import React from 'react';
import { useLocation } from 'react-router-dom';

const Resume = () => {
  const location = useLocation();
  const transaction = location.state?.transaction;

  if (!transaction) {
    return <p>Aucune transaction à afficher.</p>;
  }

  return (
    <div>
      <h2>Résumé du Transfert</h2>
      <p><strong>Devise envoyée :</strong> {transaction.devise_envoyee}</p>
      <p><strong>Montant envoyé :</strong> {transaction.montant_envoye} {transaction.devise_envoyee}</p>
      <p><strong>Pourcentage de gain :</strong> {transaction.pourcentage_gain} %</p>
      <p><strong>Devise reçue :</strong> {transaction.devise_recue}</p>
      <p><strong>Nom du bénéficiaire :</strong> {transaction.beneficiaire_nom}</p>
      <p><strong>Montant converti :</strong> {transaction.montant_converti} {transaction.devise_recue}</p>
      <p><strong>Gain du transfert :</strong> {transaction.gain_transfert} {transaction.devise_recue}</p>
      <p><strong>Numéro destinataire :</strong> {transaction.numero_destinataire}</p>
      <p><strong>Montant remis au client :</strong> {transaction.montant_remis} {transaction.devise_recue}</p>
      {transaction.remarques && <p><strong>Remarques :</strong> {transaction.remarques}</p>}
      <p>
        <strong>Date du transfert :</strong>{' '}
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
