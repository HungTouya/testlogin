import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
          setDiabetesType(data.diabetesType || "none");
          setFavoriteFlavors(data.favoriteFlavors || []);
          setQuizSubmitted(data.diabetesType && data.favoriteFlavors?.length > 0);
        } else {
          console.error("User data not found");
        }
      }
    };
    fetchUserData();
  }, []);

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

  const handleSubmitQuiz = async () => {
    if (auth.currentUser && !quizSubmitted) {
      const userRef = doc(db, "customersData", auth.currentUser.uid);
      try {
        await updateDoc(userRef, { diabetesType, favoriteFlavors });
        setQuizSubmitted(true);
      } catch (error) {
        console.error("Error saving quiz data:", error);
      }
    }
  };

  const handleRetakeQuiz = async () => {
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

  if (!userData) {
    return <p className="text-center text-gray-500 mt-6">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <p className="text-3xl font-bold text-center mb-8">Profile</p>
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white shadow-lg rounded-lg p-4 flex justify-center gap-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-500"}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "flavor" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-500"}`}
            onClick={() => setActiveTab("flavor")}
          >
            Flavor & Health
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-6">
        {activeTab === "profile" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-lg"><strong>Name:</strong> {userData.name}</p>
            <p className="text-lg"><strong>Email:</strong> {userData.email}</p>
            <p className="text-lg"><strong>Phone:</strong> {userData.phone}</p>
          </div>
        )}
        {activeTab === "flavor" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {quizSubmitted ? (
              <div>
                <p className="text-lg"><strong>Diabetes Type:</strong> {diabetesType}</p>
                <p className="text-lg"><strong>Favorite Flavors:</strong> {favoriteFlavors.join(", ")}</p>
                <button onClick={handleRetakeQuiz} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg">
                  Retake Quiz
                </button>
              </div>
            ) : (
              <button onClick={handleSubmitQuiz} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                Submit Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;







