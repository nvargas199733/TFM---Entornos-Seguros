import "./Profile.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save
} from "lucide-react";

function Profile() {
    const navigate = useNavigate();
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

          <button className="camera-button">
            <Camera size={22} />
          </button>
        </section>

        <section className="profile-info">
          <h2>Actualizar datos</h2>
          <p>Mantén tu información actualizada</p>

          <form className="profile-form">
            <label className="profile-field">
              <User size={24} />
              <div>
                <span>Nombre completo</span>
                <input type="text" defaultValue="Natalia Vargas" required />
              </div>
            </label>

            <label className="profile-field">
              <Mail size={24} />
              <div>
                <span>Correo electrónico</span>
                <input type="email" defaultValue="natalia.vargas@gmail.com" required />
              </div>
            </label>

            <label className="profile-field">
              <Phone size={24} />
              <div>
                <span>Celular</span>
                <input
                  type="text"
                  defaultValue="3188072075"
                  pattern="[0-9]{10}"
                  minLength="10"
                  maxLength="10"
                  inputMode="numeric"
                  required
                />
              </div>
            </label>

            <label className="profile-field">
              <Calendar size={24} />
              <div>
                <span>Fecha de nacimiento</span>
                <input type="date" defaultValue="1997-04-03" required />
              </div>
            </label>

            <label className="profile-field">
              <MapPin size={24} />
              <div>
                <span>Dirección</span>
                <input type="text" defaultValue="Cra. 16 # 15-28, Bogotá" />
              </div>
            </label>

            <button type="submit" className="save-button">
              <Save size={24} />
              Guardar cambios
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default Profile;