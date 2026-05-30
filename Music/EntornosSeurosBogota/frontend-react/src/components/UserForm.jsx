import "../styles/user-form.css";


const UserForm = ({
  formTitle,

  formData,

  handleSubmit,

  handleChange,

  handleOnlyNumbers,

  handleOnlyLetters,

  showPassword,
  setShowPassword,

  showConfirmPassword,
  setShowConfirmPassword,

  submitText,

  handleCancel,
}) => {
  return (
    <form className="create-user-form" onSubmit={handleSubmit}>
      <h1 className="create-user-form__title">{formTitle}</h1>

      {/* Cédula */}
      <label>
        Número de cédula
        <input
          value={formData.identification}
          onChange={(event) => handleOnlyNumbers(event, "identification")}
          maxLength="10"
          required
        />
      </label>

      {/* Nombre */}
      <label>
        Nombres y apellidos
        <input
          value={formData.fullName}
          onChange={handleOnlyLetters}
          required
        />
      </label>

      {/* Celular + correo */}
      <div className="create-user-form__row">
        <label>
          Celular
          <input
            value={formData.phone}
            onChange={(event) => handleOnlyNumbers(event, "phone")}
            maxLength="10"
            required
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      {/* Rol */}
      <label>
        Rol de usuario
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un rol</option>

          <option value="usuario">Usuario</option>

          <option value="administrador">Administrador</option>

          <option value="policia">Policía</option>
        </select>
      </label>

      {/* Contraseña */}
      <label>
        Contraseña
        <div className="create-user-form__password">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            👁️
          </button>
        </div>
      </label>

      {/* Confirmar contraseña */}
      <label>
        Confirmar contraseña
        <div className="create-user-form__password">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            👁️
          </button>
        </div>
      </label>

      {/* Botones */}
      <div className="create-user-form__actions">
        <button
          type="button"
          className="create-user-form__cancel"
          onClick={handleCancel}
        >
          Cancelar
        </button>

        <button type="submit" className="create-user-form__submit">
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
