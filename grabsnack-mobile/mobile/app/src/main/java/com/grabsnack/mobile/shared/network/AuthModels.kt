package com.grabsnack.mobile.shared.network

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    @SerializedName("fullName") val fullName: String,
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String?,
    val message: String?
)
