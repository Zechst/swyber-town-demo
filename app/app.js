import firebase from "./config/firebase";

//Misc Helpers

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
}

//Firebase Authentication
export const initializeFirebaseAuth = () => {
  console.log("Initializing Firebase Auth...");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("User logged in:", user.uid);
    } else {
      console.log("No user logged in. Attempting anonymous sign-in...");
      firebase
        .auth()
        .signInAnonymously()
        .then((userCredential) => {
          console.log("Signed in anonymously:", userCredential.user.uid);
        })
        .catch((error) => {
          console.error("Authentication Error:", error.code, error.message);
        });
    }
  });
};
