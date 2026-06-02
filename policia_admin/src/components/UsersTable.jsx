import { Pencil, Trash2 } from "lucide-react";

const UsersTable = ({
  users,
  handleEditUser,
  handleDeleteUser,
}) => {
  return (
    <div className="manage-users-table">
      <div className="manage-users-table__header">
        <span>Cédula</span>
        <span>Usuario</span>
        <span>Rol</span>
        <span>Teléfono</span>
        <span>Acciones</span>
      </div>

      {users.length > 0 ? (
        users.map((user) => (
          <div className="manage-users-table__row" key={user.id}>
            <span>{user.identification}</span>
            <span>{user.fullName}</span>
            <span>{user.role}</span>
            <span>{user.phone}</span>

            <div className="manage-users-table__actions">
              <button
                type="button"
                className="manage-users-table__edit"
                onClick={() => handleEditUser(user.id)}
              >
                <Pencil size={18} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                className="manage-users-table__delete"
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash2 size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="manage-users-table__empty">
          No existen usuarios registrados.
        </p>
      )}
    </div>
  );
};

export default UsersTable;