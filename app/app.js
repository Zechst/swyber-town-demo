import { auth, database } from "./config/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { ref, set, onDisconnect } from "firebase/database";

//Misc Helpers

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
}

function createName() {
  const prefix = randomFromArray([
    "HAPPY",
    "SAD",
    "ANGRY",
    "EXCITED",
    "NERVOUS",
    "CONFUSED",
    "PROUD",
    "CURIOUS",
    "BRAVE",
    "FEARFUL",
    "LONELY",
    "GRATEFUL",
    "RELAXED",
    "JOYFUL",
    "HOPEFUL",
  ]);

  const nameOP = randomFromArray([
    "LUFFY",
    "SANJI",
    "ZORO",
    "NAMI",
    "CHOPPER",
    "USOPP",
    "BROOK",
    "ROBIN",
    "FRANKY",
    "JINBE",
    "ACE",
    "SABO",
    "SHANKS",
    "GARP",
    "LAW",
    "KID",
    "KUZAN",
    "MIHAWK",
    "BUGGY",
    "KATAKURI",
    "BIG MOM",
    "KAIDO",
    "BLACKBEARD",
    "VIVI",
    "CARROT",
    "YAMATO",
  ]);
  return `${prefix} ${nameOP}`;
}

//Firebase Authentication
export const initializeFirebaseAuth = () => {
  let playerId;
  let playerRef;
  let playerData;

  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      playerId = user.uid;
      playerRef = ref(database, `players/${playerId}`);

      const name = createName();

      playerData = {
        id: playerId,
        name,
        direction: "right",
        x: 3,
        y: 3,
        coins: 0,
      };
      set(playerRef, playerData);

      //Remove me from Firebase when I disconnect
      onDisconnect(playerRef).remove();
    } else {
      console.log("No user logged in. Attempting anonymous sign-in...");
      signInAnonymously(auth);
      // .then((userCredential) => {
      // console.log("Signed in anonymously:", userCredential.user.uid);
      // })
      // .catch((error) => {
      //   console.error("Authentication Error:", error.code, error.message);
      // });
    }
  });
};
