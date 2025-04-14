import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch recipes from Firestore when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Filter recipes based on user query
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [query, recipes]);

  // Handle form submission (e.g., if only one suggestion is available)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length === 1) {
      handleSuggestionClick(suggestions[0].id);
    }
  };

  // Navigate to recipe page on suggestion click
  const handleSuggestionClick = (id) => {
    navigate(`/user-dashboard/menu/recipes/${id}`);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative flex flex-col">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="search"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-[250px] md:w-[300px] lg:w-[350px] p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search recipes..."
            required
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute inset-y-0 right-1.5 my-auto px-2 py-1 h-8 w-15 text-xs font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 z-10">
          {suggestions.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => handleSuggestionClick(recipe.id)}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

