import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [diabetesType, setDiabetesType] = useState(localStorage.getItem("diabetesType") || "none");
  const [favoriteFlavors, setFavoriteFlavors] = useState(JSON.parse(localStorage.getItem("favoriteFlavors")) || []);
  const [quizSubmitted, setQuizSubmitted] = useState(localStorage.getItem("quizSubmitted") === "true");

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "customersData", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("User data not found");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleRetakeQuiz = () => {
    localStorage.removeItem("diabetesType");
    localStorage.removeItem("favoriteFlavors");
    localStorage.setItem("quizSubmitted", false);
    setDiabetesType("none");
    setFavoriteFlavors([]);
    setQuizSubmitted(false);
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
        {/* Profile Information */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Profile Information</h2>
            <div className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p><strong>Diabetes Type:</strong> {userData.diabetesType || "Not specified"}</p>
            </div>
          </div>
        )}

        {/* Flavor and Health Quiz */}
        {activeTab === "flavor" && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Flavor and Health</h2>

            {quizSubmitted ? (
              <div>
                <p className="text-gray-600 dark:text-gray-300"><strong>Diabetes Type:</strong> {diabetesType}</p>
                <p className="text-gray-600 dark:text-gray-300"><strong>Favorite Flavors:</strong> {favoriteFlavors.join(", ")}</p>
                <button
                  onClick={handleRetakeQuiz}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <h3 className="text-md font-medium text-gray-600 dark:text-gray-300 mt-4">What type of diabetes do you have?</h3>
                <div className="mt-2 space-y-2">
                  {["none", "1", "2"].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <input
                        type="radio"
                        name="diabetesType"
                        value={option}
                        checked={diabetesType === option}
                        onChange={(e) => setDiabetesType(e.target.value)}
                        className="accent-blue-600"
                      />
                      {option === "none" ? "None" : `Type ${option}`}
                    </label>
                  ))}
                </div>

                <h3 className="text-md font-medium text-gray-600 dark:text-gray-300 mt-4">What are your favorite flavors?</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["Sweet", "Spicy", "Salty", "Sour", "Bitter", "Umami"].map((flavor) => (
                    <label key={flavor} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <input
                        type="checkbox"
                        value={flavor}
                        checked={favoriteFlavors.includes(flavor)}
                        onChange={handleFlavorChange}
                        className="accent-blue-600"
                      />
                      {flavor}
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem("diabetesType", diabetesType);
                    localStorage.setItem("favoriteFlavors", JSON.stringify(favoriteFlavors));
                    localStorage.setItem("quizSubmitted", true);
                    setQuizSubmitted(true);
                  }}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;



