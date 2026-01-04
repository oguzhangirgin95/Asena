package com.asena.framework.security;

import com.asena.framework.config.AsenaEnvironmentConfig;
import com.asena.framework.config.AsenaEnvironmentConfigLoader;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final AsenaEnvironmentConfigLoader envLoader;
    private volatile Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private volatile long expiration = 3600000; // 1 hour

    public JwtTokenProvider(AsenaEnvironmentConfigLoader envLoader) {
        this.envLoader = envLoader;
        applyEnvIfPresent();
    }

    private void applyEnvIfPresent() {
        AsenaEnvironmentConfig env = envLoader.get();
        if (env.security != null && env.security.jwt != null) {
            if (env.security.jwt.expirationMs != null) {
                this.expiration = env.security.jwt.expirationMs;
            }

            String secret = env.security.jwt.secret;
            if (secret != null) {
                String trimmed = secret.trim();
                if (trimmed.length() >= 32 && !trimmed.startsWith("CHANGE_ME")) {
                    this.key = Keys.hmacShaKeyFor(trimmed.getBytes(StandardCharsets.UTF_8));
                }
            }
        }
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
