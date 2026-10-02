-- Asegurar esquemas
CREATE SCHEMA IF NOT EXISTS auth_user;

-- Asegurar roles
INSERT INTO auth_user.rol (nombre, descripcion)
SELECT 'ADMINISTRADOR', 'Administrador global'
WHERE NOT EXISTS (SELECT 1 FROM auth_user.rol WHERE nombre IN ('ADMINISTRADOR', 'ADMIN'));

INSERT INTO auth_user.rol (nombre, descripcion)
SELECT 'POLICIA', 'Agente policial'
WHERE NOT EXISTS (SELECT 1 FROM auth_user.rol WHERE nombre = 'POLICIA');

INSERT INTO auth_user.rol (nombre, descripcion)
SELECT 'USUARIO', 'Ciudadano'
WHERE NOT EXISTS (SELECT 1 FROM auth_user.rol WHERE nombre = 'USUARIO');

-- Actualizar contraseñas de todos los usuarios admin y policía existentes
UPDATE auth_user.usuario 
SET contrasena_hash = '$2a$10$ERYR06VQ//9uqmKEljUgD.0CrH7CW9zKkUCRKADZi8SQ14ZD2acPy', activo = true 
WHERE correo ILIKE '%admin%';

UPDATE auth_user.usuario 
SET contrasena_hash = '$2a$10$wtISNvwAFE4iCSbdyR3gsuy6gqQ/eZek150zYBw8MYqtM2NG22.S2', activo = true 
WHERE correo ILIKE '%policia%';

-- Insertar usuario Admin si no existe ningún admin
INSERT INTO auth_user.usuario (id_rol, cedula, nombres, apellidos, telefono, correo, contrasena_hash, activo, fecha_creacion, created_at, updated_at)
SELECT 
    (SELECT id_rol FROM auth_user.rol WHERE nombre IN ('ADMINISTRADOR', 'ADMIN') LIMIT 1),
    '80000001', 'Administrador', 'Principal', '3001112233', 'admin@entornosseguros.gov.co',
    '$2a$10$ERYR06VQ//9uqmKEljUgD.0CrH7CW9zKkUCRKADZi8SQ14ZD2acPy', true, NOW(), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth_user.usuario WHERE correo = 'admin@entornosseguros.gov.co');

-- Insertar usuario Policía si no existe ningún policía
INSERT INTO auth_user.usuario (id_rol, cedula, nombres, apellidos, telefono, correo, contrasena_hash, activo, fecha_creacion, created_at, updated_at)
SELECT 
    (SELECT id_rol FROM auth_user.rol WHERE nombre = 'POLICIA' LIMIT 1),
    '80000002', 'Oficial', 'Patrullero', '3004445566', 'policia@entornosseguros.gov.co',
    '$2a$10$wtISNvwAFE4iCSbdyR3gsuy6gqQ/eZek150zYBw8MYqtM2NG22.S2', true, NOW(), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth_user.usuario WHERE correo = 'policia@entornosseguros.gov.co');
