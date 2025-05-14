import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import WarningModal from "../comp/WarningModal";  

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [alternativeRecipes, setAlternativeRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const recipeDoc = await getDoc(doc(db, "recipes", id));
      if (!recipeDoc.exists()) return;

      const recipeData = recipeDoc.data();
      setRecipe(recipeData);

      const userTypeRaw = localStorage.getItem("diabetesType") || "None"; 
      const mapUserType = {
        "1": "Type1",
        "2": "Type2",
        "None": "None"
      };
      const userType = mapUserType[userTypeRaw];

      if (
        userType !== "None" &&
        recipeData.diabetesType === "None"
      ) {
        setShowWarning(true);
        fetchAlternatives(userType);  
      }
    };

    const fetchAlternatives = async (userType) => {
      const snapshot = await getDocs(collection(db, "recipes"));
      const alternatives = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(r => r.diabetesType === userType);  

      setAlternativeRecipes(alternatives); // 🔧 Thêm dòng này
    };

    fetchRecipe();
  }, [id]);

  const handleContinue = () => {
    setShowWarning(false);  
  };

  const handleBack = () => {
    navigate("/user-dashboard/menu");  
  };

  const handleSuggestAlternative = () => {
    if (alternativeRecipes.length > 0) {
      const random = alternativeRecipes[Math.floor(Math.random() * alternativeRecipes.length)];
      navigate(`/user-dashboard/menu/recipes/${random.id}`);
    } else {
      alert("Không tìm thấy món thay thế phù hợp.");
      setShowWarning(false);
    }
  };

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
        <p className="mb-2"><strong>Ingredients:</strong> {recipe.ingredients?.join(", ")}</p>
        <p className="mb-2"><strong>Cooking Instructions:</strong> {recipe.cookingInstructions}</p>
        {recipe.tip && <p className="mb-2"><strong>Tip:</strong> {recipe.tip}</p>}
      </div>

      {showWarning && (
        <WarningModal 
          onContinue={handleContinue}
          onBack={handleBack}
          onSuggestAlternative={handleSuggestAlternative}
        />
      )}
    </div>
  );
}

export default RecipePage;

