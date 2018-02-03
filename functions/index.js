// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// get all games
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

// get all challenges
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

// get standings
exports.standings = functions.https.onRequest((request, response) => {
  var db = admin.database();
  var arenaid = request.query.arenaid;
  var joinUser = request.query.joinUser || false;

  if (!arenaid){
    return response.send({"error": "You must specify an arena"})
  }

  // get users, then filter by arena
  return admin.database().ref('users').once('value', (snapshot) => {
    var fullusers = snapshot.val() || {};
    var users = {};
    Object.keys(fullusers).forEach(uid => {
      let user = fullusers[uid];
      let joinedArenas = user.arenasjoined || [];
      if (joinedArenas.indexOf(arenaid) != -1){
        users[uid] = user;
        // add extra properties to user
        users[uid].games = 0;
        users[uid].wins = 0;
        users[uid].loses = 0;
        users[uid].percentage = 0;
        users[uid].goalsFor = 0;
        users[uid].goalsAgainst = 0;
      }
    });
    // now get the games in the arena
    return admin.database().ref('games').orderByChild('arenaid').equalTo(arenaid).once('value', (snapshot) => {
      var games = snapshot.val() || {};
      Object.keys(games).forEach(key => {
        var game = games[key];
        // update games
        users[game.player1id].games += 1;
        users[game.player2id].games += 1;
        // update win/loss
        if (game.player1score > game.player2score){
          users[game.player1id].wins += 1;
          users[game.player2id].loses += 1;
        }
        else {
          users[game.player2id].wins += 1;
          users[game.player1id].loses += 1;
        }
        // update goals
        users[game.player1id].goalsFor += game.player1score;
        users[game.player1id].goalsAgainst += game.player2score;
        users[game.player2id].goalsFor += game.player2score;
        users[game.player2id].goalsAgainst += game.player1score;
      });
      let usersRanked = [];
      // push the users into a list
      Object.keys(users).forEach(uid => {
        let user = users[uid];
        user.percentage = (user.wins / (user.games)) || 0;
        usersRanked.push(user);
      });
      // sort the users
      usersRanked = usersRanked.sort(function(a,b){
        if (a.percentage > b.percentage) {
          return -1;
        }
        if (a.percentage < b.percentage) {
          return 1;
        }
        if (a.wins > b.wins){
          return -1;
        }
        if (b.wins > a.wins){
          return 1;
        }
        return 0;
      });
      return response.send(usersRanked || {});
    });
  });
});

