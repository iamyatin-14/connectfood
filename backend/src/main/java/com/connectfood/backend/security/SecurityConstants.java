package com.connectfood.backend.security;

public class SecurityConstants {
    public static final String JWT_SECRET = "VerySecretKeyChangeThisInProd";
    public static final long JWT_EXPIRATION_MS = 86400000; // 1 day
    public static final String AUTH_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
}