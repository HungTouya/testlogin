import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function Recipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            const docRef = doc(db, "recipes", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setRecipe(docSnap.data());
            } else {
                console.error("No such recipe found!");
            }
        };
        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <p>Loading recipe...</p>;
    }

    return (
        <div>
            <h2>{recipe.name}</h2>
            <p><strong>Calories:</strong> {recipe.kcal} kcal</p>
            <p><strong>Carbohydrates:</strong> {recipe.carbohydrates}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p><strong>Cooking Instructions:</strong> {recipe.cookingInstructions}</p>
            <p><strong>Tip:</strong> {recipe.tip}</p>
        </div>
    );
}

export default Recipe;
