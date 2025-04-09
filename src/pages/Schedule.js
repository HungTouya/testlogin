import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Schedule() {
  const [activeTab, setActiveTab] = useState("expert");
  const [schedule, setSchedule] = useState({});
  const [customSchedule, setCustomSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "customersData", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        let { diabetesType = "none", favoriteFlavors = [] } = userSnap.data();

        // Map diabetes type
        if (diabetesType === "1") diabetesType = "type1";
        else if (diabetesType === "2") diabetesType = "type2";

        // Fetch expert schedule
        const scheduleDoc = await getDoc(doc(db, "schedules", diabetesType));
        setSchedule(scheduleDoc.data() || {});

        // Simple AI logic: Generate custom schedule by filtering recipes
        const recipesSnap = await getDoc(doc(db, "customSchedules", auth.currentUser.uid));
        if (recipesSnap.exists()) {
          setCustomSchedule(recipesSnap.data());
        } else {
          // Fallback logic for demonstration
          const custom = {};
          days.forEach((day) => {
            custom[day] = {};
            meals.forEach((meal) => {
              custom[day][meal] = `${favoriteFlavors[0] || "Healthy"} ${meal}`;
            });
          });
          setCustomSchedule(custom);
        }

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
                {data[day]?.[meal] || "-"}
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









