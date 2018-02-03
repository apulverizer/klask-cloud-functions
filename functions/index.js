// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.games = functions.https.onRequest((request, response) => {
  var db = admin.database();
  var ref = db.ref("games");
  var arenaid = request.query.arenaid;

  if (!arenaid){
    return response.send({"error": "You must specify an arena"})
  }

  return admin.database().ref('games').orderByChild('arenaid').equalTo(arenaid).once('value', (snapshot) => {
      response.send(snapshot.val() || {});
  });
});

exports.challenges = functions.https.onRequest((request, response) => {
  var db = admin.database();
  var ref = db.ref("challenges");
  var challengeduid = request.query.challengeduid;

  if (!challengeduid){
    return response.send({"error": "You must specify an challengeduid"})
  }
  return admin.database().ref('challenges').orderByChild('challengeduid').equalTo(challengeduid).once('value', (snapshot) => {
      response.send(snapshot.val() || {});
  });
});
