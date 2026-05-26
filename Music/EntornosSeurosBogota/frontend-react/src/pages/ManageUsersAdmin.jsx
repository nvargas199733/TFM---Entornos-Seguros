import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UsersTable from "../components/UsersTable";
import "../styles/manage-users-admin.css";

const ManageUsersAdmin = () => {
  const navigate = useNavigate();

  const adminLinks = [
    { label: "Inicio", path: "/admin" },
    { label: "Crear usuario", path: "/admin/crear-usuario" },
    { label: "Gestión de usuario", path: "/admin/gestion-usuarios" },
    { label: "Incidentes", path: "/admin/incidentes" },
  ];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const savedUsers = JSON.parse(localStorage.getItem("adminUsers")) || [];

  const filteredUsers = savedUsers.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.fullName.toLowerCase().includes(searchText) ||
      user.identification.includes(searchText);

    const matchesRole = roleFilter === "Todos" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este usuario?",
    );

    if (!confirmDelete) return;

    const updatedUsers = savedUsers.filter((user) => user.id !== userId);

    localStorage.setItem("adminUsers", JSON.stringify(updatedUsers));

    window.location.reload();
  };

  return (
    <div className="manage-users-admin">
      <Header navLinks={adminLinks} />

      <main className="manage-users-admin__content">
        <section className="manage-users-panel">
          <h1 className="manage-users-panel__title">Gestión de usuarios</h1>

          <div className="manage-users-panel__toolbar">
            <input
              className="manage-users-panel__search"
              type="text"
              placeholder="Buscar por nombre, apellido o cédula..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="manage-users-panel__filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="Todos">Todos los roles</option>
              <option value="usuario">Usuario</option>
              <option value="administrador">Administrador</option>
              <option value="policia">Policía</option>
            </select>
          </div>

          <UsersTable
            users={filteredUsers}
            handleEditUser={(userId) =>
              navigate(`/admin/editar-usuario/${userId}`)
            }
            handleDeleteUser={handleDeleteUser}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ManageUsersAdmin;
