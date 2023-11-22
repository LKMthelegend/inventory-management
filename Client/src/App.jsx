import { useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
}from 'react-router-dom';
import Login from "./components/Login/Login";
import Signup from "./components/SignUp/SignUp";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import Employe from "./pages/employee/Employe";
import Materiel from "./pages/materiel/Materiel";
import Logiciel from "./pages/logiciel/Logiciel";
import Affectation from "./pages/affectation/Affectation";
import Service from "./pages/service/Service";

function App() {
  
  //verification de la connexion de l'utilisateur s'il est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  //fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");//supprimer le token de l'utilisateur
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn && <Route path="/" element={<Navigate replace to="/login" />} />}
        {isLoggedIn && (
          <Route
            path="/"
            element={
              <div>
                <Sidebar onLogout={handleLogout}/>
              </div>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="employee" element={<Employe/>} />
            <Route path="materiel" element={<Materiel />} />
            <Route path="logiciel" element={<Logiciel />} />
            <Route path="service" element={<Service />}  />
            <Route path="affectation" element={<Affectation />} />
          </Route>
        )}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
