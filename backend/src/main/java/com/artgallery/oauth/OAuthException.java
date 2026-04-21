package com.artgallery.oauth;

import org.springframework.http.HttpStatus;

/**
 * OAuth Exception
 * Custom exception for OAuth-related errors
 * 
 * @author Art Gallery Team
 */
public class OAuthException extends RuntimeException {

    private final String code;
    private final HttpStatus httpStatus;

    public OAuthException(String code, String message) {
        super(message);
        this.code = code;
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public OAuthException(String code, String message, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public OAuthException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
