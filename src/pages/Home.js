import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  const keywordSuggestions = ["gà", "bò", "tôm", "cá", "heo", "chay"];

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
    <div className="min-h-screen bg-[#FFF6F0]"> 
      <div
        className="w-full flex items-center justify-center bg-cover bg-center h-64 mb-10"
        style={{
          backgroundImage: "url('/Home.jpg')",
        }}
      >
        <h1
          className="text-6xl font-extrabold drop-shadow-xl"
          style={{
            color: "#4E342E", 
            backgroundColor: "rgba(255, 243, 233, 0.9)", 
            padding: "0.6em 1.2em",
            borderRadius: "1.5rem",
          }}
        >
          DiabeticMealPlan
        </h1>
      </div>

      <div className="flex flex-col items-center mb-10 px-6">
        <h2 className="text-2xl font-semibold mb-3 text-[#4E342E]">Từ khóa được đề xuất</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {shuffleArray(keywordSuggestions)
            .slice(0, 5)
            .map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleKeywordClick(keyword)}
                className="bg-[#EF7C59] text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#d66546] transition duration-200"
              >
                {keyword}
              </button>
            ))}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-3 text-center text-[#4E342E]">
          Công thức nấu ăn được đề xuất
        </h2>
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
                <h3 className="text-xl font-semibold mb-2 text-[#4E342E]">
                  {recipe.name}
                </h3>
                <p className="text-[#6D4C41] text-sm">
                  {recipe.description?.slice(0, 80)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

