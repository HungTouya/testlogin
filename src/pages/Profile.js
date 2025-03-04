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
    <div>
      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between">
          <span className="text-lg font-semibold text-gray-700 dark:text-white">Profile</span>
        </div>
      </nav>

      {/* Submenu - Positioned at the top-right */}
      <div className="max-w-screen-xl mx-auto flex justify-end mt-4">
        <nav className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-2">
          <ul className="flex space-x-6 text-sm font-medium">
            <li>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === "profile" ? "bg-blue-500 text-white" : "text-gray-900 dark:text-white hover:underline"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                My Profile
              </button>
            </li>
            <li>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === "flavor" ? "bg-blue-500 text-white" : "text-gray-900 dark:text-white hover:underline"
                }`}
                onClick={() => setActiveTab("flavor")}
              >
                Flavor and Health
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto p-6">
        {/* My Profile Section */}
        {activeTab === "profile" && (
          <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Profile Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2"><strong>Name:</strong> {userData.name}</p>
            <p className="text-gray-600 dark:text-gray-300"><strong>Email:</strong> {userData.email}</p>
            <p className="text-gray-600 dark:text-gray-300"><strong>Phone:</strong> {userData.phone}</p>
            <p className="text-gray-600 dark:text-gray-300"><strong>Diabetes Type:</strong> {userData.diabetesType || "Not specified"}</p>
          </div>
        )}

        {/* Flavor and Health Section */}
        {activeTab === "flavor" && (
          <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Flavor and Health</h2>
            {quizSubmitted ? (
              <div>
                <p className="text-gray-600 dark:text-gray-300"><strong>Diabetes Type:</strong> {diabetesType}</p>
                <p className="text-gray-600 dark:text-gray-300"><strong>Favorite Flavors:</strong> {favoriteFlavors.join(", ")}</p>
                <button
                  onClick={handleRetakeQuiz}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <h3 className="text-md font-medium text-gray-600 dark:text-gray-300">What type of diabetes do you have?</h3>
                  <div className="mb-4">
                    {["none", "1", "2"].map((option) => (
                      <div key={option}>
                        <label className="text-gray-600 dark:text-gray-300">
                          <input
                            type="radio"
                            name="diabetesType"
                            value={option}
                            checked={diabetesType === option}
                            onChange={(e) => setDiabetesType(e.target.value)}
                          />{" "}
                          {option === "none" ? "None" : `Type ${option}`}
                        </label>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-md font-medium text-gray-600 dark:text-gray-300">What are your favorite flavors?</h3>
                  <div className="mb-4">
                    {["Sweet", "Spicy", "Salty", "Sour", "Bitter", "Umami"].map((flavor) => (
                      <div key={flavor}>
                        <label className="text-gray-600 dark:text-gray-300">
                          <input
                            type="checkbox"
                            value={flavor}
                            checked={favoriteFlavors.includes(flavor)}
                            onChange={handleFlavorChange}
                          />{" "}
                          {flavor}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem("diabetesType", diabetesType);
                      localStorage.setItem("favoriteFlavors", JSON.stringify(favoriteFlavors));
                      localStorage.setItem("quizSubmitted", true);
                      setQuizSubmitted(true);
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;



