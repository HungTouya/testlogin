import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";

function Schedule() {
  const [activeTab, setActiveTab] = useState("expert");
  const [schedule, setSchedule] = useState({});
  const [customSchedule, setCustomSchedule] = useState({});
  const [recipesList, setRecipesList] = useState([]);
  const [recipesDataMap, setRecipesDataMap] = useState({});
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];
  const CALORIE_LIMIT = 1800;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "customersData", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        let { diabetesType = "none", favoriteFlavors = [] } = userSnap.data();

        if (diabetesType === "1") diabetesType = "type1";
        else if (diabetesType === "2") diabetesType = "type2";

        const scheduleDoc = await getDoc(doc(db, "schedules", diabetesType));
        setSchedule(scheduleDoc.data() || {});

        const customSnap = await getDoc(doc(db, "customSchedules", auth.currentUser.uid));
        if (customSnap.exists()) {
          setCustomSchedule(customSnap.data());
        } else {
          const custom = {};
          days.forEach(day => {
            custom[day] = {};
            meals.forEach(meal => {
              custom[day][meal] = `${favoriteFlavors[0] || "Healthy"} ${meal}`;
            });
          });
          setCustomSchedule(custom);
        }

        const recipesSnapshot = await getDocs(collection(db, "recipes"));
        const recipes = [];
        const recipeMap = {};
        recipesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          recipes.push(data.name);
          recipeMap[data.name] = data;
        });
        setRecipesList(recipes);
        setFilteredRecipes(recipes);
        setRecipesDataMap(recipeMap);
      } catch (err) {
        console.error("Failed to fetch schedules:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = recipesList.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredRecipes(filtered);
  }, [searchTerm, recipesList]);

  const getExceededDays = (data) => {
    return days.filter(day => {
      const total = meals.reduce((sum, meal) => {
        const recipe = recipesDataMap[data[day]?.[meal]];
        return sum + (recipe?.kcal || 0);
      }, 0);
      return total > CALORIE_LIMIT;
    });
  };

  const renderTable = (data) => (
    <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg mt-4">
      <thead>
        <tr className="bg-[#FCD5B5] text-[#3E1F00]">
          <th className="border border-gray-300 px-4 py-2">Meal</th>
          {days.map((day, i) => (
            <th key={i} className="border border-gray-300 px-4 py-2">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {meals.map((meal, i) => (
          <tr key={i} className="text-center hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2 font-semibold bg-[#F6C28B] text-[#3E1F00]">{meal}</td>
            {days.map((day, j) => {
              const recipeName = data[day]?.[meal];
              const recipe = recipesDataMap[recipeName];
              return (
                <td key={j} className="border border-gray-300 px-4 py-2">
                  {editingMode && activeTab === "custom" && editingMeal === `${day}-${meal}` ? (
                    <div className="relative">
                      <select
                        className="border p-1 w-full"
                        value={customSchedule[day]?.[meal] || ""}
                        onChange={(e) => {
                          const updated = { ...customSchedule };
                          if (!updated[day]) updated[day] = {};
                          updated[day][meal] = e.target.value;
                          setCustomSchedule(updated);
                        }}
                      >
                        <option value="">Select</option>
                        {filteredRecipes.map((r, idx) => (
                          <option key={idx} value={r}>{r}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => setEditingMeal(null)} 
                        className="absolute top-1 right-1 text-red-500"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => setEditingMeal(`${day}-${meal}`)} className="cursor-pointer text-blue-500">
                      <div>{recipeName || "-"}</div>
                      {recipe && (
                        <div className="text-xs text-gray-500">
                          {recipe.kcal} kcal, {recipe.carbohydrates}g carbs
                        </div>
                      )}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
        {/* Nutrition Summary Row */}
        <tr className="bg-[#F6E7D8] font-semibold">
          <td className="border border-gray-300 px-4 py-2 text-[#3E1F00]">Calories</td>
          {days.map(day => {
            const total = meals.reduce((acc, meal) => {
              const recipe = recipesDataMap[data[day]?.[meal]];
              return acc + (recipe?.kcal || 0);
            }, 0);
            return (
              <td
                key={day}
                className={`border border-gray-300 px-4 py-2 ${total > CALORIE_LIMIT ? "text-red-500 font-bold" : ""}`}
              >
                {total}
              </td>
            );
          })}
        </tr>
        <tr className="bg-[#F6E7D8] font-semibold">
          <td className="border border-gray-300 px-4 py-2 text-[#3E1F00]">Carbohydrates</td>
          {days.map(day => {
            const total = meals.reduce((acc, meal) => {
              const recipe = recipesDataMap[data[day]?.[meal]];
              return acc + Number(recipe?.carbohydrates || 0);
            }, 0);
            return <td key={day} className="border border-gray-300 px-4 py-2">{total}</td>;
          })}
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-[#FFF8F1] p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Lịch ăn hàng tuần</h1>
      <div className="flex justify-center gap-6 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "expert" ? "bg-[#7B3F00] text-white" : "bg-[#FCD5B5] text-[#3E1F00] hover:bg-[#F6C28B]"}`}
          onClick={() => setActiveTab("expert")}
        >
          Expert Recommendation
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "custom" ? "bg-[#7B3F00] text-white" : "bg-[#FCD5B5] text-[#3E1F00] hover:bg-[#F6C28B]"}`}
          onClick={() => setActiveTab("custom")}
        >
          User Customize
        </button>
      </div>

      {activeTab === "custom" && (
        <div className="text-center my-4">
          {!editingMode ? (
            <button
              className="bg-[#F6C28B] text-white px-4 py-2 rounded hover:bg-[#A0522D]"
              onClick={() => setEditingMode(true)}
            >
              Edit Schedule
            </button>
          ) : (
            <>
              <button
                className="bg-[#7B3F00] text-white px-4 py-2 mr-2 rounded hover:bg-[#5C2E00]"
                onClick={async () => {
                  await setDoc(doc(db, "customSchedules", auth.currentUser.uid), customSchedule);
                  setEditingMode(false);
                }}
              >
                Save Schedule
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setEditingMode(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          {activeTab === "expert" && renderTable(schedule)}
          {activeTab === "custom" && renderTable(customSchedule)}

          {activeTab === "custom" && !loading && (() => {
            const exceededDays = getExceededDays(customSchedule);
            return exceededDays.length > 0 && (
              <div className="mt-4 text-red-600 font-semibold text-center">
                {exceededDays.map((day, idx) => (
                  <div key={idx}>Hãy chỉnh lại lịch ăn thứ {day}</div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default Schedule;

