import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function RecipePage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;
            const recipeDoc = await getDoc(doc(db, "recipes", id));
            if (recipeDoc.exists()) {
                setRecipe(recipeDoc.data());
            } else {
                setRecipe(null);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) return <p>Recipe not found.</p>;

    return (
        <div>
            {/* Back Arrow Button */}
            <h2>
                <button onClick={() => navigate("/user-dashboard/menu")} style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    marginRight: "10px",
                    fontSize: "20px",
                    color: "black"
                }}>⬅</button>
                {recipe.name}
            </h2>
            <p><strong>Calories:</strong> {recipe.kcal} kcal</p>
            <p><strong>Carbohydrates:</strong> {recipe.carbohydrates}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p><strong>Cooking Instructions:</strong> {recipe.cookingInstructions}</p>
            <p><strong>Tip:</strong> {recipe.tip}</p>
        </div>
    );
}

export default RecipePage;



