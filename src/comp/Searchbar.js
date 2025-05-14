import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length === 1) {
      handleSuggestionClick(suggestions[0].id);
    }
  };

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
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-[#A1887F]"
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

          <input
            type="search"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-[250px] md:w-[300px] lg:w-[350px] p-2.5 pl-10 text-sm text-[#4E342E] border border-[#EF7C59] rounded-lg bg-[#FFF6F0] placeholder-[#A1887F] focus:ring-[#EF7C59] focus:border-[#EF7C59]"
            placeholder="Search recipes..."
            required
          />

          <button
            type="submit"
            className="absolute inset-y-0 right-1.5 my-auto px-2 py-1 h-8 text-xs font-medium text-white bg-[#EF7C59] rounded-md hover:bg-[#d66546] focus:ring-2 focus:outline-none focus:ring-[#EF7C59]"
          >
            Search
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-[#FFF6F0] border border-[#EF7C59] rounded-lg shadow-lg z-10">
          {suggestions.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => handleSuggestionClick(recipe.id)}
              className="p-2 cursor-pointer text-[#4E342E] hover:bg-[#FFE0D2]"
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

