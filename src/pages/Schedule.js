import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Schedule() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const userDoc = await getDoc(doc(db, "customersData", auth.currentUser.uid));
        const diabetesType = userDoc.data().diabetesType || "none";

        const scheduleDoc = await getDoc(doc(db, "schedules", diabetesType));
        const userSchedule = scheduleDoc.data();

        setSchedule(userSchedule || {});
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Weekly Meal Schedule</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead>
              <tr className="bg-orange-100 text-gray-800">
                <th className="border border-gray-300 px-4 py-2">Meal</th>
                {days.map((day, index) => (
                  <th key={index} className="border border-gray-300 px-4 py-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, index) => (
                <tr key={index} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-200">{meal}</td>
                  {days.map((day, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">
                      {schedule[day]?.[meal]?.name || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Schedule;





