import { useEffect } from "react";
import Overworld from "./Overworld";
import { auth, database } from "../config/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  ref,
  set,
  onDisconnect,
  onValue,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import utils from "./utils";
import Person from "./Person";

// Misc Helpers
function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
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

let playerId;
let playerRef;
let playerData;

function initGame() {
  const allPlayersRef = ref(database, `players`);
  const overworldMap = window.OverworldMaps?.DemoShop;

  if (!overworldMap?.gameObjects) {
    overworldMap.gameObjects = {};
  }

  // Add or update players
  onValue(allPlayersRef, (snapshot) => {
    const players = snapshot.val();

    if (players) {
      Object.keys(players).forEach((key) => {
        const playerData = players[key];

        if (!overworldMap.gameObjects[key]) {
          overworldMap.gameObjects[key] = new Person({
            x: utils.withGrid(playerData.x),
            y: utils.withGrid(playerData.y),
            direction: playerData.direction,
            isPlayerControlled: key === playerId, // Only the local player is controllable
          });
        } else {
          // Update existing player position and direction
          const player = overworldMap.gameObjects[key];
          player.x = utils.withGrid(playerData.x);
          player.y = utils.withGrid(playerData.y);
          player.direction = playerData.direction;
        }
      });
    }
  });

  // Listen for new players joining
  onChildAdded(allPlayersRef, (snapshot) => {
    const addedPlayer = snapshot.val();
    console.log("New player connected:", addedPlayer);

    if (!overworldMap.gameObjects[addedPlayer.id]) {
      overworldMap.gameObjects[addedPlayer.id] = new Person({
        x: utils.withGrid(addedPlayer.x),
        y: utils.withGrid(addedPlayer.y),
        direction: addedPlayer.direction,
        isPlayerControlled: false,
      });

      console.log(
        `Added new player to gameObjects: ${addedPlayer.id}`,
        overworldMap.gameObjects
      );
    }
  });

  // Remove disconnected players
  onChildRemoved(allPlayersRef, (snapshot) => {
    const removedPlayer = snapshot.val();
    console.log("Player disconnected:", removedPlayer);

    delete overworldMap.gameObjects[removedPlayer.id];
  });
}

export default function Init() {
  useEffect(() => {
    const gameContainer = document.querySelector("#game-container");
    if (gameContainer) {
      console.log("Game container found");

      onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (user) {
          playerId = user.uid;
          playerRef = ref(database, `players/${playerId}`);

          const name = createName();

          playerData = {
            id: playerId,
            name,
            x: utils.withGrid(3),
            y: utils.withGrid(3),
          };

          const hero = new Person({
            isPlayerControlled: true,
            x: playerData.x,
            y: playerData.y,
            direction: playerData.direction,
          });

          // Inject hero into the map's gameObjects
          window.OverworldMaps.DemoShop.gameObjects.hero = hero;

          set(playerRef, playerData)
            .then(() => {
              console.log("Player data initialized", playerData);
              // Set up the Overworld map and add the hero
              const overworld = new Overworld({
                element: gameContainer,
                playerId: playerId,
              });

              overworld.init(); // Start the game loop with the new hero

              // Begin the game now that we are signed in
              initGame();
            })
            .catch((error) =>
              console.error("Error initializing player data:", error)
            );

          // Remove me from Firebase when I disconnect
          onDisconnect(playerRef).remove();
        } else {
          console.error("User is not logged in.");
        }
      });
    } else {
      console.error("Game container element not found.");
    }
  }, []);

  signInAnonymously(auth);
  return null; // No UI to render for this component
}
