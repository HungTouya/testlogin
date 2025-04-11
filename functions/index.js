const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { WebhookClient } = require("dialogflow-fulfillment");

admin.initializeApp();
const db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(async (request, response) => {
  const agent = new WebhookClient({ request, response });

  const userId = request.body.originalDetectIntentRequest?.payload?.userId || "default-user";

  // 🔁 Welcome
  function welcome(agent) {
    agent.add("Hi! I’m MealBot. I can help you plan your weekly meals. Try saying: 'Plan my meals' or 'Tell me about pho'.");
  }

  // 📅 Get Weekly Meal Plan
  async function getMealPlan(agent) {
    try {
      const userDoc = await db.collection("customersData").doc(userId).get();
      const diabetesType = userDoc.exists ? userDoc.data().diabetesType || "none" : "none";

      const scheduleDoc = await db.collection("schedules").doc(diabetesType).get();
      const schedule = scheduleDoc.exists ? scheduleDoc.data() : {};

      let reply = "Here's your expert weekly meal plan:\n";
      for (const day in schedule) {
        reply += `\n${day}:\n`;
        for (const meal in schedule[day]) {
          reply += `- ${meal}: ${schedule[day][meal]}\n`;
        }
      }

      agent.add(reply || "No schedule found.");
    } catch (error) {
      console.error("getMealPlan error:", error);
      agent.add("Sorry, I had trouble fetching your meal plan.");
    }
  }

  // 🩺 Set Diabetes Type
  async function setDiabetesType(agent) {
    const diabetes = agent.parameters["diabetes-type"] || "none";
    try {
      await db.collection("customersData").doc(userId).set({ diabetesType: diabetes }, { merge: true });
      agent.add(`Got it. I’ve saved your diabetes type as ${diabetes}.`);
    } catch (error) {
      console.error("setDiabetesType error:", error);
      agent.add("There was a problem saving your diabetes type.");
    }
  }

  // 🍜 Request Recipe Details
  async function getRecipeDetails(agent) {
    const recipeName = agent.parameters["recipe"]?.toLowerCase();
    try {
      const recipesSnap = await db.collection("recipes").where("name", "==", recipeName).limit(1).get();

      if (!recipesSnap.empty) {
        const recipe = recipesSnap.docs[0].data();
        agent.add(`Here's what I found for ${recipe.name}:\n\nIngredients:\n${recipe.ingredients.join(", ")}\n\nInstructions:\n${recipe.instructions}\n\nTips:\n${recipe.tips || "No special tips."}`);
      } else {
        agent.add(`Sorry, I couldn’t find a recipe for "${recipeName}".`);
      }
    } catch (error) {
      console.error("getRecipeDetails error:", error);
      agent.add("Something went wrong retrieving the recipe.");
    }
  }

  // 😋 Save Meal Preference
  async function setMealPreference(agent) {
    const flavor = agent.parameters["flavor"];
    if (!flavor) {
      agent.add("Please tell me your flavor preference again.");
      return;
    }

    try {
      await db.collection("customersData").doc(userId).set({
        favoriteFlavors: admin.firestore.FieldValue.arrayUnion(flavor)
      }, { merge: true });

      agent.add(`Got it! I’ve noted your preference for ${flavor} food.`);
    } catch (error) {
      console.error("setMealPreference error:", error);
      agent.add("Failed to save your flavor preference.");
    }
  }

  // 📝 Set Custom Meal in Schedule
  async function setCustomSchedule(agent) {
    const day = agent.parameters["day"];
    const mealType = agent.parameters["mealType"];
    const food = agent.parameters["recipe"];

    if (!day || !mealType || !food) {
      agent.add("Please provide a day, meal type, and food name.");
      return;
    }

    try {
      const userRef = db.collection("customSchedules").doc(userId);
      const userDoc = await userRef.get();
      let newSchedule = userDoc.exists ? userDoc.data() : {};
      
      if (!newSchedule[day]) newSchedule[day] = {};
      newSchedule[day][mealType] = food;

      await userRef.set(newSchedule);
      agent.add(`Updated your ${mealType} on ${day} to ${food}.`);
    } catch (error) {
      console.error("setCustomSchedule error:", error);
      agent.add("Could not update your schedule. Try again.");
    }
  }

  // 💡 Intent Mapping
  const intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("GetMealPlan", getMealPlan);
  intentMap.set("DiabetesTypeCheck", setDiabetesType);
  intentMap.set("RequestRecipeDetails", getRecipeDetails);
  intentMap.set("MealPreference", setMealPreference);
  intentMap.set("SetCustomSchedule", setCustomSchedule);

  agent.handleRequest(intentMap);
});


