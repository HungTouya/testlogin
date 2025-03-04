import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState({
        name: "",
        kcal: "",
        carbohydrates: "",
        ingredients: "",
        cookingInstructions: "",
        tip: ""
    });

    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "recipes"), {
                name: recipe.name,
                kcal: Number(recipe.kcal),
                carbohydrates: recipe.carbohydrates,
                ingredients: recipe.ingredients.split(",").map(item => item.trim()), // Convert string to array
                cookingInstructions: recipe.cookingInstructions,
                tip: recipe.tip
            });

            alert("Recipe added successfully!");
            setRecipe({ name: "", kcal: "", carbohydrates: "", ingredients: "", cookingInstructions: "", tip: "" }); // Reset form
        } catch (error) {
            console.error("Error adding recipe: ", error);
            alert("Failed to add recipe.");
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin! You can manage users and recipes here.</p>

            <h3>Add New Recipe</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={recipe.name} onChange={handleChange} placeholder="Recipe Name" required />
                <input type="number" name="kcal" value={recipe.kcal} onChange={handleChange} placeholder="Calories (kcal)" required />
                <input type="text" name="carbohydrates" value={recipe.carbohydrates} onChange={handleChange} placeholder="Carbohydrates (e.g., 40g)" required />
                <input type="text" name="ingredients" value={recipe.ingredients} onChange={handleChange} placeholder="Ingredients (comma-separated)" required />
                <textarea name="cookingInstructions" value={recipe.cookingInstructions} onChange={handleChange} placeholder="Cooking Instructions" required />
                <input type="text" name="tip" value={recipe.tip} onChange={handleChange} placeholder="Tip" required />
                <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Recipe"}</button>
            </form>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AdminDashboard;

