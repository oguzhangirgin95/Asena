package com.asena.framework.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AsenaEnvironmentConfig {
    public String environment;

    public Frontend frontend;
    public Backend backend;
    public Api api;
    public Security security;
    public Cors cors;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Frontend {
        public String baseUrl;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Backend {
        public String baseUrl;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Api {
        public String basePath;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Security {
        public Jwt jwt;

        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Jwt {
            public Long expirationMs;
            public String secret;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Cors {
        public List<String> allowedOrigins;
    }
}
