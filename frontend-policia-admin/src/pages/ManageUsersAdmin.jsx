import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UsersTable from "../components/UsersTable";
import "../styles/manage-users-admin.css";
import Pagination from "../components/Pagination";
import { deleteAdminUser, fetchAdminUsers } from "../services/adminUsersApi";

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
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const usersPerPage = 5;

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const backendUsers = await fetchAdminUsers();

        if (active) {
          setUsers(backendUsers);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "No se pudieron cargar los usuarios");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const filteredUsers = sortedUsers.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.fullName.toLowerCase().includes(searchText) ||
      user.identification.includes(searchText);

    const matchesRole = roleFilter === "Todos" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteAdminUser(userToDelete);

      setUsers((current) => current.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
    } catch (deleteError) {
      setError(deleteError.message || "No se pudo eliminar el usuario");
    }
  };

  return (
    <div className="manage-users-admin">
      <ConfirmModal
        isOpen={userToDelete !== null}
        title="Eliminar usuario"
        message="¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
      <Header navLinks={adminLinks} />

      <main className="manage-users-admin__content">
        <section className="manage-users-panel">
          <h1 className="manage-users-panel__title">Gestión de usuarios</h1>

          {isLoading && <p>Cargando usuarios...</p>}
          {error && <p>{error}</p>}

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
            users={paginatedUsers}
            handleEditUser={(userId) =>
              navigate(`/admin/editar-usuario/${userId}`)
            }
            handleDeleteUser={handleDeleteUser}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ManageUsersAdmin;
