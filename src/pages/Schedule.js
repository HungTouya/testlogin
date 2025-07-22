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

  const CALORIE_UPPER_LIMIT = 1800;
  const CALORIE_LOWER_LIMIT = 1000;

  const DAY_MAP = {
    "Thứ Hai": "Monday",
    "Thứ Ba": "Tuesday",
    "Thứ Tư": "Wednesday",
    "Thứ Năm": "Thursday",
    "Thứ Sáu": "Friday",
    "Thứ Bảy": "Saturday",
    "Chủ Nhật": "Sunday",
  };

  const MEAL_MAP = {
    "Bữa sáng": "Breakfast",
    "Bữa trưa": "Lunch",
    "Bữa tối": "Dinner",
  };

  const daysVN = Object.keys(DAY_MAP);
  const mealsVN = Object.keys(MEAL_MAP);
  const days = Object.values(DAY_MAP);
  const meals = Object.values(MEAL_MAP);

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

  const getInvalidDays = (data) => {
    const overDays = [];
    const underDays = [];

    days.forEach((dayEN, idx) => {
      const total = meals.reduce((sum, meal) => {
        const recipe = recipesDataMap[data[dayEN]?.[meal]];
        return sum + (recipe?.kcal || 0);
      }, 0);
      const dayVN = daysVN[idx];
      if (total > CALORIE_UPPER_LIMIT) overDays.push(dayVN);
      else if (total < CALORIE_LOWER_LIMIT) underDays.push(dayVN);
    });

    return { overDays, underDays };
  };

  const renderTable = (data) => (
    <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg mt-4">
      <thead>
        <tr className="bg-[#FCD5B5] text-[#3E1F00]">
          <th className="border border-gray-300 px-4 py-2">Bữa ăn</th>
          {daysVN.map((dayVN, i) => (
            <th key={i} className="border border-gray-300 px-4 py-2">{dayVN}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mealsVN.map((mealVN, i) => {
          const mealEN = MEAL_MAP[mealVN];
          return (
            <tr key={i} className="text-center hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-semibold bg-[#F6C28B] text-[#3E1F00]">{mealVN}</td>
              {days.map((dayEN, j) => {
                const recipeName = data[dayEN]?.[mealEN];
                const recipe = recipesDataMap[recipeName];
                return (
                  <td key={j} className="border border-gray-300 px-4 py-2">
                    {editingMode && activeTab === "custom" && editingMeal === `${dayEN}-${mealEN}` ? (
                      <div className="relative">
                        <select
                          className="border p-1 w-full"
                          value={customSchedule[dayEN]?.[mealEN] || ""}
                          onChange={(e) => {
                            const updated = { ...customSchedule };
                            if (!updated[dayEN]) updated[dayEN] = {};
                            updated[dayEN][mealEN] = e.target.value;
                            setCustomSchedule(updated);
                          }}
                        >
                          <option value="">Chọn món</option>
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
                      <div onClick={() => setEditingMeal(`${dayEN}-${mealEN}`)} className="cursor-pointer text-blue-500">
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
          );
        })}
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
                className={`border border-gray-300 px-4 py-2 ${total > CALORIE_UPPER_LIMIT || total < CALORIE_LOWER_LIMIT ? "text-red-500 font-bold" : ""}`}
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
          Gợi ý từ chuyên gia
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "custom" ? "bg-[#7B3F00] text-white" : "bg-[#FCD5B5] text-[#3E1F00] hover:bg-[#F6C28B]"}`}
          onClick={() => setActiveTab("custom")}
        >
          Người dùng tùy chỉnh
        </button>
      </div>

      {activeTab === "custom" && (
        <div className="text-center my-4">
          {!editingMode ? (
            <button
              className="bg-[#F6C28B] text-white px-4 py-2 rounded hover:bg-[#A0522D]"
              onClick={() => setEditingMode(true)}
            >
              Chỉnh sửa lịch ăn
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
                Lưu lịch ăn
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setEditingMode(false)}
              >
                Hủy
              </button>
            </>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          {activeTab === "expert" && renderTable(schedule)}
          {activeTab === "custom" && renderTable(customSchedule)}

          {activeTab === "custom" && !loading && (() => {
            const { overDays, underDays } = getInvalidDays(customSchedule);
            if (overDays.length === 0 && underDays.length === 0) return null;

            return (
              <div className="mt-4 font-semibold text-center text-red-600 space-y-1">
                {overDays.map((day, idx) => (
                  <div key={`over-${idx}`}>
                    Calories vượt quá mức cho phép, hãy chỉnh lại lịch ăn vào <b>{day}</b>.
                  </div>
                ))}
                {underDays.map((day, idx) => (
                  <div key={`under-${idx}`}>
                    Calories thấp hơn mức cho phép, hãy chỉnh lại lịch ăn vào <b>{day}</b>.
                  </div>
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
