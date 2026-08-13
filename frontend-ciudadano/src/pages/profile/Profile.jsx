import "./Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Camera,
  Mail,
  Phone,
  Save
} from "lucide-react";
import { clearSession, getMe, getSession } from "../../services/authService";

const emptyForm = {
  fullName: "",
  email: "",
  phone: ""
};

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const session = getSession();

      if (!session?.token) {
        clearSession();
        setError("La sesión no está disponible. Inicia sesión nuevamente.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const user = await getMe();

        if (!isMounted) return;

        setForm({
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: user?.phone || ""
        });
        setError("");
      } catch (loadError) {
        if (!isMounted) return;

        clearSession();
        setError("La sesión no está disponible. Inicia sesión nuevamente.");
        navigate("/login");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <main className="profile-container">
      <section className="profile-card">
        <header className="profile-header">
          <button className="profile-icon-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={28} />
          </button>

          <h1>Perfil</h1>

          <button className="profile-icon-button notification">
            <Bell size={28} />
            <span></span>
          </button>
        </header>

        <section className="profile-avatar-section">
          <div className="profile-avatar">
            <User size={64} />
          </div>

          <button className="camera-button" type="button">
            <Camera size={22} />
          </button>
        </section>

        <section className="profile-info">
          <h2>Información de perfil</h2>
          <p>Consulta los datos actuales de tu cuenta</p>

          {loading ? (
            <p>Cargando perfil...</p>
          ) : error ? (
            <p className="password-error">{error}</p>
          ) : (
            <form className="profile-form">
              <label className="profile-field">
                <User size={24} />
                <div>
                  <span>Nombre completo</span>
                  <input type="text" value={form.fullName} readOnly />
                </div>
              </label>

              <label className="profile-field">
                <Mail size={24} />
                <div>
                  <span>Correo electrónico</span>
                  <input type="email" value={form.email} readOnly />
                </div>
              </label>

              {form.phone ? (
                <label className="profile-field">
                  <Phone size={24} />
                  <div>
                    <span>Celular</span>
                    <input type="text" value={form.phone} readOnly />
                  </div>
                </label>
              ) : null}

              <button type="button" className="save-button" disabled>
                <Save size={24} />
                La actualización del perfil estará disponible próximamente
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

export default Profile;