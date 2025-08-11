import React, { useEffect, useState } from "react";
import API_ENDPOINTS from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

export default function ListeEmploye() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", ville: "", role: "employe" });

  const token = localStorage.getItem("accessToken");

  // 🔹 Charger la liste des employés
  const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(API_ENDPOINTS.LIST_USERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    const text = await response.text(); // Récupère la réponse brute (pas JSON)
    try {
      const data = JSON.parse(text);   // Essaye de parser en JSON
      setEmployees(data);
    } catch (e) {
      console.error("Réponse non JSON reçue:", text);
      throw new Error("La réponse du serveur n'est pas au format JSON.");
    }
  } catch (error) {
    console.error(error);
  }
};


  // 🔹 Supprimer un employé
  const deleteEmployee = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 204) {
        setEmployees(employees.filter((emp) => emp.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Préparer la modification
  const startEdit = (employee) => {
    setEditEmployee(employee.id);
    setFormData({
      username: employee.username,
      email: employee.email,
      ville: employee.ville,
      role: employee.role,
    });
  };

  // 🔹 Envoyer la modification
  const updateEmployee = async (id) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      const updated = await res.json();
      setEmployees(employees.map((emp) => (emp.id === id ? updated : emp)));
      setEditEmployee(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (

  
    
    <div style={{ padding: "20px" }}>



      <h2>Liste des Employés</h2>
      <button
        style={{ marginBottom: "10px", backgroundColor: "green", color: "white", padding: "8px" }}
        onClick={() => (window.location.href = "/enregistrerEmploye")}
      >
        ➕ Add Employee
      </button>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Ville</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              {editEmployee === emp.id ? (
                <>
                  <td>
                    <input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="admin">Admin</option>
                      <option value="employe">Employé</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => updateEmployee(emp.id)}>💾 Save</button>
                    <button onClick={() => setEditEmployee(null)}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{emp.username}</td>
                  <td>{emp.email}</td>
                  <td>{emp.ville}</td>
                  <td>{emp.role}</td>
                  <td>
                    <button onClick={() => startEdit(emp)}>✏ Edit</button>
                    <button onClick={() => deleteEmployee(emp.id)}>🗑 Delete</button>
                    <button onClick={() => navigate(`/employe/${emp.id}`)}>👁 Voir Dashboard</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
