const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
// const serviceAccount = require("./service-account.json");
const dialogflow = require("dialogflow");

admin.initializeApp();

// exports.helloWorld = functions.https.onRequest(async (request, response) => {
//   cors(request, response, async () => {
//     functions.logger.info("Hello logs!", {structuredData: true});
//     response.json({result: "Hello from FIREBASE FUNCtion"});
//   });
// });

// exports.addMessage = functions.https.onRequest(async (request, response) => {
//   cors(request, response, async () => {
//     functions.logger.info("In AddAMessage",);
//     functions.logger.info(
//         "request.body.data.text",
//         request.body.data.text, {structuredData: true});


//     // functions.logger.info("Request", request, {structuredData: true});
//     // functions.logger.info("response", response, {structuredData: true});
//     // functions.logger.info("Hello logs!", {structuredData: true});

//     response.json(
//         {result: "Hello2 from FIREBASE FUNCtion. Here is your imput text->" +
//       request.body.data.text});
//   });
// });

exports.dialogflowFirebaseFulfillment =
functions.https.onRequest((request, response) => {
  // console.log("Request headers: " + JSON.stringify(request.headers));
  // console.log("Request body: " + JSON.stringify(request.body));
  console.log("Request.body.queryResult: " +
  JSON.stringify(request.body.queryResult));

  console.log("Fulfillment text " +
  JSON.stringify(request.body.queryResult.fulfillmentText));

  // TODO Add fulfillment text to the correct RTDB chat


  // An action is a string used to identify what needs to be done in fulfillment
  const action = request.body.queryResult.action;
  // https://dialogflow.com/docs/actions-and-parameters
  console.log("Actions = "+ JSON.stringify(action));

  // const query = request.body.result.resolvedQuery;

  // Parameters are any entites that Dialogflow has extracted from the request.
  // const parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters

  // Contexts are objects used to track and store conversation state
  // const inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts


  // TODO Add all actions that modily the database
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

  // Function to send correctly formatted responses to
  // Dialogflow which are then sent to the user
  /**
       * Whatever garbage. Dont look at this comment
       * @param {int} responseToUser The first number.
       */
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
        // functions.logger.info("  Responses: ", JSON.stringify(responses), {structuredData: true});
        functions.logger.info("  Result:", JSON.stringify(result), {structuredData: true});
        // functions.logger.info(`  Query: ${result.queryText}`, {structuredData: true});
        // functions.logger.info(`  Action: ${result.action}`, {structuredData: true});
        // functions.logger.info(`  Response: ${result.fulfillmentText}`, {structuredData: true});
        // if (result.intent) {
        //   functions.logger.info(`  Intent: ${result.intent.displayName}`,{structuredData: true});
        // } else {
        //   functions.logger.info("  No intent matched.");
        // }

        // TODO Do actions here
        if (result.action === "firebase.update") {
          console.log("hello");
        }

        // Add the response to the persons Ai Chat

        // This works but overrides the whole location
        // await admin.database().ref(RTDBLocation).set({
        //   message: result.fulfillmentText,
        //   senderEmail: "aiEmail@uregina.ca",
        //   employeeEmail: "aiEmail@uregina.ca",
        //   senderName: "AI Chatbot",
        // });

        // Works great, but need a ref to delete later
        // await admin.database().ref(RTDBLocation).push().set({
        //   message: result.fulfillmentText,
        //   senderEmail: "aiEmail@uregina.ca",
        //   employeeEmail: "aiEmail@uregina.ca",
        //   senderName: "AI Chatbot",
        // });
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
