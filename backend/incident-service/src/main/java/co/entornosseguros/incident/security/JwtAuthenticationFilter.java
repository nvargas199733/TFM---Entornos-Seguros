package co.entornosseguros.incident.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length()).trim();
        if (token.isEmpty() || "null".equalsIgnoreCase(token) || "undefined".equalsIgnoreCase(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.extractClaims(token);
            if (claims.getExpiration() == null || claims.getExpiration().before(new java.util.Date())) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = claims.getSubject();
            Object rawUid = claims.get("uid");
            Object role = claims.get("role");

            Long userId = rawUid instanceof Number number ? number.longValue() : null;

            if (email == null || email.isBlank() || userId == null || role == null || role.toString().isBlank()) {
                filterChain.doFilter(request, response);
                return;
            }

            String normalizedRole = normalizeRole(role.toString());
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(normalizedRole));

            AuthenticatedUser principal = new AuthenticatedUser(
                userId,
                email,
                normalizedRole.replaceFirst("^ROLE_", "")
            );

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                authorities
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug(
                    "JWT authentication principalId={} role={} authorities={}",
                    principal.id(),
                    principal.role(),
                    authorities
                );
            }
        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "ROLE_USER";
        }

        String trimmed = role.trim();
        if (trimmed.startsWith("ROLE_")) {
            return trimmed;
        }

        return "ROLE_" + trimmed.toUpperCase();
    }
}
