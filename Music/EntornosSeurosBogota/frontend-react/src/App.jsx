/*
  App:
  Configuración principal de rutas.
*/

import { Routes, Route } from "react-router-dom";
import HomePolice from "./pages/HomePolice";
import ReportsPolice from "./pages/ReportsPolice";
import UserReportDetail from "./pages/UserReportDetail";

const App = () => {
  return (
    <Routes>

      {/* Inicio */}
      <Route path="/"  element={<HomePolice />} />

      {/* Reportes */}
      <Route path="/reportes" element={<ReportsPolice />} />


      <Route path="/reportes/:id" element={<UserReportDetail />}/>

    </Routes>
  );
};

export default App;