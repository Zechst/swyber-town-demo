import { useEffect } from "react";
import Overworld from "./overworld";

export default function Init() {
  useEffect(() => {
    const gameContainer = document.querySelector("#game-container");
    if (gameContainer) {
      console.log("Game container found"); // Debug log
      const overworld = new Overworld({
        element: gameContainer,
      });
      overworld.init();
    } else {
      console.error("Game container element not found.");
    }
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  return null; // No UI to render for this component
}
