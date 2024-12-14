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
let players = {};

function handleArrowPress(xChange = 0, yChange = 0) {
  const newX = players[playerId].x + xChange;
  const newY = players[playerId].y + yChange;
  if (true) {
    //move to the next space
    players[playerId].x = newX;
    players[playerId].y = newY;
    if (xChange === 1) {
      players[playerId].direction = "right";
    }
    if (xChange === -1) {
      players[playerId].direction = "left";
    }
    playerRef.set(players[playerId]);
  }
}

function initGame(overworldMap) {
  const allPlayersRef = ref(database, `players`);

  if (!overworldMap?.gameObjects) {
    overworldMap.gameObjects = {};
  }

  // Add or update players
  onValue(allPlayersRef, (snapshot) => {
    players = snapshot.val() || {};

    if (players) {
      Object.keys(players).forEach((key) => {
        const characterState = players[key];

        // Ensure the player is properly initialized
        if (!overworldMap.gameObjects[key]) {
          overworldMap.gameObjects[key] = new Person({
            id: key,
            x: characterState.x,
            y: characterState.y,
            direction: characterState.direction,
            isPlayerControlled: key === playerId, // Only the local player is controllable
          });
          overworldMap.gameObjects[key].mount(overworldMap);
        } else {
          // Update existing player position and direction
          const player = overworldMap.gameObjects[key];
          player.x = characterState.x;
          player.y = characterState.y;
          player.direction = characterState.direction;
        }
      });
    }
  });

  // Listen for new players joining
  onChildAdded(allPlayersRef, (snapshot) => {
    const addedPlayer = snapshot.val();
    console.log("New player connected:", addedPlayer);

    if (!overworldMap.gameObjects[addedPlayer.id]) {
      const newPlayer = new Person({
        id: addedPlayer.id,
        x: addedPlayer.x,
        y: addedPlayer.y,
        direction: addedPlayer.direction,
        isPlayerControlled: false,
      });

      overworldMap.gameObjects[addedPlayer.id] = newPlayer;
      newPlayer.mount(overworldMap);

      console.log("Mounted new player:", newPlayer);
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
            x: utils.withGrid(4),
            y: utils.withGrid(4),
            direction: "down",
          };

          const hero = new Person({
            id: playerId,
            isPlayerControlled: true,
            x: playerData.x,
            y: playerData.y,
            direction: playerData.direction,
          });

          // Inject hero into the map's gameObjects
          const overworldMap = window.OverworldMaps.DemoShop;
          overworldMap.gameObjects[playerId] = hero;

          set(playerRef, playerData)
            .then(() => {
              console.log("Player data initialized", playerData);
              // Set up the Overworld map and add the hero
              const overworld = new Overworld({
                element: gameContainer,
                playerId: playerId, // Pass playerId to Overworld
              });

              overworld.init(); // Start the game loop with the new hero

              // Begin the game now that we are signed in
              initGame(overworld.map);
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
