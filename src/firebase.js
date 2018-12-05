import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
    apiKey: "AIzaSyAG1pggMaU3AqwBXd8CZbYxE52x1cS2jm0",
    authDomain: "slack-clone-64501.firebaseapp.com",
    databaseURL: "https://slack-clone-64501.firebaseio.com",
    projectId: "slack-clone-64501",
    storageBucket: "slack-clone-64501.appspot.com",
    messagingSenderId: "618453639413"
};
firebase.initializeApp(config);

export default firebase;