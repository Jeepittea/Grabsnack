package com.grabsnack.backend.dto;

import java.time.Instant;

public class ApiResponse<T> {

    private boolean success;
    private T data;
    private ErrorBody error;
    private String timestamp;

    private ApiResponse() {
        this.timestamp = Instant.now().toString();
    }

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.data = data;
        return r;
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = false;
        r.data = null;
        r.error = new ErrorBody(code, message, null);
        return r;
    }

    public static <T> ApiResponse<T> fail(String code, String message, Object details) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = false;
        r.data = null;
        r.error = new ErrorBody(code, message, details);
        return r;
    }

    public boolean isSuccess()     { return success; }
    public T getData()             { return data; }
    public ErrorBody getError()    { return error; }
    public String getTimestamp()   { return timestamp; }

    public static class ErrorBody {
        private String code;
        private String message;
        private Object details;

        public ErrorBody(String code, String message, Object details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode()    { return code; }
        public String getMessage() { return message; }
        public Object getDetails() { return details; }
    }
}
