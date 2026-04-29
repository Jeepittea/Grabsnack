package com.grabsnack.mobile.features.auth

import android.content.Intent
import android.os.Bundle
import android.text.Html
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import com.grabsnack.mobile.R
import com.grabsnack.mobile.shared.network.RegisterRequest
import com.grabsnack.mobile.shared.network.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    private lateinit var tilFullName: TextInputLayout
    private lateinit var tilEmail:    TextInputLayout
    private lateinit var tilPassword: TextInputLayout
    private lateinit var etFullName:  TextInputEditText
    private lateinit var etEmail:     TextInputEditText
    private lateinit var etPassword:  TextInputEditText
    private lateinit var btnRegister: Button
    private lateinit var tvLoginLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        tilFullName  = findViewById(R.id.tilFullName)
        tilEmail     = findViewById(R.id.tilEmail)
        tilPassword  = findViewById(R.id.tilPassword)
        etFullName   = findViewById(R.id.etFullName)
        etEmail      = findViewById(R.id.etEmail)
        etPassword   = findViewById(R.id.etPassword)
        btnRegister  = findViewById(R.id.btnRegister)
        tvLoginLink  = findViewById(R.id.tvLoginLink)

        tvLoginLink.text = Html.fromHtml(getString(R.string.has_account), Html.FROM_HTML_MODE_LEGACY)

        btnRegister.setOnClickListener {
            if (validate()) {
                btnRegister.isEnabled = false
                register(etFullName.text.toString().trim(),
                         etEmail.text.toString().trim(),
                         etPassword.text.toString().trim())
            }
        }

        tvLoginLink.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    private fun validate(): Boolean {
        var valid = true
        val fullName = etFullName.text.toString().trim()
        val email    = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        if (fullName.isEmpty()) { tilFullName.error = getString(R.string.error_empty_fields); valid = false }
        else tilFullName.error = null

        if (email.isEmpty()) { tilEmail.error = getString(R.string.error_empty_fields); valid = false }
        else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            tilEmail.error = getString(R.string.error_invalid_email); valid = false
        } else tilEmail.error = null

        if (password.isEmpty()) { tilPassword.error = getString(R.string.error_empty_fields); valid = false }
        else if (password.length < 6) { tilPassword.error = getString(R.string.error_password_short); valid = false }
        else tilPassword.error = null

        return valid
    }

    private fun register(fullName: String, email: String, password: String) {
        try {
            RetrofitClient.instance.register(RegisterRequest(fullName, email, password))
                .enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                        btnRegister.isEnabled = true
                        if (response.isSuccessful) {
                            Toast.makeText(this@RegisterActivity,
                                getString(R.string.register_success), Toast.LENGTH_LONG).show()
                            startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                            finish()
                        } else {
                            Toast.makeText(this@RegisterActivity,
                                response.errorBody()?.string() ?: "Registration failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        btnRegister.isEnabled = true
                        Toast.makeText(this@RegisterActivity,
                            getString(R.string.error_network, t.message), Toast.LENGTH_SHORT).show()
                    }
                })
        } catch (e: Exception) {
            btnRegister.isEnabled = true
            Toast.makeText(this, getString(R.string.error_network, e.message), Toast.LENGTH_SHORT).show()
        }
    }
}
