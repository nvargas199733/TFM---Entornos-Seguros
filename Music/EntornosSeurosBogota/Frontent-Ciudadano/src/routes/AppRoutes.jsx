import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "../pages/auth/Register";
import RegisterForm from "../pages/auth/RegisterForm";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Register />}
        />

        <Route
          path="/registro"
          element={<RegisterForm />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;