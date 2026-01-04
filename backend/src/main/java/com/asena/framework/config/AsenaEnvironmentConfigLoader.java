package com.asena.framework.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class AsenaEnvironmentConfigLoader {
    private static final Logger log = LoggerFactory.getLogger(AsenaEnvironmentConfigLoader.class);

    private final ObjectMapper objectMapper;
    private AsenaEnvironmentConfig config;
    private volatile boolean loaded;

    public AsenaEnvironmentConfigLoader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.config = new AsenaEnvironmentConfig();
        this.config.environment = "local";
        this.loaded = false;
    }

    @PostConstruct
    public void init() {
        loadIfPresent();
    }

    public AsenaEnvironmentConfig get() {
        if (!loaded) {
            loadIfPresent();
        }
        if (config == null) {
            config = new AsenaEnvironmentConfig();
            config.environment = "local";
        }
        return config;
    }

    /**
     * Loads config/environment.json.
     * 
     * Resolution order:
     * 1) ASENA_ENV_FILE env var (absolute or relative)
     * 2) ./config/environment.json
     * 3) ../config/environment.json (when running from backend/)
     */
    public void loadIfPresent() {
        Path resolved = resolveConfigPath();
        if (resolved == null) {
            log.warn("Asena environment file not found. Using defaults.");
            loaded = true;
            return;
        }

        try {
            String json = Files.readString(resolved);
            this.config = objectMapper.readValue(json, AsenaEnvironmentConfig.class);
            log.info("Loaded Asena environment from: {} (environment={})", resolved.toAbsolutePath(), this.config.environment);
        } catch (Exception e) {
            log.warn("Failed to load Asena environment from {}. Using defaults. Error: {}", resolved.toAbsolutePath(), e.getMessage());
        } finally {
            loaded = true;
        }
    }

    private Path resolveConfigPath() {
        String fromEnv = System.getenv("ASENA_ENV_FILE");
        if (fromEnv != null && !fromEnv.isBlank()) {
            Path p = Paths.get(fromEnv.trim());
            if (Files.exists(p)) return p;
        }

        Path p1 = Paths.get("config", "environment.json");
        if (Files.exists(p1)) return p1;

        Path p2 = Paths.get("..", "config", "environment.json");
        if (Files.exists(p2)) return p2;

        return null;
    }
}
