import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaArrowLeft } from "react-icons/fa";

function AddRecipe() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState({
        name: "",
        kcal: "",
        carbohydrates: "",
        fat: "", // Added fat field
        protein: "", // Added protein field
        ingredients: "",
        cookingInstructions: "",
        tip: "",
        diabetesType: "",
    });

    // Function to determine diabetes type suitability
    const determineDiabetesType = (kcal, carbs) => {
        const carbsValue = parseInt(carbs.replace("g", "").trim()); // Convert "40g" to 40
        const kcalValue = Number(kcal);

        if (carbsValue < 50 && kcalValue < 500) {
            return "Type 2"; // Low-carb, low-calorie meals fit Type 2 diabetes
        } else if (carbsValue >= 50 && kcalValue >= 500) {
            return "None"; // Regular diet, no restrictions
        } else {
            return "Type 1"; // Moderate balance suitable for Type 1 diabetes
        }
    };

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Determine diabetes recommendation before saving
        const diabetesType = determineDiabetesType(recipe.kcal, recipe.carbohydrates);

        try {
            await addDoc(collection(db, "recipes"), {
                name: recipe.name,
                kcal: Number(recipe.kcal),
                carbohydrates: recipe.carbohydrates,
                fat: recipe.fat, // Save fat to Firebase
                protein: recipe.protein, // Save protein to Firebase
                ingredients: recipe.ingredients.split(",").map(item => item.trim()),
                cookingInstructions: recipe.cookingInstructions,
                tip: recipe.tip,
                diabetesType: diabetesType, // Store calculated diabetes type
            });

            alert("Recipe added successfully!");
            setRecipe({ name: "", kcal: "", carbohydrates: "", fat: "", protein: "", ingredients: "", cookingInstructions: "", tip: "", diabetesType: "" });
        } catch (error) {
            console.error("Error adding recipe: ", error);
            alert("Failed to add recipe.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            {/* Back Button */}
            <button onClick={() => navigate("/admin-dashboard")} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <FaArrowLeft className="mr-2" /> Back to Admin Dashboard
            </button>

            <h2 className="text-3xl font-bold mb-6">Add New Recipe</h2>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
                <input type="text" name="name" value={recipe.name} onChange={handleChange} placeholder="Recipe Name" required className="w-full p-3 border rounded mb-3" />
                <input type="number" name="kcal" value={recipe.kcal} onChange={handleChange} placeholder="Calories (kcal)" required className="w-full p-3 border rounded mb-3" />
                <input type="text" name="carbohydrates" value={recipe.carbohydrates} onChange={handleChange} placeholder="Carbohydrates (e.g., 40g)" required className="w-full p-3 border rounded mb-3" />
                <input type="text" name="fat" value={recipe.fat} onChange={handleChange} placeholder="Fat (g)" required className="w-full p-3 border rounded mb-3" /> {/* Fat Input */}
                <input type="text" name="protein" value={recipe.protein} onChange={handleChange} placeholder="Protein (g)" required className="w-full p-3 border rounded mb-3" /> {/* Protein Input */}
                <input type="text" name="ingredients" value={recipe.ingredients} onChange={handleChange} placeholder="Ingredients (comma-separated)" required className="w-full p-3 border rounded mb-3" />
                <textarea name="cookingInstructions" value={recipe.cookingInstructions} onChange={handleChange} placeholder="Cooking Instructions" required className="w-full p-3 border rounded mb-3" />
                <input type="text" name="tip" value={recipe.tip} onChange={handleChange} placeholder="Tip" required className="w-full p-3 border rounded mb-3" />
                
                {/* Display assigned diabetes type */}
                <p className="mb-3 font-semibold">Diabetes Type Recommendation: <span className="text-blue-600">{determineDiabetesType(recipe.kcal, recipe.carbohydrates)}</span></p>

                <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-3 rounded w-full hover:bg-blue-600">
                    {loading ? "Adding..." : "Add Recipe"}
                </button>
            </form>
        </div>
    );
}

export default AddRecipe;

