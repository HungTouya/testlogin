import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Menu() {
  const [recipes, setRecipes] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const location = useLocation();
  const filterKeyword = location.state?.keyword || "";

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      let recipesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (filterKeyword) {
        recipesList = recipesList.filter((recipe) =>
          recipe.ingredients?.some((ingredient) =>
            ingredient.toLowerCase().includes(filterKeyword.toLowerCase())
          )
        );
        setSelectedIngredient(filterKeyword);
      }

      setRecipes(recipesList);
    };

    fetchRecipes();
  }, [filterKeyword]);

  const sortRecipes = (recipes, option) => {
    let sorted = [...recipes];

    switch (option) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "kcal-asc":
        return sorted.sort((a, b) => (a.kcal || 0) - (b.kcal || 0));
      case "kcal-desc":
        return sorted.sort((a, b) => (b.kcal || 0) - (a.kcal || 0));
      case "carbs-asc":
        return sorted.sort((a, b) => (a.carbohydrates || 0) - (b.carbohydrates || 0));
      case "carbs-desc":
        return sorted.sort((a, b) => (b.carbohydrates || 0) - (a.carbohydrates || 0));
      case "protein-asc":
        return sorted.sort((a, b) => (a.protein || 0) - (b.protein || 0));
      case "protein-desc":
        return sorted.sort((a, b) => (b.protein || 0) - (a.protein || 0));
      case "fat-asc":
        return sorted.sort((a, b) => (a.fat || 0) - (b.fat || 0));
      case "fat-desc":
        return sorted.sort((a, b) => (b.fat || 0) - (a.fat || 0));
      default:
        return sorted;
    }
  };

  const filteredRecipes = selectedIngredient
    ? recipes.filter((recipe) =>
        recipe.ingredients?.some((ingredient) =>
          ingredient.toLowerCase().includes(selectedIngredient.toLowerCase())
        )
      )
    : recipes;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header + Filters (fixed height) */}
      <div className="p-6 flex-shrink-0 bg-gray-100 z-10">
        <h1 className="text-3xl font-bold text-center mb-6">Menu</h1>
        <div className="flex flex-wrap justify-center gap-4">
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
            <option value="protein-asc">Protein (Low to High)</option>
            <option value="protein-desc">Protein (High to Low)</option>
            <option value="fat-asc">Fat (Low to High)</option>
            <option value="fat-desc">Fat (High to Low)</option>
          </select>

          <input
            type="text"
            placeholder="Filter by ingredient (e.g., beef)"
            className="bg-white border rounded px-4 py-2 text-gray-700"
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Recipe List */}
      <div className="flex-1 overflow-y-auto p-6">
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
                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  {recipe.kcal && (
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      {recipe.kcal} kcal
                    </span>
                  )}
                  {recipe.carbohydrates && (
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      {recipe.carbohydrates}g Carbs
                    </span>
                  )}
                  {recipe.protein && (
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      {recipe.protein}g Protein
                    </span>
                  )}
                  {recipe.fat && (
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      {recipe.fat}g Fat
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
    </div>
  );
}

export default Menu;








