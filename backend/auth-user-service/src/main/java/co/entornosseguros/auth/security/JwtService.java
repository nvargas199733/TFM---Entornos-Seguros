package co.entornosseguros.auth.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
        @Value("${security.jwt.secret}") String secret,
        @Value("${security.jwt.expiration-ms}") long expirationMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId, String email, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMs);

        return Jwts.builder()
            .subject(email)
            .claim("uid", userId)
            .claim("role", role)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(signingKey)
            .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String expectedEmail) {
        Claims claims = extractClaims(token);
        return claims.getSubject().equalsIgnoreCase(expectedEmail)
            && claims.getExpiration().after(new Date());
    }
}
