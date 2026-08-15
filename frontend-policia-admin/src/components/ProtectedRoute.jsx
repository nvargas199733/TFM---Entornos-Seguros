import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession } from "../services/authService";

function ProtectedRoute() {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;