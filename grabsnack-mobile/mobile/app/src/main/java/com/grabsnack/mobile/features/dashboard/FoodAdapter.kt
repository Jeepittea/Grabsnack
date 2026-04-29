package com.grabsnack.mobile.features.dashboard

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.grabsnack.mobile.R

class FoodAdapter(
    private var items: List<FoodItem>
) : RecyclerView.Adapter<FoodAdapter.FoodViewHolder>() {

    inner class FoodViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvEmoji: TextView = view.findViewById(R.id.tvFoodEmoji)
        val tvName:  TextView = view.findViewById(R.id.tvFoodName)
        val tvPrice: TextView = view.findViewById(R.id.tvFoodPrice)
        val btnAdd:  View     = view.findViewById(R.id.btnAddToCart)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FoodViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_food_card, parent, false)
        return FoodViewHolder(view)
    }

    override fun onBindViewHolder(holder: FoodViewHolder, position: Int) {
        val item = items[position]
        holder.tvEmoji.text = item.emoji
        holder.tvName.text  = item.name
        holder.tvPrice.text = "₱${item.price}"
        holder.btnAdd.setOnClickListener {
            Toast.makeText(holder.itemView.context,
                "${item.name} added to cart! 🛒", Toast.LENGTH_SHORT).show()
        }
    }

    override fun getItemCount() = items.size

    fun updateItems(newItems: List<FoodItem>) {
        items = newItems
        notifyDataSetChanged()
    }
}
