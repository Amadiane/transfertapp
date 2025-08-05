import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/log/login.jsx";
import DashboardAdmin from "./components/admin/dashboardAdmin.jsx";
import EnregistrerEmploye from "./components/admin/enregistrerEmploye.jsx";
import Logout from "./components/log/logout.jsx";
import GestionClubs from "./components/admin/gestionClubs.jsx";



function App() {
  return (
    <BrowserRouter>
      
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/enregistrerEmploye" element={<EnregistrerEmploye />} />
        <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
         <Route path="/gestionClubs" element={<GestionClubs />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;