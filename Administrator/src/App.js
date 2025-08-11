import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/log/login.jsx";
import DashboardAdmin from "./components/admin/dashboardAdmin.jsx";
import EnregistrerEmploye from "./components/admin/enregistrerEmploye.jsx";
import Logout from "./components/log/logout.jsx";
import SendTransfert from "./components/admin/sendTransfert.jsx";
import Resume from "./components/admin/resume.jsx";
import DashboardEmploye from "./components/employe/dashboardEmploye.jsx";
import ProtectedRoutes from "./components/privateRoute/protectedRoutes.jsx";
import ListeEmploye from "./components/admin/listeEmploye.jsx";
import InactivityHandler from "./config/InactivityHandler.jsx";
import ProfilEmploye from "./components/employe/profilEmploye.jsx";


function App() {
  return (
    
    <BrowserRouter>
    <InactivityHandler>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Routes protégées Admin */}
        <Route element={<ProtectedRoutes roleRequired="admin" />}>
          <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/enregistrerEmploye" element={<EnregistrerEmploye />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/listeEmploye" element={<ListeEmploye />} />
          <Route path="/profilEmploye" element={<ProfilEmploye />} />
          <Route path="/employe/:id" element={<DashboardEmploye isAdminView={true} />} />
          
        </Route>

        {/* Routes protégées Employé */}
        <Route element={<ProtectedRoutes roleRequired="employe" />}>
          <Route path="/dashboardEmploye" element={<DashboardEmploye />} />
        </Route>

        {/* Route accessible par admin ET employé */}
        <Route element={<ProtectedRoutes allowedRoles={['admin', 'employe']} />}>
        <Route path="/sendTransfert" element={<SendTransfert />} />
        </Route>
      </Routes>
      </InactivityHandler>
    </BrowserRouter>
    
  );
}

export default App;