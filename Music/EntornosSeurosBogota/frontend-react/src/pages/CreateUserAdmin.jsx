import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import UserForm from "../components/UserForm";

import "../styles/create-user-admin.css";

const CreateUserAdmin = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const adminLinks = [
  { label: "Inicio", path: "/admin" },
  { label: "Crear usuario", path: "/admin/crear-usuario" },
  { label: "Gestión de usuario", path: "/admin/gestion-usuarios" },
  { label: "Incidentes", path: "/admin/incidentes" },
];

  const savedUsers = JSON.parse(localStorage.getItem("adminUsers")) || [];

  const userToEdit = savedUsers.find((user) => user.id === Number(id));

  const isEditing = Boolean(userToEdit);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    identification: userToEdit?.identification || "",
    fullName: userToEdit?.fullName || "",
    phone: userToEdit?.phone || "",
    email: userToEdit?.email || "",
    role: userToEdit?.role || "",
    password: "",
    confirmPassword: "",
  });

  const handleOnlyNumbers = (event, field) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleOnlyLetters = (event) => {
    const value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

    setFormData({
      ...formData,
      fullName: value,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if (formData.identification.length !== 10) {
      alert("La cédula debe tener 10 números.");
      return false;
    }

    if (formData.fullName.trim().length < 3) {
      alert("Ingrese nombres y apellidos válidos.");
      return false;
    }

    if (formData.phone.length !== 10) {
      alert("El celular debe tener 10 números.");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      alert("Ingrese un correo electrónico válido.");
      return false;
    }

    if (!formData.role) {
      alert("Seleccione un rol de usuario.");
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      alert(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (isEditing) {
      const updatedUsers = savedUsers.map((user) =>
        user.id === Number(id)
          ? {
              ...user,
              identification: formData.identification,
              fullName: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              role: formData.role,
              updatedAt: new Date().toISOString(),
            }
          : user,
      );

      localStorage.setItem("adminUsers", JSON.stringify(updatedUsers));

      alert("Usuario actualizado correctamente.");

      navigate("/admin/gestion-usuarios");

      return;
    }

    const newUser = {
      id: Date.now(),
      identification: formData.identification,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "adminUsers",
      JSON.stringify([...savedUsers, newUser]),
    );

    alert("Usuario creado correctamente.");

    navigate("/admin/gestion-usuarios");
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="create-user-admin">
      <Header navLinks={adminLinks} />

      <main className="create-user-admin__content">
        <UserForm
          formTitle={isEditing ? "Editar usuario" : "Crear nuevo usuario"}
          formData={formData}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleOnlyNumbers={handleOnlyNumbers}
          handleOnlyLetters={handleOnlyLetters}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          submitText={isEditing ? "Guardar cambios" : "Crear usuario"}
          handleCancel={handleCancel}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CreateUserAdmin;
