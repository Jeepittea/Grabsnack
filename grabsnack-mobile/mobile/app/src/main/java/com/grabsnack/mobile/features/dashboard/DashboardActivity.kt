package com.grabsnack.mobile.features.dashboard

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.chip.ChipGroup
import com.grabsnack.mobile.R

class DashboardActivity : AppCompatActivity() {

    private lateinit var tvGreeting: TextView
    private lateinit var tvAvatar:   TextView
    private lateinit var etSearch:   EditText
    private lateinit var chipGroup:  ChipGroup
    private lateinit var rvFoodItems: RecyclerView
    private lateinit var bottomNav:  BottomNavigationView
    private lateinit var foodAdapter: FoodAdapter

    private val allFoodItems = listOf(
        FoodItem(1, "Crispy Chicken Burger", 120, "Burgers",  "🍔"),
        FoodItem(2, "Loaded Fries",           85,  "Fries",    "🍟"),
        FoodItem(3, "Cheese Dog",             95,  "Snacks",   "🌭"),
        FoodItem(4, "Iced Milk Tea",          75,  "Drinks",   "🧋"),
        FoodItem(5, "Chocolate Sundae",       65,  "Desserts", "🍦"),
        FoodItem(6, "Spicy Wings",            110, "Snacks",   "🍗")
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val userEmail = intent.getStringExtra("user_email") ?: ""
        val username  = userEmail.substringBefore("@")
            .replaceFirstChar { it.uppercaseChar() }.ifEmpty { "Foodie" }

        tvGreeting  = findViewById(R.id.tvGreeting)
        tvAvatar    = findViewById(R.id.tvAvatar)
        etSearch    = findViewById(R.id.etSearch)
        chipGroup   = findViewById(R.id.chipGroupCategories)
        rvFoodItems = findViewById(R.id.rvFoodItems)
        bottomNav   = findViewById(R.id.bottomNav)

        tvGreeting.text = "Hello, $username! 🍔"
        tvAvatar.text   = username.firstOrNull()?.uppercaseChar()?.toString() ?: "F"

        setupRecyclerView()
        setupChips()
        setupSearch()
        setupBottomNav()
    }

    private fun setupRecyclerView() {
        foodAdapter = FoodAdapter(allFoodItems)
        rvFoodItems.layoutManager = GridLayoutManager(this, 2)
        rvFoodItems.adapter = foodAdapter
        rvFoodItems.isNestedScrollingEnabled = false
    }

    private fun setupChips() {
        chipGroup.setOnCheckedStateChangeListener { _, checkedIds ->
            if (checkedIds.isEmpty()) return@setOnCheckedStateChangeListener
            val filtered = when (checkedIds[0]) {
                R.id.chipAll      -> allFoodItems
                R.id.chipBurgers  -> allFoodItems.filter { it.category == "Burgers"  }
                R.id.chipFries    -> allFoodItems.filter { it.category == "Fries"    }
                R.id.chipDrinks   -> allFoodItems.filter { it.category == "Drinks"   }
                R.id.chipSnacks   -> allFoodItems.filter { it.category == "Snacks"   }
                R.id.chipDesserts -> allFoodItems.filter { it.category == "Desserts" }
                else              -> allFoodItems
            }
            foodAdapter.updateItems(filtered)
        }
    }

    private fun setupSearch() {
        etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s?.toString()?.trim() ?: ""
                foodAdapter.updateItems(
                    if (query.isEmpty()) allFoodItems
                    else allFoodItems.filter { it.name.contains(query, ignoreCase = true) }
                )
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun setupBottomNav() {
        bottomNav.selectedItemId = R.id.nav_home
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home    -> true
                R.id.nav_cart    -> { Toast.makeText(this, "Cart coming soon! 🛒",    Toast.LENGTH_SHORT).show(); true }
                R.id.nav_orders  -> { Toast.makeText(this, "Orders coming soon! 📋",  Toast.LENGTH_SHORT).show(); true }
                R.id.nav_profile -> { Toast.makeText(this, "Profile coming soon! 👤", Toast.LENGTH_SHORT).show(); true }
                else -> false
            }
        }
    }
}
