import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";

function Schedule() {
  const [activeTab, setActiveTab] = useState("expert");
  const [schedule, setSchedule] = useState({});
  const [customSchedule, setCustomSchedule] = useState({});
  const [recipesList, setRecipesList] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];

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

        const recipesSnap = await getDoc(doc(db, "customSchedules", auth.currentUser.uid));
        if (recipesSnap.exists()) {
          setCustomSchedule(recipesSnap.data());
        } else {
          const custom = {};
          days.forEach((day) => {
            custom[day] = {};
            meals.forEach((meal) => {
              custom[day][meal] = `${favoriteFlavors[0] || "Healthy"} ${meal}`;
            });
          });
          setCustomSchedule(custom);
        }

        const recipesSnapshot = await getDocs(collection(db, "recipes"));
        const recipes = recipesSnapshot.docs.map(doc => doc.data().name);
        setRecipesList(recipes);
      } catch (err) {
        console.error("Failed to fetch schedules:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderTable = (data) => (
    <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg mt-4">
      <thead>
        <tr className="bg-orange-100 text-gray-800">
          <th className="border border-gray-300 px-4 py-2">Meal</th>
          {days.map((day, i) => (
            <th key={i} className="border border-gray-300 px-4 py-2">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {meals.map((meal, i) => (
          <tr key={i} className="text-center hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-200">{meal}</td>
            {days.map((day, j) => (
              <td key={j} className="border border-gray-300 px-4 py-2">
                {editingMode && activeTab === "custom" ? (
                  <input
                    list={`recipes-${day}-${meal}`}
                    className="border rounded px-2 py-1 w-full"
                    value={customSchedule[day]?.[meal] || ""}
                    onChange={(e) => {
                      const updated = { ...customSchedule };
                      if (!updated[day]) updated[day] = {};
                      updated[day][meal] = e.target.value;
                      setCustomSchedule(updated);
                    }}
                    placeholder="Search food..."
                  />
                ) : (
                  data[day]?.[meal] || "-"
                )}
                <datalist id={`recipes-${day}-${meal}`}>
                  {recipesList.map((r, index) => (
                    <option key={index} value={r} />
                  ))}
                </datalist>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Weekly Meal Schedule</h1>

      <div className="flex justify-center gap-6 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "expert" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-500"}`}
          onClick={() => setActiveTab("expert")}
        >
          Expert Recommendation
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "custom" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-500"}`}
          onClick={() => setActiveTab("custom")}
        >
          User Customize
        </button>
      </div>

      {activeTab === "custom" && (
        <div className="text-center my-4">
          {!editingMode ? (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => setEditingMode(true)}
            >
              Edit Schedule
            </button>
          ) : (
            <>
              <button
                className="bg-green-600 text-white px-4 py-2 mr-2 rounded hover:bg-green-700"
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
        </div>
      )}
    </div>
  );
}

export default Schedule;






