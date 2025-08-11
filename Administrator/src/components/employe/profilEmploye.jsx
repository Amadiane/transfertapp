import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apiConfig';

const ProfilEmploye = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_ENDPOINTS.USERS}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!employee) return <p>Pas d'utilisateur à afficher</p>;

  return (
    <div>
      <h1>Profil de {employee.username}</h1>
      <p>Email: {employee.email}</p>
      <p>Ville: {employee.ville}</p>
      <p>Rôle: {employee.role}</p>
      {/* Ajoute ici les boutons pour modifier, supprimer etc. */}
    </div>
  );
};

export default ProfilEmploye;
