import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Provided quiz questions array
const quizQuestions = [
  {
    question: "What type of diabetes do you have?",
    options: [
      { value: "none", label: "None" },
      { value: "1", label: "Type 1" },
      { value: "2", label: "Type 2" }
    ]
  },
  {
    question: "What are your favorite flavors?",
    options: [
      { value: "Sweet", label: "Sweet" },
      { value: "Spicy", label: "Spicy" },
      { value: "Salty", label: "Salty" },
      { value: "Sour", label: "Sour" },
      { value: "Bitter", label: "Bitter" }
    ]
  }
];

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({ name: "", phone: "" });
  
  // Quiz-related state
  const [step, setStep] = useState(0);
  const [diabetesType, setDiabetesType] = useState("none");
  const [favoriteFlavors, setFavoriteFlavors] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "customersData", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setUpdatedData({ 
            name: data.name || "", 
            phone: data.phone || ""
          });
          // Load quiz data if available
          setDiabetesType(data.diabetesType || "none");
          setFavoriteFlavors(data.favoriteFlavors || []);
          // Mark quiz as submitted if both values are set (diabetesType not "none" and favoriteFlavors array has items)
          setQuizSubmitted(
            data.diabetesType && data.diabetesType !== "none" &&
            Array.isArray(data.favoriteFlavors) && data.favoriteFlavors.length > 0
          );
        } else {
          console.error("User data not found");
        }
      }
    };
    fetchUserData();
  }, []);

  // Profile update handlers (only name and phone)
  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "customersData", auth.currentUser.uid);
      try {
        await updateDoc(userRef, { 
          name: updatedData.name, 
          phone: updatedData.phone 
        });
        setUserData({ ...userData, name: updatedData.name, phone: updatedData.phone });
        setEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  // Quiz submission: update Firestore with both diabetesType and favoriteFlavors
  const handleSubmitQuiz = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "customersData", auth.currentUser.uid);
      try {
        await updateDoc(userRef, { diabetesType, favoriteFlavors });
        setQuizSubmitted(true);
      } catch (error) {
        console.error("Error saving quiz data:", error);
      }
    }
  };

  // Retake quiz: reset quiz state and update Firestore
  const handleRetakeQuiz = async () => {
    setStep(0);
    setDiabetesType("none");
    setFavoriteFlavors([]);
    setQuizSubmitted(false);
    if (auth.currentUser) {
      const userRef = doc(db, "customersData", auth.currentUser.uid);
      try {
        await updateDoc(userRef, { diabetesType: "none", favoriteFlavors: [] });
      } catch (error) {
        console.error("Error resetting quiz data:", error);
      }
    }
  };

  const handleFlavorChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFavoriteFlavors((prev) => [...prev, value]);
    } else {
      setFavoriteFlavors((prev) => prev.filter((flavor) => flavor !== value));
    }
  };

  if (!userData) {
    return <p className="text-center text-gray-500 mt-6">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white shadow-md dark:bg-gray-800 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
          <span className="text-xl font-semibold text-gray-700 dark:text-white">Profile</span>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex justify-center gap-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "flavor"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("flavor")}
          >
            Flavor & Health
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        {/* My Profile Section (diabetes type is not displayed here) */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Profile Information</h2>
            <div className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
              {editing ? (
                <>
                  <label className="block">
                    <span className="text-gray-700 dark:text-gray-200">Name:</span>
                    <input
                      type="text"
                      className="w-full px-3 py-2 mt-1 rounded-lg border dark:bg-gray-700 dark:text-white"
                      value={updatedData.name}
                      onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                    />
                  </label>
                  <label className="block mt-2">
                    <span className="text-gray-700 dark:text-gray-200">Phone:</span>
                    <input
                      type="text"
                      className="w-full px-3 py-2 mt-1 rounded-lg border dark:bg-gray-700 dark:text-white"
                      value={updatedData.phone}
                      onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                    />
                  </label>
                  <div className="mt-4 flex gap-4">
                    <button onClick={handleSave} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                    <button onClick={handleCancel} className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Phone:</strong> {userData.phone}</p>
                  <button onClick={handleEdit} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Flavor & Health Quiz Section (Multi-step quiz using quizQuestions) */}
        {activeTab === "flavor" && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Flavor & Health</h2>
            {quizSubmitted ? (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Diabetes Type:</strong> {diabetesType === "none" ? "None" : `Type ${diabetesType}`}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Favorite Flavors:</strong> {favoriteFlavors.join(", ") || "None"}
                </p>
                <button onClick={handleRetakeQuiz} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Retake Quiz
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                {quizQuestions.map((q, index) => {
                  if (index !== step) return null;
                  return (
                    <div key={index}>
                      <h3 className="text-md font-medium text-gray-600 dark:text-gray-300 mt-4">{q.question}</h3>
                      <div className="mt-2 space-y-2">
                        {q.options.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <input
                              type={index === 0 ? "radio" : "checkbox"}
                              name={index === 0 ? "diabetesType" : "favoriteFlavors"}
                              value={option.value}
                              checked={
                                index === 0
                                  ? diabetesType === option.value
                                  : favoriteFlavors.includes(option.value)
                              }
                              onChange={(e) => {
                                if (index === 0) {
                                  setDiabetesType(e.target.value);
                                } else {
                                  const { value, checked } = e.target;
                                  if (checked) {
                                    setFavoriteFlavors((prev) => [...prev, value]);
                                  } else {
                                    setFavoriteFlavors((prev) => prev.filter((flavor) => flavor !== value));
                                  }
                                }
                              }}
                              className="accent-blue-600"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 flex gap-4">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                    >
                      Back
                    </button>
                  )}
                  {step < quizQuestions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
                  {step === quizQuestions.length - 1 && (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;






