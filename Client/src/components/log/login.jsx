import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../config/apiConfig";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔐 Requête d’authentification
      const response = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError("Identifiants invalides");
        return;
      }

      const data = await response.json();
      const token = data.access;

      // 💾 Stocker le token localement
      localStorage.setItem("access_token", token);

      // 📥 Récupération des infos utilisateur
      const userResponse = await fetch(API.GET_USER_DATA, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
        throw new Error("Échec de la récupération des données utilisateur.");
      }

      const userData = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Redirection selon le rôle
      if (userData.role === "admin") {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboardUser");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la connexion");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
