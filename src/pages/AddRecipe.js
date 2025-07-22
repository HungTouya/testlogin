import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaArrowLeft } from "react-icons/fa";

function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    name: "",
    kcal: "",
    carbohydrates: "",
    fat: "",
    protein: "",
    ingredients: "",
    cookingInstructions: "",
    tip: "",
    diabetesType: "",
  });
  const [image, setImage] = useState(null);

  const determineDiabetesType = (kcal, carbs) => {
    const carbsValue = parseFloat(carbs); 
    const kcalValue = Number(kcal);

    const isType2 =
      carbsValue >= 30 && carbsValue <= 50 &&
      kcalValue >= 350 && kcalValue <= 500;

    const isType1 =
      carbsValue <= 60 &&
      kcalValue <= 600;

    if (isType2) {
      return "Type 2";
    } else if (isType1) {
      return "Type 1";
    } else {
      return "Not Classified";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const diabetesType = determineDiabetesType(recipe.kcal, recipe.carbohydrates);
    const storage = getStorage();
    const imageRef = ref(storage, `recipe-images/${Date.now()}-${image.name}`);

    try {
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "recipes"), {
        name: recipe.name,
        kcal: Number(recipe.kcal),
        carbohydrates: parseFloat(recipe.carbohydrates),
        fat: recipe.fat,
        protein: recipe.protein,
        ingredients: recipe.ingredients.split(",").map((i) => i.trim()),
        cookingInstructions: recipe.cookingInstructions,
        tip: recipe.tip,
        diabetesType,
        imageUrl,
      });

      alert("Recipe added successfully!");
      setRecipe({
        name: "",
        kcal: "",
        carbohydrates: "",
        fat: "",
        protein: "",
        ingredients: "",
        cookingInstructions: "",
        tip: "",
        diabetesType: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding recipe: ", error);
      alert("Failed to add recipe.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F0] p-6 flex flex-col items-center">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="flex items-center text-[#6F4F37] hover:text-[#5c3f2e] mb-4 font-medium"
      >
        <FaArrowLeft className="mr-2" /> Back to Admin Dashboard
      </button>

      <h2 className="text-3xl font-bold mb-6 text-[#6F4F37]">Add New Recipe</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg"
      >
        <input
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          placeholder="Recipe Name"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <input
          type="number"
          name="kcal"
          value={recipe.kcal}
          onChange={handleChange}
          placeholder="Calories (kcal)"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <input
          type="number"
          name="carbohydrates"
          value={recipe.carbohydrates}
          onChange={handleChange}
          placeholder="Carbohydrates (g)"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <input
          type="text"
          name="fat"
          value={recipe.fat}
          onChange={handleChange}
          placeholder="Fat (g)"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <input
          type="text"
          name="protein"
          value={recipe.protein}
          onChange={handleChange}
          placeholder="Protein (g)"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <input
          type="text"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma-separated)"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <textarea
          name="cookingInstructions"
          value={recipe.cookingInstructions}
          onChange={handleChange}
          placeholder="Cooking Instructions"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />
        <input
          type="text"
          name="tip"
          value={recipe.tip}
          onChange={handleChange}
          placeholder="Tip"
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full p-3 border border-[#FFA07A] rounded mb-3"
        />

        <p className="mb-3 font-semibold text-[#6F4F37]">
          Diabetes Type Recommendation:{" "}
          <span className="text-[#FFA07A]">
            {determineDiabetesType(recipe.kcal, recipe.carbohydrates)}
          </span>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FFA07A] text-white px-4 py-3 rounded w-full hover:bg-[#ff8c66] transition-colors"
        >
          {loading ? "Adding..." : "Add Recipe"}
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;




