import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

const keywordSuggestions = [
  "gà",
  "bò",
  "tôm",
  "cá",
  "heo",
  "chay",
];


  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecipes(shuffleArray(recipeList).slice(0, 3));
    };

    fetchRecipes();
  }, []);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleKeywordClick = (keyword) => {
    navigate("/user-dashboard/menu", { state: { keyword } });
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/user-dashboard/menu/recipes/${recipeId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">DiabeticMealPlan</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Suggested Keywords</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {shuffleArray(keywordSuggestions).slice(0, 5).map((keyword, index) => (
            <button
              key={index}
              onClick={() => handleKeywordClick(keyword)}
              className="bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-3 text-center">Suggested Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
                <p className="text-gray-600 text-sm">{recipe.description?.slice(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

