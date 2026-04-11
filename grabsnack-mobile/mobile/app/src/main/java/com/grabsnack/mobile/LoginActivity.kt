package com.grabsnack.mobile

import android.content.Intent
import android.os.Bundle
import android.text.Html
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import com.grabsnack.mobile.network.LoginRequest
import com.grabsnack.mobile.network.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var tilEmail: TextInputLayout
    private lateinit var tilPassword: TextInputLayout
    private lateinit var etEmail: TextInputEditText
    private lateinit var etPassword: TextInputEditText
    private lateinit var btnLogin: Button
    private lateinit var tvRegisterLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        tilEmail = findViewById(R.id.tilEmail)
        tilPassword = findViewById(R.id.tilPassword)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        tvRegisterLink = findViewById(R.id.tvRegisterLink)

        tvRegisterLink.text = Html.fromHtml(
            getString(R.string.no_account),
            Html.FROM_HTML_MODE_LEGACY
        )

        btnLogin.setOnClickListener {
            if (validate()) {
                val email = etEmail.text.toString().trim()
                val password = etPassword.text.toString().trim()
                btnLogin.isEnabled = false
                login(email, password)
            }
        }

        tvRegisterLink.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
            // No finish() — Back press returns to Login
        }
    }

    private fun validate(): Boolean {
        var valid = true

        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        if (email.isEmpty()) {
            tilEmail.error = getString(R.string.error_empty_fields)
            valid = false
        } else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            tilEmail.error = getString(R.string.error_invalid_email)
            valid = false
        } else {
            tilEmail.error = null
        }

        if (password.isEmpty()) {
            tilPassword.error = getString(R.string.error_empty_fields)
            valid = false
        } else if (password.length < 6) {
            tilPassword.error = getString(R.string.error_password_short)
            valid = false
        } else {
            tilPassword.error = null
        }

        return valid
    }

    private fun login(email: String, password: String) {
        try {
            RetrofitClient.instance.login(LoginRequest(email, password))
                .enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(
                        call: Call<ResponseBody>,
                        response: Response<ResponseBody>
                    ) {
                        btnLogin.isEnabled = true
                        if (response.isSuccessful) {
                            Toast.makeText(
                                this@LoginActivity,
                                "Login Successful! Welcome back \uD83C\uDF54",
                                Toast.LENGTH_SHORT
                            ).show()
                            startActivity(
                                Intent(this@LoginActivity, DashboardActivity::class.java).apply {
                                    putExtra("user_email", email)
                                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                                            Intent.FLAG_ACTIVITY_CLEAR_TASK
                                }
                            )
                        } else {
                            val msg = response.errorBody()?.string() ?: "Invalid credentials"
                            Toast.makeText(this@LoginActivity, msg, Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        btnLogin.isEnabled = true
                        Toast.makeText(
                            this@LoginActivity,
                            getString(R.string.error_network, t.message),
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                })
        } catch (e: Exception) {
            btnLogin.isEnabled = true
            Toast.makeText(
                this,
                getString(R.string.error_network, e.message),
                Toast.LENGTH_SHORT
            ).show()
        }
    }
}
