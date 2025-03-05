import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Menu() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipesList);
    };

    fetchRecipes();
  }, []);

  // Combined list of meat and seafood keywords
  const proteinKeywords = [
    "chicken",
    "beef",
    "pork",
    "lamb",
    "turkey",
    "ham",
    "bacon",
    "veal",
    "duck",
    "shrimp",
    "prawn",
    "crab",
    "lobster",
    "fish",
    "salmon",
    "tuna",
    "cod",
    "mackerel",
    "squid",
    "oyster",
    "clam",
    "mussel"
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => {
          // Find which protein keywords appear in the ingredients, excluding "fish sauce" for "fish"
          const uniqueProteins =
            recipe.ingredients &&
            [
              ...new Set(
                proteinKeywords.filter((keyword) =>
                  recipe.ingredients.some((ingredient) => {
                    const lower = ingredient.toLowerCase();
                    if (keyword === "fish") {
                      return lower.includes(keyword) && !lower.includes("fish sauce");
                    }
                    return lower.includes(keyword);
                  })
                )
              )
            ];

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
                {recipe.description && (
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                )}
                {/* Protein and Nutritional Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {uniqueProteins && uniqueProteins.length > 0 &&
                    uniqueProteins.map((protein, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                      >
                        {protein}
                      </span>
                    ))}
                  {recipe.kcal && (
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {recipe.kcal} kcal
                    </span>
                  )}
                  {recipe.carbohydrates && (
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {recipe.carbohydrates} Carbs
                    </span>
                  )}
                </div>
                <Link
                  to={`/user-dashboard/menu/recipes/${recipe.id}`}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Menu;





