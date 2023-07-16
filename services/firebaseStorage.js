const firebase = require('firebase-admin');
//const configFirebase = require('../services/firebaseConfig');
const serviceAccount = require('../services/fbSDK.json')
const firebaseStorage = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: "avnmetaverse.appspot.com",
});

module.exports = firebaseStorage;