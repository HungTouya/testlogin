import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";

function AddSchedule() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleSelectMeal = (type, day, meal, recipeId) => {
        const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
        setSchedule(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [day]: {
                    ...prev[type][day],
                    [meal]: {
                        id: recipeId,
                        name: selectedRecipe?.name || ""
                    }
                }
            }
        }));
    };

    const handleSaveSchedule = async () => {
        setLoading(true);
        try {
            await Promise.all(
                Object.entries(schedule).map(([type, data]) =>
                    setDoc(doc(db, "schedules", type), data)
                )
            );
            alert("Schedules saved successfully!");
        } catch (error) {
            console.error("Error saving schedules: ", error);
            alert("Failed to save schedules.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-hidden">
            {/* Fixed top bar with back button and title */}
            <div className="bg-white shadow-md p-4 flex items-center sticky top-0 z-10">
                <button onClick={() => navigate("/admin-dashboard")} className="text-blue-600 flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </button>
                <h2 className="text-2xl font-bold text-center flex-grow">Add Weekly Meal Schedule</h2>
            </div>

            {/* Scrollable content container */}
            <div className="p-6 flex-grow overflow-y-auto">
                {Object.entries({ none: "General", type1: "Diabetes Type 1", type2: "Diabetes Type 2" }).map(([key, label]) => (
                    <div key={key} className="mt-6 p-4 bg-white shadow rounded-lg overflow-x-auto">
                        <h3 className="text-xl font-semibold text-center">{label}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 mt-4">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-4 py-2">Meal</th>
                                        {days.map(day => <th key={day} className="border px-4 py-2">{day}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {meals.map(meal => (
                                        <tr key={meal}>
                                            <td className="border px-4 py-2 font-semibold bg-gray-100">{meal}</td>
                                            {days.map(day => (
                                                <td key={day} className="border px-4 py-2">
                                                    <select 
                                                        className="border p-1 w-full"
                                                        onChange={(e) => handleSelectMeal(key, day, meal, e.target.value)}
                                                        value={schedule[key]?.[day]?.[meal]?.id || ""}
                                                    >
                                                        <option value="">Select</option>
                                                        {recipes.map(recipe => (
                                                            <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {/* Save button with sticky positioning */}
            <div className="bg-white p-4 shadow-md sticky bottom-0 flex justify-center">
                <button onClick={handleSaveSchedule} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? "Saving..." : "Save Schedules"}
                </button>
            </div>
        </div>
    );
}

export default AddSchedule;




