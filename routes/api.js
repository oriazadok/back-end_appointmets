const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

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


// Create the new user account with email and password
router.post("/signUp", (req, res) => {
  const form = req.body; 
  
  admin.auth().createUser({
      email: form.email,
      password: form.password
    })
    .then((userRecord) => {
      console.log('Successfully created new user:', userRecord.uid);
      res.json(true);
    })
    .catch((error) => {
      console.error('Error creating new user:', error);
      res.json(false);
    });

  const collectionRef = admin.firestore().collection('clients');

  // Create a new document with a unique ID
  const newDocRef = collectionRef.doc();
  
  // Add the new document to the Firestore collection
  newDocRef.set(form)
  .then(() => {
      console.log('New document added to Firestore');
  })
  .catch((error) => {
      console.error('Error adding document to Firestore:', error);
  });
});







module.exports = router






