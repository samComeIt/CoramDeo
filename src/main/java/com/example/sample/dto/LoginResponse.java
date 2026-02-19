package com.example.sample.dto;

public class LoginResponse {
    private String token;
    private Integer adminId;
    private String username;
    private String name;
    private String type;

    public LoginResponse() {
    }

    public LoginResponse(String token, Integer adminId, String username, String name, String type) {
        this.token = token;
        this.adminId = adminId;
        this.username = username;
        this.name = name;
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}