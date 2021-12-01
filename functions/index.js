const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
const dialogflow = require("dialogflow");

admin.initializeApp();

exports.dialogflowFirebaseFulfillment =
functions.https.onRequest((request, response) => {
  console.log("Request.body.queryResult: " +
  JSON.stringify(request.body.queryResult));

  console.log("Fulfillment text " +
  JSON.stringify(request.body.queryResult.fulfillmentText));

  // An action is a string used to identify what needs to be done in fulfillment
  const action = request.body.queryResult.action;
  console.log("Actions = "+ JSON.stringify(action));

  if (action === "firebase.update") {
    const userId = "bert.macklin";
    // Check if the user is in our DB
    admin.firestore().collection("users").where("userId", "==", userId)
        .limit(1).get()
        .then((snapshot) => {
          const user = snapshot.docs[0];
          if (!user) {
            // Add the user to DB
            admin.firestore().collection("users").add({
              userId: userId,
            }).then((ref) => {
              sendResponse("Added new user");
            });
          } else {
            // User in DB
            sendResponse("User already exists");
          }
        });
  }

  function sendResponse(responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === "string") {
      const responseJson = {};
      responseJson.speech = responseToUser; // spoken response
      responseJson.displayText = responseToUser; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich
      // responses or contexts send them to Dialogflow
      const responseJson = {};

      // If speech or displayText is defined, use it
      // to respond (if one isn't defined use the other's value)
      responseJson.speech = responseToUser.speech || responseToUser.displayText;
      responseJson.displayText =
      responseToUser.displayText || responseToUser.speech;

      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      responseJson.data = responseToUser.richResponses;

      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      responseJson.contextOut = responseToUser.outputContexts;

      response.json(responseJson); // Send response to Dialogflow
    }
  }
});


/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
exports.dialogFlowMiddle = functions.https.onRequest(
    async (request, response) => {
      cors(request, response, async () => {
        const queryInput = request.body.data.queryInput;
        const sessionId = request.body.data.sessionId;
        const RTDBLocation = request.body.data.RTDBLocation;

        // functions.logger.info("request.body", request.body);
        // functions.logger.info("queryInput", queryInput);
        functions.logger.info("RTDBLocation", RTDBLocation);

        // Create a new session
        const projectId = "cs476project";
        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        // The text query request.
        const req = {
          session: sessionPath,
          queryInput: {
            text: {
              text: queryInput,
              languageCode: "en-US",
            },
          },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(req);
        const result = responses[0].queryResult;
        functions.logger.info("  Result:", JSON.stringify(result), {structuredData: true});

        if (result.action === "firebase.update") {
          console.log("hello");
        }

        if (result.fulfillmentText == "CREATE-APPOINTMENT") {
          await admin.database().ref(RTDBLocation).child("CREATE-APPOINTMENT").set({
            message: result.fulfillmentText,
            senderEmail: "aiEmail@uregina.ca",
            employeeEmail: "aiEmail@uregina.ca",
            senderName: "AI Chatbot",
          });
        } else {
          await admin.database().ref(RTDBLocation).push().set({
            message: result.fulfillmentText,
            senderEmail: "aiEmail@uregina.ca",
            employeeEmail: "aiEmail@uregina.ca",
            senderName: "AI Chatbot",
          });
        }

        response.json({result: result.fulfillmentText});
      });
    });
