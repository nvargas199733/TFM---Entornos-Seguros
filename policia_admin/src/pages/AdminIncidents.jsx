import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminIncidentsPanel from "../components/AdminIncidentsPanel";

import "../styles/admin-incidents.css";

const AdminIncidents = () => {
  const adminLinks = [
    { label: "Inicio", path: "/admin" },
    { label: "Crear usuario", path: "/admin/crear-usuario" },
    { label: "Gestión de usuarios", path: "/admin/gestion-usuarios" },
    { label: "Incidentes", path: "/admin/incidentes" },
  ];

  return (
    <div className="admin-incidents">
      <Header navLinks={adminLinks} />

      <main className="admin-incidents__content">
        <AdminIncidentsPanel />
      </main>

      <Footer />
    </div>
  );
};

export default AdminIncidents;