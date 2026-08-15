package co.entornosseguros.policereport.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
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
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(BEARER_PREFIX.length()).trim();
        if (token.isEmpty() || "null".equalsIgnoreCase(token) || "undefined".equalsIgnoreCase(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.extractClaims(token);
            Object rawUid = claims.get("uid");
            Object rawRole = claims.get("role");
            Long userId = rawUid instanceof Number number ? number.longValue() : null;
            String email = claims.getSubject();

            if (userId == null || email == null || email.isBlank() || rawRole == null || claims.getExpiration() == null
                || claims.getExpiration().before(new java.util.Date())) {
                filterChain.doFilter(request, response);
                return;
            }

            String authority = normalizeRole(rawRole.toString());
            AuthenticatedUser principal = new AuthenticatedUser(userId, email, authority.replaceFirst("^ROLE_", ""));
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                List.of(new SimpleGrantedAuthority(authority))
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug(
                    "POST authentication principalType={} principalId={} authority={}",
                    principal.getClass().getSimpleName(),
                    principal.id(),
                    authority
                );
            }
        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String normalizeRole(String role) {
        String normalized = role == null ? "" : role.trim().toUpperCase();
        return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
    }
}