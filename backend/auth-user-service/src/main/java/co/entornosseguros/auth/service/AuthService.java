package co.entornosseguros.auth.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.entornosseguros.auth.domain.RoleEntity;
import co.entornosseguros.auth.domain.UserEntity;
import co.entornosseguros.auth.repository.RoleRepository;
import co.entornosseguros.auth.repository.UserRepository;
import co.entornosseguros.auth.security.JwtService;
import co.entornosseguros.auth.web.dto.AdminUserResponse;
import co.entornosseguros.auth.web.dto.AuthResponse;
import co.entornosseguros.auth.web.dto.CreateAdminUserRequest;
import co.entornosseguros.auth.web.dto.LoginRequest;
import co.entornosseguros.auth.web.dto.RegisterRequest;
import co.entornosseguros.auth.web.dto.UpdateAdminUserRequest;
import co.entornosseguros.auth.web.dto.UserSummaryResponse;

@Service
public class AuthService {

    private static final String DEFAULT_CITIZEN_ROLE = "USUARIO";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByCorreoIgnoreCase(email)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        if (userRepository.existsByCedula(request.cedula().trim())) {
            throw new IllegalArgumentException("La cédula ya está registrada");
        }

        RoleEntity role = resolveOrCreateDefaultCitizenRole();

        UserEntity user = new UserEntity();
        user.setRol(role);
        user.setCedula(request.cedula().trim());
        user.setNombres(request.nombres().trim());
        user.setApellidos(request.apellidos().trim());
        user.setTelefono(request.telefono().trim());
        user.setCorreo(email);
        user.setContrasenaHash(passwordEncoder.encode(request.password()));
        user.setActivo(Boolean.TRUE);

        UserEntity saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.password())
        );

        UserEntity user = userRepository.findByCorreoIgnoreCase(email)
            .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        return buildAuthResponse(user);
    }

    public UserSummaryResponse getMe(String email) {
        UserEntity user = userRepository.findByCorreoIgnoreCase(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        return toSummary(user);
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getActiveUsers() {
        return userRepository.findAllByActivoTrueOrderByFechaCreacionDesc().stream()
            .map(this::toAdminUserResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(Long id) {
        UserEntity user = userRepository.findById(id)
            .filter(entity -> Boolean.TRUE.equals(entity.getActivo()))
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        return toAdminUserResponse(user);
    }

    @Transactional
    public AdminUserResponse createAdminUser(CreateAdminUserRequest request) {
        String email = request.email().trim().toLowerCase();
        String cedula = request.cedula().trim();

        if (userRepository.existsByCorreoIgnoreCase(email)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        if (userRepository.existsByCedula(cedula)) {
            throw new IllegalArgumentException("La cédula ya está registrada");
        }

        RoleEntity role = resolveOrCreateRole(request.role());
        String[] names = splitFullName(request.fullName());

        UserEntity user = new UserEntity();
        user.setRol(role);
        user.setCedula(cedula);
        user.setNombres(names[0]);
        user.setApellidos(names[1]);
        user.setTelefono(request.telefono().trim());
        user.setCorreo(email);
        user.setContrasenaHash(passwordEncoder.encode(request.password()));
        user.setActivo(Boolean.TRUE);

        return toAdminUserResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse updateAdminUser(Long id, UpdateAdminUserRequest request) {
        UserEntity user = userRepository.findById(id)
            .filter(entity -> Boolean.TRUE.equals(entity.getActivo()))
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        String email = request.email().trim().toLowerCase();
        String cedula = request.cedula().trim();

        if (userRepository.existsByCorreoIgnoreCaseAndIdNot(email, id)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        if (userRepository.existsByCedulaAndIdNot(cedula, id)) {
            throw new IllegalArgumentException("La cédula ya está registrada");
        }

        RoleEntity role = resolveOrCreateRole(request.role());
        String[] names = splitFullName(request.fullName());

        user.setRol(role);
        user.setCedula(cedula);
        user.setNombres(names[0]);
        user.setApellidos(names[1]);
        user.setTelefono(request.telefono().trim());
        user.setCorreo(email);
        user.setContrasenaHash(passwordEncoder.encode(request.password()));

        return toAdminUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deactivateUser(Long id) {
        UserEntity user = userRepository.findById(id)
            .filter(entity -> Boolean.TRUE.equals(entity.getActivo()))
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        user.setActivo(Boolean.FALSE);
        userRepository.save(user);
    }

    private RoleEntity resolveOrCreateDefaultCitizenRole() {
        return roleRepository.findByNombreIgnoreCase(DEFAULT_CITIZEN_ROLE)
            .orElseGet(() -> {
                RoleEntity role = new RoleEntity();
                role.setNombre(DEFAULT_CITIZEN_ROLE);
                role.setDescripcion("Usuario ciudadano");
                return roleRepository.save(role);
            });
    }

    private RoleEntity resolveOrCreateRole(String roleNameRaw) {
        String roleName = normalizeRoleName(roleNameRaw);

        return roleRepository.findByNombreIgnoreCase(roleName)
            .orElseGet(() -> {
                RoleEntity role = new RoleEntity();
                role.setNombre(roleName);
                role.setDescripcion("Rol "+ roleName.toLowerCase());
                return roleRepository.save(role);
            });
    }

    private String normalizeRoleName(String roleRaw) {
        String normalized = roleRaw == null ? "" : roleRaw.trim().toUpperCase();

        if (normalized.equals("USUARIO")) {
            return "USUARIO";
        }

        if (normalized.equals("ADMINISTRADOR") || normalized.equals("ADMIN")) {
            return "ADMINISTRADOR";
        }

        if (normalized.equals("POLICIA") || normalized.equals("POLICÍA")) {
            return "POLICIA";
        }

        throw new IllegalArgumentException("Rol no válido");
    }

    private String[] splitFullName(String fullNameRaw) {
        String fullName = fullNameRaw.trim().replaceAll("\\s+", " ");
        String[] parts = fullName.split(" ");

        if (parts.length < 2) {
            return new String[] { fullName, "-" };
        }

        int middle = (int) Math.ceil(parts.length / 2.0);
        String first = String.join(" ", java.util.Arrays.copyOfRange(parts, 0, middle));
        String last = String.join(" ", java.util.Arrays.copyOfRange(parts, middle, parts.length));
        return new String[] { first, last };
    }

    private AuthResponse buildAuthResponse(UserEntity user) {
        String role = user.getRol().getNombre();
        String token = jwtService.generateToken(user.getId(), user.getCorreo(), role);

        return new AuthResponse(token, "Bearer", toSummary(user));
    }

    private UserSummaryResponse toSummary(UserEntity user) {
        return new UserSummaryResponse(
            user.getId(),
            user.getCorreo(),
            (user.getNombres() + " " + user.getApellidos()).trim(),
            user.getTelefono(),
            user.getRol().getNombre()
        );
    }

    private AdminUserResponse toAdminUserResponse(UserEntity user) {
        return new AdminUserResponse(
            user.getId(),
            user.getCedula(),
            (user.getNombres() + " " + user.getApellidos()).trim(),
            user.getTelefono(),
            user.getCorreo(),
            user.getRol().getNombre(),
            user.getActivo(),
            user.getFechaCreacion()
        );
    }
}
