package com.example.employeeapp.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds JWT signing configuration from {@code app.jwt.*} properties.
 */
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtProperties {

    /**
     * Secret key used to sign JWTs (HMAC). Must be at least 256 bits for HS256.
     */
    private String secret;

    /**
     * Token validity in milliseconds.
     */
    private long expirationMs;
}
