import React, { useState, useEffect } from "react";
import axios from "axios";
import API from '../../config/apiConfig';

const GestionClubs = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [clubs, setClubs] = useState([]);
  const [editingClubId, setEditingClubId] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Charger la liste des clubs
  const fetchClubs = async () => {
    try {
      const response = await axios.get(API.CLUBS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClubs(response.data);
    } catch (error) {
      console.error("Erreur de chargement des clubs :", error);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Ajouter ou modifier un club
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Vous devez être connecté.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      if (editingClubId) {
        // Modification
        await axios.put(`${API.CLUBS}${editingClubId}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("✅ Club modifié !");
      } else {
        // Ajout
        await axios.post(API.CLUBS, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("✅ Club ajouté !");
      }

      setName("");
      setLogo(null);
      setEditingClubId(null);
      fetchClubs();
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Échec de l'enregistrement.");
    }
  };

  // Supprimer un club
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce club ?")) return;

    try {
      await axios.delete(`${API.CLUBS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("✅ Club supprimé.");
      fetchClubs();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      setMessage("❌ Échec de la suppression.");
    }
  };

  // Préparer la modification
  const handleEdit = (club) => {
    setName(club.name);
    setLogo(null); // Tu peux afficher un aperçu si tu veux
    setEditingClubId(club.id);
  };

  return (
    <div>
      <h2>{editingClubId ? "Modifier le club" : "Ajouter un club"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom du club :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Logo (facultatif) :</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
          />
        </div>

        <button type="submit">{editingClubId ? "Modifier" : "Enregistrer"}</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Liste des clubs</h3>
      <ul>
        {clubs.map((club) => (
  <li key={club.id}>
    <strong>{club.name}</strong>{" "}
    {club.logo && (
      <img
        src={club.logo}
        alt="logo"
        width={50}
        height={50}
      />
    )}
    <button onClick={() => handleEdit(club)}>Modifier</button>
    <button onClick={() => handleDelete(club.id)}>Supprimer</button>
  </li>
))}

      </ul>
    </div>
  );
};

export default GestionClubs;
