package co.entornosseguros.auth.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import co.entornosseguros.auth.domain.UserEntity;
import co.entornosseguros.auth.repository.UserRepository;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByCorreoIgnoreCase(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        String rawRole = user.getRol() != null && user.getRol().getNombre() != null
            ? user.getRol().getNombre().trim().toUpperCase()
            : "";
        String role = (rawRole.equals("ADMINISTRADOR") || rawRole.equals("ADMIN")) ? "ADMIN" : rawRole;
        String roleName = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        return User.builder()
            .username(user.getCorreo())
            .password(user.getContrasenaHash())
            .authorities(Collections.singletonList(new SimpleGrantedAuthority(roleName)))
            .disabled(!Boolean.TRUE.equals(user.getActivo()))
            .build();
    }
}
