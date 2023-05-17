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
      res.json(userRecord);

      const collectionRef = admin.firestore().collection('clients');

      // Create a new document with a unique ID
      const newDocRef = collectionRef.doc(userRecord.uid);
      
      // Add the new document to the Firestore collection
      newDocRef.set(form)
      .then(() => {
        console.log('New document added to Firestore');
      })
      .catch((error) => {
        console.error('Error adding document to Firestore:', error);
      });
    })
    .catch((error) => {
      console.error('Error creating new user:', error);
      res.json(null);
    });

});

// router.post('/signIn', async (req, res) => {
//   console("dddddd", req.body);
//   const idToken = req.body.idToken;

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;
    
//     console.log(`Signed in user with UID: ${uid}`);
//     res.send(decodedToken);
//   } catch (error) {
//     console.log(error);
//     res.status(401).send(error.message);
//   }
// });

router.get("/unameAndAppointmentsList", async (req, res) => {
  const uid = req.query.uid;

  try {
    const docRef = admin.firestore().collection('clients').doc(uid);
    docRef.get()
      .then(doc => {
        if (doc.exists) {
          const uname = doc.data().uname;
          const appointments = doc.data().appointments;
          res.json({uname, appointments});
        } else {
          console.log('Document does not exist');
        }
      })
      .catch(error => {
        console.log('Error getting document:', error);
        res.status(500).send('Error getting document');
      });
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put("/schedule", async (req, res) => {
  const dataSchedule = req.body;
  const dts = dataSchedule.dataToSchedule;
  const uid = dataSchedule.uid;

  try {
    const documentRef = admin.firestore().collection('clients').doc(uid);

    // Update the field in the document
    await documentRef.update({
      appointments: admin.firestore.FieldValue.arrayUnion(dts)
    });

    const updatedDoc = await documentRef.get();

    // Extract the appointments field from the document data
    const appointments = updatedDoc.data().appointments;

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router