import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const quizQuestions = [
  {
    question: "Bạn bị tiểu đường loại mấy?",
    options: [
      { value: "none", label: "None" },
      { value: "1", label: "Type 1" },
      { value: "2", label: "Type 2" }
    ]
  },
  {
    question: "Bạn thích vị gì?",
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
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
          setQuizSubmitted(data.diabetesType !== "none" && data.favoriteFlavors?.length > 0);
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
          phone: updatedData.phone,
          diabetesType,  
          favoriteFlavors 
        });
        setUserData({ ...userData, name: updatedData.name, phone: updatedData.phone });
        setEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

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

  const handleRetakeQuiz = async () => {
    setDiabetesType("none");
    setFavoriteFlavors([]);
    setQuizSubmitted(false);
    setCurrentQuestion(0);
    if (auth.currentUser) {
      const userRef = doc(db, "customersData", auth.currentUser.uid);
      try {
        await updateDoc(userRef, { diabetesType: "none", favoriteFlavors: [] });
      } catch (error) {
        console.error("Error resetting quiz data:", error);
      }
    }
  };

  const renderQuizQuestion = () => {
    const question = quizQuestions[currentQuestion];

    return (
      <div>
        <p className="text-lg mb-2">{question.question}</p>
        {question.options.map(option => (
          <label key={option.value} className="block mb-2">
            <input
              type={currentQuestion === 0 ? "radio" : "checkbox"}
              name={currentQuestion === 0 ? "diabetesType" : "favoriteFlavors"}
              value={option.value}
              checked={currentQuestion === 0 ? diabetesType === option.value : favoriteFlavors.includes(option.value)}
              onChange={(e) => {
                if (currentQuestion === 0) {
                  setDiabetesType(option.value);
                } else {
                  const updatedFlavors = e.target.checked
                    ? [...favoriteFlavors, option.value]
                    : favoriteFlavors.filter(flavor => flavor !== option.value);
                  setFavoriteFlavors(updatedFlavors);
                }
              }}
              className="mr-2"
            />
            {option.label}
          </label>
        ))}
        <button
          onClick={() => {
            if (currentQuestion < quizQuestions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
            } else {
              handleSubmitQuiz();
            }
          }}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          {currentQuestion < quizQuestions.length - 1 ? "Next" : "Submit"}
        </button>
      </div>
    );
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
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "profile" ? "bg-[#7B3F00] text-white" : "bg-[#FCD5B5] text-[#3E1F00] hover:bg-[#F6C28B]"}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "flavor" ? "bg-[#7B3F00] text-white" : "bg-[#FCD5B5] text-[#3E1F00] hover:bg-[#F6C28B]"}`}
            onClick={() => setActiveTab("flavor")}
          >
            Hương vị & Sức khỏe
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-6">
        {activeTab === "profile" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {editing ? (
              <>
                <input
                  type="text"
                  value={updatedData.name}
                  onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                  className="border rounded-md p-2 mb-4 w-full"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={updatedData.phone}
                  onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                  className="border rounded-md p-2 mb-4 w-full"
                  placeholder="Phone"
                />
                <button
                  onClick={handleSave}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <p className="text-lg"><strong>Tên:</strong> {userData.name}</p>
                <p className="text-lg"><strong>Email:</strong> {userData.email}</p>
                <p className="text-lg"><strong>SĐT:</strong> {userData.phone}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        )}
        {activeTab === "flavor" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {quizSubmitted ? (
              <div>
                <p className="text-lg"><strong>Diabetes Type:</strong> {diabetesType}</p>
                <p className="text-lg"><strong>Hương vị yêu thích:</strong> {favoriteFlavors.join(", ")}</p>
                <button onClick={handleRetakeQuiz} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg">
                  Retake Quiz
                </button>
              </div>
            ) : (
              renderQuizQuestion()
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;








