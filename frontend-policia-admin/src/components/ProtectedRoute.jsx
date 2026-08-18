import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearSession, getSession } from "../services/authService";

function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const session = getSession();

  if (!session || !session.token || !session.user?.id || !session.user?.role) {
    clearSession();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = session.user.role;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "POLICIA") {
      return <Navigate to="/" replace />;
    }
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    clearSession();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;