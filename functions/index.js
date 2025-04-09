const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { WebhookClient } = require("dialogflow-fulfillment");

admin.initializeApp();
const db = admin.firestore();

exports.dialogflowWebhook = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  const requestRecipeDetails = async (agent) => {
    const ingredient = agent.parameters.ingredient;

    const snapshot = await db.collection("recipes").get();
    const matching = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const ingredients = data.ingredients?.map((i) => i.toLowerCase()) || [];
      if (ingredients.some((ing) => ing.includes(ingredient.toLowerCase()))) {
        matching.push(`${data.name} - ${data.description?.slice(0, 60)}...`);
      }
    });

    if (matching.length > 0) {
      agent.add(`I found these recipes with ${ingredient}:\n\n${matching.join("\n")}`);
    } else {
      agent.add(`Sorry, I couldn't find recipes with ${ingredient}.`);
    }
  };

  let intentMap = new Map();
  intentMap.set("RequestRecipeDetails", requestRecipeDetails);
  agent.handleRequest(intentMap);
});
