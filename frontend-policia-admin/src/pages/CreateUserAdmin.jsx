import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserForm from "../components/UserForm";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    identification: userToEdit?.identification || "",
    fullName: userToEdit?.fullName || "",
    phone: userToEdit?.phone || "",
    email: userToEdit?.email || "",
    role: userToEdit?.role || "",
    password: "",
    confirmPassword: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 2500);
  };

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
      showToast("La cédula debe tener 10 números.", "error");
      return false;
    }

    if (formData.fullName.trim().length < 3) {
      showToast("Ingrese nombres y apellidos válidos.", "error");
      return false;
    }

    if (formData.phone.length !== 10) {
      showToast("El celular debe tener 10 números.", "error");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      showToast("Ingrese un correo electrónico válido.", "error");
      return false;
    }

    if (!formData.role) {
      showToast("Seleccione un rol de usuario.", "error");
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      showToast(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
        "error"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Las contraseñas no coinciden.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
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
            : user
        );

        localStorage.setItem("adminUsers", JSON.stringify(updatedUsers));

        setIsLoading(false);
        showToast("Usuario actualizado correctamente.", "success");

        setTimeout(() => {
          navigate("/admin/gestion-usuarios");
        }, 1000);

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
        JSON.stringify([...savedUsers, newUser])
      );

      setIsLoading(false);
      showToast("Usuario creado correctamente.", "success");

      setTimeout(() => {
        navigate("/admin/gestion-usuarios");
      }, 1000);
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="create-user-admin">
      <Toast message={toast.message} type={toast.type} />

      <Header navLinks={adminLinks} />

      <main className="create-user-admin__content">
        {isLoading ? (
          <LoadingSpinner message="Procesando usuario..." />
        ) : (
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CreateUserAdmin;
