package com.grabsnack.mobile.shared.network

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("api/auth/login")
    fun login(@Body request: LoginRequest): Call<ResponseBody>

    @POST("api/auth/register")
    fun register(@Body request: RegisterRequest): Call<ResponseBody>
}
