# 🤝 GUÍA DE CONTRIBUCIÓN

## 📋 Código de Conducta

Todos los contribuyentes deben:
- ✅ Respetar a otros miembros del equipo
- ✅ Mantener un ambiente inclusivo
- ✅ Reportar problemas de seguridad privadamente
- ✅ Seguir los eslóganes de calidad de código

---

##  Proceso de Contribución

### 1. Fork el Proyecto
```bash
git clone https://github.com/TU_USUARIO/entornos-seguros.git
cd EntornosSeurosBogota
```

### 2. Crear una Rama
```bash
git checkout -b feature/Tu-Nueva-Funcionalidad
# o para bugfixes:
git checkout -b fix/Tu-Bug
```

### Convención de Nombres de Ramas
- `feature/descripcion-corta` - Para nuevas funcionalidades
- `fix/descripcion-del-bug` - Para correción de bugs
- `docs/descripcion` - Para documentación
- `refactor/descripcion` - Para refactorización
- `test/descripcion` - Para tests

### 3. Hacer Cambios
```bash
# Editar archivos
git add .
git commit -m "✨ Descripción clara del cambio"
```

### Convención de Mensajes de Commit
```
✨ feat: Nueva funcionalidad
🐛 fix: Corrección de bug
📚 docs: Cambios en documentación
♻️  refactor: Cambios de código sin funcionamiento nuevo
✅ test: Agregar o actualizar tests
⚡ perf: Mejoras de performance
🎨 style: Cambios en formato/estilos
🔧 chore: Cambios de configuración/dependencias
```

### 4. Push a tu Fork
```bash
git push origin feature/Tu-Nueva-Funcionalidad
```

### 5. Crear Pull Request
- Ir a GitHub https://github.com/entornos-seguros/entornos-seguros-git
- Click en "New Pull Request"
- Seleccionar tu rama
- Llenar descripción detallada
- Esperar review

---

## 🏗️ Estructura de Código

### Java (Backend)

#### Convención de Nombres
```java
// Clases - PascalCase
public class IncidentService { }

// Métodos - camelCase
public void reportIncident() { }

// Constantes - UPPER_SNAKE_CASE
public static final String ERROR_MESSAGE = "...";

// Variables privadas - camelCase con prefijo _
private String _userName;
```

#### Estructura de Clase
```java
@Service
public class UserService {
    
    // 1. Constantes
    private static final String ERROR_USER_NOT_FOUND = "Usuario no encontrado";
    
    // 2. Inyecciones
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Constructor
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    // 3. Métodos públicos
    public User findById(Long id) {
        // ...
    }
    
    // 4. Métodos privados
    private void validateUser(User user) {
        // ...
    }
}
```

#### JavaDoc (Obligatorio)
```java
/**
 * Encuentra un usuario por su ID.
 * 
 * @param id el ID del usuario a buscar
 * @return el usuario encontrado
 * @throws ResourceNotFoundException si el usuario no existe
 * @since 1.0.0
 */
public User findById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(ERROR_USER_NOT_FOUND));
}
```

### JavaFX (Frontend)

#### Estructura FXML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.layout.*?>
<?import javafx.scene.control.*?>

<!-- Root node siempre declarado -->
<BorderPane xmlns="http://javafx.com/javafx"
            prefWidth="1200" prefHeight="800"
            stylesheets="@../styles/main.css">
            
    <!-- Estructura clara -->
    <top>
        <!-- Top content -->
    </top>
    
    <left>
        <!-- Sidebar -->
    </left>
    
    <center>
        <!-- Main content -->
    </center>
    
    <right>
        <!-- Right panel si aplica -->
    </right>
    
    <bottom>
        <!-- Footer -->
    </bottom>
</BorderPane>
```

---

## ✅ Checklist Antes de Push

### Código
- [ ] Código compila sin errores
- [ ] No hay imports no utilizados
- [ ] Variables nombradas correctamente
- [ ] Functions / Métodos < 20 líneas
- [ ] JavaDoc completo
- [ ] Manejo de excepciones apropiado

### Testing
- [ ] Todos los tests pasan: `mvn test`
- [ ] Coverage > 80%
- [ ] Tests nombrados descriptivamente
- [ ] Tests son independientes

### Git
- [ ] Commits claros y ordenados
- [ ] Branch actualizado con main
- [ ] Sin conflictos

### Documentación
- [ ] README actualizado si aplica
- [ ] Cambios en arquitectura documentados
- [ ] Ejemplos añadidos si es necesario

---

## 🧪 Testing

### Backend (JUnit + Mockito)
```bash
# Ejecutar tests
mvn test

# Con cobertura
mvn clean test jacoco:report
# Ver en: target/site/jacoco/index.html
```

### Frontend (TestFX)
```bash
cd frontend
mvn test
```

### Ejemplo de Test
```java
@SpringBootTest
class UserServiceTest {
    
    @MockBean
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testFindUserById() {
        // Arrange
        User user = new User(1L, "test@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Act
        User result = userService.findById(1L);
        
        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }
}
```

---

## 📊 Code Review

### Lo que Buscamos
- ✅ Código limpio y legible
- ✅ Funcionalidad correcta
- ✅ Tests adecuados
- ✅ Documentación clara
- ✅ Sin código duplicado
- ✅ Performance aceptable
- ✅ Seguridad considerada

### Comentarios
- Sé respetuoso
- Sugiere mejoras
- Explica el "por qué"
- Aprecia el esfuerzo

---

## 🐛 Reportar Bugs

### Proporcionar
1. Descripción clara del bug
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Environment (OS, Java version, etc.)
5. Logs/Screenshots si aplica
6. Versión del proyecto

### Ejemplo
```
Título: [BUG] Login falla con emails con caracteres especiales

Descripción:
Cuando intento hacer login con un email que contiene caracteres especiales 
(ej: nombre+tag@gmail.com), el sistema rechaza el login.

Pasos para reproducir:
1. Abrir login
2. Ingresar "usuario+tag@gmail.com"
3. Ingrese contraseña válida
4. Click en "Inicia Sesión"
5. Error: "Email inválido"

Esperado:
El login debe aceptar emails con caracteres especiales válidos

Actual:
Rechazo del login con mensaje de error

Logs:
[ERROR] 2026-01-15 10:30:00 - Email validation failed...

Environment:
- Java: 17.0.5
- SO: Windows 11
- Versión: 1.0.0
```

---

## 💡 Feature Requests

### Template
```
Título: [FEATURE] Breve descripción

Problema:
- Describer el problema que esto resolvería

Solución Propuesta:
- Descripción detallada de la solución

Alternativas Consideradas:
- Otros approaches explorados

Contexto Adicional:
- Información extra relevante
```

---

## 📚 Recursos

- [Java Conventions](https://www.oracle.com/java/technologies/javase-code-style-guide.html)
- [Spring Best Practices](https://spring.io/guides)
- [JavaFX Documentation](https://openjfx.io/)
- [Git Workflow](https://git-scm.com/book/en/v2)

---

## 🙏 Agradecimientos

Gracias por contribuir a **Entornos Seguros Bogotá**. Cada contribución nos ayuda a crear una ciudad más segura.

---

**Versión**: 1.0.0 | **Actualizado**: Enero 2026
