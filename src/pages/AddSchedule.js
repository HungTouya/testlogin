import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";

function AddSchedule() {
    const navigate = useNavigate();
    const [loadingType, setLoadingType] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [schedule, setSchedule] = useState({
        none: {},
        type1: {},
        type2: {}
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const meals = ["Breakfast", "Lunch", "Dinner"];

    useEffect(() => {
        const fetchRecipes = async () => {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            setRecipes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchRecipes();
    }, []);

    const handleSelectMeal = (type, day, meal, recipeName) => {
        setSchedule(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [day]: {
                    ...prev[type][day],
                    [meal]: recipeName
                }
            }
        }));
    };

    const handleSaveIndividualSchedule = async (type) => {
        setLoadingType(type);
        try {
            await setDoc(doc(db, "schedules", type), schedule[type]);
            alert(`${type} schedule saved successfully!`);
        } catch (error) {
            console.error(`Error saving ${type} schedule: `, error);
            alert(`Failed to save ${type} schedule.`);
        }
        setLoadingType("");
    };

    return (
<div className="bg-[#FFF5F2] min-h-screen flex flex-col">
  <header className="bg-[#FFD3C4] shadow-md p-4 flex items-center sticky top-0 z-10">
    <button onClick={() => navigate("/admin-dashboard")} className="text-[#6F4F37] flex items-center hover:text-[#8a6650]">
      <FaArrowLeft className="mr-2" /> Back to Dashboard
    </button>
    <h2 className="text-2xl font-bold text-center flex-grow text-[#6F4F37]">Add Weekly Meal Schedule</h2>
  </header>

  <main className="p-6 flex-grow overflow-y-auto pt-56">
    {Object.entries({ none: "General", type1: "Diabetes Type 1", type2: "Diabetes Type 2" }).map(([key, label]) => (
      <div key={key} className="mt-16 p-4 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-4 text-[#6F4F37]">{label}</h3>
        <div>
          <table className="w-full border-collapse border border-[#FFC2A1]">
            <thead>
              <tr className="bg-[#FFE1D6]">
                <th className="border px-4 py-2 text-[#6F4F37]">Meal</th>
                {days.map(day => (
                  <th key={day} className="border px-4 py-2 text-[#6F4F37]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal}>
                  <td className="border px-4 py-2 font-semibold bg-[#FFF0E8] text-[#6F4F37]">{meal}</td>
                  {days.map(day => (
                    <td key={day} className="border px-4 py-2">
                      <select
                        className="border p-1 w-full text-[#6F4F37] rounded bg-[#FFF5F2]"
                        onChange={(e) => handleSelectMeal(key, day, meal, e.target.value)}
                        value={schedule[key]?.[day]?.[meal] || ""}
                      >
                        <option value="">Select</option>
                        {recipes.map(recipe => (
                          <option key={recipe.id} value={recipe.name}>{recipe.name}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSaveIndividualSchedule(key)}
            className="bg-[#FFA07A] text-white px-4 py-2 rounded hover:bg-[#e88d68]"
            disabled={loadingType === key}
          >
            {loadingType === key ? "Saving..." : `Save ${label} Schedule`}
          </button>
        </div>
      </div>
    ))}
  </main>
</div>

    );
}

export default AddSchedule;

