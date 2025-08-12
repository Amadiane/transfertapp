import React, { useEffect, useState } from 'react';
import API_ENDPOINTS from '../../config/apiConfig';

// Fonction pour récupérer le token JWT depuis le localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

const TransactionsLists = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const token = getAuthToken();

  useEffect(() => {
    if (!token) return;

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.GET_USER_DATA, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Erreur fetch user data', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.TRANSACTIONS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Erreur fetch transactions', error);
      }
    };

    fetchCurrentUser();
    fetchTransactions();
  }, [token]);

  const handleDistribuer = async (tx) => {
    if (
      window.confirm(
        `Confirmer que le transfert ID ${tx.id} a été remis avec succès ?`
      )
    ) {
      try {
        const res = await fetch(API_ENDPOINTS.DISTRIBUER_TRANSACTION(tx.id), {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const updatedTx = await res.json();
          setTransactions((prev) =>
            prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
          );
          alert('Transfert marqué comme distribué.');
        } else {
          alert('Erreur lors de la distribution');
        }
      } catch (error) {
        console.error(error);
        alert('Erreur réseau ou serveur');
      }
    }
  };

  const handleAnnulerDistribution = async (tx) => {
    if (!window.confirm(`Annuler la distribution du transfert ID ${tx.id} ? Cette action est réservée à l'admin.`))
      return;

    // Récupération du token CSRF si nécessaire
    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          cookie = cookie.trim();
          if (cookie.startsWith(name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    try {
      const res = await fetch(API_ENDPOINTS.ANNULER_DISTRIBUTION(tx.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
      });
      if (res.ok) {
        const updatedTx = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
        );
        alert('Distribution annulée.');
      } else {
        alert('Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur réseau ou serveur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression du transfert ?')) return;

    try {
      const res = await fetch(API_ENDPOINTS.DELETE_TRANSACTION(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const openEditForm = (tx) => {
    setEditingTx(tx);
    setEditFormData({
      devise_envoyee: tx.devise_envoyee || '',
      montant_envoye: tx.montant_envoye || '',
      pourcentage_gain: tx.pourcentage_gain || '',
      devise_recue: tx.devise_recue || '',
      beneficiaire_nom: tx.beneficiaire_nom || '',
      numero_destinataire: tx.numero_destinataire || '',
      date_transfert: tx.date_transfert ? tx.date_transfert.slice(0, 16) : '',
      remarques: tx.remarques || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    const payload = { ...editFormData };
    // On peut choisir d'envoyer uniquement les champs modifiables et valides

    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_TRANSACTION(editingTx.id), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updatedTx = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
        );
        setEditingTx(null);
      } else {
        alert('Erreur lors de la modification');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
    }
  };

  const cancelEdit = () => setEditingTx(null);

  return (
    <div>
      <h2>Résumé des Transferts</h2>
      {transactions.length === 0 && <p>Aucun transfert disponible</p>}
      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            border: '1px solid #ccc',
            margin: '10px',
            padding: '15px',
            borderRadius: 6,
          }}
        >
          <p><strong>ID :</strong> {tx.id}</p>
          <p><strong>Envoyé par :</strong> {tx.sender?.username} ({tx.sender?.email})</p>
          <p><strong>Devise envoyée :</strong> {tx.devise_envoyee}</p>
          <p><strong>Montant envoyé :</strong> {tx.montant_envoye}</p>
          <p><strong>Pourcentage de gain :</strong> {tx.pourcentage_gain} %</p>
          <p><strong>Devise reçue :</strong> {tx.devise_recue}</p>
          <p><strong>Nom bénéficiaire :</strong> {tx.beneficiaire_nom}</p>
          <p><strong>Numéro destinataire :</strong> {tx.numero_destinataire}</p>
          <p><strong>Date transfert :</strong> {new Date(tx.date_transfert).toLocaleString()}</p>
          <p><strong>Remarques :</strong> {tx.remarques || 'Aucune'}</p>

          <p>
            <strong>Statut :</strong>{' '}
            {tx.is_distribue ? (
              <>
                Distribué par <em>{tx.distributeur?.username || 'inconnu'}</em>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleAnnulerDistribution(tx)}
                    style={{
                      marginLeft: 10,
                      backgroundColor: '#f87171',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: '3px 8px',
                    }}
                  >
                    Annuler
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => handleDistribuer(tx)}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: '6px 12px',
                }}
              >
                Distribuer
              </button>
            )}
          </p>

          {(currentUser?.role === 'admin' || !tx.is_distribue) && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => openEditForm(tx)}
                style={{ marginRight: 10 }}
                disabled={tx.is_distribue && currentUser?.role !== 'admin'}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(tx.id)}
                style={{ color: 'red' }}
                disabled={tx.is_distribue && currentUser?.role !== 'admin'}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}

      {editingTx && (
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            background: '#fff',
            padding: 20,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            borderRadius: 8,
            width: 400,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          <h3>Modifier Transfert ID {editingTx.id}</h3>

          <label>
            Devise envoyée :
            <input
              type="text"
              name="devise_envoyee"
              value={editFormData.devise_envoyee}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Montant envoyé :
            <input
              type="number"
              step="0.01"
              name="montant_envoye"
              value={editFormData.montant_envoye}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Pourcentage de gain (%):
            <input
              type="number"
              step="0.01"
              name="pourcentage_gain"
              value={editFormData.pourcentage_gain}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Devise reçue :
            <input
              type="text"
              name="devise_recue"
              value={editFormData.devise_recue}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Nom du bénéficiaire :
            <input
              type="text"
              name="beneficiaire_nom"
              value={editFormData.beneficiaire_nom}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Numéro destinataire :
            <input
              type="text"
              name="numero_destinataire"
              value={editFormData.numero_destinataire}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Date du transfert :
            <input
              type="datetime-local"
              name="date_transfert"
              value={editFormData.date_transfert}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </label>

          <label>
            Remarques :
            <textarea
              name="remarques"
              value={editFormData.remarques}
              onChange={handleEditChange}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
              style={{ width: '100%', height: 60, marginBottom: 10 }}
            />
          </label>

          <div style={{ textAlign: 'right' }}>
            <button onClick={cancelEdit} style={{ marginRight: 10 }}>
              Annuler
            </button>
            <button
              onClick={submitEdit}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsLists;
