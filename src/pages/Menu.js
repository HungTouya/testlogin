import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Menu() {
  const [recipes, setRecipes] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const location = useLocation();
  const filterKeyword = location.state?.keyword || ""; // Get keyword from Home.js

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      let recipesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Auto-filter recipes if a keyword was passed from Home.js
      if (filterKeyword) {
        recipesList = recipesList.filter((recipe) =>
          recipe.ingredients?.some((ingredient) =>
            ingredient.toLowerCase().includes(filterKeyword.toLowerCase())
          )
        );
        setSelectedIngredient(filterKeyword); // Auto-fill ingredient filter
      }

      setRecipes(recipesList);
    };

    fetchRecipes();
  }, [filterKeyword]);

  const sortRecipes = (recipes, option) => {
    let sortedRecipes = [...recipes];

    if (option === "name-asc") {
      sortedRecipes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "name-desc") {
      sortedRecipes.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === "kcal-asc") {
      sortedRecipes.sort((a, b) => (a.kcal || 0) - (b.kcal || 0));
    } else if (option === "kcal-desc") {
      sortedRecipes.sort((a, b) => (b.kcal || 0) - (a.kcal || 0));
    } else if (option === "carbs-asc") {
      sortedRecipes.sort((a, b) => (a.carbohydrates || 0) - (b.carbohydrates || 0));
    } else if (option === "carbs-desc") {
      sortedRecipes.sort((a, b) => (b.carbohydrates || 0) - (a.carbohydrates || 0));
    }

    return sortedRecipes;
  };

  const filteredRecipes = selectedIngredient
    ? recipes.filter((recipe) =>
        recipe.ingredients?.some((ingredient) =>
          ingredient.toLowerCase().includes(selectedIngredient.toLowerCase())
        )
      )
    : recipes;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>

      {/* Sorting and Ingredient Filter */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <select
          className="bg-white border rounded px-4 py-2 text-gray-700"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="kcal-asc">Calories (Low to High)</option>
          <option value="kcal-desc">Calories (High to Low)</option>
          <option value="carbs-asc">Carbs (Low to High)</option>
          <option value="carbs-desc">Carbs (High to Low)</option>
        </select>

        <input
          type="text"
          placeholder="Filter by ingredient (e.g., beef)"
          className="bg-white border rounded px-4 py-2 text-gray-700"
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortRecipes(filteredRecipes, sortOption).map((recipe) => (
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
              <div className="flex flex-wrap gap-2 mb-4">
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
        ))}
      </div>
    </div>
  );
}

export default Menu;








