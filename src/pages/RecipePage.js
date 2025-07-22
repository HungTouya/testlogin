import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../css/recipe.css";

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAlt = location.pathname.includes("altRecipes");

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const collectionName = isAlt ? "altRecipes" : "recipes";
      const recipeDoc = await getDoc(doc(db, collectionName, id));

      if (recipeDoc.exists()) {
        setRecipe(recipeDoc.data());
      } else {
        setRecipe(null);
      }
    };

    fetchRecipe();
  }, [id, isAlt]);

  if (!recipe) return <p className="text-center text-gray-500 mt-6">Không tìm thấy công thức.</p>;

  return (
    <div className="recipe-container">
      <div className="recipe-card">
        <button 
          onClick={() => navigate("/user-dashboard/menu")} 
          className="back-button"
        >
          ⬅ Quay lại Menu
        </button>
        <h2 className="recipe-title">{recipe.name}</h2>
        {recipe.imageUrl && (
          <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
        )}
        <p className="recipe-text"><span className="recipe-label">Calories:</span> {recipe.kcal} kcal</p>
        <p className="recipe-text"><span className="recipe-label">Carbohydrates:</span> {recipe.carbohydrates}</p>
        <p className="recipe-text"><span className="recipe-label">Fat:</span> {recipe.fat} g</p>
        <p className="recipe-text"><span className="recipe-label">Protein:</span> {recipe.protein} g</p>
        <p className="recipe-text"><span className="recipe-label">Nguyên Liệu:</span> {recipe.ingredients?.join(", ")}</p>
        <p className="recipe-text"><span className="recipe-label">Công thức:</span> {recipe.cookingInstructions}</p>
        {recipe.tip && (
          <p className="recipe-text"><span className="recipe-label">Tip:</span> {recipe.tip}</p>
        )}
      </div>
    </div>
  );
}

export default RecipePage;



