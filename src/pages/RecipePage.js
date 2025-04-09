import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

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

  if (!recipe) return <p className="text-center text-gray-500 mt-6">Recipe not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <button 
          onClick={() => navigate("/user-dashboard/menu")} 
          className="text-xl font-bold mb-4 flex items-center"
        >
          <span className="mr-2">⬅</span> Back to Menu
        </button>
        <h2 className="text-3xl font-semibold mb-4">{recipe.name}</h2>
        {recipe.imageUrl && (
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 object-cover rounded mb-4" />
        )}
        <p className="mb-2"><strong>Calories:</strong> {recipe.kcal} kcal</p>
        <p className="mb-2"><strong>Carbohydrates:</strong> {recipe.carbohydrates}</p>
        <p className="mb-2"><strong>Fat:</strong> {recipe.fat} g</p>
        <p className="mb-2"><strong>Protein:</strong> {recipe.protein} g</p>
        <p className="mb-2"><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
        <p className="mb-2"><strong>Cooking Instructions:</strong> {recipe.cookingInstructions}</p>
        {recipe.tip && (
          <p className="mb-2"><strong>Tip:</strong> {recipe.tip}</p>
        )}
      </div>
    </div>
  );
}

export default RecipePage;




