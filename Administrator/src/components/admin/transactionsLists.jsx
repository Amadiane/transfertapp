import React, { useEffect, useState } from 'react';
import API_ENDPOINTS from '../../config/apiConfig';

         //Fonction pour récupérer le token JWT depuis le localStorage
         const getAuthToken = () => {
         return localStorage.getItem("accessToken");
        };

const TransactionsLists = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const token = getAuthToken();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
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
  }, []);

  const handleDistribuer = async (tx) => {
    if (
      window.confirm(
        `Confirmer que le transfert ID ${tx.id} a été remis avec succès ?`
      )
    ) {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch(
          `${API_ENDPOINTS.TRANSACTIONS}/${tx.id}/distribuer/`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
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

  const token = localStorage.getItem('accessToken');

  // Fonction pour récupérer le cookie CSRF
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
        'X-CSRFToken': csrftoken,   // ajoute ce header pour CSRF
      },
    });
    if (res.ok) {
      const updatedTx = await res.json();
      setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
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
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_ENDPOINTS.TRANSACTIONS}${id}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTransactions(transactions.filter((tx) => tx.id !== id));
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
      montant_converti: tx.montant_converti || '',
      devise_recue: tx.devise_recue || '',
      montant_remis: tx.montant_remis || '',
      gain_transfert: tx.gain_transfert || '',
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
    const token = localStorage.getItem('accessToken');
    const payload = {
      ...editFormData,
      date_transfert: new Date(editFormData.date_transfert).toISOString(),
    };

    try {
      const res = await fetch(
        `${API_ENDPOINTS.TRANSACTIONS}${editingTx.id}/update/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
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
          <p>
            <strong>ID :</strong> {tx.id}
          </p>
          <p>
            <strong>Envoyé par (Agent) :</strong> {tx.sender?.username} (
            {tx.sender?.email})
          </p>
          <p>
            <strong>Ville :</strong> {tx.sender?.ville}
          </p>
          {currentUser?.role === 'admin' && (
            <p>
              <strong>Rôle :</strong> {tx.sender?.role}
            </p>
          )}
          <p>
            <strong>Devise envoyée :</strong> {tx.devise_envoyee}
          </p>
          <p>
            <strong>Montant envoyé :</strong> {tx.montant_envoye}
          </p>
          <p>
            <strong>Pourcentage de gain :</strong> {tx.pourcentage_gain} %
          </p>
          <p>
            <strong>Montant converti :</strong> {tx.montant_converti}
          </p>
          <p>
            <strong>Devise reçue :</strong> {tx.devise_recue}
          </p>
          <p>
            <strong>Montant remis :</strong> {tx.montant_remis}
          </p>
          <p>
            <strong>Gain sur transfert :</strong> {tx.gain_transfert}
          </p>
          <p>
            <strong>Nom du bénéficiaire :</strong> {tx.beneficiaire_nom}
          </p>
          <p>
            <strong>Numéro destinataire :</strong> {tx.numero_destinataire}
          </p>
          <p>
            <strong>Date du transfert :</strong>{' '}
            {new Date(tx.date_transfert).toLocaleString()}
          </p>
          <p>
            <strong>Remarques :</strong> {tx.remarques || 'Aucune'}
          </p>

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
                disabled={tx.is_distribue}
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
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
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
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
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
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Montant converti :
            <input
              type="number"
              step="0.01"
              name="montant_converti"
              value={editFormData.montant_converti}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Devise reçue :
            <input
              type="text"
              name="devise_recue"
              value={editFormData.devise_recue}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Montant remis :
            <input
              type="number"
              step="0.01"
              name="montant_remis"
              value={editFormData.montant_remis}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Gain sur transfert :
            <input
              type="number"
              step="0.01"
              name="gain_transfert"
              value={editFormData.gain_transfert}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Nom du bénéficiaire :
            <input
              type="text"
              name="beneficiaire_nom"
              value={editFormData.beneficiaire_nom}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Numéro destinataire :
            <input
              type="text"
              name="numero_destinataire"
              value={editFormData.numero_destinataire}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Date du transfert :
            <input
              type="datetime-local"
              name="date_transfert"
              value={editFormData.date_transfert}
              onChange={handleEditChange}
              style={{ width: '100%', marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
            />
          </label>

          <label>
            Remarques :
            <textarea
              name="remarques"
              value={editFormData.remarques}
              onChange={handleEditChange}
              style={{ width: '100%', height: 60, marginBottom: 10 }}
              disabled={editingTx.is_distribue && currentUser?.role !== 'admin'}
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










// # // TransactionsList.jsx
// # import React, { useEffect, useState } from "react";
// # import API_ENDPOINTS from '../../config/apiConfig';

// # // Fonction pour récupérer le token JWT depuis le localStorage
// #   const getAuthToken = () => {
// #   return localStorage.getItem("accessToken");
// #   };

// # export default function TransactionsLists() {
// #   const [transactions, setTransactions] = useState([]);
// #   const token = getAuthToken();

  

// #   // Charger la liste au montage
// #   useEffect(() => {
// #     fetch(API_ENDPOINTS.LIST_TRANSACTIONS, {
// #       headers: {
// #         "Authorization": Bearer ${token},
// #       },
// #     })
// #       .then((res) => res.json())
// #       .then((data) => setTransactions(data))
// #       .catch((err) => console.error("Erreur chargement transactions :", err));
// #   }, [token]);

// #   // Fonction de distribution avec logs détaillés
// #   const distribuerTransaction = async (id) => {
// #     const url = ${API_ENDPOINTS.TRANSACTIONS}${id}/distribuer/;

// #     console.log("📡 Envoi requête DISTRIBUER vers :", url);
// #     console.log("🔑 Token utilisé :", token);

// #     try {
// #       const response = await fetch(url, {
// #         method: "POST",
// #         headers: {
// #           "Authorization": Bearer ${token},
// #           "Content-Type": "application/json",
// #         },
// #       });

// #       console.log("📥 Statut HTTP :", response.status);
// #       console.log("📥 Headers réponse :", Object.fromEntries(response.headers.entries()));

// #       const contentType = response.headers.get("content-type");
// #       let responseBody;

// #       if (contentType && contentType.includes("application/json")) {
// #         responseBody = await response.json();
// #       } else {
// #         responseBody = await response.text();
// #       }

// #       console.log("📥 Corps de la réponse :", responseBody);

// #       if (!response.ok) {
// #         alert(Erreur ${response.status} : ${JSON.stringify(responseBody)});
// #         return;
// #       }

// #       alert("✅ Transaction distribuée avec succès !");
// #     } catch (err) {
// #       console.error("💥 Erreur réseau ou fetch :", err);
// #       alert("Impossible de contacter le serveur !");
// #     }
// #   };

// #   return (
// #     <div>
// #       <h2>📋 Liste des transactions</h2>
// #       <table>
// #         <thead>
// #           <tr>
// #             <th>ID</th>
// #             <th>Bénéficiaire</th>
// #             <th>Montant</th>
// #             <th>Distribué</th>
// #             <th>Action</th>
// #           </tr>
// #         </thead>
// #         <tbody>
// #           {transactions.map((t) => (
// #             <tr key={t.id}>
// #               <td>{t.id}</td>
// #               <td>{t.beneficiaire_nom}</td>
// #               <td>{t.montant_envoye} {t.devise_envoyee}</td>
// #               <td>{t.is_distribue ? "✅" : "❌"}</td>
// #               <td>
// #                 {!t.is_distribue && (
// #                   <button onClick={() => distribuerTransaction(t.id)}>
// #                     Distribuer
// #                   </button>
// #                 )}
// #               </td>
// #             </tr>
// #           ))}
// #         </tbody>
// #       </table>
// #     </div>
// #   );
// # }