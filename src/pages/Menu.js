import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

function Menu() {
  const [recipes, setRecipes] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const filterKeyword = location.state?.keyword || "";

  useEffect(() => {
    const fetchRecipes = async () => {
      const snapshot = await getDocs(collection(db, "recipes"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(data);
      if (filterKeyword) {
        setSelectedIngredient(filterKeyword);
      }
    };
    fetchRecipes();
  }, [filterKeyword]);

  const handleSort = (recipes, option) => {
    const sorted = [...recipes];
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

  const filtered = recipes.filter(
    (recipe) =>
      selectedIngredient === "" ||
      recipe.ingredients?.some((ing) =>
        ing.toLowerCase().includes(selectedIngredient.toLowerCase())
      )
  );

  const sortedRecipes = handleSort(filtered, sortOption);

  const handleViewRecipe = async (recipe) => {
  if (!auth.currentUser) {
    alert("Bạn cần đăng nhập để xem công thức.");
    return;
  }

  try {
    const userRef = doc(db, "customersData", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Không tìm thấy thông tin người dùng.");
      return;
    }

    const userData = userSnap.data();
    const userDiabetesType = userData.diabetesType?.toLowerCase() || "none";
    const recipeDiabetesType = recipe.diabetesType?.toLowerCase() || "";

    if (recipeDiabetesType === "none" && userDiabetesType !== "none") {
      let choice = window.prompt(
        "Công thức này không phù hợp cho người tiểu đường.\n" +
        "Nhập:\n" +
        "'alt' để xem phiên bản phù hợp,\n" +
        "'yes' để tiếp tục xem công thức gốc,\n" +
        "'no' để quay lại menu."
      );

      if (!choice) {
        navigate(`/user-dashboard/menu`);
        return;
      }

      choice = choice.toLowerCase();

      if (choice === "alt") {
        navigate(`/user-dashboard/menu/altRecipes/${recipe.id}`);
      } else if (choice === "yes") {
        navigate(`/user-dashboard/menu/recipes/${recipe.id}`);
      } else {
        navigate(`/user-dashboard/menu`);
      }
    } else {
      navigate(`/user-dashboard/menu/recipes/${recipe.id}`);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    alert("Đã có lỗi xảy ra, vui lòng thử lại.");
  }
};


  return (
    <div className="h-screen flex flex-col bg-[#FFF6F0]">
      <div className="p-6 flex-shrink-0 z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#4E342E]">Menu</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <select
            className="bg-[#FFF6F0] border border-[#EF7C59] rounded px-4 py-2 text-[#4E342E]"
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
            className="bg-[#FFF6F0] border border-[#EF7C59] rounded px-4 py-2 text-[#4E342E]"
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecipes.map((recipe) => (
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
                <h2 className="text-xl font-semibold mb-2 text-[#4E342E]">{recipe.name}</h2>
                {recipe.description && (
                  <p className="text-[#4E342E] mb-4">{recipe.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  {recipe.kcal && (
                    <span className="bg-[#FFE0D2] px-2 py-1 rounded text-[#4E342E]">
                      {recipe.kcal} kcal
                    </span>
                  )}
                  {recipe.carbohydrates && (
                    <span className="bg-[#FFE0D2] px-2 py-1 rounded text-[#4E342E]">
                      {recipe.carbohydrates}g Carbs
                    </span>
                  )}
                  {recipe.protein && (
                    <span className="bg-[#FFE0D2] px-2 py-1 rounded text-[#4E342E]">
                      {recipe.protein}g Protein
                    </span>
                  )}
                  {recipe.fat && (
                    <span className="bg-[#FFE0D2] px-2 py-1 rounded text-[#4E342E]">
                      {recipe.fat}g Fat
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleViewRecipe(recipe)}
                  className="bg-[#EF7C59] text-white py-2 px-4 rounded hover:bg-[#d66546] inline-block"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;










