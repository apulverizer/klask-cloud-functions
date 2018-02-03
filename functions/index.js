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

exports.standings = functions.https.onRequest((request, response) => {
  var db = admin.database();
  var arenaid = request.query.arenaid;

  if (!arenaid){
    return response.send({"error": "You must specify an arena"})
  }

  return admin.database().ref('games').orderByChild('arenaid').equalTo(arenaid).once('value', (snapshot) => {
    var games = snapshot.val() || {};
    var users = [];
    Object.keys(games).forEach(key => {
      var game = games[key];
      // if player 1 not in list of users add them and their score
      // if player 2 not in list of users add them and their score
      // figure out if player 1 or player 2 won, then increment their total wins/loses
    });
    return response.send(snapshot || {});
  });
});
