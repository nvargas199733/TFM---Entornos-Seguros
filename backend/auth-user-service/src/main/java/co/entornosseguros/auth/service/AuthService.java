package co.entornosseguros.auth.service;

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
import co.entornosseguros.auth.web.dto.AuthResponse;
import co.entornosseguros.auth.web.dto.LoginRequest;
import co.entornosseguros.auth.web.dto.RegisterRequest;
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

    private RoleEntity resolveOrCreateDefaultCitizenRole() {
        return roleRepository.findByNombreIgnoreCase(DEFAULT_CITIZEN_ROLE)
            .orElseGet(() -> {
                RoleEntity role = new RoleEntity();
                role.setNombre(DEFAULT_CITIZEN_ROLE);
                role.setDescripcion("Usuario ciudadano");
                return roleRepository.save(role);
            });
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
            user.getNombres() + " " + user.getApellidos(),
            user.getRol().getNombre()
        );
    }
}
