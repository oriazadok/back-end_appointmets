const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

// firebase
let admin = require("firebase-admin");
let serviceAccount = require("../serviceAccountKey.json");

// Initialize the Firebase Admin SDK with service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.get("/HairStyleMenu", async (req, res) => {
  try {
      // Get a reference to the collection you want to retrieve
      const collectionRef = admin.firestore().collection('hairStyleMenu');

      // Retrieve the contents of the collection
      const querySnapshot = await collectionRef.get();
      const hairStyleMenu = {};

      querySnapshot.forEach((doc) => {
          hairStyleMenu[doc.id] = doc.data();
      });

      res.json(hairStyleMenu);
  } catch (error) {
      console.log(`Error getting documents: ${error}`);
      res.status(500).send('Error getting documents');
  }
});









module.exports = router






